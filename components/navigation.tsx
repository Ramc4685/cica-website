"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Tournaments", href: "/tournaments" },
  { name: "Rules", href: "/rules" },
  { name: "Champions", href: "/champions" },
  { name: "Board", href: "/board" },
  { name: "Sponsors", href: "/sponsors" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b-2 border-blue-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-12 h-12 transform group-hover:scale-110 transition-transform duration-300">
              <Image
                src="/images/cica-logo-main.jpg"
                alt="CICA Logo"
                fill
                className="object-contain drop-shadow-md"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-blue-600 group-hover:text-blue-700 transition-colors">CICA</span>
              <span className="text-xs text-gray-500 hidden sm:block">Since 1998</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium text-sm relative group py-2"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 transform hover:scale-105 transition-all duration-200"
            >
              Join Community
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="relative">
              <div className="relative w-6 h-6">
                <span
                  className={`absolute block h-0.5 w-6 bg-gray-600 transform transition duration-300 ${isOpen ? "rotate-45 translate-y-2" : "translate-y-0"}`}
                ></span>
                <span
                  className={`absolute block h-0.5 w-6 bg-gray-600 transform transition duration-300 ${isOpen ? "opacity-0" : "translate-y-2"}`}
                ></span>
                <span
                  className={`absolute block h-0.5 w-6 bg-gray-600 transform transition duration-300 ${isOpen ? "-rotate-45 translate-y-2" : "translate-y-4"}`}
                ></span>
              </div>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 py-4" : "max-h-0"}`}
        >
          <div className="border-t border-gray-200">
            <div className="flex flex-col space-y-4 pt-4">
              {navItems.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium px-2 py-1 animate-slide-in-right"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Button className="mx-2 bg-green-600 hover:bg-green-700">Join Community</Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
