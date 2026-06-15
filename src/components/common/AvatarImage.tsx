import { useEffect, useState } from 'react'
import { API_BASE_URL } from '../../lib/api'
import { useUser } from '../../context/UserContext'

type AvatarImageProps = {
  src?: string | null
  alt: string
  className: string
}

function toBackendURL(src: string) {
  if (src.startsWith('http') || src.startsWith('blob:') || src.startsWith('data:')) {
    return src
  }

  return `${API_BASE_URL}${src}`
}

export default function AvatarImage({ src, alt, className }: AvatarImageProps) {
  const { accessToken } = useUser()
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {
    if (!src) {
      setImageUrl('')
      return
    }

    if (src.startsWith('blob:') || src.startsWith('data:')) {
      setImageUrl(src)
      return
    }

    if (!accessToken) {
      setImageUrl(toBackendURL(src))
      return
    }

    const source = src
    let objectUrl = ''
    let isMounted = true

    async function loadImage() {
      try {
        const response = await fetch(toBackendURL(source), {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to load image')
        }

        const blob = await response.blob()
        objectUrl = URL.createObjectURL(blob)
        if (isMounted) {
          setImageUrl(objectUrl)
        }
      } catch {
        if (isMounted) {
          setImageUrl('')
        }
      }
    }

    void loadImage()

    return () => {
      isMounted = false
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [accessToken, src])

  if (!imageUrl) return null

  return <img src={imageUrl} alt={alt} className={className} />
}
