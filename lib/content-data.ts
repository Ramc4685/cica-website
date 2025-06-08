import { Trophy, Calendar, Users } from "lucide-react"

// Content management for admin panel
export interface NewsItem {
  id: string
  title: string
  date: string
  category: string
  excerpt: string
  content?: string
  image?: string
  author?: string
  icon?: any // Add icon property
}

export interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  rating: number
  image?: string
  featured?: boolean
}

// Default news items (can be updated via admin)
export const defaultNews: NewsItem[] = [
  {
    id: "1",
    title: "CICA Indoor Championship Finals Set for This Weekend",
    date: "December 10, 2024",
    category: "Tournament",
    excerpt:
      "The top four teams have qualified for the championship finals scheduled for this weekend. Exciting matches ahead with live streaming available!",
    image: "/placeholder.svg?height=200&width=300",
    icon: Trophy,
  },
  {
    id: "2",
    title: "2025 Tournament Schedule Released - Registration Opens Soon",
    date: "December 5, 2024",
    category: "Announcement",
    excerpt:
      "Mark your calendars! The complete 2025 tournament schedule is now available with registration opening January 1st. Early bird discounts available.",
    image: "/placeholder.svg?height=200&width=300",
    icon: Calendar,
  },
  {
    id: "3",
    title: "Record Breaking New Player Orientation Success",
    date: "November 28, 2024",
    category: "Community",
    excerpt:
      "Over 45 new players joined our recent orientation session, the largest in CICA history. Welcome to the CICA family!",
    image: "/placeholder.svg?height=200&width=300",
    icon: Users,
  },
]

// Default testimonials (can be updated via admin)
export const defaultTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    role: "Team Captain, Bloomington Warriors",
    content:
      "CICA has been instrumental in developing cricket in our community. The tournaments are well-organized and the spirit of cricket is always maintained.",
    rating: 5,
    image: "/placeholder.svg?height=60&width=60",
    featured: true,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    role: "Parent & Volunteer",
    content:
      "My son has grown so much as a player and person through CICA. The community here is incredibly welcoming and supportive.",
    rating: 5,
    image: "/placeholder.svg?height=60&width=60",
    featured: true,
  },
  {
    id: "3",
    name: "Amit Patel",
    role: "Local Business Owner",
    content:
      "Sponsoring CICA events has been great for our business. The community engagement and professional organization make it worthwhile.",
    rating: 5,
    image: "/placeholder.svg?height=60&width=60",
    featured: true,
  },
]

// Helper functions for content management
export function getNewsItems(): NewsItem[] {
  // In a real app, this would fetch from a database
  // For now, return default items
  return defaultNews
}

export function getTestimonials(): Testimonial[] {
  // In a real app, this would fetch from a database
  // For now, return default items
  return defaultTestimonials
}

export function getFeaturedTestimonials(): Testimonial[] {
  return getTestimonials().filter((t) => t.featured)
}
