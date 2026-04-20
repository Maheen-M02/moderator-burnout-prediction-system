import { motion } from 'framer-motion'
import { ArrowRight, BarChart3, Clock, Layout, ShieldCheck } from 'lucide-react'

const Landing = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0A0A0B] overflow-hidden selection:bg-[#FF4D00]/30 selection:text-white">
      {/* Left Pane - Full Bleed Video Presentation */}
      <div className="relative w-full md:w-1/2 h-[50vh] md:h-screen bg-[#0A0A0B] flex items-center justify-center overflow-hidden border-r border-white/5 z-20">
        {/* Looping Video Section - Full Coverage */}
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="relative z-30 w-full h-full flex items-center justify-center"
        >
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="relative z-40 w-full h-full object-cover mix-blend-screen pointer-events-none opacity-90"
          >
            <source src="https://s4.ezgif.com/tmp/ezgif-4de4eb0b4b790a56.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </motion.div>
      </div>

      {/* Right Pane - Content Side */}
      <main className="w-full md:w-1/2 h-full flex flex-col p-8 md:p-20 justify-between bg-[#0A0A0B]">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 border border-white/20 flex items-center justify-center">
              <div className="w-3 h-3 bg-[#FF4D00]" />
            </div>
            <span className="font-bold text-lg tracking-[0.2em] text-white">BURNOUT</span>
          </motion.div>
          
          <nav className="hidden sm:flex gap-8">
            {['Protocol', 'Systems', 'Access'].map((item) => (
              <a key={item} href="#" className="text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </nav>
        </header>

        {/* Hero Content */}
        <div className="flex-1 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <span className="inline-block text-[#FF4D00] text-[12px] font-semibold uppercase tracking-[0.3em] mb-8">
              Cognitive Load Monitoring
            </span>
            <h1 className="text-6xl md:text-8xl font-bold leading-[0.95] tracking-[-0.03em] text-white mb-8">
              Burnout<br />
              Analytic<br />
              Dashboard
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-md text-white/50 text-lg md:text-xl font-light leading-relaxed mb-12"
          >
            Quantifying the invisible. Monitor team exhaustion through predictive behavioral modeling and biometric synthesis.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 mb-16"
          >
            <button 
              onClick={onGetStarted}
              className="px-10 py-5 bg-white text-black font-bold text-sm uppercase tracking-[0.15em] hover:bg-white/90 transition-all flex items-center justify-center gap-3"
            >
              Initialize Deployment
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="px-10 py-5 border border-white/10 text-white font-bold text-sm uppercase tracking-[0.15em] hover:bg-white hover:text-black transition-all">
              Systems Check
            </button>
          </motion.div>

          {/* Stat Grid */}
          <div className="grid grid-cols-2 gap-12 border-t border-white/10 pt-12">
            <div className="flex flex-col gap-2">
              <span className="text-2xl font-semibold tracking-tight text-white">94.2%</span>
              <span className="text-[10px] uppercase tracking-widest text-white/40">Precision Rate</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-2xl font-semibold tracking-tight text-white">2.4ms</span>
              <span className="text-[10px] uppercase tracking-widest text-white/40">Latency Index</span>
            </div>
          </div>
        </div>

        {/* Footer Features */}
        <footer className="mt-20 pt-10 border-t border-white/5 opacity-40">
          <div className="flex flex-wrap gap-8">
            <Feature icon={<BarChart3 className="w-3 h-3" />} title="Metrics" />
            <Feature icon={<Clock className="w-3 h-3" />} title="Real-time" />
            <Feature icon={<ShieldCheck className="w-3 h-3" />} title="Privacy" />
            <Feature icon={<Layout className="w-3 h-3" />} title="Modular" />
          </div>
        </footer>
      </main>
    </div>
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
