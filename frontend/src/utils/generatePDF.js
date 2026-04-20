import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// ─── Brand colours ────────────────────────────────────────────────────────────
const ORANGE = [255, 77, 0]
const DARK   = [10, 10, 11]
const WHITE  = [255, 255, 255]
const GREY   = [120, 120, 130]
const LIGHT  = [245, 245, 247]
const RED_BG = [255, 235, 230]
const GRN_BG = [230, 255, 235]
const YLW_BG = [255, 250, 230]

// ─── Helpers ──────────────────────────────────────────────────────────────────
const pct = (v) => (typeof v === 'number' ? `${(v * 100).toFixed(1)}%` : '—')
const num = (v, dp = 2) => (typeof v === 'number' ? v.toFixed(dp) : '—')

function riskColor(level) {
  if (!level) return GREY
  const l = level.toLowerCase()
  if (l.includes('high'))   return [220, 53, 69]
  if (l.includes('medium')) return [255, 153, 0]
  return [40, 167, 69]
}

function riskBg(level) {
  if (!level) return LIGHT
  const l = level.toLowerCase()
  if (l.includes('high'))   return RED_BG
  if (l.includes('medium')) return YLW_BG
  return GRN_BG
}

// Draw a filled rectangle header band
function sectionHeader(doc, y, text) {
  doc.setFillColor(...ORANGE)
  doc.rect(14, y, 182, 8, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(...WHITE)
  doc.text(text.toUpperCase(), 18, y + 5.5)
  doc.setTextColor(...DARK)
  return y + 13
}

// Thin horizontal rule
function rule(doc, y) {
  doc.setDrawColor(...ORANGE)
  doc.setLineWidth(0.3)
  doc.line(14, y, 196, y)
  return y + 4
}

// KPI box — draws a bordered card with label + value
function kpiBox(doc, x, y, w, h, label, value, sub) {
  doc.setFillColor(...LIGHT)
  doc.setDrawColor(...ORANGE)
  doc.setLineWidth(0.4)
  doc.roundedRect(x, y, w, h, 2, 2, 'FD')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.setTextColor(...ORANGE)
  doc.text(value, x + w / 2, y + h / 2 - 1, { align: 'center' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(...GREY)
  doc.text(label, x + w / 2, y + h / 2 + 6, { align: 'center' })

  if (sub) {
    doc.setFontSize(6.5)
    doc.text(sub, x + w / 2, y + h / 2 + 11, { align: 'center' })
  }
}

// ─── Main export function ─────────────────────────────────────────────────────
export function generateAnalyticsPDF(data) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const now   = new Date()
  const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

  const kpis = data?.kpis || {}
  const charts = data?.charts || {}
  const insights = data?.insights || []
  const recommendations = data?.recommendations || []

  // ── PAGE 1 ────────────────────────────────────────────────────────────────

  // Header band
  doc.setFillColor(...DARK)
  doc.rect(0, 0, pageW, 38, 'F')

  // Logo area — orange square + mark
  doc.setFillColor(...ORANGE)
  doc.rect(14, 8, 6, 6, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(...WHITE)
  doc.text('BURNOUT', 23, 14)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(...ORANGE)
  doc.text('MODERATOR ANALYTICS REPORT', 23, 19)

  // Report meta — right-aligned
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(180, 180, 190)
  doc.text(`Generated: ${dateStr} at ${timeStr}`, pageW - 14, 13, { align: 'right' })
  doc.text('Classification: Internal Use Only', pageW - 14, 18, { align: 'right' })

  // Title block
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.setTextColor(...WHITE)
  doc.text('Moderator Burnout & Wellness', 14, 30)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(200, 200, 210)
  doc.text('Predictive Analytics Report', 14, 36)

  let y = 46

  // ── EXECUTIVE SUMMARY ─────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(...DARK)
  doc.text('EXECUTIVE SUMMARY', 14, y)
  y = rule(doc, y + 3)

  const riskLevel = kpis.burnout_risk || 'Moderate'
  const riskC = riskColor(riskLevel)
  const riskBgC = riskBg(riskLevel)

  // Risk badge
  doc.setFillColor(...riskBgC)
  doc.roundedRect(14, y, 55, 16, 2, 2, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7)
  doc.setTextColor(...GREY)
  doc.text('OVERALL BURNOUT RISK', 41.5, y + 5, { align: 'center' })
  doc.setFontSize(12)
  doc.setTextColor(...riskC)
  doc.text(riskLevel.toUpperCase(), 41.5, y + 13, { align: 'center' })

  // Summary text
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(50, 50, 60)
  const totalMods = charts.clusters?.length || 0
  const highRisk   = insights.filter(i => i.message?.toLowerCase().includes('high')).length
  const warnings   = insights.filter(i => i.type === 'warning').length
  const positive   = insights.filter(i => i.type === 'positive').length
  const summaryText = [
    `This report presents a comprehensive analysis of ${totalMods} content moderator(s) using`,
    `AI-powered predictive modelling. Key findings include ${highRisk} high-risk indicator(s),`,
    `${warnings} active warning(s), and ${positive} positive wellness signal(s). Average sentiment`,
    `stands at ${pct(kpis.avg_sentiment)} with a platform toxicity rate of ${pct(kpis.toxicity_level)}.`,
    `Immediate attention is recommended for moderators flagged as high risk.`,
  ]
  summaryText.forEach((line, idx) => {
    doc.text(line, 75, y + 4 + idx * 5)
  })

  y += 22

  // ── KPI CARDS ─────────────────────────────────────────────────────────────
  y = sectionHeader(doc, y, '01  Key Performance Indicators')

  const boxW = 42
  const boxH = 26
  const gap  = 4
  const kpiItems = [
    { label: 'Avg Sentiment Score', value: pct(kpis.avg_sentiment), sub: 'Emotional index' },
    { label: 'Toxicity Rate',       value: pct(kpis.toxicity_level), sub: 'Content exposure' },
    { label: 'Activity Score',      value: num(kpis.activity_score), sub: 'Engagement level' },
    { label: 'Total Moderators',    value: String(totalMods),        sub: 'Analysed' },
  ]
  kpiItems.forEach((k, i) => kpiBox(doc, 14 + i * (boxW + gap), y, boxW, boxH, k.label, k.value, k.sub))
  y += boxH + 8

  // ── RISK DISTRIBUTION ─────────────────────────────────────────────────────
  y = sectionHeader(doc, y, '02  Risk Distribution')

  const totalInsights = insights.length || 1
  const riskRows = [
    ['High Risk',   highRisk,                        `${((highRisk / totalInsights) * 100).toFixed(0)}%`,   'Immediate intervention required'],
    ['Medium Risk', warnings,                        `${((warnings / totalInsights) * 100).toFixed(0)}%`,   'Monitor closely; schedule check-ins'],
    ['Low Risk',    positive,                        `${((positive / totalInsights) * 100).toFixed(0)}%`,   'Maintain current support level'],
  ]

  autoTable(doc, {
    startY: y,
    head:   [['Risk Level', 'Moderators', 'Share', 'Recommended Action']],
    body:   riskRows,
    theme:  'grid',
    styles: { fontSize: 8, cellPadding: 3, font: 'helvetica', textColor: DARK },
    headStyles: { fillColor: DARK, textColor: WHITE, fontStyle: 'bold', fontSize: 8 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 32 },
      1: { halign: 'center', cellWidth: 26 },
      2: { halign: 'center', cellWidth: 22 },
      3: { cellWidth: 'auto' },
    },
    didParseCell(hookData) {
      if (hookData.column.index === 0 && hookData.section === 'body') {
        const val = hookData.cell.raw
        if (String(val).includes('High'))   hookData.cell.styles.textColor = [220, 53, 69]
        if (String(val).includes('Medium')) hookData.cell.styles.textColor = [200, 120, 0]
        if (String(val).includes('Low'))    hookData.cell.styles.textColor = [40, 167, 69]
      }
    },
    margin: { left: 14, right: 14 },
  })

  y = doc.lastAutoTable.finalY + 8

  // ── TOXIC CONTENT TABLE ───────────────────────────────────────────────────
  if (charts.toxic_posts?.length) {
    y = sectionHeader(doc, y, '03  Toxic Content Exposure by Moderator')

    const toxicRows = charts.toxic_posts.map((item) => {
      const ratio = ((item.toxic_count / 200) * 100).toFixed(1)
      const level = ratio >= 15 ? 'High' : ratio >= 8 ? 'Medium' : 'Low'
      return [item.moderator, item.toxic_count, '200', `${ratio}%`, level]
    })

    autoTable(doc, {
      startY: y,
      head:   [['Moderator ID', 'Toxic Posts', 'Total Posts', 'Exposure Ratio', 'Risk Level']],
      body:   toxicRows,
      theme:  'striped',
      styles: { fontSize: 8, cellPadding: 3, font: 'helvetica', textColor: DARK },
      headStyles: { fillColor: DARK, textColor: WHITE, fontStyle: 'bold', fontSize: 8 },
      alternateRowStyles: { fillColor: [248, 248, 250] },
      columnStyles: {
        0: { fontStyle: 'bold' },
        1: { halign: 'center' },
        2: { halign: 'center' },
        3: { halign: 'center', fontStyle: 'bold', textColor: ORANGE },
        4: { halign: 'center', fontStyle: 'bold' },
      },
      didParseCell(hookData) {
        if (hookData.column.index === 4 && hookData.section === 'body') {
          const val = String(hookData.cell.raw)
          if (val === 'High')   { hookData.cell.styles.textColor = [220, 53, 69]; hookData.cell.styles.fillColor = RED_BG }
          if (val === 'Medium') { hookData.cell.styles.textColor = [200, 120, 0]; hookData.cell.styles.fillColor = YLW_BG }
          if (val === 'Low')    { hookData.cell.styles.textColor = [40, 167, 69]; hookData.cell.styles.fillColor = GRN_BG }
        }
      },
      margin: { left: 14, right: 14 },
    })

    y = doc.lastAutoTable.finalY + 8
  }

  // ── PAGE 2 — Insights & Recommendations ───────────────────────────────────
  doc.addPage()
  y = 16

  // Continuation header
  doc.setFillColor(...DARK)
  doc.rect(0, 0, pageW, 12, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...ORANGE)
  doc.text('BURNOUT ANALYTICS REPORT', 14, 8)
  doc.setTextColor(180, 180, 190)
  doc.setFont('helvetica', 'normal')
  doc.text(`${dateStr}  ·  Page 2`, pageW - 14, 8, { align: 'right' })
  y = 20

  // ── ACTIVITY TREND DATA TABLE ─────────────────────────────────────────────
  if (charts.activity_time?.length) {
    y = sectionHeader(doc, y, '04  Activity & Sentiment Trend Data')

    const trendRows = charts.activity_time.map((item, idx) => {
      const sentiment = charts.sentiment_time?.[idx]?.sentiment
      return [
        item.time,
        num(item.activity, 1),
        typeof sentiment === 'number' ? num(sentiment, 3) : '—',
        typeof sentiment === 'number' ? (sentiment >= 0.5 ? 'Positive' : 'Negative') : '—',
      ]
    })

    autoTable(doc, {
      startY: y,
      head:   [['Period', 'Activity Score', 'Sentiment Score', 'Sentiment Direction']],
      body:   trendRows,
      theme:  'striped',
      styles: { fontSize: 8, cellPadding: 3, font: 'helvetica' },
      headStyles: { fillColor: DARK, textColor: WHITE, fontStyle: 'bold', fontSize: 8 },
      alternateRowStyles: { fillColor: [248, 248, 250] },
      columnStyles: {
        0: { fontStyle: 'bold' },
        1: { halign: 'center' },
        2: { halign: 'center' },
        3: { halign: 'center', fontStyle: 'bold' },
      },
      didParseCell(hookData) {
        if (hookData.column.index === 3 && hookData.section === 'body') {
          const val = String(hookData.cell.raw)
          hookData.cell.styles.textColor = val === 'Positive' ? [40, 167, 69] : [220, 53, 69]
        }
      },
      margin: { left: 14, right: 14 },
    })

    y = doc.lastAutoTable.finalY + 8
  }

  // ── AI INSIGHTS ───────────────────────────────────────────────────────────
  if (insights.length) {
    y = sectionHeader(doc, y, '05  AI-Generated Insights')

    const insightRows = insights.map((ins) => [
      ins.type?.toUpperCase() || 'INFO',
      ins.message || '—',
    ])

    autoTable(doc, {
      startY: y,
      head:   [['Type', 'Insight']],
      body:   insightRows,
      theme:  'grid',
      styles: { fontSize: 8, cellPadding: 3, font: 'helvetica', textColor: DARK },
      headStyles: { fillColor: DARK, textColor: WHITE, fontStyle: 'bold', fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 28, fontStyle: 'bold', halign: 'center' },
        1: { cellWidth: 'auto' },
      },
      didParseCell(hookData) {
        if (hookData.column.index === 0 && hookData.section === 'body') {
          const val = String(hookData.cell.raw)
          if (val === 'CRITICAL' || val === 'HIGH') {
            hookData.cell.styles.textColor = [220, 53, 69]
            hookData.cell.styles.fillColor = RED_BG
          } else if (val === 'WARNING') {
            hookData.cell.styles.textColor = [200, 120, 0]
            hookData.cell.styles.fillColor = YLW_BG
          } else if (val === 'POSITIVE') {
            hookData.cell.styles.textColor = [40, 167, 69]
            hookData.cell.styles.fillColor = GRN_BG
          }
        }
      },
      margin: { left: 14, right: 14 },
    })

    y = doc.lastAutoTable.finalY + 8
  }

  // ── RECOMMENDATIONS ────────────────────────────────────────────────────────
  if (recommendations.length) {
    // Check if we need a new page
    if (y > pageH - 80) {
      doc.addPage()
      doc.setFillColor(...DARK)
      doc.rect(0, 0, pageW, 12, 'F')
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8)
      doc.setTextColor(...ORANGE)
      doc.text('BURNOUT ANALYTICS REPORT', 14, 8)
      doc.setTextColor(180, 180, 190)
      doc.setFont('helvetica', 'normal')
      doc.text(`${dateStr}  ·  Page 3`, pageW - 14, 8, { align: 'right' })
      y = 20
    }

    y = sectionHeader(doc, y, '06  Recommended Actions & Interventions')

    const recRows = recommendations.map((rec, i) => [`${i + 1}`, rec])

    autoTable(doc, {
      startY: y,
      head:   [['#', 'Recommendation']],
      body:   recRows,
      theme:  'grid',
      styles: { fontSize: 8.5, cellPadding: 4, font: 'helvetica', textColor: DARK },
      headStyles: { fillColor: DARK, textColor: WHITE, fontStyle: 'bold', fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 12, halign: 'center', fontStyle: 'bold', textColor: ORANGE },
        1: { cellWidth: 'auto' },
      },
      margin: { left: 14, right: 14 },
    })

    y = doc.lastAutoTable.finalY + 8
  }

  // ── METHODOLOGY NOTE ──────────────────────────────────────────────────────
  const totalPages = doc.internal.getNumberOfPages()
  if (y < pageH - 50) {
    y = sectionHeader(doc, y, '07  Methodology & Disclaimer')

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(80, 80, 90)
    const methodText = [
      'This report was generated by the Moderator Burnout Detection System using a machine-learning pipeline that',
      'combines clustering analysis, sentiment scoring, and temporal activity modelling. Risk scores are probabilistic',
      'estimates and should be interpreted alongside domain expertise. Data is processed in-memory and not retained',
      'beyond the current session. For support or queries, contact your system administrator.',
    ]
    methodText.forEach((line, idx) => doc.text(line, 14, y + idx * 5))
    y += methodText.length * 5 + 6
  }

  // ── FOOTER on every page ───────────────────────────────────────────────────
  const pages = doc.internal.getNumberOfPages()
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p)
    doc.setFillColor(...DARK)
    doc.rect(0, pageH - 10, pageW, 10, 'F')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(120, 120, 130)
    doc.text('Moderator Burnout Detection System  ·  Confidential', 14, pageH - 4)
    doc.text(`Page ${p} of ${pages}`, pageW - 14, pageH - 4, { align: 'right' })
    doc.setTextColor(...ORANGE)
    doc.text('BURNOUT', pageW / 2, pageH - 4, { align: 'center' })
  }

  // ── SAVE ──────────────────────────────────────────────────────────────────
  const filename = `burnout-analytics-${now.toISOString().slice(0, 10)}.pdf`
  doc.save(filename)
}
