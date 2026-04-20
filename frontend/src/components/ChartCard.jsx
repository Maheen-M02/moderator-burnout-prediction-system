import { motion } from 'framer-motion'

const ChartCard = ({ title, children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card p-6"
    >
      <h3 className="text-lg font-semibold mb-4 gradient-text">{title}</h3>
      <div className="h-64">
        {children}
      </div>
    </motion.div>
  )
}

export default ChartCard
