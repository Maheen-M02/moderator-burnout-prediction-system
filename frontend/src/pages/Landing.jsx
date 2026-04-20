import { motion } from 'framer-motion'
import { ArrowRight, BarChart3, Clock, Layout, ShieldCheck } from 'lucide-react'

const Landing = ({ onGetStarted }) => {

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col md:flex-row bg-[#0A0A0B] overflow-hidden selection:bg-[#FF4D00]/30 selection:text-white"
    >
      {/* Left Pane - Full Bleed Video Presentation */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full md:w-1/2 h-[50vh] md:h-screen bg-[#0A0A0B] flex items-center justify-center overflow-hidden border-r border-white/5 z-20"
      >
        {/* YouTube Video Embed - Full Coverage */}
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ 
            scale: 1,
            opacity: 1
          }}
          transition={{ 
            duration: 1.2,
            ease: "easeOut"
          }}
          className="relative z-30 w-full h-full flex items-center justify-center"
        >
          <img
              src="/video.gif"
              alt="Burnout Prediction System Demo"
              className="relative z-40 w-full h-full object-cover"
            />
          
          {/* Enhanced Fallback - Animated particles and gradient */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 overflow-hidden"
          >
            {/* Animated gradient background */}
            <motion.div
              animate={{
                background: [
                  'radial-gradient(circle at 20% 50%, rgba(255, 77, 0, 0.4) 0%, transparent 50%)',
                  'radial-gradient(circle at 80% 50%, rgba(255, 77, 0, 0.4) 0%, transparent 50%)',
                  'radial-gradient(circle at 50% 80%, rgba(255, 77, 0, 0.4) 0%, transparent 50%)',
                  'radial-gradient(circle at 20% 50%, rgba(255, 77, 0, 0.4) 0%, transparent 50%)',
                ]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            />
            
            {/* Floating particles */}
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: Math.random() * 100 + '%',
                  y: Math.random() * 100 + '%',
                  scale: Math.random() * 0.5 + 0.5
                }}
                animate={{
                  y: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
                  x: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
                  opacity: [0.2, 0.6, 0.2]
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute w-1 h-1 bg-[#FF4D00] rounded-full"
              />
            ))}
            
            {/* Pulsing circles */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`circle-${i}`}
                initial={{ 
                  x: '50%',
                  y: '50%',
                  scale: 0,
                  opacity: 0.5
                }}
                animate={{
                  scale: [0, 2, 0],
                  opacity: [0.5, 0, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 1.3,
                  ease: "easeOut"
                }}
                className="absolute w-64 h-64 border border-[#FF4D00] rounded-full -translate-x-1/2 -translate-y-1/2"
              />
            ))}
          </motion.div>
          
          {/* Fallback gradient animation */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="absolute inset-0 bg-gradient-to-br from-[#FF4D00]/20 via-transparent to-[#FF4D00]/10 pointer-events-none" 
          />
          
          {/* Animated grid overlay for visual interest if video fails */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255, 77, 0, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 77, 0, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          />
        </motion.div>
      </motion.div>

      {/* Right Pane - Content Side */}
      <main className="w-full md:w-1/2 h-full flex flex-col p-6 sm:p-8 md:p-20 justify-between bg-[#0A0A0B]">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 md:mb-12">
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex items-center gap-2"
          >
            <motion.div 
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6, type: "spring", stiffness: 200 }}
              className="w-6 h-6 sm:w-8 sm:h-8 border border-white/20 flex items-center justify-center"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, duration: 0.4 }}
                className="w-2 h-2 sm:w-3 sm:h-3 bg-[#FF4D00]" 
              />
            </motion.div>
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="font-bold text-base sm:text-lg tracking-[0.2em] text-white"
            >
              BURNOUT
            </motion.span>
          </motion.div>
          
          <nav className="hidden sm:flex gap-4 md:gap-8">
            {['Protocol', 'Systems', 'Access'].map((item, index) => (
              <motion.a 
                key={item} 
                href="#"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-white transition-colors"
              >
                {item}
              </motion.a>
            ))}
          </nav>
        </header>

        {/* Hero Content */}
        <div className="flex-1 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mb-6 md:mb-8"
          >
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="inline-block text-[#FF4D00] text-[10px] sm:text-[12px] font-semibold uppercase tracking-[0.3em] mb-4 md:mb-8"
            >
              Cognitive Load Monitoring
            </motion.span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold leading-[0.95] tracking-[-0.03em] text-white mb-6 md:mb-8">
              {['Burnout', 'Analytic', 'Dashboard'].map((word, index) => (
                <motion.div
                  key={word}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: 1.0 + index * 0.15, 
                    duration: 0.8,
                    ease: [0.6, 0.05, 0.01, 0.9]
                  }}
                >
                  {word}
                  <br />
                </motion.div>
              ))}
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="max-w-md text-white/50 text-base sm:text-lg md:text-xl font-light leading-relaxed mb-8 md:mb-12"
          >
            Quantifying the invisible. Monitor team exhaustion through predictive behavioral modeling and biometric synthesis.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 md:gap-6 mb-12 md:mb-16"
          >
            <motion.button 
              onClick={onGetStarted}
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255, 77, 0, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.0, duration: 0.6 }}
              className="px-8 sm:px-10 py-4 sm:py-5 bg-white text-black font-bold text-xs sm:text-sm uppercase tracking-[0.15em] hover:bg-white/90 transition-all flex items-center justify-center gap-3"
            >
              Initialize Deployment
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05, borderColor: "rgba(255, 255, 255, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.2, duration: 0.6 }}
              className="px-8 sm:px-10 py-4 sm:py-5 border border-white/10 text-white font-bold text-xs sm:text-sm uppercase tracking-[0.15em] hover:bg-white hover:text-black transition-all"
            >
              Systems Check
            </motion.button>
          </motion.div>

          {/* Stat Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4, duration: 0.8 }}
            className="grid grid-cols-2 gap-8 md:gap-12 border-t border-white/10 pt-8 md:pt-12"
          >
            {[
              { value: '94.2%', label: 'Precision Rate' },
              { value: '2.4ms', label: 'Latency Index' }
            ].map((stat, index) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.6 + index * 0.2, duration: 0.6 }}
                className="flex flex-col gap-2"
              >
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.8 + index * 0.2, duration: 0.8 }}
                  className="text-xl sm:text-2xl font-semibold tracking-tight text-white"
                >
                  {stat.value}
                </motion.span>
                <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-white/40">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Footer Features */}
        <motion.footer 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.0, duration: 0.8 }}
          className="mt-12 md:mt-20 pt-8 md:pt-10 border-t border-white/5 opacity-40"
        >
          <div className="flex flex-wrap gap-6 md:gap-8">
            {[
              { icon: <BarChart3 className="w-3 h-3" />, title: 'Metrics' },
              { icon: <Clock className="w-3 h-3" />, title: 'Real-time' },
              { icon: <ShieldCheck className="w-3 h-3" />, title: 'Privacy' },
              { icon: <Layout className="w-3 h-3" />, title: 'Modular' }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3.2 + index * 0.1, duration: 0.5 }}
              >
                <Feature icon={feature.icon} title={feature.title} />
              </motion.div>
            ))}
          </div>
        </motion.footer>
      </main>
    </motion.div>
  )
}

function Feature({ icon, title }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-white/40">{icon}</div>
      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">{title}</span>
    </div>
  )
}

export default Landing
