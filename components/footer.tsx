import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Facebook, Youtube, Mail, MessageCircle, MapPin, Trophy } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Cricket field pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
        <div className="absolute top-20 right-20 w-24 h-24 border-2 border-white rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-20 h-20 border-2 border-white rounded-full"></div>
      </div>

      <div className="relative container mx-auto px-4 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative w-16 h-16 transform hover:scale-110 transition-transform duration-300">
                <Image
                  src="/images/cica-logo-main.jpg"
                  alt="CICA Logo"
                  fill
                  className="object-contain drop-shadow-lg"
                />
              </div>
              <div>
                <span className="font-bold text-3xl cricket-gradient-text">CICA</span>
                <p className="text-sm text-gray-300">Since 1998</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Central Illinois Cricket Association - Developing cricket and building community in Bloomington/Normal,
              Illinois. Join our tournaments, events, and active cricket community.
            </p>
            <div className="flex space-x-4">
              <Button
                size="sm"
                variant="outline"
                className="bg-blue-600/20 text-blue-400 border-blue-500/50 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300"
                asChild
              >
                <a
                  href="https://www.facebook.com/cicacric/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-red-600/20 text-red-400 border-red-500/50 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300"
                asChild
              >
                <a
                  href="https://www.youtube.com/@CICA-CRIC"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                >
                  <Youtube className="h-4 w-4" />
                </a>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-green-600/20 text-green-400 border-green-500/50 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all duration-300"
                asChild
              >
                <a
                  href="https://chat.whatsapp.com/Ij7GEOEkGJK9DCY2LDPFj8"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-400" />
              Quick Links
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li>
                <Link href="/about" className="hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-blue-400 rounded-full group-hover:scale-150 transition-transform"></span>
                  About CICA
                </Link>
              </li>
              <li>
                <Link href="/tournaments" className="hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-green-400 rounded-full group-hover:scale-150 transition-transform"></span>
                  Tournaments
                </Link>
              </li>
              <li>
                <Link href="/champions" className="hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-yellow-400 rounded-full group-hover:scale-150 transition-transform"></span>
                  Champions History
                </Link>
              </li>
              <li>
                <Link href="/board" className="hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-purple-400 rounded-full group-hover:scale-150 transition-transform"></span>
                  Board Members
                </Link>
              </li>
              <li>
                <Link href="/sponsors" className="hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-pink-400 rounded-full group-hover:scale-150 transition-transform"></span>
                  Sponsors
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-white transition-colors flex items-center gap-2 group">
                  <span className="w-1 h-1 bg-indigo-400 rounded-full group-hover:scale-150 transition-transform"></span>
                  Photo Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-6">Contact</h3>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start gap-3 group">
                <Mail className="h-5 w-5 text-blue-400 mt-0.5 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-sm font-medium">General Inquiries</p>
                  <a
                    href="mailto:organizers@cicainfo.com"
                    className="text-blue-400 hover:text-blue-300 transition-colors break-all"
                  >
                    organizers@cicainfo.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <MapPin className="h-5 w-5 text-green-400 mt-0.5 group-hover:scale-110 transition-transform" />
                <div>
                  <p className="text-sm font-medium">Serving</p>
                  <p className="text-sm">Bloomington/Normal, Illinois</p>
                </div>
              </li>
              <li>
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-green-500" />
                Connect With Us
              </h3>
              <ul className="space-y-3 text-gray-300">
                <li>
                  <div className="flex flex-col">
                    <span className="text-gray-100 font-medium">Stay Updated</span>
                    <div className="flex flex-wrap gap-3 mt-2">
                      <Link
                        href="/join"
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1.5 px-3 rounded-md transition-colors inline-flex items-center gap-2"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        Join CICA Updates
                      </Link>
                      <a
                        href="https://chat.whatsapp.com/Ij7GEOEkGJK9DCY2LDPFj8"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 hover:bg-green-700 text-white text-sm py-1.5 px-3 rounded-md transition-colors inline-flex items-center gap-2"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        WhatsApp Group
                      </a>
                    </div>
                  </div>
                </li>
              </ul>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
              <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                <Youtube className="h-4 w-4 text-red-500" />
                Latest on YouTube
              </h4>
              <div className="flex items-center gap-4">
                <div className="flex w-16 h-16 flex-shrink-0 items-center justify-center rounded-md bg-red-500/10" aria-hidden="true">
                  <Youtube className="h-8 w-8 text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">
                    Watch match highlights, player interviews, and tournament coverage
                  </p>
                  <a
                    href="https://www.youtube.com/@CICA-CRIC"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-red-400 hover:text-red-300 mt-1 inline-block"
                  >
                    Subscribe to our channel
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
              <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                <Facebook className="h-4 w-4 text-blue-500" />
                Connect on Facebook
              </h4>
              <div className="flex items-center gap-4">
                <div className="flex w-16 h-16 flex-shrink-0 items-center justify-center rounded-md bg-blue-500/10" aria-hidden="true">
                  <Facebook className="h-8 w-8 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">
                    Follow us for event updates, photos, and community announcements
                  </p>
                  <a
                    href="https://www.facebook.com/cicacric/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-300 mt-1 inline-block"
                  >
                    Like our page
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} Central Illinois Cricket Association. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/rules" className="text-gray-400 hover:text-white transition-colors hover:underline">
                Rules & Bylaws
              </Link>
              <Link
                href="https://cricclubs.com/CICA"
                target="_blank"
                className="text-blue-400 hover:text-blue-300 transition-colors hover:underline"
              >
                Live Scores
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
