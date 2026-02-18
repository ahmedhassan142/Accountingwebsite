'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Calendar, Clock, User, Tag, ArrowRight, ChevronRight, 
  ChevronLeft, Eye, ThumbsUp, Share2, Bookmark, Star,
  Facebook, Twitter, Linkedin, Mail, Award, Sparkles,
  TrendingUp, FileText, Briefcase, DollarSign, X
} from 'lucide-react';
import { getBlogPostBySlug, getRelatedPosts, BlogPost } from '../data';

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      const foundPost = getBlogPostBySlug(slug);
      if (!foundPost) {
        notFound();
        return;
      }
      
      setPost(foundPost);
      setRelatedPosts(getRelatedPosts(foundPost, 3));
      setLoading(false);
    }, 500);
  }, [slug]);

  const formatDate = (dateString: string) => {
    return dateString;
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = post?.title || '';
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`
    };
    
    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
    setShowShareMenu(false);
  };

  // Get category icon
  const getCategoryIcon = (categoryName: string) => {
    //@ts-ignore
    const icons: Record<string, JSX.Element> = {
      'Tax Planning': <DollarSign className="w-4 h-4" />,
      'Tax Updates': <FileText className="w-4 h-4" />,
      'Financial Management': <TrendingUp className="w-4 h-4" />,
      'Bookkeeping': <FileText className="w-4 h-4" />,
      'Audit': <FileText className="w-4 h-4" />,
      'Financial Analysis': <Briefcase className="w-4 h-4" />,
    };
    return icons[categoryName] || <FileText className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Loading Skeleton */}
        <div className="container-custom py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-96 bg-gray-200 rounded-2xl mb-6"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      
      {/* ========== BREADCRUMB ========== */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-600 hover:text-yellow-500 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link href="/Blogs" className="text-gray-600 hover:text-yellow-500 transition-colors">
              Blog
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium line-clamp-1">{post.title}</span>
          </div>
        </div>
      </div>

      {/* ========== ARTICLE HEADER ========== */}
      <section className="relative pt-12 pb-8">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Category and Meta */}
            <div className="flex items-center flex-wrap gap-3 mb-6">
              <span className="inline-flex items-center bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                {getCategoryIcon(post.category)}
                <span className="ml-2">{post.category}</span>
              </span>
              {post.featured && (
                <span className="inline-flex items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  <Star className="w-4 h-4 mr-1 fill-white" />
                  Editor's Pick
                </span>
              )}
              {post.trending && (
                <span className="inline-flex items-center bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Trending
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Author and Meta Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gradient-to-r from-yellow-500 to-yellow-600 p-0.5">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white">
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-lg">{post.author.name}</p>
                  <p className="text-sm text-gray-600">{post.author.role}</p>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(post.date)}
                    <span className="mx-2">•</span>
                    <Clock className="w-4 h-4 mr-1" />
                    {post.readTime}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors group"
                  aria-label="Like article"
                >
                  <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-yellow-500 text-yellow-500' : 'text-gray-600 group-hover:text-yellow-500'}`} />
                </button>
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors group"
                  aria-label="Bookmark article"
                >
                  <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-yellow-500 text-yellow-500' : 'text-gray-600 group-hover:text-yellow-500'}`} />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors group"
                    aria-label="Share article"
                  >
                    <Share2 className="w-5 h-5 text-gray-600 group-hover:text-yellow-500" />
                  </button>
                  
                  {/* Share Menu */}
                  {showShareMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                      <button
                        onClick={() => handleShare('facebook')}
                        className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Facebook className="w-4 h-4 mr-3 text-blue-600" />
                        Facebook
                      </button>
                      <button
                        onClick={() => handleShare('twitter')}
                        className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Twitter className="w-4 h-4 mr-3 text-blue-400" />
                        Twitter
                      </button>
                      <button
                        onClick={() => handleShare('linkedin')}
                        className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Linkedin className="w-4 h-4 mr-3 text-blue-700" />
                        LinkedIn
                      </button>
                      <button
                        onClick={() => handleShare('email')}
                        className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Mail className="w-4 h-4 mr-3 text-gray-600" />
                        Email
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FEATURED IMAGE ========== */}
      <section className="pb-12">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl group">
              <Image
                src={post.image}
                alt={post.imageAlt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                priority
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              
              {/* Image Stats Overlay */}
              <div className="absolute bottom-6 left-6 flex items-center space-x-4 text-white">
                <div className="flex items-center bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                  <Eye className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">2.5K views</span>
                </div>
                <div className="flex items-center bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">328 likes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== ARTICLE CONTENT ========== */}
      <section className="py-12">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            {/* Article Stats Bar */}
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                <span>2.5K views</span>
              </div>
              <div className="flex items-center">
                <ThumbsUp className="w-4 h-4 mr-1" />
                <span>328 likes</span>
              </div>
              <div className="flex items-center">
                <Tag className="w-4 h-4 mr-1" />
                <div className="flex gap-1">
                  {post.tags.slice(0, 3).map((tag) => (
                    <Link
                      key={tag}
                      href={`/Blogs?tag=${tag}`}
                      className="hover:text-yellow-500 transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Article Content */}
            <article className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-yellow-500 hover:prose-a:text-yellow-600 prose-strong:text-gray-900 prose-ul:text-gray-600 prose-ol:text-gray-600 prose-li:text-gray-600">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </article>

            {/* Author Bio */}
            <div className="mt-12 p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl text-white">
              <div className="flex flex-col sm:flex-row items-start space-x-0 sm:space-x-6 space-y-4 sm:space-y-0">
                <div className="relative w-20 h-20 rounded-full overflow-hidden ring-4 ring-yellow-500/30 flex-shrink-0">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-xl font-bold">{post.author.name}</h3>
                    <Award className="w-5 h-5 ml-2 text-yellow-500" />
                  </div>
                  <p className="text-yellow-400 text-sm mb-3">{post.author.role}</p>
                  <p className="text-gray-300 text-sm leading-relaxed">{post.author.bio}</p>
                  <Link
                    href={`/Blogs?author=${encodeURIComponent(post.author.name)}`}
                    className="inline-flex items-center mt-4 text-yellow-400 hover:text-yellow-300 font-medium text-sm"
                  >
                    View all articles by {post.author.name}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Tags Section */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Tag className="w-5 h-5 mr-2 text-yellow-500" />
                Related Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/Blogs?tag=${tag}`}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-yellow-500 hover:text-white transition-all duration-300 text-sm hover:scale-105"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== RELATED POSTS ========== */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
                <Sparkles className="w-6 h-6 mr-2 text-yellow-500" />
                You May Also Like
              </h2>
              <Link 
                href="/Blogs" 
                className="text-yellow-500 hover:text-yellow-600 font-semibold flex items-center group"
              >
                View All
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/Blogs/${relatedPost.slug}`}
                  className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:-translate-y-1"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={relatedPost.image}
                      alt={relatedPost.imageAlt}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center">
                        {getCategoryIcon(relatedPost.category)}
                        <span className="ml-1">{relatedPost.category}</span>
                      </span>
                    </div>

                    {/* Featured Badge */}
                    {relatedPost.featured && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center">
                          <Star className="w-3 h-3 mr-1 fill-white" />
                          Featured
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <Clock className="w-3 h-3 mr-1" />
                      {relatedPost.readTime}
                      <span className="mx-2">•</span>
                      <Calendar className="w-3 h-3 mr-1" />
                      {relatedPost.date}
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-yellow-500 transition-colors line-clamp-2 mb-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center text-xs text-gray-500">
                        <User className="w-3 h-3 mr-1" />
                        {relatedPost.author.name}
                      </div>
                      <span className="inline-flex items-center text-yellow-500 font-medium text-sm group-hover:text-yellow-600">
                        Read More
                        <ArrowRight className="ml-1 w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========== NEWSLETTER CTA ========== */}
      <section className="py-16 bg-gradient-to-r from-yellow-500 to-yellow-600">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stay Updated with Financial Insights
            </h2>
            <p className="text-xl text-yellow-100 mb-8">
              Get the latest tax tips and financial strategies delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-yellow-300"
              />
              <button className="px-8 py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Subscribe
              </button>
            </div>
            <p className="text-sm text-yellow-100 mt-4">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      {/* ========== BACK TO BLOG ========== */}
      <div className="bg-white border-t border-gray-200 py-8">
        <div className="container-custom">
          <Link
            href="/Blogs"
            className="inline-flex items-center text-gray-600 hover:text-yellow-500 font-semibold transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back to All Articles
          </Link>
        </div>
      </div>
    </main>
  );
}