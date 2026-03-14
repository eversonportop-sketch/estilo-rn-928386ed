import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { getActiveClientId } from "@/hooks/useActiveClient"

type StyleProfile = {
  id: string
  name: string
  slug: string
  description: string | null
}

export default function useClientStyleIdentity() {
  const [styles, setStyles] = useState<StyleProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStyles = async () => {
      const clientId = getActiveClientId()

      if (!clientId) {
        setStyles([])
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("client_style_profiles")
        .select(`
          style_profiles (
            id,
            name,
            slug,
            description
          )
        `)
        .eq("client_id", clientId)

      if (!error && data) {
        const mapped = data
          .map((item: any) => item.style_profiles)
          .filter(Boolean)

        setStyles(mapped)
      } else {
        setStyles([])
      }

      setLoading(false)
    }

    loadStyles()
  }, [])

  return { styles, loading }
}
