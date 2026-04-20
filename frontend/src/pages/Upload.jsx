import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload as UploadIcon, FileText, CheckCircle2, AlertCircle, Loader2, FileSpreadsheet } from 'lucide-react'
import axios from 'axios'

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Create axios instance with longer timeout for mobile
const axiosInstance = axios.create({
  timeout: 60000, // 60 seconds timeout for mobile networks
  headers: {
    'Accept': 'application/json',
  }
})

const Upload = ({ onAnalysisComplete, onNavigate }) => {
  const [file, setFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.name.endsWith('.csv')) {
      setFile(droppedFile)
      setError(null)
    } else {
      setError('Please upload a CSV file')
    }
  }

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.name.endsWith('.csv')) {
      setFile(selectedFile)
      setError(null)
    } else {
      setError('Please upload a CSV file')
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setError(null)
    setUploadProgress('Uploading file...')

    const formData = new FormData()
    formData.append('file', file)

    try {
      // Upload with progress tracking
      setUploadProgress('Uploading file...')
      await axiosInstance.post(`${API_URL}/api/upload`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setUploadProgress(`Uploading... ${percentCompleted}%`)
        }
      })

      // Analyze with retry logic
      setUploadProgress('Analyzing data...')
      let retries = 3
      let analysisResponse = null
      
      while (retries > 0) {
        try {
          analysisResponse = await axiosInstance.post(`${API_URL}/api/analyze`, {}, {
            timeout: 90000 // 90 seconds for analysis
          })
          break // Success, exit retry loop
        } catch (err) {
          retries--
          if (retries === 0) throw err
          setUploadProgress(`Retrying analysis... (${3 - retries}/3)`)
          await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2s before retry
        }
      }

      if (analysisResponse) {
        onAnalysisComplete(analysisResponse.data)
        setSuccess(true)
        setUploadProgress('Complete!')
        
        setTimeout(() => {
          onNavigate('dashboard')
        }, 1500)
      }
    } catch (err) {
      console.error('Upload/Analysis error:', err)
      
      let errorMessage = 'Upload failed. Please try again.'
      
      if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        errorMessage = 'Request timed out. Please check your internet connection and try again.'
      } else if (err.code === 'ERR_NETWORK') {
        errorMessage = 'Network error. Please check your internet connection.'
      } else if (err.response) {
        errorMessage = err.response.data?.detail || err.response.statusText || errorMessage
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
      setUploadProgress('')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 px-4 sm:px-0" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-light text-gray-900 mb-2">Upload Data</h1>
        <p className="text-xs sm:text-sm text-gray-500">Upload moderator data for analysis</p>
      </motion.div>

      {/* Upload Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-8"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-16 text-center transition-all cursor-pointer ${
            isDragging
              ? 'border-gray-900 bg-gray-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-4">
            {file ? (
              <>
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-green-100 flex items-center justify-center">
                  <FileSpreadsheet className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                </div>
                <div>
                  <p className="text-base sm:text-lg font-medium text-gray-900 mb-1 break-all px-2">{file.name}</p>
                  <p className="text-xs sm:text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                  <UploadIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                </div>
                <div>
                  <p className="text-base sm:text-lg font-medium text-gray-900 mb-1">
                    Drop your CSV file here
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">or click to browse</p>
                </div>
              </>
            )}
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-700">{error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 rounded-xl bg-green-50 border border-green-200 flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-700">Analysis complete! Redirecting...</p>
          </motion.div>
        )}

        {file && !error && !success && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleUpload}
            disabled={uploading}
            className="w-full mt-6 py-4 rounded-xl bg-gray-900 text-white font-medium flex items-center justify-center gap-3 hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{uploadProgress || 'Processing...'}</span>
                </div>
                <span className="text-xs text-gray-400">This may take a moment on mobile networks</span>
              </div>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Analyze Data
              </>
            )}
          </motion.button>
        )}
      </motion.div>

      {/* Format Guide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-8"
      >
        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Expected CSV Format</h3>
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 overflow-x-auto">
          <pre className="text-xs text-gray-700 font-mono">
{`moderator_id,posts_moderated,toxic_posts,sentiment_score,activity_hours,response_time
mod_001,150,12,0.65,8.5,2.3
mod_002,200,25,0.45,10.2,3.1`}
          </pre>
        </div>
        <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-200">
          <p className="text-xs sm:text-sm text-blue-700">
            <span className="font-medium">Tip:</span> Sample data is available in <code className="px-1.5 py-0.5 bg-white rounded text-xs">data/sample_moderator_data.csv</code>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default Upload
