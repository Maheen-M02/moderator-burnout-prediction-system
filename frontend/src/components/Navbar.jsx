import { Bell, Settings, User, Search } from 'lucide-react'

const Navbar = () => {
  return (
    <nav className="bg-[#0A0A0B] text-white px-6 py-3 flex items-center justify-between shadow-lg border-b border-[#FF4D00]/10" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div className="flex items-center gap-4 flex-1">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-black/50 border border-[#FF4D00]/20 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF4D00]/50 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 rounded-lg hover:bg-[#FF4D00]/10 transition-colors relative">
          <Bell className="w-5 h-5 text-gray-400" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF4D00] rounded-full"></span>
        </button>
        
        <button className="p-2 rounded-lg hover:bg-[#FF4D00]/10 transition-colors">
          <Settings className="w-5 h-5 text-gray-400" />
        </button>
        
        <div className="ml-2 flex items-center gap-3 pl-3 border-l border-[#FF4D00]/10">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-200">Admin User</p>
            <p className="text-xs text-gray-500">admin@modguard.com</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF4D00] to-[#ff6b35] flex items-center justify-center text-sm font-semibold cursor-pointer hover:ring-2 hover:ring-[#FF4D00] transition-all">
            AU
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
