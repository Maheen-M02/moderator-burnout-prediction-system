import { motion } from 'framer-motion'
import { LineChart, Line, BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { AlertTriangle, Heart, Activity, TrendingUp, TrendingDown, RefreshCw, Download, MoreVertical, Users, Shield, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { generateAnalyticsPDF } from '../utils/generatePDF'

const Dashboard = ({ data }) => {
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    if (downloading) return
    setDownloading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 50)) // allow spinner to render
      generateAnalyticsPDF(data)
    } finally {
      setDownloading(false)
    }
  }

  const kpiData = data?.kpis || {
    burnout_risk: 'No Data',
    avg_sentiment: 0,
    toxicity_level: 0,
    activity_score: 0
  }

  return (
    <div className="space-y-5" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#FF4D00] mb-2 tracking-tight" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            Moderator Dashboard
          </h1>
          <p className="text-sm sm:text-base text-black font-medium">Real-time burnout detection and wellness monitoring</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 bg-[#FF4D00] text-white rounded-lg hover:bg-[#ff6b35] transition-colors">
            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={handleDownload}
            disabled={downloading}
            title="Download PDF Report"
            className="p-2 bg-[#FF4D00] text-white rounded-lg hover:bg-[#ff6b35] transition-colors disabled:opacity-60 flex items-center gap-1"
          >
            {downloading
              ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              : <Download className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
          <button className="p-2 bg-black border border-[#FF4D00]/20 text-[#FF4D00] rounded-lg hover:bg-[#FF4D00]/10 transition-colors">
            <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </motion.div>

      {/* Overview Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-black border border-[#FF4D00]/20 rounded-2xl p-4 sm:p-6 shadow-lg"
      >
        <h3 className="text-sm font-medium text-white/60 mb-4">Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
          <div>
            <div className="text-2xl sm:text-3xl font-light mb-1 text-[#FF4D00]">
              {data?.charts?.clusters?.length || 0}
              <span className="text-xs sm:text-sm text-white/60 ml-2">+8.2%</span>
            </div>
            <div className="text-xs sm:text-sm text-white/40">Total Moderators</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-light mb-1 text-[#FF4D00]">
              {typeof kpiData.avg_sentiment === 'number' ? (kpiData.avg_sentiment * 100).toFixed(0) + '%' : '0%'}
              <span className="text-xs sm:text-sm text-white/60 ml-2">+12.1%</span>
            </div>
            <div className="text-xs sm:text-sm text-white/40">Avg Sentiment</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-light mb-1 text-[#FF4D00]">
              {typeof kpiData.toxicity_level === 'number' ? (kpiData.toxicity_level * 100).toFixed(0) + '%' : '0%'}
              <span className="text-xs sm:text-sm text-white/60 ml-2">-3.2%</span>
            </div>
            <div className="text-xs sm:text-sm text-white/40">Toxicity Rate</div>
          </div>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column - 2 Cards */}
        <div className="lg:col-span-2 space-y-5">
          {/* Activity Trends Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black border border-[#FF4D00]/20 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-[#FF4D00]">Activity Trends</h3>
                <p className="text-sm text-white/40 mt-1">Moderator activity over time</p>
              </div>
              <button className="p-2 hover:bg-[#FF4D00]/10 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5 text-[#FF4D00]" />
              </button>
            </div>
            {data?.charts?.activity_time ? (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={data.charts.activity_time}>
                  <defs>
                    <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF4D00" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#FF4D00" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,77,0,0.1)" />
                  <XAxis
                    dataKey="time"
                    stroke="rgba(255,77,0,0.6)"
                    style={{ fontSize: '12px' }}
                    label={{ value: 'Time', position: 'insideBottom', offset: -5, fill: 'rgba(255,77,0,0.8)', fontSize: 12 }}
                  />
                  <YAxis
                    stroke="rgba(255,77,0,0.6)"
                    style={{ fontSize: '12px' }}
                    label={{ value: 'Activity', angle: -90, position: 'insideLeft', offset: 10, fill: 'rgba(255,77,0,0.8)', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: '#000', 
                      border: '1px solid rgba(255,77,0,0.3)', 
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#FF4D00'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="activity" 
                    stroke="#FF4D00" 
                    strokeWidth={2}
                    fill="url(#activityGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[250px] text-white/40">
                <div className="text-center">
                  <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Upload data to view activity trends</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Toxic Posts Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-black border border-[#FF4D00]/20 rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-medium text-[#FF4D00] mb-4">Toxic Content by Moderator</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-white/60 border-b border-[#FF4D00]/20">
                    <th className="pb-3 font-medium">MODERATOR</th>
                    <th className="pb-3 font-medium">TOXIC COUNT</th>
                    <th className="pb-3 font-medium">TOTAL POSTS</th>
                    <th className="pb-3 font-medium">RATIO</th>
                    <th className="pb-3 font-medium">TREND</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {data?.charts?.toxic_posts ? (
                    data.charts.toxic_posts.slice(0, 5).map((item, index) => (
                      <tr key={index} className="border-b border-[#FF4D00]/10 hover:bg-[#FF4D00]/5 transition-colors">
                        <td className="py-3 text-white">{item.moderator}</td>
                        <td className="py-3 text-[#FF4D00]">{item.toxic_count}</td>
                        <td className="py-3 text-white/60">-</td>
                        <td className="py-3">
                          <span className="text-[#FF4D00]">{((item.toxic_count / 200) * 100).toFixed(1)}%</span>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-1">
                            {Math.random() > 0.5 ? (
                              <>
                                <TrendingUp className="w-4 h-4 text-[#FF4D00]" />
                                <span className="text-[#FF4D00] text-xs">+{(Math.random() * 10).toFixed(1)}%</span>
                              </>
                            ) : (
                              <>
                                <TrendingDown className="w-4 h-4 text-white/60" />
                                <span className="text-white/60 text-xs">-{(Math.random() * 10).toFixed(1)}%</span>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-white/40">
                        Upload data to view toxic content analysis
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Stats Cards */}
        <div className="space-y-5">
          {/* Burnout Risk Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-black border border-[#FF4D00]/20 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-[#FF4D00]">Burnout Risk</h3>
              <MoreVertical className="w-5 h-5 text-[#FF4D00]" />
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/60">High Risk</span>
                  <span className="text-sm text-[#FF4D00] font-medium">
                    {data?.insights?.filter(i => i.message.includes('high')).length || 0}
                  </span>
                </div>
                <div className="w-full bg-[#FF4D00]/10 rounded-full h-2">
                  <div className="h-2 rounded-full bg-[#FF4D00]" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/60">Medium Risk</span>
                  <span className="text-sm text-[#FF4D00] font-medium">
                    {data?.insights?.filter(i => i.type === 'warning').length || 0}
                  </span>
                </div>
                <div className="w-full bg-[#FF4D00]/10 rounded-full h-2">
                  <div className="h-2 rounded-full bg-[#ff8c42]" style={{ width: '30%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/60">Low Risk</span>
                  <span className="text-sm text-[#FF4D00] font-medium">
                    {data?.insights?.filter(i => i.type === 'positive').length || 0}
                  </span>
                </div>
                <div className="w-full bg-[#FF4D00]/10 rounded-full h-2">
                  <div className="h-2 rounded-full bg-[#ff6b35]" style={{ width: '25%' }}></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sentiment Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-black border border-[#FF4D00]/20 rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-medium text-[#FF4D00] mb-4">Sentiment Analysis</h3>
            {data?.charts?.sentiment_time ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data.charts.sentiment_time}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,77,0,0.1)" />
                  <XAxis
                    dataKey="time"
                    stroke="rgba(255,77,0,0.6)"
                    style={{ fontSize: '11px' }}
                    label={{ value: 'Time', position: 'insideBottom', offset: -5, fill: 'rgba(255,77,0,0.8)', fontSize: 11 }}
                  />
                  <YAxis
                    stroke="rgba(255,77,0,0.6)"
                    style={{ fontSize: '11px' }}
                    label={{ value: 'Sentiment Score', angle: -90, position: 'insideLeft', offset: 10, fill: 'rgba(255,77,0,0.8)', fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: '#000', 
                      border: '1px solid rgba(255,77,0,0.3)', 
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#FF4D00'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sentiment" 
                    stroke="#FF4D00" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-white/40">
                <div className="text-center">
                  <Heart className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">No sentiment data</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Bottom Section - Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-black border border-[#FF4D00]/20 rounded-2xl p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-[#FF4D00]">Recommended Actions</h3>
            <p className="text-sm text-white/40 mt-1">AI-powered insights to improve team wellness</p>
          </div>
          <button className="px-4 py-2 bg-[#FF4D00] text-white text-sm rounded-lg hover:bg-[#ff6b35] transition-colors font-medium">
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.recommendations ? (
            data.recommendations.slice(0, 3).map((rec, index) => (
              <div key={index} className="bg-[#FF4D00]/5 border border-[#FF4D00]/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FF4D00]/20 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-4 h-4 text-[#FF4D00]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80 leading-relaxed">{rec}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-white/40">
              <Shield className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Upload data to receive AI-powered recommendations</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard
