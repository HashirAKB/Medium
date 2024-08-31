import { useState, useEffect } from 'react'
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen } from "lucide-react"

const loadingPhrases = [
  "Opening the cover...",
  "Turning the pages...",
  "Brewing a cup of reading tea...",
  "Adjusting the reading light...",
  "Bookmarking your spot..."
]

export default function EnhancedProgressLoader({ progress }) {
  const [phraseIndex, setPhraseIndex] = useState(0)

  useEffect(() => {
    const phraseTimer = setInterval(() => {
      setPhraseIndex((prevIndex) => (prevIndex + 1) % loadingPhrases.length)
    }, 2000)

    return () => clearInterval(phraseTimer)
  }, [])

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center space-y-6 p-6">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">Medium Vanced</h1>
          </div>
          
          <Progress value={progress} className="w-full" />
          
          <div className="h-8 flex items-center justify-center">
            <p className="text-sm text-muted-foreground animate-pulse">
              {loadingPhrases[phraseIndex]}
            </p>
          </div>
          
          <p className="text-xs text-muted-foreground">
            {progress}% complete
          </p>
        </CardContent>
      </Card>
    </div>
  )
}