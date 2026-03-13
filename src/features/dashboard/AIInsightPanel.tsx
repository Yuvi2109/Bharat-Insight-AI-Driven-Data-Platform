import { useState } from 'react'
import { Sparkles, Send, X, Brain } from 'lucide-react'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Simple AI panel for a fresher-level project
export default function AIInsightPanel({ 
  isOpen, 
  onClose,
  contextData
}: { 
  isOpen: boolean, 
  onClose: () => void,
  contextData?: any
}) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hi! Ask me anything about the Indian agriculture data currently visible in your dashboard.' }
  ])

  // Simple function to call Gemini API with streaming
  async function askAI() {
    if (!input) return
    
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      setMessages(prev => [
        ...prev, 
        { role: 'user', text: input },
        { role: 'ai', text: 'Oops! It looks like the Gemini API Key is missing. Please create a .env file in the root directory and add VITE_GEMINI_API_KEY=your_key_here to enable AI insights.' }
      ])
      setInput('')
      return
    }

    const userText = input
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userText }])
    setLoading(true)

    try {
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

      const dataSummary = contextData ? JSON.stringify(contextData).slice(0, 1000) : 'No specific data selected'
      
      const projectContext = `
      Project Name: Bharat Insight
      Project Type: Advanced Indian Data Analytics Platform (Assignment/Assessment Project)
      Developer: Yuvraj Singh Bhati
      Tech Stack: React 19, TypeScript, Vite, Framer Motion, Tailwind CSS, Lucide Icons, TanStack Table v8, TanStack Virtual.
      Core Features:
      1. Multi-tenant ministry architecture (Agriculture, Health, Education, Finance).
      2. High-performance virtualized data grid for large datasets.
      3. Advanced analytics view with dynamic charts (Pie, Bar, Area charts).
      4. Real-time AI reasoning panel integrated with Gemini 1.5 Flash.
      5. Ministry-specific Dataset Catalog with staggered Framer Motion animations.
      6. User Profile management with avatar upload and role-based access.
      7. Command Palette (Ctrl+K) for quick global navigation.
      `

      const prompt = `You are Bharat-Insight AI, an assistant built for the Bharat Insight platform.
      
      ABOUT THIS PROJECT (ASSIGNMENT CONTEXT):
      ${projectContext}

      CURRENT DATA CONTEXT:
      ${dataSummary}
      
      USER QUESTION: ${userText}
      
      INSTRUCTIONS:
      1. If the user asks about the assignment, the project, or how things are built, use the PROJECT CONTEXT above.
      2. If the user asks about the data (crops, states, values), use the DATA CONTEXT.
      3. Be concise, professional, and helpful.
      4. Answer in plain text with simple formatting.`

      const result = await model.generateContentStream(prompt)
      
      // Add an empty message for the AI that we will stream into
      setMessages(prev => [...prev, { role: 'ai', text: '' }])
      setLoading(false)

      let fullText = ''
      for await (const chunk of result.stream) {
        const chunkText = chunk.text()
        fullText += chunkText
        
        setMessages(prev => {
          const newMessages = [...prev]
          if (newMessages.length > 0) {
            newMessages[newMessages.length - 1] = { 
              ...newMessages[newMessages.length - 1], 
              text: fullText 
            }
          }
          return newMessages
        })
      }
    } catch (err: any) {
      console.error(err)
      setMessages(prev => [...prev, { role: 'ai', text: 'Error: ' + (err.message || 'Failed to connect to AI service.') }])
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="w-80 border-l border-white/10 bg-[#0c0c0c] flex flex-col h-full shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <div className="flex items-center gap-2 text-blue-400">
          <Sparkles size={18} />
          <span className="font-bold">AI Insights</span>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={18} /></button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] p-3 rounded-lg text-xs leading-relaxed ${
              m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-300 border border-white/5'
            }`}>
              {m.text || (loading && m.role === 'ai' ? '...' : '')}
            </div>
          </div>
        ))}
        {loading && (
          <div className="space-y-2">
            <div className="text-blue-400 text-[10px] flex items-center gap-2 animate-pulse font-bold uppercase tracking-widest">
              <Brain size={12} /> Reasoning State
            </div>
            <div className="text-gray-500 text-[10px] italic leading-tight bg-white/[0.02] p-2 rounded-lg border border-white/5">
              Analyzing current grid filters, cross-referencing ministry context, and synthesizing response...
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input 
            className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
            placeholder="Type your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && askAI()}
          />
          <button 
            onClick={askAI}
            className="bg-blue-600 p-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            <Send size={14} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
