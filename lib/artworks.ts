export interface ArtworkImage {
  id?: string
  artwork_id?: string
  image_url: string
  sort_order: number
  created_at?: string
}

export interface ArtworkRecord {
  id: string
  title: string
  description?: string | null
  image_url?: string | null
  created_at: string
  updated_at?: string
  published?: boolean
  medium?: string | null
  dimensions?: string | null
  year?: number | null
  tags?: string[] | null
  is_featured?: boolean | null
  artwork_images?: ArtworkImage[] | null
}

export interface ArtworkWithImages extends ArtworkRecord {
  artwork_images: ArtworkImage[]
  cover_image_url?: string
  image_count: number
}

export function normalizeArtwork(record: ArtworkRecord): ArtworkWithImages {
  const nestedImages = [...(record.artwork_images ?? [])]
    .filter((image) => Boolean(image?.image_url))
    .sort((left, right) => left.sort_order - right.sort_order)

  const fallbackImages =
    nestedImages.length === 0 && record.image_url
      ? [
          {
            id: `legacy-${record.id}`,
            artwork_id: record.id,
            image_url: record.image_url,
            sort_order: 0,
            created_at: record.created_at,
          },
        ]
      : []

  const artworkImages = nestedImages.length > 0 ? nestedImages : fallbackImages
  const coverImage = artworkImages[0]?.image_url ?? record.image_url ?? undefined

  return {
    ...record,
    artwork_images: artworkImages,
    cover_image_url: coverImage,
    image_count: artworkImages.length,
    description: record.description ?? '',
    medium: record.medium ?? '',
    dimensions: record.dimensions ?? '',
    year: record.year ?? null,
    tags: record.tags ?? [],
    is_featured: Boolean(record.is_featured),
  }
}

export function normalizeArtworks(records: ArtworkRecord[] | null | undefined): ArtworkWithImages[] {
  return (records ?? []).map(normalizeArtwork)
}

export function isArtworkImagesQueryError(error: unknown) {
  if (!error || typeof error !== 'object') {
    return false
  }

  const message = 'message' in error ? String(error.message) : ''
  const details = 'details' in error ? String(error.details) : ''

  return `${message} ${details}`.toLowerCase().includes('artwork_images')
}
