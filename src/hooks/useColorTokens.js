import { useEffect } from 'react'
import { useSiteSettings } from './useSiteSettings'

export function useColorTokens() {
  const { settings, loading, error } = useSiteSettings()

  useEffect(() => {
    if (!settings?.color_tokens) return

    const root = document.documentElement
    const tokens = settings.color_tokens
    const mapping = {
      background: '--background',
      surface: '--surface',
      textPrimary: '--text-primary',
      textMuted: '--text-muted',
      accent: '--accent',
      accentDark: '--accent-dark',
      border: '--border',
      danger: '--danger',
      success: '--success',
      warning: '--warning',
      textInverse: '--text-inverse',
      cardAccent1: '--card-accent-1',
      cardAccent2: '--card-accent-2',
      cardAccent3: '--card-accent-3',
    }

    for (const [key, cssVar] of Object.entries(mapping)) {
      if (tokens[key]) {
        root.style.setProperty(cssVar, tokens[key])
      }
    }
  }, [settings])

  return { loading, error }
}
