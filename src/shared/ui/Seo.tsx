import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

interface SeoProps {
  title: string
  description: string
}

export function Seo({ title, description }: SeoProps) {
  const location = useLocation()

  useEffect(() => {
    document.title = `${title} | Kray Music`
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description)
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', `https://kraymusic.example${location.pathname}`)
  }, [description, location.pathname, title])

  return null
}
