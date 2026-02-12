'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { MapPin, Navigation, Phone, Mail, Clock, Car, Train, Bus, Building, Users, Briefcase, Calendar, ArrowRight, CheckCircle } from 'lucide-react';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), {
  ssr: false,
  loading: () => <div className="h-[500px] bg-gray-200 animate-pulse rounded-lg"></div>
});
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

// Import leaflet CSS
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Next.js
let L: any;

const officeLocations = [
  {
    id: 1,
    name: 'Prime Accounting - Headquarters',
    address: '123 Financial District, Suite 500, New York, NY 10005',
    phone: '(212) 555-0123',
    email: 'nyc@primeaccounting.com',
    position: [40.7128, -74.0060] as [number, number],
    hours: 'Mon-Fri: 8:30am - 6:30pm, Sat: 9am - 1pm',
    services: ['Tax Planning', 'Audit', 'Business Consulting'],
    cpaCount: 25,
    clients: '1,200+',
    established: '2008',
    image: '/images/locations/new-york.jpg'
  },
  {
    id: 2,
    name: 'Los Angeles Financial Center',
    address: '456 Wilshire Boulevard, Suite 1200, Los Angeles, CA 90010',
    phone: '(213) 555-0456',
    email: 'la@primeaccounting.com',
    position: [34.0522, -118.2437] as [number, number],
    hours: 'Mon-Fri: 8:00am - 7:00pm, Sat: 9am - 2pm',
    services: ['Bookkeeping', 'Tax Planning', 'Financial Analysis'],
    cpaCount: 18,
    clients: '800+',
    established: '2012',
    image: '/images/locations/los-angeles.jpg'
  },
  {
    id: 3,
    name: 'Chicago Accounting Hub',
    address: '789 Michigan Avenue, Floor 15, Chicago, IL 60611',
    phone: '(312) 555-0789',
    email: 'chicago@primeaccounting.com',
    position: [41.8781, -87.6298] as [number, number],
    hours: 'Mon-Fri: 8:30am - 6:00pm, Sat: 10am - 2pm',
    services: ['Audit Services', 'CFO Consulting', 'Tax Planning'],
    cpaCount: 15,
    clients: '600+',
    established: '2015',
    image: '/images/locations/chicago.jpg'
  },
  {
    id: 4,
    name: 'Miami Business Center',
    address: '101 Brickell Avenue, Suite 800, Miami, FL 33131',
    phone: '(305) 555-0321',
    email: 'miami@primeaccounting.com',
    position: [25.7617, -80.1918] as [number, number],
    hours: 'Mon-Fri: 9:00am - 6:00pm, Sat-Sun: By Appointment',
    services: ['International Tax', 'Real Estate Accounting', 'Business Consulting'],
    cpaCount: 12,
    clients: '500+',
    established: '2018',
    image: '/images/locations/miami.jpg'
  },
  {
    id: 5,
    name: 'Dallas Financial Plaza',
    address: '234 Main Street, Suite 300, Dallas, TX 75201',
    phone: '(214) 555-0654',
    email: 'dallas@primeaccounting.com',
    position: [32.7767, -96.7970] as [number, number],
    hours: 'Mon-Fri: 8:00am - 6:00pm, Sat: 9am - 1pm',
    services: ['Oil & Gas Accounting', 'Tax Planning', 'Audit'],
    cpaCount: 10,
    clients: '400+',
    established: '2020',
    image: '/images/locations/dallas.jpg'
  }
];

const transportOptions = [
  { icon: <Car className="w-5 h-5" />, name: 'Parking', details: 'Secure parking garage available' },
  { icon: <Train className="w-5 h-5" />, name: 'Subway', details: '2-minute walk from station' },
  { icon: <Bus className="w-5 h-5" />, name: 'Bus', details: 'Multiple routes at doorstep' },
];

