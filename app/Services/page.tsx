import Link from 'next/link';
import Image from 'next/image';
import { Calculator, FileText, PieChart, TrendingUp, Shield, Briefcase, ArrowRight, CheckCircle } from 'lucide-react';

export default function ServicesPage() {
  const services = [
    {
      icon: <Calculator className="h-12 w-12 text-yellow-500" />,
      title: 'Tax Planning & Preparation',
      description: 'Comprehensive tax strategies and preparation services for individuals and businesses.',
      features: ['Corporate Tax', 'Personal Tax', 'Tax Planning', 'IRS Representation'],
      price: 'Starting at $499'
    },
    {
      icon: <FileText className="h-12 w-12 text-yellow-500" />,
      title: 'Bookkeeping Services',
      description: 'Accurate and timely bookkeeping to keep your finances organized and compliant.',
      features: ['Daily Transactions', 'Bank Reconciliation', 'Financial Reports', 'Payroll Processing'],
      price: 'Starting at $299/mo'
    },
    {
      icon: <PieChart className="h-12 w-12 text-yellow-500" />,
      title: 'Financial Analysis',
      description: 'Deep dive into your financial data to identify opportunities and risks.',
      features: ['Profitability Analysis', 'Cash Flow Management', 'Budget Planning', 'Financial Forecasting'],
      price: 'Custom Quote'
    },
    {
      icon: <Shield className="h-12 w-12 text-yellow-500" />,
      title: 'Audit Services',
      description: 'Thorough audit preparation and representation for peace of mind.',
      features: ['Internal Audit', 'External Audit', 'Compliance Review', 'Risk Assessment'],
      price: 'Custom Quote'
    },
    {
      icon: <TrendingUp className="h-12 w-12 text-yellow-500" />,
      title: 'Business Consulting',
      description: 'Strategic advice to help your business grow and maximize profits.',
      features: ['Business Planning', 'Growth Strategy', 'Merger & Acquisition', 'Exit Planning'],
      price: 'Starting at $899'
    },
    {
      icon: <Briefcase className="h-12 w-12 text-yellow-500" />,
      title: 'CFO Services',
      description: 'Expert financial leadership without the full-time executive cost.',
      features: ['Strategic Planning', 'Risk Management', 'Investor Relations', 'Financial Modeling'],
      price: 'Custom Quote'
    }
  ];

  return (
    <>
      {/* Hero Section with Background Image - FIXED OPACITY */}
    {/* Hero Section with Background Image - FIXED OPACITY & INCREASED HEIGHT */}
<section className="relative pt-32 pb-32 overflow-hidden min-h-[500px] md:min-h-[550px] lg:min-h-[600px] flex items-center">
  {/* Background Image - INCREASED VISIBILITY */}
  <div className="absolute inset-0 z-0">
    {/* Lighter gradient overlay - REDUCED OPACITY from 0.95 to 0.6 */}
    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/60 via-gray-900/50 to-gray-900/60 z-10"></div>
    <Image
      src="/images/hero/service-hero.jpg"
      alt="Professional accounting services"
      fill
      className="object-cover"
      priority
      quality={95}
      sizes="100vw"
    />
  </div>
  
  <div className="container-custom relative z-20">
    <div className="max-w-3xl mx-auto text-center text-white">
      <h1 className="heading-1 mb-6 drop-shadow-lg">Our Services</h1>
      <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow">
        Comprehensive accounting and financial solutions tailored to your specific needs
      </p>
    </div>
  </div>
</section>

      {/* Services Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-8">
                  <div className="mb-4">{service.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="mb-6">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-yellow-500">{service.price}</span>
                    <Link href="/Contact" className="inline-flex items-center text-yellow-500 hover:text-yellow-600 font-semibold">
                      Get Quote <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-yellow-500">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Not Sure Which Service You Need?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Schedule a free consultation and we'll help you identify the best solution for your situation.
          </p>
          <Link href="/Contact" className="bg-white text-yellow-500 hover:bg-gray-100 font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 inline-block shadow-lg">
            Schedule Free Consultation
          </Link>
        </div>
      </section>
    </>
  );
}