const { createClient } = require('@supabase/supabase-js')
const matter = require('gray-matter')

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Extract frontmatter and content
function extractFrontmatter(mdFile) {
  const { data, content } = matter(mdFile)
  return {
    frontmatter: data,
    content
  }
}

async function migratePosts() {
  try {
    console.log('Starting post migration...')
    
    // Fetch all posts that might need migration
    const { data: posts, error: fetchError } = await supabase
      .from('posts')
      .select('*')
    
    if (fetchError) {
      console.error('Error fetching posts:', fetchError)
      return
    }
    
    console.log(`Found ${posts.length} posts to migrate`)
    
    for (const post of posts) {
      console.log(`Migrating post: ${post.title}`)
      
      let content = post.content || post.content_md || ''
      let needsUpdate = false
      let updateData = {
        updated_at: new Date().toISOString()
      }
      
      // If the content looks like it has frontmatter, extract it
      if (content.startsWith('---')) {
        console.log('  - Found frontmatter, extracting...')
        const { frontmatter, content: extractedContent } = extractFrontmatter(content)
        
        // Store the clean content without frontmatter
        updateData.content_md = extractedContent
        needsUpdate = true
        
        // Update post with frontmatter data if not already set
        if (!post.subtitle && frontmatter.subtitle) {
          updateData.subtitle = frontmatter.subtitle
          console.log(`  - Setting subtitle: ${frontmatter.subtitle}`)
        }
        if (!post.excerpt && frontmatter.excerpt) {
          updateData.excerpt = frontmatter.excerpt
          console.log(`  - Setting excerpt: ${frontmatter.excerpt}`)
        }
        if (!post.featured_image && frontmatter.featured_image) {
          updateData.featured_image = frontmatter.featured_image
          console.log(`  - Setting featured_image: ${frontmatter.featured_image}`)
        }
      }
      
      // Only update if we found frontmatter to extract
      if (needsUpdate) {
        const { error: updateError } = await supabase
          .from('posts')
          .update(updateData)
          .eq('id', post.id)
        
        if (updateError) {
          console.error(`Error updating post ${post.title}:`, updateError)
        } else {
          console.log(`✓ Successfully migrated: ${post.title}`)
        }
      } else {
        console.log(`  - No frontmatter found, skipping: ${post.title}`)
      }
    }
    
    console.log('Migration completed!')
  } catch (error) {
    console.error('Migration failed:', error)
  }
}

// Run the migration
migratePosts()