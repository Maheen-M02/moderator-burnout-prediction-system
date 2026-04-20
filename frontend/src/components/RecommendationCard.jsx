import { motion } from 'framer-motion'
import { CheckCircle2, Users, Heart, Calendar } from 'lucide-react'

const RecommendationCard = ({ recommendations, delay = 0 }) => {
  const getIcon = (index) => {
    const icons = [Users, Heart, Calendar, CheckCircle2]
    return icons[index % icons.length]
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card p-6"
    >
      <h3 className="text-lg font-semibold mb-4 gradient-text">Recommendations</h3>
      <div className="space-y-3">
        {recommendations && recommendations.length > 0 ? (
          recommendations.map((rec, index) => {
            const Icon = getIcon(index)
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: delay + index * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 hover:border-blue-500/40 transition"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <p className="text-sm text-gray-900">{rec}</p>
              </motion.div>
            )
          })
        ) : (
          <p className="text-gray-500 text-sm text-center py-4">Upload data to see recommendations</p>
        )}
      </div>
    </motion.div>
  )
}

export default RecommendationCard
