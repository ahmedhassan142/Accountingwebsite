'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { Mail, Phone, Clock, MapPin, Send, CheckCircle, AlertCircle, X } from 'lucide-react';

type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

// SMTP Configuration - Used by API route
const SMTP_CONFIG = {
  user: 'ah770643@gmail.com',
  pass: 'tzhixkiirkcpahrq',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // TLS
  toEmail: 'ah770643@gmail.com'
};

// Toast Component
const Toast = ({ 
  type, 
  message, 
  onClose 
}: { 
  type: 'success' | 'error'; 
  message: string; 
  onClose: () => void 
}) => {
  useState(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  });

  return (
    <div className="fixed top-24 right-4 z-50 animate-slide-in-right max-w-md w-full">
      <div className={`rounded-lg shadow-lg p-4 ${
        type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
      }`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {type === 'success' ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
          </div>
          <div className="ml-3 flex-1">
            <p className={`text-sm font-medium ${
              type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`ml-4 flex-shrink-0 rounded-md p-1.5 inline-flex ${
              type === 'success' 
                ? 'text-green-600 hover:bg-green-100' 
                : 'text-red-600 hover:bg-red-100'
            } transition-colors`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ContactPage() {
  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm<ContactFormData>();
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const onSubmit = async (data: ContactFormData) => {
    try {
      // Send email using API route
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          toEmail: SMTP_CONFIG.toEmail,
          smtpConfig: {
            user: SMTP_CONFIG.user,
            pass: SMTP_CONFIG.pass,
            host: SMTP_CONFIG.host,
            port: SMTP_CONFIG.port,
            secure: SMTP_CONFIG.secure
          }
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setToast({
          type: 'success',
          message: 'Your message has been sent successfully! We\'ll get back to you within 24 hours.'
        });
        reset();
      } else {
        throw new Error(result.error || 'Failed to send email');
      }
    } catch (error: any) {
      console.error('Email Error:', error);
      setToast({
        type: 'error',
        message: error?.message || 'Failed to send message. Please try again or contact us directly.'
      });
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <Toast 
          type={toast.type} 
          message={toast.message} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Hero Section with Background Image */}
      <section className="relative pt-32 pb-32 overflow-hidden min-h-[500px] md:min-h-[550px] lg:min-h-[600px] flex items-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/65 via-gray-900/55 to-gray-900/65 z-10"></div>
          <Image
            src="/images/hero/contact-hero.jpg"
            alt="Contact our accounting team"
            fill
            className="object-cover"
            priority
            quality={95}
            sizes="100vw"
          />
        </div>
        
        <div className="container-custom relative z-20">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="heading-1 mb-6 drop-shadow-lg">Get In Touch</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow">
              Ready to take control of your finances? Contact us today for a free consultation.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">Send Us a Message</h2>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    SMTP Ready
                  </span>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('name', { 
                        required: 'Name is required',
                        minLength: { value: 2, message: 'Name must be at least 2 characters' }
                      })}
                      className={`w-full px-4 py-3 border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all`}
                      placeholder="Your name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: { 
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Please enter a valid email address'
                        }
                      })}
                      className={`w-full px-4 py-3 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all`}
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      {...register('phone')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      {...register('message', { 
                        required: 'Message is required',
                        minLength: { value: 10, message: 'Message must be at least 10 characters' }
                      })}
                      rows={5}
                      className={`w-full px-4 py-3 border ${errors.message ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all`}
                      placeholder="How can we help you?"
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-400 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>

                  {/* SMTP Status */}
                  <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                      </div>
                      <p className="text-green-800 text-sm font-medium">
                        ✓ SMTP Connected: Messages sent via Gmail SMTP to {SMTP_CONFIG.toEmail}
                      </p>
                    </div>
                    <p className="text-xs text-green-600 mt-1 ml-4">
                      Your message will be delivered securely using TLS encryption
                    </p>
                  </div>
                </form>
              </div>

              {/* Quick Contact */}
              <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="font-bold text-lg mb-4 flex items-center text-gray-900">
                  <Mail className="w-5 h-5 text-yellow-500 mr-2" />
                  Quick Contact
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a 
                    href="tel:5551234567" 
                    className="flex items-center space-x-3 text-gray-700 hover:text-yellow-500 transition-colors group bg-white p-3 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">Call Us</p>
                      <p className="text-sm text-gray-600">(555) 123-4567</p>
                    </div>
                  </a>
                  <a 
                    href="mailto:info@primeaccounting.com" 
                    className="flex items-center space-x-3 text-gray-700 hover:text-yellow-500 transition-colors group bg-white p-3 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">Email Directly</p>
                      <p className="text-sm text-gray-600">info@primeaccounting.com</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Contact Information</h2>
              
              <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-xl shadow-lg border border-gray-100 mb-8">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4 group hover:translate-x-1 transition-transform">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600 group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Visit Us</h3>
                      <p className="text-gray-600">123 Business Avenue, Suite 100<br />New York, NY 10001</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 group hover:translate-x-1 transition-transform">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600 group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Call Us</h3>
                      <p className="text-gray-600">(555) 123-4567</p>
                      <p className="text-gray-600">(555) 987-6543</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 group hover:translate-x-1 transition-transform">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600 group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email Us</h3>
                      <a href="mailto:info@primeaccounting.com" className="text-gray-600 hover:text-yellow-500 transition-colors block">
                        info@primeaccounting.com
                      </a>
                      <a href="mailto:support@primeaccounting.com" className="text-gray-600 hover:text-yellow-500 transition-colors block">
                        support@primeaccounting.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 group hover:translate-x-1 transition-transform">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600 group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Business Hours</h3>
                      <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p className="text-gray-600">Saturday: 10:00 AM - 2:00 PM</p>
                      <p className="text-gray-600">Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Response Guarantee */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900">24-Hour Response Guarantee</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  We pride ourselves on fast response times. All inquiries are answered within 24 hours during business days.
                </p>
                <div className="mt-4 flex items-center text-xs text-gray-500 bg-white/50 p-2 rounded-lg">
                  <Mail className="w-3 h-3 mr-1 text-yellow-500" />
                  <span>SMTP Active: {SMTP_CONFIG.toEmail}</span>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="mt-6 flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"></div>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Trusted by 500+ businesses</p>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <svg key={i} className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                      <span className="text-xs text-gray-500 ml-1">4.9/5</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </>
  );
}