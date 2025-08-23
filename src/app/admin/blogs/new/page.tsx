'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminGuard from '../../../../../components/AdminGuard'
import Link from 'next/link'
import { extractFrontmatter } from '../../../../../lib/md/parseMarkdown'

export default function NewBlogPost() {
  const router = useRouter()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleFileSelect = (file: File) => {
    if (file.type !== 'text/markdown' && !file.name.endsWith('.md')) {
      alert('Please select a valid markdown (.md) file')
      return
    }
    setSelectedFile(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  const handleContinue = async () => {
    if (!selectedFile) return
    
    setIsProcessing(true)
    try {
      const mdContent = await selectedFile.text()
      const { frontmatter, content } = extractFrontmatter(mdContent)
      
      // Store the markdown data in sessionStorage to pass to setup page
      const blogData = {
        filename: selectedFile.name,
        content: mdContent,
        frontmatter,
        parsedContent: content
      }
      
      sessionStorage.setItem('newBlogData', JSON.stringify(blogData))
      
      // Redirect to setup page
      router.push('/admin/blogs/setup')
    } catch (error) {
      console.error('Error processing markdown file:', error)
      alert('Error processing the markdown file. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <AdminGuard>
      <div className="md-surface" style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '2rem',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Back Button */}
        <div style={{
          marginBottom: '1rem'
        }}>
          <Link 
            href="/admin/blogs"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--md-sys-color-primary)',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            ← Back to Blog Posts
          </Link>
        </div>

        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          <h1 className="md-display-small" style={{
            color: 'var(--md-sys-color-on-surface)',
            marginBottom: '0.5rem',
            fontWeight: 'bold'
          }}>
            Create New Blog Post
          </h1>
          <p className="md-body-large" style={{
            color: 'var(--md-sys-color-on-surface-variant)'
          }}>
            Upload a markdown file to get started
          </p>
        </div>

        {/* File Upload Area */}
        <div 
          className="md-surface-container-high"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '3rem 2rem',
            borderRadius: 'var(--md-sys-shape-corner-large)',
            border: `2px dashed ${dragActive ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-outline)'}`,
            backgroundColor: dragActive ? 'var(--md-sys-color-primary-container)' : 'var(--md-sys-color-surface-container-high)',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            position: 'relative'
          }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <input
            id="file-input"
            type="file"
            accept=".md,.markdown"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          
          {selectedFile ? (
            <div style={{ textAlign: 'center' }}>
              <svg 
                style={{ 
                  width: '4rem', 
                  height: '4rem', 
                  color: 'var(--md-sys-color-primary)',
                  marginBottom: '1rem'
                }} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="md-headline-medium" style={{
                color: 'var(--md-sys-color-on-surface)',
                marginBottom: '0.5rem'
              }}>
                File Selected
              </h3>
              <p className="md-body-large" style={{
                color: 'var(--md-sys-color-on-surface-variant)',
                marginBottom: '0.25rem'
              }}>
                {selectedFile.name}
              </p>
              <p className="md-body-medium" style={{
                color: 'var(--md-sys-color-on-surface-variant)'
              }}>
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <svg 
                style={{ 
                  width: '4rem', 
                  height: '4rem', 
                  color: 'var(--md-sys-color-on-surface-variant)',
                  marginBottom: '1rem'
                }} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <h3 className="md-headline-medium" style={{
                color: 'var(--md-sys-color-on-surface)',
                marginBottom: '0.5rem'
              }}>
                Upload Markdown File
              </h3>
              <p className="md-body-large" style={{
                color: 'var(--md-sys-color-on-surface-variant)',
                marginBottom: '1rem'
              }}>
                Drag and drop your .md file here, or click to browse
              </p>
              <p className="md-body-medium" style={{
                color: 'var(--md-sys-color-on-surface-variant)'
              }}>
                Supports .md and .markdown files
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginTop: '2rem',
          justifyContent: 'center'
        }}>
          {selectedFile && (
            <>
              <button
                onClick={() => setSelectedFile(null)}
                className="md-outlined-button"
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: 'var(--md-sys-shape-corner-full)',
                  border: '1px solid var(--md-sys-color-outline)',
                  backgroundColor: 'transparent',
                  color: 'var(--md-sys-color-on-surface)'
                }}
              >
                Choose Different File
              </button>
              <button
                onClick={handleContinue}
                disabled={isProcessing}
                className="md-filled-button"
                style={{
                  padding: '0.75rem 2rem',
                  borderRadius: 'var(--md-sys-shape-corner-full)',
                  backgroundColor: 'var(--md-sys-color-primary)',
                  color: 'var(--md-sys-color-on-primary)',
                  border: 'none',
                  opacity: isProcessing ? 0.6 : 1,
                  cursor: isProcessing ? 'not-allowed' : 'pointer'
                }}
              >
                {isProcessing ? 'Processing...' : 'Continue to Setup'}
              </button>
            </>
          )}
        </div>
      </div>
    </AdminGuard>
  )
}