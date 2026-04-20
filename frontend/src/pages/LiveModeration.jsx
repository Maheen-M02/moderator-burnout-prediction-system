import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, AlertTriangle, CheckCircle2, Flag, XCircle, Loader2, Shield } from 'lucide-react'
import axios from 'axios'

const LiveModeration = () => {
  const [inputText, setInputText] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)

  const getActionColor = (action) => {
    switch (action) {
      case 'Block': return 'bg-red-500'
      case 'Review': return 'bg-orange-500'
      case 'Flag': return 'bg-yellow-500'
      case 'Approve': return 'bg-green-500'
      default: return 'bg-blue-500'
    }
  }

  const getActionIcon = (action) => {
    switch (action) {
      case 'Block': return XCircle
      case 'Review': return AlertTriangle
      case 'Flag': return Flag
      case 'Approve': return CheckCircle2
      default: return Shield
    }
  }

  const handleAnalyze = async () => {
    if (!inputText.trim()) return

    setAnalyzing(true)
    try {
      const response = await axios.post('/api/moderate/text', {
        text: inputText
      })
      setResult(response.data)
    } catch (error) {
      console.error('Analysis failed:', error)
      alert('Failed to analyze content. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-light text-gray-900 mb-2">Live Content Moderation</h1>
        <p className="text-sm text-gray-500">Real-time AI-powered content analysis</p>
      </motion.div>

      {/* Main Input Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
      >
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text to analyze for toxicity, sentiment, spam, and offensive content..."
          className="w-full h-48 bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition resize-none text-sm"
        />

        <div className="flex items-center justify-between mt-6">
          <span className="text-sm text-gray-500">{inputText.length} characters</span>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAnalyze}
            disabled={!inputText.trim() || analyzing}
            className="px-8 py-3 rounded-xl bg-gray-900 text-white font-medium flex items-center gap-2 hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Analyze Content
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Action Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center gap-6 mb-6">
                <div className={`w-16 h-16 rounded-2xl ${getActionColor(result.action)} flex items-center justify-center`}>
                  {(() => {
                    const Icon = getActionIcon(result.action)
                    return <Icon className="w-8 h-8 text-white" />
                  })()}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Recommended Action</p>
                  <p className="text-3xl font-light text-gray-900">{result.action}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">Risk Score</p>
                  <p className="text-3xl font-light text-gray-900">{(result.risk_score * 100).toFixed(0)}%</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <p className="text-sm text-gray-700 leading-relaxed">{result.explanation}</p>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <p className="text-xs text-gray-500 mb-2">Toxicity</p>
                <p className="text-2xl font-light text-gray-900 mb-1">
                  {(result.metrics.toxicity.score * 100).toFixed(0)}%
                </p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  result.metrics.toxicity.level === 'High' ? 'bg-red-100 text-red-700' :
                  result.metrics.toxicity.level === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {result.metrics.toxicity.level}
                </span>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <p className="text-xs text-gray-500 mb-2">Offensive</p>
                <p className="text-2xl font-light text-gray-900 mb-1">
                  {(result.metrics.offensive_language.score * 100).toFixed(0)}%
                </p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  result.metrics.offensive_language.level === 'High' ? 'bg-red-100 text-red-700' :
                  result.metrics.offensive_language.level === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {result.metrics.offensive_language.level}
                </span>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <p className="text-xs text-gray-500 mb-2">Sentiment</p>
                <p className="text-2xl font-light text-gray-900 mb-1">
                  {(result.metrics.sentiment.score * 100).toFixed(0)}%
                </p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  result.metrics.sentiment.polarity === 'positive' ? 'bg-green-100 text-green-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {result.metrics.sentiment.label}
                </span>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <p className="text-xs text-gray-500 mb-2">Spam</p>
                <p className="text-2xl font-light text-gray-900 mb-1">
                  {(result.metrics.spam.score * 100).toFixed(0)}%
                </p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  result.metrics.spam.level === 'High' ? 'bg-red-100 text-red-700' :
                  result.metrics.spam.level === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {result.metrics.spam.level}
                </span>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recommendations</h3>
              <div className="space-y-3">
                {result.recommendations.map((rec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start gap-3 text-sm text-gray-700"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{rec}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LiveModeration
