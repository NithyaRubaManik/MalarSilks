import AIOutfitAdvisor from '@/components/ai-outfit-advisor'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Outfit Advisor — Malar Silks',
  description: 'Get AI-powered outfit recommendations based on your local weather. Malar Silks suggests the perfect traditional attire for every weather condition.',
}

export default function OutfitAdvisorPage() {
  return (
    <div className="min-h-screen bg-gray-950 pt-16">
      <AIOutfitAdvisor />
    </div>
  )
}
