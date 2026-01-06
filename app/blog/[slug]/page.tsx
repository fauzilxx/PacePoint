import { Navbar } from "@/components/navbar"
import BlogArticle from "./BlogArticle"

export default function BlogArticlePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container max-w-7xl mx-auto px-6 md:px-12">
          <BlogArticle />
        </div>
      </main>
    </div>
  )
}
