import { motion } from 'framer-motion'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, BarChart, Bar } from 'recharts'
import { TrendingUp, Users, Activity, AlertCircle } from 'lucide-react'

const Analytics = ({ data }) => {
  const clusterColors = ['#FF4D00', '#ff6b35', '#ff8c42', '#10b981', '#3b82f6']

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-light text-white mb-1" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            Moderator Analytics Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-white/40">Real-time insights and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 sm:px-4 py-2 bg-[#FF4D00] text-white text-xs sm:text-sm rounded-lg hover:bg-[#ff6b35] transition-colors">
            Refresh
          </button>
          <button className="px-3 sm:px-4 py-2 bg-white/5 border border-white/10 text-white text-xs sm:text-sm rounded-lg hover:bg-white/10 transition-colors">
            Export
          </button>
        </div>
      </motion.div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-black border border-[#FF4D00]/20 rounded-2xl p-5 shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-white/60">Total Moderators</span>
            <Users className="w-5 h-5 text-[#FF4D00]" />
          </div>
          <div className="text-3xl font-light mb-1 text-[#FF4D00]">{data?.charts?.clusters?.length || 0}</div>
          <div className="text-xs text-white/60 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+12% from last month</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-black border border-[#FF4D00]/20 rounded-2xl p-5 shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-white/60">Avg Sentiment</span>
            <Activity className="w-5 h-5 text-[#FF4D00]" />
          </div>
          <div className="text-3xl font-light mb-1 text-[#FF4D00]">{data?.kpis?.avg_sentiment?.toFixed(2) || '0.00'}</div>
          <div className="text-xs text-white/60 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+5.2% positive trend</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-black border border-[#FF4D00]/20 rounded-2xl p-5 shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-white/60">Toxicity Level</span>
            <AlertCircle className="w-5 h-5 text-[#FF4D00]" />
          </div>
          <div className="text-3xl font-light mb-1 text-[#FF4D00]">{((data?.kpis?.toxicity_level || 0) * 100).toFixed(1)}%</div>
          <div className="text-xs text-white/60 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Monitor closely</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-black border border-[#FF4D00]/20 rounded-2xl p-5 shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-white/60">Activity Score</span>
            <Activity className="w-5 h-5 text-[#FF4D00]" />
          </div>
          <div className="text-3xl font-light mb-1 text-[#FF4D00]">{data?.kpis?.activity_score?.toFixed(1) || '0.0'}</div>
          <div className="text-xs text-white/60">hours/day average</div>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Clustering Visualization - Takes 2 columns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-black border border-[#FF4D00]/20 rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-[#FF4D00]">Moderator Clustering Analysis</h3>
            <button className="p-2 hover:bg-[#FF4D00]/10 rounded-lg transition-colors">
              <svg className="w-5 h-5 text-[#FF4D00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
          {data?.charts?.clusters ? (
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,77,0,0.1)" />
                <XAxis dataKey="x" name="Workload" stroke="rgba(255,77,0,0.6)" style={{ fontSize: '12px' }} />
                <YAxis dataKey="y" name="Sentiment" stroke="rgba(255,77,0,0.6)" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: '#000', 
                    border: '1px solid rgba(255,77,0,0.3)', 
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#FF4D00'
                  }}
                  cursor={{ strokeDasharray: '3 3' }}
                />
                <Scatter data={data.charts.clusters}>
                  {data.charts.clusters.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={clusterColors[entry.cluster % clusterColors.length]} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-white/40">
              Upload data to view clustering analysis
            </div>
          )}
        </motion.div>

        {/* Cluster Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-black border border-[#FF4D00]/20 rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-medium text-[#FF4D00] mb-4">Cluster Distribution</h3>
          <div className="space-y-3">
            {data?.predictions?.cluster_info ? (
              Object.entries(data.predictions.cluster_info).map(([cluster, info]) => (
                <div key={cluster} className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: clusterColors[parseInt(cluster)] }}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-[#FF4D00] font-medium">Cluster {cluster}</span>
                      <span className="text-sm text-white/60">{info.count}</span>
                    </div>
                    <div className="w-full bg-[#FF4D00]/10 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${(info.count / (data?.charts?.clusters?.length || 1)) * 100}%`,
                          backgroundColor: clusterColors[parseInt(cluster)]
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-white/40 mt-1">{info.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white/40 text-sm">Upload data to see distribution</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Activity Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-black border border-[#FF4D00]/20 rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-medium text-[#FF4D00] mb-4">Activity Trends</h3>
          {data?.charts?.activity_time ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data.charts.activity_time}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,77,0,0.1)" />
                <XAxis dataKey="time" stroke="rgba(255,77,0,0.6)" style={{ fontSize: '12px' }} />
                <YAxis stroke="rgba(255,77,0,0.6)" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: '#000', 
                    border: '1px solid rgba(255,77,0,0.3)', 
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#FF4D00'
                  }}
                />
                <Line type="monotone" dataKey="activity" stroke="#FF4D00" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-white/40">
              No activity data available
            </div>
          )}
        </motion.div>

        {/* Model Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-black border border-[#FF4D00]/20 rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-medium text-[#FF4D00] mb-4">Model Performance</h3>
          <div className="space-y-4">
            {data?.predictions?.model_metrics ? (
              Object.entries(data.predictions.model_metrics).map(([model, metrics]) => (
                <div key={model} className="bg-[#FF4D00]/5 border border-[#FF4D00]/20 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white/80 capitalize">
                      {model.replace('_', ' ')}
                    </span>
                    <span className="text-lg font-semibold text-[#FF4D00]">
                      {metrics.accuracy ? `${(metrics.accuracy * 100).toFixed(1)}%` : 
                       metrics.r2_score ? metrics.r2_score.toFixed(3) : 'N/A'}
                    </span>
                  </div>
                  <div className="w-full bg-[#FF4D00]/10 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-[#FF4D00] transition-all duration-500"
                      style={{ width: `${(metrics.accuracy || metrics.r2_score || 0) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white/40 text-sm">Upload data to see model metrics</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Analytics
