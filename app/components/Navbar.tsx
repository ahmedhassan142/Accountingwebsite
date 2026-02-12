'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Calculator, ChevronDown } from 'lucide-react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/Services' },
    { name: 'About', href: '/About' },
    { name: 'Blog', href: '/Blogs' },
    { name: 'Location', href: '/location' },
    { name: 'Contact', href: '/Contact' },
  ]

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-lg py-2' : 'bg-white/95 py-4'
    }`}>
      <div className="container-custom">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Calculator className="h-8 w-8 text-yellow-500" />
            <span className="text-xl font-bold text-gray-900">Prime<span className="text-yellow-500">Accounting</span></span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-yellow-500 font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
            {/* <Link href="/contact" className="btn-primary">
              Get Started
            </Link> */}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4 px-4">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-yellow-500 font-medium py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {/* <Link href="/contact" className="btn-primary text-center">
                Get Started
              </Link> */}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar