import { LayoutDashboard, Upload, BarChart3, Shield, MessageSquare } from 'lucide-react'

const Sidebar = ({ currentPage, onNavigate }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload', label: 'Upload Data', icon: Upload },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'live', label: 'Live Moderation', icon: MessageSquare },
  ]

  return (
    <aside className="w-20 bg-[#0A0A0B] text-white flex flex-col shadow-2xl border-r border-[#FF4D00]/10" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-[#FF4D00]/10">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF4D00] to-[#ff6b35] flex items-center justify-center">
          <Shield className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="px-3 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex flex-col items-center justify-center gap-1 p-3 rounded-xl transition-all group relative ${
                  isActive
                    ? 'bg-[#FF4D00]/20 text-[#FF4D00]'
                    : 'text-gray-500 hover:bg-[#FF4D00]/10 hover:text-[#FF4D00]'
                }`}
                title={item.label}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-[#FF4D00]' : 'text-gray-500'
                }`} />
                <span className="text-[10px] font-medium">{item.label.split(' ')[0]}</span>
                
                {/* Tooltip */}
                <div className="absolute left-full ml-2 px-3 py-1.5 bg-[#0A0A0B] text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl border border-[#FF4D00]/20">
                  {item.label}
                </div>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Footer - User Avatar */}
      <div className="p-3 border-t border-[#FF4D00]/10">
        <div className="w-full flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF4D00] to-[#ff6b35] flex items-center justify-center text-sm font-semibold cursor-pointer hover:ring-2 hover:ring-[#FF4D00] transition-all">
            MG
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
