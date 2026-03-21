'use client'

import AdminGuard from '../../../../../components/AdminGuard'
import ArtworkEditorForm from '../../../../../components/admin/ArtworkEditorForm'

export default function NewArtwork() {
  return (
    <AdminGuard>
      <ArtworkEditorForm mode="create" />
    </AdminGuard>
  )
}
