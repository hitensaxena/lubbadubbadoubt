const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkPosts() {
  try {
    console.log('Checking all posts in database...');
    const { data: allPosts, error: allError } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (allError) {
      console.error('Error fetching all posts:', allError);
      return;
    }
    
    console.log(`\nFound ${allPosts.length} total posts:`);
    allPosts.forEach((post, index) => {
      console.log(`\n${index + 1}. Title: ${post.title}`);
      console.log(`   Slug: ${post.slug}`);
      console.log(`   Published: ${post.published}`);
      console.log(`   Created: ${post.created_at}`);
      if (post.content_md) {
        const preview = post.content_md.substring(0, 150).replace(/\n/g, ' ');
        console.log(`   Content preview: ${preview}...`);
      }
    });
    
    // Check specifically for file-demo related posts
    const demoPosts = allPosts.filter(post => 
      post.title?.toLowerCase().includes('demo') || 
      post.slug?.includes('demo') ||
      post.content_md?.toLowerCase().includes('file-demo') ||
      post.content_md?.toLowerCase().includes('markdown') ||
      post.title?.toLowerCase().includes('file')
    );
    
    if (demoPosts.length > 0) {
      console.log('\n=== DEMO/FILE-RELATED POSTS ===');
      demoPosts.forEach(post => {
        console.log(`Title: ${post.title}`);
        console.log(`Slug: ${post.slug}`);
        console.log(`Published: ${post.published}`);
        console.log(`Content MD: ${post.content_md?.substring(0, 300)}...`);
        console.log(`Content HTML: ${post.content_html?.substring(0, 300)}...`);
      });
    } else {
      console.log('\n=== NO DEMO/FILE-RELATED POSTS FOUND ===');
      console.log('The file-demo.md content does not appear to be in the database yet.');
    }
    
    // Check unpublished posts specifically
    const unpublishedPosts = allPosts.filter(post => !post.published);
    console.log(`\n=== UNPUBLISHED POSTS: ${unpublishedPosts.length} ===`);
    unpublishedPosts.forEach(post => {
      console.log(`- ${post.title} (${post.slug})`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkPosts();