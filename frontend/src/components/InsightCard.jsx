import { motion } from 'framer-motion'
import { AlertTriangle, TrendingUp, TrendingDown, Info } from 'lucide-react'

const InsightCard = ({ insights, delay = 0 }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'warning': return AlertTriangle
      case 'positive': return TrendingUp
      case 'negative': return TrendingDown
      default: return Info
    }
  }

  const getColor = (type) => {
    switch (type) {
      case 'warning': return 'text-yellow-400 bg-yellow-500/20'
      case 'positive': return 'text-green-400 bg-green-500/20'
      case 'negative': return 'text-red-400 bg-red-500/20'
      default: return 'text-blue-400 bg-blue-500/20'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card p-6"
    >
      <h3 className="text-lg font-semibold mb-4 gradient-text">Key Insights</h3>
      <div className="space-y-3">
        {insights && insights.length > 0 ? (
          insights.map((insight, index) => {
            const Icon = getIcon(insight.type)
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: delay + index * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-dark-hover hover:bg-dark-border transition"
              >
                <div className={`w-8 h-8 rounded-lg ${getColor(insight.type)} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <p className="text-sm text-gray-900">{insight.message}</p>
              </motion.div>
            )
          })
        ) : (
          <p className="text-gray-500 text-sm text-center py-8">
            Upload data to see insights
          </p>
        )}
      </div>
    </motion.div>
  )
}

export default InsightCard
