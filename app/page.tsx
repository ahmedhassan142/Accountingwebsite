import Link from 'next/link';
import Image from 'next/image';
import { TrendingUp, Shield, Clock, Users, ArrowRight, CheckCircle, DollarSign, FileText, BarChart } from 'lucide-react';

export default function Home() {
  const services = [
    {
      icon: <DollarSign className="h-10 w-10 text-yellow-500" />,
      title: 'Tax Planning',
      description: 'Strategic tax planning to minimize liabilities and maximize returns.',
    },
    {
      icon: <FileText className="h-10 w-10 text-yellow-500" />,
      title: 'Bookkeeping',
      description: 'Accurate and timely bookkeeping services for businesses of all sizes.',
    },
    {
      icon: <BarChart className="h-10 w-10 text-yellow-500" />,
      title: 'Financial Analysis',
      description: 'Deep insights into your financial health and performance.',
    },
  ];

  const stats = [
    { number: '500+', label: 'Clients Served' },
    { number: '15+', label: 'Years Experience' },
    { number: '50+', label: 'Expert Accountants' },
    { number: '98%', label: 'Client Satisfaction' },
  ];

  return (
    <>
      {/* Hero Section with Background Image - FIXED OPACITY */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Image - INCREASED VISIBILITY */}
        <div className="absolute inset-0 z-0">
          {/* Lighter gradient overlay - REDUCED OPACITY from 0.95 to 0.7 */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 via-gray-900/60 to-gray-900/70 z-10"></div>
          <Image
            src="/images/hero/home-hero.jpg"
            alt="Prime Accounting - Your trusted financial partner"
            fill
            className="object-cover"
            priority
            quality={95}
            sizes="100vw"
          />
        </div>
        
        <div className="container-custom relative z-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="heading-1 mb-6">
                Your Trusted Partner in{' '}
                <span className="text-yellow-500">Financial Success</span>
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Expert accounting, tax, and consulting services tailored to help your business grow and thrive in today's competitive landscape.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/Contact" className="btn-primary">
                  Get Free Consultation
                </Link>
                <Link href="/Services" className="btn-outline text-white border-white hover:bg-white hover:text-gray-900">
                  Our Services
                </Link>
              </div>
              <div className="flex items-center mt-8 space-x-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gray-600/50 border-2 border-white"></div>
                  ))}
                </div>
                <p className="text-white/90">
                  <span className="font-semibold text-yellow-500">500+</span> businesses trust us
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-8 shadow-2xl">
                <h3 className="text-2xl font-bold mb-4 text-white">Free Financial Assessment</h3>
                <p className="mb-6 text-white/90">Get a comprehensive review of your current financial situation.</p>
                <Link href="/Contact" className="inline-flex items-center text-white font-semibold hover:underline">
                  Schedule Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-yellow-500 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="heading-2 mb-4">Our Professional Services</h2>
            <p className="text-xl text-gray-600">
              Comprehensive accounting solutions tailored to your unique business needs
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <Link href="/Services" className="inline-flex items-center text-yellow-500 font-semibold hover:text-yellow-600">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="heading-2 mb-6">Why Choose Prime Accounting?</h2>
              <div className="space-y-4">
                {[
                  { icon: <CheckCircle className="h-6 w-6 text-yellow-500" />, title: 'Certified Professionals', desc: 'All our accountants are CPA certified' },
                  { icon: <Clock className="h-6 w-6 text-yellow-500" />, title: '24/7 Availability', desc: 'Round-the-clock support for urgent matters' },
                  { icon: <Shield className="h-6 w-6 text-yellow-500" />, title: '100% Confidential', desc: 'Your financial data is always secure' },
                  { icon: <TrendingUp className="h-6 w-6 text-yellow-500" />, title: 'Results Driven', desc: 'Proven track record of client success' },
                ].map((item, index) => (
                  <div key={index} className="flex space-x-4">
                    <div className="flex-shrink-0">{item.icon}</div>
                    <div>
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-900 text-white p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-gray-300 mb-6">
                Schedule a free consultation with our expert accountants today.
              </p>
              <Link href="/Contact" className="btn-primary inline-block">
                Book Your Free Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}