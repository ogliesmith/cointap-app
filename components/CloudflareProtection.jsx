import { useState, useEffect } from 'react';

export default function CloudflareProtection() {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Checking your browser before accessing cointap-app.vercel.app...');

  useEffect(() => {
    // Show protection screen on page load
    setIsVisible(true);
    
    const messages = [
      'Checking your browser before accessing cointap-app.vercel.app...',
      'This process is automatic. Your browser will redirect to your requested content shortly.',
      'Please allow up to 5 seconds...',
      'DDoS protection by Cloudflare',
      'Ray ID: 7f8a2b3c4d5e6f7g',
      'Verifying security...',
      'Loading CoinTap...'
    ];

    let messageIndex = 0;
    let progressValue = 0;

    const interval = setInterval(() => {
      progressValue += Math.random() * 15 + 5; // Random progress increment
      
      if (progressValue >= 100) {
        progressValue = 100;
        setProgress(100);
        setStatus('Redirecting...');
        
        setTimeout(() => {
          setIsVisible(false);
        }, 500);
        
        clearInterval(interval);
        return;
      }

      setProgress(progressValue);
      
      // Change message every 800ms
      if (messageIndex < messages.length - 1) {
        setStatus(messages[messageIndex]);
        messageIndex++;
      }
    }, 800);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-6">
        {/* Cloudflare Logo */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13.5 0C6.5 0 0 6.5 0 13.5S6.5 27 13.5 27 27 20.5 27 13.5 20.5 0 13.5 0zM13.5 24C7.7 24 3 19.3 3 13.5S7.7 3 13.5 3 24 7.7 24 13.5 19.3 24 13.5 24z"/>
                <path d="M13.5 6c-4.1 0-7.5 3.4-7.5 7.5s3.4 7.5 7.5 7.5 7.5-3.4 7.5-7.5-3.4-7.5-7.5-7.5zm0 12c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5 4.5 2 4.5 4.5-2 4.5-4.5 4.5z"/>
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">CoinTap</h1>
          <p className="text-gray-400 text-sm">cointap-app.vercel.app</p>
        </div>

        {/* Protection Status */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
          <p className="text-gray-300 text-sm mb-4">{status}</p>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
            <div 
              className="bg-orange-500 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-xs text-gray-400">
            <span>0%</span>
            <span>{Math.round(progress)}%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Cloudflare Branding */}
        <div className="text-xs text-gray-500">
          <p>DDoS protection by Cloudflare</p>
          <p>Ray ID: 7f8a2b3c4d5e6f7g</p>
        </div>
      </div>
    </div>
  );
}
