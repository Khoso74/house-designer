'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HouseDesignForm from '@/components/HouseDesignForm';
import House3DViewer from '@/components/House3DViewer';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingOverlay, FullPageLoading } from '@/components/LoadingComponents';
import { HouseFormData, HouseLayout, TourWaypoint } from '@/types/house';
import { Home, RotateCcw, Download, Share2, AlertCircle } from 'lucide-react';

/**
 * Main Page Component
 * AI House Designer - Complete house design application
 */
export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [houseLayout, setHouseLayout] = useState<HouseLayout | null>(null);
  const [tourWaypoints, setTourWaypoints] = useState<TourWaypoint[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(true);

  /**
   * Handle form submission and generate house
   */
  const handleFormSubmit = async (formData: HouseFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Client-side validation
      if (!formData.plotSize?.trim()) {
        throw new Error('Plot size is required');
      }

      if (formData.bedrooms < 1 || formData.bedrooms > 10) {
        throw new Error('Number of bedrooms must be between 1 and 10');
      }

      if (formData.bathrooms < 1 || formData.bathrooms > 5) {
        throw new Error('Number of bathrooms must be between 1 and 5');
      }

      if (formData.kitchens < 1 || formData.kitchens > 3) {
        throw new Error('Number of kitchens must be between 1 and 3');
      }

      const response = await fetch('/api/house', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Check if response is ok first
      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = `Server error (${response.status})`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If JSON parsing fails, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      // Check if response has content
      const text = await response.text();
      if (!text) {
        throw new Error('Empty response from server');
      }

      // Parse JSON safely
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Invalid response format from server');
      }

      // Validate response structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response structure');
      }

      if (!data.success) {
        throw new Error(data.error || 'House generation failed');
      }

      if (!data.layout) {
        throw new Error('No house layout received from server');
      }

      // Validate layout structure
      if (!data.layout.rooms || !Array.isArray(data.layout.rooms)) {
        throw new Error('Invalid house layout structure');
      }

      setHouseLayout(data.layout);
      setTourWaypoints(data.tourWaypoints || []);
      setShowForm(false);
      
    } catch (err) {
      console.error('Form submission error:', err);
      
      // Provide user-friendly error messages
      let errorMessage = 'An unexpected error occurred';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      // Handle common error cases
      if (errorMessage.includes('fetch')) {
        errorMessage = 'Network error - please check your internet connection';
      } else if (errorMessage.includes('timeout')) {
        errorMessage = 'Request timed out - please try again';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Reset to form view
   */
  const handleReset = () => {
    setHouseLayout(null);
    setTourWaypoints([]);
    setError(null);
    setShowForm(true);
  };

  /**
   * Handle tour completion
   */
  const handleTourComplete = () => {
    // Optional: Add any actions when tour completes
    console.log('Auto tour completed');
  };

  /**
   * Download house design (placeholder)
   */
  const handleDownload = () => {
    // In a real app, this would generate and download a file
    alert('Download feature would save the house design as a 3D model file');
  };

  /**
   * Share house design (placeholder)
   */
  const handleShare = () => {
    // In a real app, this would share the design
    if (navigator.share) {
      navigator.share({
        title: 'My AI House Design',
        text: 'Check out my custom house design created with AI House Designer!',
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Home className="w-8 h-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-800">AI House Designer</h1>
            </div>
            
            {houseLayout && (
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShare}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReset}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  New Design
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorBoundary>
          <AnimatePresence mode="wait">
            {showForm ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                <LoadingOverlay isLoading={isLoading} text="Generating your house design...">
                  <HouseDesignForm onSubmit={handleFormSubmit} isLoading={isLoading} />
                </LoadingOverlay>
                
                {/* Error Display */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-red-700 font-medium">Generation Failed</p>
                        <p className="text-red-600 text-sm mt-1">{error}</p>
                        <p className="text-red-600 text-sm mt-1">
                          Please check your input values and try again.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="viewer"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Success Message */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-50 border border-green-200 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-green-700 font-medium">
                      House design generated successfully!
                    </p>
                  </div>
                  <p className="text-green-600 text-sm mt-1">
                    Use the controls below to explore your 3D house design.
                  </p>
                </motion.div>

                {/* 3D Viewer */}
                <ErrorBoundary fallback={Viewer3DErrorFallback}>
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <House3DViewer
                      houseLayout={houseLayout!}
                      tourWaypoints={tourWaypoints}
                      onTourComplete={handleTourComplete}
                    />
                  </div>
                </ErrorBoundary>

              {/* Instructions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div className="card">
                  <h3 className="font-semibold text-gray-800 mb-2">🎮 Controls</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Left click + drag: Rotate view</li>
                    <li>• Right click + drag: Pan view</li>
                    <li>• Scroll: Zoom in/out</li>
                    <li>• Auto Tour: Automatic camera tour</li>
                  </ul>
                </div>

                <div className="card">
                  <h3 className="font-semibold text-gray-800 mb-2">🏠 House Features</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• {houseLayout?.floors} floor{houseLayout?.floors !== 1 ? 's' : ''}</li>
                    <li>• {houseLayout?.rooms.length} room{houseLayout?.rooms.length !== 1 ? 's' : ''}</li>
                    <li>• {houseLayout?.style} style design</li>
                    <li>• Fully furnished interior</li>
                  </ul>
                </div>

                <div className="card">
                  <h3 className="font-semibold text-gray-800 mb-2">💡 Tips</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Click "Auto Tour" for guided tour</li>
                    <li>• Explore each room in detail</li>
                    <li>• Use different angles to view layout</li>
                    <li>• Download or share your design</li>
                  </ul>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </ErrorBoundary>
    </main>

    {/* Footer */}
    <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-600">
          <p className="text-sm">
            AI House Designer - Create your dream home with AI-powered 3D visualization
          </p>
          <p className="text-xs mt-2 text-gray-500">
            Built with Next.js, Three.js, and TailwindCSS
          </p>
        </div>
      </div>
    </footer>
  </div>
);
}

/**
 * 3D Viewer Error Fallback Component
 */
function Viewer3DErrorFallback({ error, resetError }: { error?: Error; resetError: () => void }) {
return (
  <div className="min-h-[600px] flex items-center justify-center p-8 bg-gradient-to-b from-red-50 to-red-100 rounded-xl">
    <div className="text-center max-w-md">
      <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      
      <h3 className="text-xl font-bold text-gray-800 mb-2">
        3D Rendering Error
      </h3>
      
      <p className="text-gray-600 mb-4">
        Failed to load the 3D house visualization. This might be due to browser compatibility or hardware limitations.
      </p>
      
      <div className="space-y-2">
        <button
          onClick={resetError}
          className="block w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Try Again
        </button>
        
        <button
          onClick={() => window.location.reload()}
          className="block w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Reload Page
        </button>
      </div>
      
      {error && (
        <details className="mt-4 text-left">
          <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
            Technical Details
          </summary>
          <pre className="mt-2 p-3 bg-white rounded text-xs overflow-auto border">
            {error.message}
          </pre>
        </details>
      )}
    </div>
  </div>
);
}


