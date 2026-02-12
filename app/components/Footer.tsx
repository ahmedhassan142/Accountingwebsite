import Link from 'next/link'
import { Calculator, Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Calculator className="h-8 w-8 text-yellow-500" />
              <span className="text-xl font-bold">PrimeAccounting</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Expert accounting and financial services to help your business thrive.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Services', 'About', 'Blogs',  'Contact'].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.replace(' ', '-')}`}
                    className="text-gray-400 hover:text-yellow-500 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              {['Tax Planning', 'Bookkeeping', 'Financial Analysis', 'Audit Services', 'Business Consulting'].map((item) => (
                <li key={item}>
                  <Link href="/Services" className="text-gray-400 hover:text-yellow-500 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                <span className="text-gray-400">123 Business Ave, Suite 100<br />New York, NY 10001</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                <span className="text-gray-400">(555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                <span className="text-gray-400">info@primeaccounting.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Prime Accounting. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer