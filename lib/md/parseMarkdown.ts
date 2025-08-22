import matter from 'gray-matter'
import { remark } from 'remark'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'

/**
 * Extract frontmatter and content from a markdown file
 * @param mdFile - The markdown file content as a string
 * @returns Object containing frontmatter and content
 */
export function extractFrontmatter(mdFile: string): {
  frontmatter: Record<string, unknown>
  content: string
} {
  const { data, content } = matter(mdFile)
  return {
    frontmatter: data,
    content
  }
}

/**
 * Convert markdown to HTML with syntax highlighting and heading IDs
 * @param md - The markdown content as a string
 * @returns Promise resolving to HTML string
 */
export async function mdToHtml(md: string): Promise<string> {
  const result = await remark()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug) // Adds IDs to headings
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(md)

  return result.toString()
}

/**
 * Estimate reading time for markdown content
 * @param md - The markdown content as a string
 * @param wpm - Words per minute (default: 200)
 * @returns Estimated reading time in minutes
 */
export function estimateReadTime(md: string, wpm: number = 200): number {
  // Remove markdown syntax and count words
  const plainText = md
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]*`/g, '') // Remove inline code
    .replace(/!?\[[^\]]*\]\([^)]*\)/g, '') // Remove links and images
    .replace(/#{1,6}\s/g, '') // Remove heading markers
    .replace(/[*_~`]/g, '') // Remove emphasis markers
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()

  const wordCount = plainText.split(' ').filter(word => word.length > 0).length
  const readTime = Math.ceil(wordCount / wpm)
  
  return Math.max(1, readTime) // Minimum 1 minute
}