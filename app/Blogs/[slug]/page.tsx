import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Calendar, Clock, User, Tag, ArrowLeft, Share2, Bookmark, 
  Facebook, Twitter, Linkedin, Mail, ChevronRight, Eye,Star,Copy,FileText,ArrowRight,
  ThumbsUp, MessageCircle, Printer, Download, Award
} from 'lucide-react';
import { blogPosts, getBlogPostBySlug, getRelatedPosts, BlogPost } from '../data';

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getBlogPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: 'Blog Post Not Found | Prime Accounting',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: post.seo.title,
    description: post.seo.description,
    keywords: post.seo.keywords.join(', '),
    authors: [{ name: post.author.name, url: `https://primeaccounting.com/authors/${post.author.name.toLowerCase().replace(' ', '-')}` }],
    openGraph: {
      title: post.seo.title,
      description: post.seo.description,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.modifiedDate || post.date,
      authors: [post.author.name],
      tags: post.tags,
      images: [
        {
          url: post.image.startsWith('http') ? post.image : `https://primeaccounting.com${post.image}`,
          width: 1200,
          height: 630,
          alt: post.imageAlt,
        }
      ],
      siteName: 'Prime Accounting',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seo.title,
      description: post.seo.description,
      images: [post.image.startsWith('http') ? post.image : `https://primeaccounting.com${post.image}`],
      creator: '@primeaccounting',
      site: '@primeaccounting',
    },
    alternates: {
      canonical: post.seo.canonicalUrl || `https://primeaccounting.com/blog/${post.slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// Generate static paths for all blog posts
export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

// Schema.org structured data
function generateBlogPostingSchema(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.image.startsWith('http') ? post.image : `https://primeaccounting.com${post.image}`,
    datePublished: post.date,
    dateModified: post.modifiedDate || post.date,
    author: {
      '@type': 'Person',
      name: post.author.name,
      description: post.author.bio,
      url: `https://primeaccounting.com/authors/${post.author.name.toLowerCase().replace(' ', '-')}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Prime Accounting',
      logo: {
        '@type': 'ImageObject',
        url: 'https://primeaccounting.com/images/logo.png',
      },
    },
    keywords: post.tags.join(', '),
    articleSection: post.category,
    wordCount: post.content.split(' ').length,
    timeRequired: post.readTime,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://primeaccounting.com/blog/${post.slug}`,
    },
  };
}

