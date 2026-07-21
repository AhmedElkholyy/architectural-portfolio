import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useSiteSettings() {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    async function fetchSettings() {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 1)
        .single()

      if (error) setError(error.message)
      else setSettings(data)
      setLoading(false)
    }

    fetchSettings()
  }, [])

  return { settings, loading, error }
}