export default function LocationPage() {
  const [selectedLocation, setSelectedLocation] = useState(officeLocations[0]);
  const [mapCenter, setMapCenter] = useState<[number, number]>(officeLocations[0].position);
  const [isClient, setIsClient] = useState(false);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('offices');

  useEffect(() => {
    setIsClient(true);
    
    if (typeof window !== 'undefined') {
      import('leaflet').then((leaflet) => {
        L = leaflet.default;
        setLeafletLoaded(true);
        
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
      });
    }
  }, []);

  const handleLocationSelect = (location: typeof officeLocations[0]) => {
    setSelectedLocation(location);
    setMapCenter(location.position);
  };

  const defaultIcon = useMemo(() => {
    if (typeof window === 'undefined' || !L || !leafletLoaded) return null;
    
    return L.icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  }, [leafletLoaded]);

  const selectedIcon = useMemo(() => {
    if (typeof window === 'undefined' || !L || !leafletLoaded) return null;
    
    return L.divIcon({
      html: `
        <div style="
          width: 40px;
          height: 40px;
          background: #EAB308;
          border-radius: 50%;
          border: 4px solid white;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            width: 16px;
            height: 16px;
            background: white;
            border-radius: 50%;
          "></div>
        </div>
      `,
      className: '',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });
  }, [leafletLoaded]);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our <span className="text-yellow-500">Offices</span> Nationwide
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Visit us at any of our five strategic locations across the United States. 
              Expert financial guidance is always close to home.
            </p>
            
            {/* Office Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
                <Building className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">5</div>
                <div className="text-sm text-gray-300">Offices</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
                <Users className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">80+</div>
                <div className="text-sm text-gray-300">CPAs</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
                <Briefcase className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">3,500+</div>
                <div className="text-sm text-gray-300">Clients</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
                <Calendar className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">15+</div>
                <div className="text-sm text-gray-300">Years</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Tab Navigation */}
          <div className="flex space-x-4 mb-8 border-b">
            <button
              onClick={() => setActiveTab('offices')}
              className={`px-6 py-3 font-semibold transition-colors relative ${
                activeTab === 'offices'
                  ? 'text-yellow-500 border-b-2 border-yellow-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Our Offices
            </button>
            <button
              onClick={() => setActiveTab('virtual')}
              className={`px-6 py-3 font-semibold transition-colors relative ${
                activeTab === 'virtual'
                  ? 'text-yellow-500 border-b-2 border-yellow-500'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Virtual Services
            </button>
          </div>

          {activeTab === 'offices' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Office List */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <Building className="w-6 h-6 text-yellow-500 mr-2" />
                    Select Location
                  </h2>
                  <div className="space-y-4">
                    {officeLocations.map((location) => (
                      <button
                        key={location.id}
                        onClick={() => handleLocationSelect(location)}
                        className={`w-full text-left p-4 rounded-lg transition-all duration-300 ${
                          selectedLocation.id === location.id
                            ? 'bg-yellow-50 border-2 border-yellow-500 shadow-md'
                            : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            selectedLocation.id === location.id 
                              ? 'bg-yellow-100 text-yellow-600' 
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            <MapPin className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <h3 className={`font-bold ${
                              selectedLocation.id === location.id ? 'text-yellow-700' : 'text-gray-900'
                            }`}>
                              {location.name}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">{location.address}</p>
                            <div className="flex items-center mt-2 text-xs text-gray-500">
                              <Users className="w-3 h-3 mr-1" />
                              {location.cpaCount} CPAs
                              <span className="mx-2">•</span>
                              <Briefcase className="w-3 h-3 mr-1" />
                              Since {location.established}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Transportation */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Getting Here</h3>
                  <div className="space-y-3">
                    {transportOptions.map((transport, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600">
                          {transport.icon}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{transport.name}</p>
                          <p className="text-sm text-gray-600">{transport.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Schedule Meeting */}
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
                  <h3 className="text-lg font-bold mb-2">Schedule a Meeting</h3>
                  <p className="text-white/90 text-sm mb-4">
                    Book a consultation with our experts at this location
                  </p>
                  <Link 
                    href="/contact" 
                    className="block w-full bg-white text-yellow-600 text-center px-4 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Schedule Now
                  </Link>
                </div>
              </div>

              {/* Map & Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Map */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6 border-b">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{selectedLocation.name}</h2>
                        <p className="text-gray-600">{selectedLocation.address}</p>
                      </div>
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {selectedLocation.clients} Clients
                      </span>
                    </div>
                  </div>
                  
                  <div className="h-[400px] relative">
                    {isClient && leafletLoaded ? (
                      <MapContainer
                        center={mapCenter}
                        zoom={14}
                        style={{ height: '100%', width: '100%' }}
                        className="z-0"
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        />
                        {officeLocations.map((location) => (
                          <Marker
                            key={location.id}
                            position={location.position}
                            icon={location.id === selectedLocation.id ? selectedIcon || defaultIcon : defaultIcon}
                            eventHandlers={{
                              click: () => handleLocationSelect(location),
                            }}
                          >
                            <Popup>
                              <div className="p-2">
                                <h3 className="font-bold text-gray-900">{location.name}</h3>
                                <p className="text-sm text-gray-600 mt-1">{location.address}</p>
                                <p className="text-sm text-gray-600 mt-1">{location.phone}</p>
                                <Link 
                                  href={`https://maps.google.com/?q=${location.address}`}
                                  target="_blank"
                                  className="text-yellow-500 text-sm font-semibold hover:text-yellow-600 mt-2 inline-block"
                                >
                                  Get Directions →
                                </Link>
                              </div>
                            </Popup>
                          </Marker>
                        ))}
                      </MapContainer>
                    ) : (
                      <div className="h-full bg-gray-200 animate-pulse flex items-center justify-center">
                        <div className="text-center">
                          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <div className="text-gray-500">Loading map...</div>
                        </div>
                      </div>
                    )}
                    
                    {/* Map Controls */}
                    {isClient && (
                      <div className="absolute top-4 right-4 flex flex-col space-y-2 z-[1000]">
                        <button
                          onClick={() => {
                            if (navigator.geolocation) {
                              navigator.geolocation.getCurrentPosition((position) => {
                                setMapCenter([position.coords.latitude, position.coords.longitude]);
                              });
                            }
                          }}
                          className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
                          title="Find My Location"
                        >
                          <Navigation className="w-5 h-5 text-yellow-500" />
                        </button>
                        <button
                          onClick={() => window.open(`https://maps.google.com/?q=${selectedLocation.address}`, '_blank')}
                          className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
                          title="Open in Google Maps"
                        >
                          <MapPin className="w-5 h-5 text-yellow-500" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Location Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contact Info */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600">
                          <Phone className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium text-gray-900">{selectedLocation.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600">
                          <Mail className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium text-gray-900">{selectedLocation.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600">
                          <Clock className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Business Hours</p>
                          <p className="font-medium text-gray-900">{selectedLocation.hours}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Services Available</h3>
                    <div className="space-y-3">
                      {selectedLocation.services.map((service, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                          <span className="text-gray-700">{service}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <Link href="/services" className="text-yellow-500 font-semibold hover:text-yellow-600 flex items-center">
                        View All Services <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>

                  {/* Team Info */}
                  <div className="bg-white rounded-xl shadow-lg p-6 md:col-span-2">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Office Team</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="text-center">
                          <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-2"></div>
                          <p className="font-medium text-gray-900">John Doe</p>
                          <p className="text-sm text-gray-500">Senior CPA</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Virtual Services Tab */
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="max-w-3xl mx-auto text-center">
                <div className="bg-yellow-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-10 h-10 text-yellow-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Virtual Accounting Services</h2>
                <p className="text-lg text-gray-600 mb-8">
                  Can't make it to our physical office? We offer comprehensive virtual services to serve you wherever you are.
                </p>
                
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {[
                    { title: 'Virtual Consultations', desc: 'Face-to-face video meetings with CPAs' },
                    { title: 'Secure Document Upload', desc: 'Share financial documents securely' },
                    { title: 'Remote Bookkeeping', desc: 'Full-service virtual bookkeeping' },
                  ].map((item, index) => (
                    <div key={index} className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <Link 
                  href="/contact"
                  className="inline-flex items-center bg-yellow-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
                >
                  Schedule Virtual Appointment
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Meet Our Team?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Schedule a free consultation at any of our locations or request a virtual meeting
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="bg-yellow-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-yellow-600 transition-colors">
              Book an Appointment
            </Link>
            <Link href="/services" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors">
              Explore Services
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}