// Generate breadcrumb schema
function generateBreadcrumbSchema(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://primeaccounting.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://primeaccounting.com/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.category,
        item: `https://primeaccounting.com/blog?category=${post.category.toLowerCase().replace(' ', '-')}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: post.title,
        item: `https://primeaccounting.com/blog/${post.slug}`,
      },
    ],
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPostBySlug(params.slug);
  
  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(post, 3);

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBlogPostingSchema(post)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbSchema(post)),
        }}
      />

      {/* ========== HERO SECTION WITH BACKGROUND IMAGE - FIXED OPACITY ========== */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Image - INCREASED VISIBILITY */}
        <div className="absolute inset-0 z-0">
          {/* Lighter gradient overlay - REDUCED OPACITY from 0.95 to 0.65 */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/65 via-gray-900/55 to-gray-900/65 z-10"></div>
          <Image
            src={post.image}
            alt={post.imageAlt}
            fill
            className="object-cover scale-105 animate-ken-burns"
            priority
            quality={95}
            sizes="100vw"
          />
        </div>
        
        <div className="container-custom relative z-20">
          <div className="max-w-4xl mx-auto text-white">
            {/* Breadcrumbs */}
            <div className="flex items-center text-sm text-white/80 mb-6 flex-wrap">
              <Link href="/" className="hover:text-yellow-500 transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4 mx-2" />
              <Link href="/blog" className="hover:text-yellow-500 transition-colors">Blog</Link>
              <ChevronRight className="w-4 h-4 mx-2" />
              <Link 
                href={`/blog?category=${post.category.toLowerCase().replace(' ', '-')}`} 
                className="hover:text-yellow-500 transition-colors"
              >
                {post.category}
              </Link>
            </div>
            
            {/* Category Badge */}
            <div className="inline-block bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg">
              {post.category}
            </div>
            
            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight drop-shadow-lg">
              {post.title}
            </h1>
            
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-white/90 mb-8">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mr-3 border-2 border-white/50 shadow-lg flex items-center justify-center text-white font-bold">
                  {post.author.name.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-medium text-lg">{post.author.name}</p>
                  <p className="text-sm text-white/80">{post.author.role}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-yellow-500" />
                <span>{formatDate(post.date)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-yellow-500" />
                <span>{post.readTime}</span>
              </div>
              <div className="flex items-center">
                <Eye className="w-5 h-5 mr-2 text-yellow-500" />
                <span>1.2K views</span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center space-x-2 bg-white/20 backdrop-blur-lg hover:bg-white/30 text-white px-5 py-2.5 rounded-lg transition-all duration-300 border border-white/30 group">
                <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Share</span>
              </button>
              <button className="flex items-center space-x-2 bg-white/20 backdrop-blur-lg hover:bg-white/30 text-white px-5 py-2.5 rounded-lg transition-all duration-300 border border-white/30 group">
                <Bookmark className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Save</span>
              </button>
              <button className="flex items-center space-x-2 bg-white/20 backdrop-blur-lg hover:bg-white/30 text-white px-5 py-2.5 rounded-lg transition-all duration-300 border border-white/30 group">
                <Printer className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Print</span>
              </button>
              <button className="flex items-center space-x-2 bg-white/20 backdrop-blur-lg hover:bg-white/30 text-white px-5 py-2.5 rounded-lg transition-all duration-300 border border-white/30 group">
                <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden rotate-180">
          <svg
            className="relative block w-full h-16 md:h-24"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="fill-white"
            ></path>
          </svg>
        </div>
      </section>

      {/* ========== MAIN CONTENT SECTION ========== */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-12 gap-8">
            
            {/* ========== LEFT SIDEBAR - AUTHOR INFO & SHARE ========== */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 space-y-6">
                {/* Author Card */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-4 h-4 mr-2 text-yellow-500" />
                    Author
                  </h4>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      {post.author.name.charAt(0)}
                    </div>
                    <h5 className="font-bold text-gray-900 text-lg">{post.author.name}</h5>
                    <p className="text-sm text-yellow-500 font-semibold mb-2">{post.author.role}</p>
                    <p className="text-xs text-gray-500 mb-4 line-clamp-4">
                      {post.author.bio}
                    </p>
                    <Link 
                      href={`/author/${post.author.name.toLowerCase().replace(' ', '-')}`}
                      className="text-sm text-yellow-500 hover:text-yellow-600 font-medium"
                    >
                      View Profile →
                    </Link>
                  </div>
                </div>
                
                {/* Share Card */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Share2 className="w-4 h-4 mr-2 text-yellow-500" />
                    Share Article
                  </h4>
                  <div className="flex flex-col space-y-3">
                    <div className="flex justify-center space-x-3">
                      <button className="w-10 h-10 bg-[#1877F2] text-white rounded-lg hover:bg-[#0C63D4] transition-colors flex items-center justify-center transform hover:scale-110 transition-transform">
                        <Facebook className="w-5 h-5" />
                      </button>
                      <button className="w-10 h-10 bg-[#1DA1F2] text-white rounded-lg hover:bg-[#1A8CD8] transition-colors flex items-center justify-center transform hover:scale-110 transition-transform">
                        <Twitter className="w-5 h-5" />
                      </button>
                      <button className="w-10 h-10 bg-[#0A66C2] text-white rounded-lg hover:bg-[#0958A3] transition-colors flex items-center justify-center transform hover:scale-110 transition-transform">
                        <Linkedin className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex justify-center space-x-3">
                      <button className="w-10 h-10 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center transform hover:scale-110 transition-transform">
                        <Mail className="w-5 h-5" />
                      </button>
                      <button className="w-10 h-10 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center transform hover:scale-110 transition-transform">
                        <MessageCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-yellow-500 transition-colors text-sm">
                      <Copy className="w-4 h-4" />
                      <span>Copy Link</span>
                    </button>
                  </div>
                </div>

                {/* Table of Contents */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 lg:block hidden">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Award className="w-4 h-4 mr-2 text-yellow-500" />
                    Table of Contents
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <a href="#introduction" className="text-gray-600 hover:text-yellow-500 transition-colors flex items-center">
                        <ChevronRight className="w-3 h-3 mr-1" />
                        Introduction
                      </a>
                    </li>
                    <li>
                      <a href="#key-deductions" className="text-gray-600 hover:text-yellow-500 transition-colors flex items-center">
                        <ChevronRight className="w-3 h-3 mr-1" />
                        Key Deductions
                      </a>
                    </li>
                    <li>
                      <a href="#strategic-planning" className="text-gray-600 hover:text-yellow-500 transition-colors flex items-center">
                        <ChevronRight className="w-3 h-3 mr-1" />
                        Strategic Planning
                      </a>
                    </li>
                    <li>
                      <a href="#qbi-deduction" className="text-gray-600 hover:text-yellow-500 transition-colors flex items-center">
                        <ChevronRight className="w-3 h-3 mr-1" />
                        QBI Deduction
                      </a>
                    </li>
                    <li>
                      <a href="#retirement-planning" className="text-gray-600 hover:text-yellow-500 transition-colors flex items-center">
                        <ChevronRight className="w-3 h-3 mr-1" />
                        Retirement Planning
                      </a>
                    </li>
                    <li>
                      <a href="#professional-help" className="text-gray-600 hover:text-yellow-500 transition-colors flex items-center">
                        <ChevronRight className="w-3 h-3 mr-1" />
                        Working with a Professional
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ========== MAIN ARTICLE CONTENT ========== */}
            <div className="lg:col-span-7">
              <article className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600 prose-strong:text-gray-900 prose-a:text-yellow-500 prose-a:no-underline hover:prose-a:text-yellow-600">
                {/* Article Header */}
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-xl mb-8">
                  <p className="text-gray-700 italic text-lg">
                    "{post.excerpt}"
                  </p>
                </div>

                {/* Article Content */}
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </article>

              {/* Tags Section */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 sm:mb-0 flex items-center">
                    <Tag className="w-5 h-5 mr-2 text-yellow-500" />
                    Related Topics
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/blog?tag=${tag.toLowerCase().replace(' ', '-')}`}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gradient-to-r hover:from-yellow-500 hover:to-yellow-600 hover:text-white transition-all duration-300"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Article Footer - Navigation */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <Link 
                    href="/blog" 
                    className="flex items-center text-gray-600 hover:text-yellow-500 transition-colors group"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Blog
                  </Link>
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center text-gray-600 hover:text-yellow-500 transition-colors">
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      128
                    </button>
                    <button className="flex items-center text-gray-600 hover:text-yellow-500 transition-colors">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      24
                    </button>
                  </div>
                </div>
              </div>

              {/* Author Bio Section */}
              <div className="mt-12 p-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                <div className="flex flex-col md:flex-row items-start md:items-center space-x-0 md:space-x-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mb-4 md:mb-0 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {post.author.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xl font-bold text-gray-900">{post.author.name}</h4>
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                        {post.author.role}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">
                      {post.author.bio}
                    </p>
                    <div className="flex items-center space-x-4">
                      <Link 
                        href={`/author/${post.author.name.toLowerCase().replace(' ', '-')}`}
                        className="text-yellow-500 hover:text-yellow-600 font-medium flex items-center"
                      >
                        View all articles
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                      <div className="flex space-x-2">
                        <button className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors">
                          <Twitter className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors">
                          <Linkedin className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h4 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <MessageCircle className="w-6 h-6 mr-2 text-yellow-500" />
                  Comments (0)
                </h4>
                
                {/* Comment Form */}
                <form className="space-y-4 mb-8">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Comment *
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Share your thoughts..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    ></textarea>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="save-info"
                        className="w-4 h-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500"
                      />
                      <label htmlFor="save-info" className="ml-2 text-sm text-gray-600">
                        Save my name and email for the next time I comment
                      </label>
                    </div>
                    <button className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                      Post Comment
                    </button>
                  </div>
                </form>

                {/* No Comments Yet */}
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h5 className="text-lg font-semibold text-gray-900 mb-1">No comments yet</h5>
                  <p className="text-gray-600">Be the first to share your thoughts!</p>
                </div>
              </div>
            </div>

            {/* ========== RIGHT SIDEBAR - RELATED POSTS ========== */}
            <div className="lg:col-span-3">
              <div className="sticky top-24 space-y-6">
                {/* Related Posts */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-yellow-500" />
                    Related Articles
                  </h4>
                  <div className="space-y-6">
                    {relatedPosts.length > 0 ? (
                      relatedPosts.map((relatedPost) => (
                        <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`} className="group block">
                          <div className="relative h-32 bg-gradient-to-r from-gray-700 to-gray-900 rounded-lg mb-3 overflow-hidden">
                            <Image
                              src={relatedPost.image}
                              alt={relatedPost.imageAlt}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                              sizes="(max-width: 768px) 100vw, 25vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-2 py-1 rounded text-xs font-semibold shadow-lg">
                              {relatedPost.category}
                            </div>
                          </div>
                          <h5 className="font-bold text-gray-900 group-hover:text-yellow-500 transition-colors line-clamp-2 mb-2">
                            {relatedPost.title}
                          </h5>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                            {relatedPost.excerpt}
                          </p>
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            {relatedPost.date}
                            <span className="mx-2">•</span>
                            <Clock className="w-3 h-3 mr-1" />
                            {relatedPost.readTime}
                          </div>
                        </Link>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No related articles found</p>
                    )}
                  </div>
                </div>

                {/* Newsletter Card */}
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white border border-yellow-400">
                  <h4 className="text-lg font-bold mb-2 flex items-center">
                    <Mail className="w-5 h-5 mr-2" />
                    📬 Newsletter
                  </h4>
                  <p className="text-sm text-yellow-100 mb-4">
                    Get the latest articles and tax tips delivered to your inbox.
                  </p>
                  <input
                    type="email"
                    placeholder="Your email"
                    className="w-full px-4 py-3 bg-white/20 backdrop-blur-lg border border-white/30 rounded-lg text-white placeholder-yellow-100 focus:outline-none focus:ring-2 focus:ring-white mb-3"
                  />
                  <button className="w-full bg-white text-yellow-600 px-4 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
                    Subscribe Now
                  </button>
                  <p className="text-xs text-yellow-100 mt-3">
                    No spam, unsubscribe anytime.
                  </p>
                </div>

                {/* Popular Tags */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Tag className="w-5 h-5 mr-2 text-yellow-500" />
                    Popular Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {['Tax Tips', 'Small Business', 'Deductions', 'IRS', 'Compliance', 'Bookkeeping'].map((tag) => (
                      <Link
                        key={tag}
                        href={`/blog?tag=${tag.toLowerCase().replace(' ', '-')}`}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gradient-to-r hover:from-yellow-500 hover:to-yellow-600 hover:text-white transition-all duration-300"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Advertisement / CTA */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg p-6 text-white border border-gray-700">
                  <h4 className="text-lg font-bold mb-2">📊 Free Financial Assessment</h4>
                  <p className="text-sm text-gray-300 mb-4">
                    Get a comprehensive review of your financial situation from our expert CPAs.
                  </p>
                  <Link
                    href="/contact"
                    className="block w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105 text-center shadow-lg"
                  >
                    Schedule Now →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/70 to-gray-900/80 z-10"></div>
          <Image
            src="/images/hero/cta-blog.jpg"
            alt="Get expert financial advice"
            fill
            className="object-cover"
            quality={90}
            sizes="100vw"
          />
        </div>

        <div className="container-custom relative z-20">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-lg">
              Need Expert Financial Advice?
            </h2>
            <p className="text-xl text-white/90 mb-8 drop-shadow">
              Schedule a free consultation with our team of expert CPAs and financial advisors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="group bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-yellow-500/30 inline-flex items-center justify-center"
              >
                Schedule Consultation
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link
                href="/services"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center"
              >
                Explore Services
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex items-center justify-center space-x-8 mt-12">
              <div className="flex items-center">
                <div className="flex -space-x-2 mr-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-600/50 backdrop-blur-sm border-2 border-white/50"></div>
                  ))}
                </div>
                <span className="text-sm text-white/90">Join 3,500+ satisfied clients</span>
              </div>
              <div className="flex items-center text-sm text-white/90">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                <span>4.9/5 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}