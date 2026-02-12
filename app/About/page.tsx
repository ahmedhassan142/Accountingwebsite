import Link from 'next/link'
import { Award, Users, Target, Heart } from 'lucide-react'

export default function AboutPage() {
  const team = [
    { name: 'John Smith', role: 'Founder & CEO', experience: '20+ years' },
    { name: 'Sarah Johnson', role: 'Head of Tax', experience: '15+ years' },
    { name: 'Michael Chen', role: 'Senior Accountant', experience: '12+ years' },
    { name: 'Emily Brown', role: 'Financial Advisor', experience: '10+ years' },
  ]

  const values = [
    {
      icon: <Target className="h-8 w-8 text-yellow-500" />,
      title: 'Excellence',
      description: 'We strive for excellence in every service we provide.'
    },
    {
      icon: <Heart className="h-8 w-8 text-yellow-500" />,
      title: 'Integrity',
      description: 'Honesty and transparency in all our dealings.'
    },
    {
      icon: <Users className="h-8 w-8 text-yellow-500" />,
      title: 'Client-First',
      description: 'Your success is our top priority.'
    },
    {
      icon: <Award className="h-8 w-8 text-yellow-500" />,
      title: 'Innovation',
      description: 'Staying ahead with modern financial solutions.'
    }
  ]

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white pt-32 pb-20">
        <div className="container-custom text-center">
          <h1 className="heading-1 mb-6">About Prime Accounting</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            With over 15 years of experience, we've helped thousands of clients achieve financial clarity and success.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="heading-2 mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 mb-4">
                Founded in 2008, Prime Accounting started with a simple mission: to provide exceptional financial services with integrity and personalized attention.
              </p>
              <p className="text-lg text-gray-600 mb-4">
                What began as a small practice has grown into a trusted firm serving over 500 businesses and individuals across the country.
              </p>
              <p className="text-lg text-gray-600">
                Today, we continue to uphold our founding principles while embracing modern technology to deliver the best possible service to our clients.
              </p>
            </div>
            <div className="bg-gray-100 p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-lg text-gray-700 italic">
                "To empower our clients with expert financial guidance and personalized service, helping them make informed decisions and achieve their financial goals."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="heading-2 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="bg-white p-4 rounded-full inline-block mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="heading-2 mb-4">Meet Our Expert Team</h2>
            <p className="text-xl text-gray-600">
              Certified professionals dedicated to your success
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-yellow-500 font-semibold mb-2">{member.role}</p>
                <p className="text-gray-600">{member.experience} experience</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}