import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'

const KPICard = ({ title, value, icon: Icon, trend, color = 'blue', delay = 0 }) => {
  const colorClasses = {
    red: {
      icon: 'bg-red-100 text-red-600',
      text: 'text-red-600'
    },
    yellow: {
      icon: 'bg-yellow-100 text-yellow-600',
      text: 'text-yellow-600'
    },
    green: {
      icon: 'bg-green-100 text-green-600',
      text: 'text-green-600'
    },
    blue: {
      icon: 'bg-blue-100 text-blue-600',
      text: 'text-blue-600'
    },
    purple: {
      icon: 'bg-purple-100 text-purple-600',
      text: 'text-purple-600'
    }
  }

  const colors = colorClasses[color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card p-5 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded ${colors.icon} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${
            trend > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      
      <h3 className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-medium">{title}</h3>
      <p className={`text-2xl font-bold ${colors.text}`}>{value}</p>
    </motion.div>
  )
}

export default KPICard
