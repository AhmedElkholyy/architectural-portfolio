import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useProjects({ published = true, featured = false, limit = null } = {}) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    async function fetchProjects() {
      let query = supabase
        .from('projects')
        .select('id, title_en, title_ar, subtitle_en, subtitle_ar, cover_image_url, featured_position, published, created_at')

      if (published) query = query.eq('published', true)
      if (featured) query = query.not('featured_position', 'is', null).order('featured_position')
      else query = query.order('created_at', { ascending: false })
      if (limit) query = query.limit(limit)

      const { data, error } = await query

      if (error) setError(error.message)
      else setProjects(data || [])
      setLoading(false)
    }

    fetchProjects()
  }, [published, featured, limit])

  return { projects, loading, error }
}
