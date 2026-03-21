'use client'

import { useParams } from 'next/navigation'
import AdminGuard from '../../../../../../components/AdminGuard'
import ArtworkEditorForm from '../../../../../../components/admin/ArtworkEditorForm'

export default function EditArtworkPage() {
  const params = useParams()
  const artworkId = params.id as string

  return (
    <AdminGuard>
      <ArtworkEditorForm mode="edit" artworkId={artworkId} />
    </AdminGuard>
  )
}
