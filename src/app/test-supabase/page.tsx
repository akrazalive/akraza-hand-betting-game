'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function TestSupabasePage() {
  const [status, setStatus] = useState<string>('Ready')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setStatus('Testing connection...')
    setError(null)
    
    try {
      // Test 1: Check if we can connect and read data
      const { data: readData, error: readError } = await supabase
        .from('scores')
        .select('*')
        .limit(1)
      
      if (readError) {
        throw new Error(`Read failed: ${readError.message}`)
      }
      
      setStatus('✅ Connection successful! Can read data.')
      setResult({ read: readData })
      
    } catch (err: any) {
      setStatus('❌ Connection failed')
      setError(err.message)
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const testInsert = async () => {
    setLoading(true)
    setStatus('Testing insert...')
    setError(null)
    
    try {
      const testScore = Math.floor(Math.random() * 1000)
      const { data: insertData, error: insertError } = await supabase
        .from('scores')
        .insert({
          player_name: 'TestUser',
          score: testScore
        })
        .select()
      
      if (insertError) {
        throw new Error(`Insert failed: ${insertError.message}`)
      }
      
      setStatus(`✅ Insert successful! Added score: ${testScore}`)
      setResult({ inserted: insertData })
      
    } catch (err: any) {
      setStatus('❌ Insert failed')
      setError(err.message)
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const checkEnv = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    setResult({
      env: {
        urlExists: !!url,
        urlValue: url ? url.substring(0, 50) + '...' : 'missing',
        keyExists: !!key,
        keyLength: key?.length || 0,
        keyPreview: key ? key.substring(0, 30) + '...' : 'missing'
      }
    })
    setStatus('Environment variables checked')
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Supabase Connection Test</h1>
        
        {/* Status Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Status</h2>
          <div className={`p-4 rounded-lg ${status.includes('✅') ? 'bg-green-100 text-green-700' : status.includes('❌') ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
            <p className="font-mono">{status}</p>
            {loading && <p className="text-sm mt-2">Loading...</p>}
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
              <p className="font-bold">Error:</p>
              <pre className="text-sm mt-2 whitespace-pre-wrap">{error}</pre>
            </div>
          )}
        </div>
        
        {/* Buttons */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={checkEnv}
              disabled={loading}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
            >
              Check Environment Variables
            </button>
            <button
              onClick={testConnection}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Test Read Connection
            </button>
            <button
              onClick={testInsert}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              Test Insert Score
            </button>
          </div>
        </div>
        
        {/* Results */}
        {result && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Results</h2>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
        
        {/* Info */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Troubleshooting Tips:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Make sure .env.local exists in the root directory</li>
            <li>• Restart dev server after changing .env.local</li>
            <li>• Check that the scores table exists in Supabase</li>
            <li>• Verify RLS is disabled or has proper policies</li>
            <li>• Your anon key should start with "eyJ" and be ~200 chars</li>
          </ul>
        </div>
      </div>
    </div>
  )
}