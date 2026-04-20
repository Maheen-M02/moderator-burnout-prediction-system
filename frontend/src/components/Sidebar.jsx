import { LayoutDashboard, Upload, BarChart3, Shield, MessageSquare, X } from 'lucide-react'

const Sidebar = ({ currentPage, onNavigate, mobileMenuOpen, setMobileMenuOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload', label: 'Upload Data', icon: Upload },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'live', label: 'Live Moderation', icon: MessageSquare },
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 lg:w-20 bg-[#0A0A0B] text-white flex flex-col shadow-2xl border-r border-[#FF4D00]/10
          transform transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 lg:justify-center border-b border-[#FF4D00]/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF4D00] to-[#ff6b35] flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="lg:hidden text-lg font-semibold text-white">ModGuard</span>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-2 hover:bg-[#FF4D00]/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
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
                  className={`w-full flex items-center lg:flex-col lg:justify-center gap-3 lg:gap-1 p-3 rounded-xl transition-all group relative ${
                    isActive
                      ? 'bg-[#FF4D00]/20 text-[#FF4D00]'
                      : 'text-gray-500 hover:bg-[#FF4D00]/10 hover:text-[#FF4D00]'
                  }`}
                  title={item.label}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-[#FF4D00]' : 'text-gray-500'
                  }`} />
                  <span className="text-sm lg:text-[10px] font-medium">{item.label}</span>
                  
                  {/* Desktop Tooltip */}
                  <div className="hidden lg:block absolute left-full ml-2 px-3 py-1.5 bg-[#0A0A0B] text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl border border-[#FF4D00]/20">
                    {item.label}
                  </div>
                </button>
              )
            })}
          </div>
        </nav>

        {/* Footer - User Avatar */}
        <div className="p-3 border-t border-[#FF4D00]/10">
          <div className="w-full flex items-center justify-center lg:justify-center gap-3 lg:gap-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF4D00] to-[#ff6b35] flex items-center justify-center text-sm font-semibold cursor-pointer hover:ring-2 hover:ring-[#FF4D00] transition-all">
              MG
            </div>
            <div className="lg:hidden">
              <p className="text-sm font-medium text-gray-200">Admin User</p>
              <p className="text-xs text-gray-500">admin@modguard.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
