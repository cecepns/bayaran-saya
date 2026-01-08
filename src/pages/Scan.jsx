import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { userAPI } from '../utils/api'
import { QrCode, Camera } from 'lucide-react'

const Scan = () => {
  const navigate = useNavigate()
  const [scanning, setScanning] = useState(false)
  const [qrData, setQrData] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  useEffect(() => {
    return () => {
      // Cleanup: stop camera stream when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const startScanning = async () => {
    try {
      setError('')
      setScanning(true)
      
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Use back camera on mobile
      })
      
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    } catch (err) {
      console.error('Error accessing camera:', err)
      setError('Unable to access camera. Please check permissions.')
      setScanning(false)
    }
  }

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setScanning(false)
  }

  const handleManualInput = () => {
    const input = prompt('Enter QR code data or merchant ID:')
    if (input && input.trim()) {
      handleQRScan(input.trim())
    }
  }

  const handleQRScan = async (data) => {
    if (!data) return

    try {
      setLoading(true)
      setError('')
      
      // Parse QR data (could be JSON or simple string)
      let parsedData = data
      try {
        parsedData = JSON.parse(data)
      } catch {
        // If not JSON, use as is
      }

      // Send to backend
      const response = await userAPI.scanQR(data)
      
      // Display scanned QR data
      if (response.data && response.data.merchantId) {
        alert(`QR Code scanned successfully!\nMerchant ID: ${response.data.merchantId}\nAmount: ${response.data.amount ? 'RM ' + response.data.amount : 'N/A'}`)
      } else {
        alert(`QR Code scanned: ${data}`)
      }
      navigate('/')
    } catch (error) {
      console.error('Scan error:', error)
      setError(error.response?.data?.message || 'Failed to process QR code')
    } finally {
      setLoading(false)
      stopScanning()
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="Scan QR Code" showBack />
      
      <div className="bg-white rounded-t-3xl mt-4 p-6 min-h-[calc(100vh-80px)]">
        {!scanning ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-48 h-48 bg-primary-light rounded-2xl flex items-center justify-center mb-6">
              <QrCode size={120} className="text-primary" />
            </div>
            
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Scan QR Code
            </h2>
            <p className="text-gray-600 text-center mb-8 max-w-sm">
              Scan a QR code to make a payment or transfer money
            </p>

            <button
              onClick={startScanning}
              className="w-full bg-primary text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary-dark transition-colors mb-4 flex items-center justify-center gap-2"
            >
              <Camera size={24} />
              Start Scanning
            </button>

            <button
              onClick={handleManualInput}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Enter Manually
            </button>

            {error && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-md mb-6">
              <video
                ref={videoRef}
                className="w-full rounded-lg bg-black"
                style={{ aspectRatio: '1/1', objectFit: 'cover' }}
                playsInline
              />
              <div className="absolute inset-0 border-4 border-primary rounded-lg pointer-events-none">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg"></div>
              </div>
            </div>

            <p className="text-gray-600 text-center mb-4">
              Position the QR code within the frame
            </p>

            <div className="flex gap-4 w-full max-w-md">
              <button
                onClick={stopScanning}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleManualInput}
                className="flex-1 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Enter Manually'}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm max-w-md">
                {error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Scan

