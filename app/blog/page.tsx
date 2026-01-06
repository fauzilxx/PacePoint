import { Navbar } from "@/components/navbar"
import BlogList from "./BlogList"

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <BlogList />
    </div>
  )
}
