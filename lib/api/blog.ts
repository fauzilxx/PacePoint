import { supabase } from '@/lib/supabase'

export type BlogPost = {
  id: number
  slug: string
  title: string
  excerpt: string | null
  content: string
  image: string | null
  category: string
  author_id: string
  read_time: string | null
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

export type BlogPostWithAuthor = BlogPost & {
  author?: {
    full_name: string
    email: string
  }
}

// Fetch all published blog posts
export async function fetchPublishedBlogPosts(limit?: number) {
  let query = supabase
    .from('blog_posts')
    .select(`
      *,
      author:profiles!blog_posts_author_id_fkey(full_name, email)
    `)
    .eq('published', true)
    .order('published_at', { ascending: false })

  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching blog posts:', error)
    throw new Error(error.message)
  }

  return data as BlogPostWithAuthor[]
}

// Fetch single blog post by slug
export async function fetchBlogPostBySlug(slug: string) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      author:profiles!blog_posts_author_id_fkey(full_name, email)
    `)
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error) {
    console.error('Error fetching blog post:', error)
    throw new Error(error.message)
  }

  return data as BlogPostWithAuthor
}

// Fetch all blog posts (for organizers/admins)
export async function fetchAllBlogPosts() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      author:profiles!blog_posts_author_id_fkey(full_name, email)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all blog posts:', error)
    throw new Error(error.message)
  }

  return data as BlogPostWithAuthor[]
}

// Create blog post
export async function createBlogPost(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert(post)
    .select()
    .single()

  if (error) {
    console.error('Error creating blog post:', error)
    throw new Error(error.message)
  }

  return data as BlogPost
}

// Update blog post
export async function updateBlogPost(id: number, updates: Partial<BlogPost>) {
  const { data, error } = await supabase
    .from('blog_posts')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating blog post:', error)
    throw new Error(error.message)
  }

  return data as BlogPost
}

// Delete blog post
export async function deleteBlogPost(id: number) {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting blog post:', error)
    throw new Error(error.message)
  }
}
