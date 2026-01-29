/**
 * Test Component to verify API key is loaded
 */

import React from 'react';

export default function TestApiKey() {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  
  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="font-bold mb-2">API Key Test</h3>
      <div className="space-y-2 text-sm">
        <div>
          <strong>Status:</strong>{' '}
          {apiKey ? (
            <span className="text-green-600">✅ Loaded</span>
          ) : (
            <span className="text-red-600">❌ Not Found</span>
          )}
        </div>
        {apiKey && (
          <div>
            <strong>Key Preview:</strong>{' '}
            <code className="bg-gray-200 px-2 py-1 rounded">
              {apiKey.substring(0, 10)}...{apiKey.substring(apiKey.length - 4)}
            </code>
          </div>
        )}
        <div>
          <strong>Length:</strong> {apiKey ? apiKey.length : 0} characters
        </div>
        <div>
          <strong>Expected:</strong> ~39 characters (AIzaSy...)
        </div>
        {!apiKey && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 rounded">
            <p className="font-semibold text-red-700">API Key Not Found!</p>
            <p className="text-red-600 text-xs mt-1">
              Make sure REACT_APP_GEMINI_API_KEY is set in .env file and restart server
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
