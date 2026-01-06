'use client'

import useSWR from 'swr'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import AnimatedContent from "@/components/AnimatedContent"
import { Calendar, Clock, AlertCircle } from "lucide-react"
import { fetchPublishedBlogPosts } from "@/lib/api/blog"
import { format } from "date-fns"

export default function BlogList() {
  const { data: blogPosts, error, isLoading } = useSWR('all-blog-posts', fetchPublishedBlogPosts)

  return (
    <main className="flex-1 py-16 md:py-24">
      <div className="container max-w-7xl mx-auto px-6 md:px-12">
        <AnimatedContent duration={0.8} initialOpacity={0} distance={30}>
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Running Blog</h1>
            <p className="text-lg text-muted-foreground">
              Tips, event recaps, gear reviews, and insights from the running community
            </p>
          </div>
        </AnimatedContent>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading blog posts...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <p className="text-muted-foreground">Failed to load blog posts. Please try again later.</p>
          </div>
        ) : blogPosts && blogPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post, index) => (
              <AnimatedContent 
                key={post.id}
                duration={0.8} 
                initialOpacity={0} 
                distance={50}
                delay={index * 0.1}
              >
                <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="relative aspect-video overflow-hidden flex-shrink-0">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary" className="bg-card/90 backdrop-blur">
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-3 flex-grow flex flex-col">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {post.published_at ? format(new Date(post.published_at), 'MMM dd, yyyy') : 'N/A'}
                        </span>
                      </div>
                      {post.read_time && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{post.read_time}</span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg text-foreground min-h-[3.5rem]">{post.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 flex-grow">{post.excerpt}</p>
                    {post.author && (
                      <div className="pt-2">
                        <p className="text-xs text-muted-foreground">By {post.author.full_name}</p>
                      </div>
                    )}
                    <Button variant="link" className="p-0 h-auto font-semibold text-primary justify-start" asChild>
                      <Link href={`/blog/${post.slug}`}>
                        Read Article →
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </AnimatedContent>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No blog posts available yet. Check back soon!</p>
          </div>
        )}
      </div>
    </main>
  )
}
