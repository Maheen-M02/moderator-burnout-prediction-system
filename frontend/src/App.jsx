import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Upload from './pages/Upload'
import Analytics from './pages/Analytics'
import LiveModeration from './pages/LiveModeration'
import Landing from './pages/Landing'

function App() {
  const [showLanding, setShowLanding] = useState(true)
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [analysisData, setAnalysisData] = useState(null)

  const handleGetStarted = () => {
    setShowLanding(false)
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard data={analysisData} />
      case 'upload':
        return <Upload onAnalysisComplete={setAnalysisData} onNavigate={setCurrentPage} />
      case 'analytics':
        return <Analytics data={analysisData} />
      case 'live':
        return <LiveModeration />
      default:
        return <Dashboard data={analysisData} />
    }
  }

  if (showLanding) {
    return <Landing onGetStarted={handleGetStarted} />
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}

export default App
