'use client'

import { useState, useEffect, useRef } from 'react'
import { Mic, MicOff, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

export function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const router = useRouter()
  const { toast } = useToast()
  
  // Store the recognition instance
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Initialize SpeechRecognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = 'en-US'

        recognitionRef.current.onstart = () => {
          setIsListening(true)
        }

        recognitionRef.current.onresult = (event: any) => {
          const current = event.resultIndex
          const text = event.results[current][0].transcript.toLowerCase()
          setTranscript(text)
          handleCommand(text)
        }

        recognitionRef.current.onerror = (event: any) => {
          if (event.error === 'no-speech' || event.error === 'aborted') {
            setIsListening(false)
            return
          }
          console.error('Speech recognition error', event.error)
          setIsListening(false)
          toast({
            title: "Voice Assistant Error",
            description: "Could not recognize speech. Please try again.",
            variant: "destructive"
          })
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }
      }
    }
  }, [])

  const handleCommand = (command: string) => {
    toast({
      title: "Voice Command Recognized",
      description: `"${command}"`,
    })

    const cmd = command.toLowerCase()

    if (cmd.includes('home')) {
      router.push('/')
    } else if (cmd.includes('cart')) {
      router.push('/cart')
    } else if (cmd.includes('login') || cmd.includes('sign in')) {
      router.push('/auth/login')
    } else if (cmd.includes('profile') || cmd.includes('account') || cmd.includes('my profile')) {
      router.push('/profile')
    } else if (cmd.includes('contact')) {
      router.push('/contact')
    } else if (cmd.includes('about')) {
      router.push('/about')
    } else if (cmd === 'shop' || cmd === 'products') {
      router.push('/shop')
    } else if (cmd.includes('men shirt') || cmd.includes('man shirt')) {
      // Specifically handled "men shirt" combination
      router.push('/shop?category=men&search=shirt')
    } else if (cmd.includes('women') || cmd.includes('woman')) {
      router.push('/shop?category=women')
    } else if (cmd.includes('men') || cmd.includes('man')) {
      router.push('/shop?category=men')
    } else if (cmd.includes('girls') || cmd.includes('girl')) {
      router.push('/shop?category=girls')
    } else if (cmd.includes('boys') || cmd.includes('boy') || cmd.includes('kids') || cmd.includes('children')) {
      // Maps 'kids' to boys collection as default since shop takes one category.
      router.push('/shop?category=boys')
    } else {
      // For any specific item like "kurta", "lehenga", "search saree", etc.
      let searchQuery = cmd.replace('search', '').trim()
      if (searchQuery) {
        router.push(`/shop?search=${encodeURIComponent(searchQuery)}`)
      } else {
        router.push('/shop')
      }
    }
  }

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop()
    } else {
      if (recognitionRef.current) {
        setTranscript('')
        recognitionRef.current.start()
      } else {
        toast({
          title: "Not Supported",
          description: "Your browser does not support voice recognition.",
          variant: "destructive"
        })
      }
    }
  }

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3">
      {transcript && isListening && (
        <div className="bg-white px-5 py-3 rounded-2xl shadow-xl border border-amber-200 animate-in slide-in-from-bottom-2 fade-in whitespace-nowrap text-sm font-bold text-gray-900">
          Listening: <span className="text-amber-600 italic">"{transcript}..."</span>
        </div>
      )}
      <button
        onClick={toggleListen}
        className={`relative flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 ${
          isListening 
            ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white animate-pulse shadow-[0_10px_40px_rgba(239,68,68,0.6)]' 
            : 'bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white shadow-[0_10px_40px_rgba(245,158,11,0.5)]'
        }`}
        aria-label="Voice Assistant"
      >
        {isListening ? (
          <Loader2 className="w-7 h-7 animate-spin" />
        ) : (
          <Mic className="w-7 h-7" />
        )}
        
        {/* Glow effect when listening */}
        {isListening && (
          <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping opacity-30"></div>
        )}
      </button>
    </div>
  )
}
