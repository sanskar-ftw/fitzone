import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('FitZone UI Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md bg-gray-900 border border-red-500/30 rounded-2xl p-8 shadow-2xl">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
              !
            </div>
            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-gray-400 text-sm mb-6">
              An unexpected error occurred while rendering this page:
            </p>
            <pre className="text-left text-xs bg-black/60 p-3 rounded-lg border border-gray-800 text-red-400 overflow-x-auto mb-6 max-h-40">
              {this.state.error?.message || 'Unknown error'}
            </pre>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="bg-white hover:bg-gray-100 text-gray-950 font-bold px-6 py-2.5 rounded-full text-xs shadow-md transition-all cursor-pointer"
              >
                Reload Page
              </button>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null })
                  window.location.href = '/'
                }}
                className="bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-2.5 rounded-full text-xs border border-white/15 transition cursor-pointer"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
