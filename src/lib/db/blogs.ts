import { createAdminClient } from '@/lib/supabase/admin'

export type BlogFaq = { q: string; a: string }

export type BlogPost = {
  id:              string
  slug:            string
  title:           string
  excerpt:         string | null
  content:         string | null
  cover_image_url: string | null
  author_name:     string | null
  status:          'draft' | 'published'
  published_at:    string | null
  seo_title:       string | null
  seo_description: string | null
  tags:            string[]
  faqs:            BlogFaq[]
  created_at:      string
  updated_at:      string
}

export type BlogPostInput = Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function db() { return createAdminClient() as any }

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await db()
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getBlogPost(id: string): Promise<BlogPost | null> {
  const { data, error } = await db()
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await db()
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single()
  if (error) return null
  return data
}

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await db()
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function createBlogPost(input: BlogPostInput): Promise<BlogPost> {
  const { data, error } = await db()
    .from('blog_posts')
    .insert(input)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateBlogPost(id: string, input: Partial<BlogPostInput>): Promise<BlogPost> {
  const { data, error } = await db()
    .from('blog_posts')
    .update(input)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteBlogPost(id: string): Promise<void> {
  const { error } = await db()
    .from('blog_posts')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export async function getPublishedBlogSlugs(): Promise<string[]> {
  const { data } = await db()
    .from('blog_posts')
    .select('slug')
    .eq('status', 'published')
  return (data ?? []).map((r: { slug: string }) => r.slug)
}
