"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User } from "lucide-react"
import Link from "next/link"

export default function BlogArticle() {
    // This would normally come from a database or CMS
    const article = {
        slug: "trail-running-tips-beginners",
        title: "Trail Running Tips for Beginners",
        excerpt: "Essential advice to start your trail running journey safely and confidently.",
        date: "Feb 28, 2025",
        readTime: "5 min read",
        image: "/trail-runner-on-mountain-path.jpg",
        category: "Tips & Guides",
        author: "Sarah Johnson",
        content: `
      <p>Trail running offers an exhilarating way to connect with nature while getting an incredible workout. Whether you're transitioning from road running or starting your running journey on the trails, these essential tips will help you get started safely and confidently.</p>

      <h2>Start with the Right Mindset</h2>
      <p>Trail running is different from road running. The terrain is unpredictable, the pace is slower, and the experience is more about the journey than the speed. Embrace the challenge and enjoy the beautiful surroundings!</p>

      <h2>Essential Gear for Trail Running</h2>
      <p>Investing in proper trail running shoes is crucial. Unlike road running shoes, trail shoes offer:</p>
      <ul>
        <li>Better grip and traction for uneven surfaces</li>
        <li>Rock plates for protection against sharp objects</li>
        <li>More durable materials to withstand rough terrain</li>
        <li>Enhanced stability for technical trails</li>
      </ul>

      <h2>Start Slow and Build Gradually</h2>
      <p>Begin with well-maintained, easy trails. As you gain confidence and experience, gradually progress to more technical terrain. Listen to your body and don't push too hard too soon.</p>

      <h2>Master the Basics</h2>
      <p>Key techniques for trail running:</p>
      <ul>
        <li><strong>Watch your step:</strong> Keep your eyes on the trail 10-15 feet ahead</li>
        <li><strong>Shorten your stride:</strong> Smaller steps give you better control</li>
        <li><strong>Use your arms:</strong> They help with balance on uneven terrain</li>
        <li><strong>Walk when needed:</strong> It's okay to walk steep uphills or technical sections</li>
      </ul>

      <h2>Safety First</h2>
      <p>Always prioritize safety on the trails:</p>
      <ul>
        <li>Tell someone where you're going and when you'll return</li>
        <li>Carry water and basic first aid supplies</li>
        <li>Check weather conditions before heading out</li>
        <li>Know your limits and turn back if conditions deteriorate</li>
        <li>Consider carrying a phone for emergencies</li>
      </ul>

      <h2>Build Your Trail Running Fitness</h2>
      <p>Trail running uses different muscles than road running. Incorporate strength training, especially for your:</p>
      <ul>
        <li>Core muscles for stability</li>
        <li>Ankles and calves for uneven terrain</li>
        <li>Quads and glutes for uphill climbing</li>
      </ul>

      <h2>Respect Nature and Other Trail Users</h2>
      <p>Follow Leave No Trace principles, yield to hikers and equestrians, and stay on marked trails to protect the environment.</p>

      <h2>Join the Community</h2>
      <p>Consider joining local trail running groups or events. The trail running community is incredibly welcoming and supportive. You'll learn from experienced runners and make lasting friendships!</p>

      <p><strong>Ready to hit the trails?</strong> Check out our upcoming trail running events and join a supportive community of runners at all levels. See you on the trails!</p>
    `
    }

    return (
        <article className="max-w-4xl mx-auto">
            {/* Back button */}
            <div className="mb-8">
                <Button variant="ghost" asChild>
                    <Link href="/blog">← Back to Blog</Link>
                </Button>
            </div>

            {/* Category badge */}
            <div className="mb-4">
                <Badge variant="secondary">{article.category}</Badge>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                {article.title}
            </h1>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
                <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{article.author}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{article.date}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{article.readTime}</span>
                </div>
            </div>

            {/* Featured image */}
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border mb-8">
                <img
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    className="object-cover w-full h-full"
                />
            </div>

            {/* Article content */}
            <div
                className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Share section */}
            <div className="mt-12 pt-8 border-t border-border">
                <p className="text-sm text-muted-foreground mb-4">Enjoyed this article? Share it with your running friends!</p>
                <div className="flex gap-3">
                    <Button variant="outline" size="sm">Share on Twitter</Button>
                    <Button variant="outline" size="sm">Share on Facebook</Button>
                    <Button variant="outline" size="sm">Copy Link</Button>
                </div>
            </div>

            {/* Back to blog */}
            <div className="mt-12 text-center">
                <Button asChild>
                    <Link href="/blog">Read More Articles</Link>
                </Button>
            </div>
        </article>
    )
}
