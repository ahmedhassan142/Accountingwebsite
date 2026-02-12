'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Calendar, Clock, User, Tag, Search, ArrowRight, 
  TrendingUp, DollarSign, FileText, Briefcase, ChevronRight,
  ChevronLeft, BookOpen, Star, Eye, ThumbsUp, Share2,
  Bookmark, Filter, X, Newspaper, Award, Sparkles, Mail,
  ChevronDown, AlertCircle
} from 'lucide-react';
import { blogPosts, BlogPost } from './data';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Posts');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [bookmarkedPosts, setBookmarkedPosts] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const postsPerPage = 6;

  // Categories with counts
  const categories = [
    { name: 'All Posts', count: blogPosts.length, icon: <Newspaper className="w-4 h-4" /> },
    { name: 'Tax Planning', count: blogPosts.filter(p => p.category === 'Tax Planning').length, icon: <DollarSign className="w-4 h-4" /> },
    { name: 'Financial Management', count: blogPosts.filter(p => p.category === 'Financial Management').length, icon: <TrendingUp className="w-4 h-4" /> },
    { name: 'Bookkeeping', count: blogPosts.filter(p => p.category === 'Bookkeeping').length, icon: <FileText className="w-4 h-4" /> },
    { name: 'Audit', count: blogPosts.filter(p => p.category === 'Audit').length, icon: <FileText className="w-4 h-4" /> },
    { name: 'Financial Analysis', count: blogPosts.filter(p => p.category === 'Financial Analysis').length, icon: <Briefcase className="w-4 h-4" /> },
  ];

  // All unique tags with counts
  const allTags = blogPosts.reduce((acc, post) => {
    post.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const popularTags = Object.entries(allTags)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 15);

  // Featured post
  const featuredPost = blogPosts.find(post => post.featured);

  // Trending posts (most viewed/commented)
  const trendingPosts = blogPosts
    .filter(post => post.trending)
    .sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0))
    .slice(0, 4);

  // Editor's picks
  const editorsPicks = blogPosts
    .filter(post => post.featured)
    .slice(0, 3);

  // Recent posts
  const recentPosts = [...blogPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  // Filter and sort posts
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All Posts' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTag = selectedTag === '' || post.tags.includes(selectedTag);
    return matchesCategory && matchesSearch && matchesTag;
  });

  // Sort posts
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'oldest':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'popular':
        return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
      default:
        return 0;
    }
  });

  // Pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, selectedTag, sortBy]);

  // Handle bookmark toggle
  const toggleBookmark = (postId: number) => {
    setBookmarkedPosts(prev =>
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory('All Posts');
    setSearchQuery('');
    setSelectedTag('');
    setSortBy('latest');
  };

  // Get category icon
  const getCategoryIcon = (categoryName: string) => {
    const category = categories.find(c => c.name === categoryName);
    return category?.icon || <Newspaper className="w-4 h-4" />;
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      
      {/* ========== HERO SECTION WITH BACKGROUND IMAGE - FIXED OPACITY ========== */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Background Image - INCREASED VISIBILITY */}
        <div className="absolute inset-0 z-0">
          {/* Lighter gradient overlay - REDUCED OPACITY from 0.95 to 0.65 */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/65 via-gray-900/55 to-gray-900/65 z-10"></div>
          <Image
            src="/images/hero/blog-hero.jpg"
            alt="Prime Accounting Blog - Financial Insights and Expert Advice"
            fill
            className="object-cover scale-105 animate-ken-burns"
            priority
            quality={95}
            sizes="100vw"
          />
          {/* Animated shapes - REDUCED OPACITY */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container-custom relative z-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Breadcrumbs */}
            <div className="flex items-center justify-center text-sm text-white/80 mb-6 animate-fade-in">
              <Link href="/" className="hover:text-yellow-500 transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span className="text-yellow-500">Blog</span>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-yellow-500/30 backdrop-blur-lg text-yellow-500 px-4 py-2 rounded-full text-sm font-semibold mb-6 animate-slide-up border border-yellow-500/50 shadow-lg">
              <Sparkles className="w-4 h-4" />
              <span>Financial Insights & Expert Advice</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-slide-up delay-100 drop-shadow-lg">
              Knowledge Center for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                Financial Success
              </span>
            </h1>
            
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-slide-up delay-200 drop-shadow">
              Stay ahead with expert insights, tax tips, and financial strategies from our team of certified professionals.
            </p>
            
            {/* Search Bar with Enhanced UI */}
            <div className="relative max-w-2xl mx-auto animate-slide-up delay-300">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search articles, topics, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-5 pl-14 pr-36 bg-white/20 backdrop-blur-lg border-2 border-white/30 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-4 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-300 group-hover:border-white/50 text-lg"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70 group-hover:text-yellow-500 transition-colors" />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="p-2 hover:bg-white/30 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  )}
                  <button className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-2 rounded-xl font-medium hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-yellow-500/30">
                    Search
                  </button>
                </div>
              </div>
              
              {/* Popular search suggestions */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                <span className="text-sm text-white/70">Popular:</span>
                {['Tax Tips', 'Small Business', 'Deductions', 'Cash Flow'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchQuery(term)}
                    className="text-sm text-white/90 hover:text-yellow-500 transition-colors px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 border border-white/20"
                  >
                    {term}
                  </button>
                ))}
              </div>
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

      {/* ========== FEATURED POST SECTION ========== */}
      {featuredPost && (
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Award className="w-6 h-6 text-yellow-500" />
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                      Featured <span className="text-yellow-500">Article</span>
                    </h2>
                  </div>
                  <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
                    New
                  </span>
                </div>
                <Link 
                  href={`/blog/${featuredPost.slug}`} 
                  className="text-yellow-500 hover:text-yellow-600 font-semibold flex items-center group"
                >
                  View All Features
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <Link href={`/blog/${featuredPost.slug}`} className="group">
                <div className="grid lg:grid-cols-2 gap-8 bg-gradient-to-br from-gray-50 to-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
                  {/* Image Section */}
                  <div className="relative h-[400px] lg:h-full overflow-hidden">
                    <Image
                      src={featuredPost.image}
                      alt={featuredPost.imageAlt}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                    <div className="absolute top-6 left-6 flex space-x-3">
                      <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                        {featuredPost.category}
                      </span>
                      <span className="bg-black/50 backdrop-blur-lg text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center border border-white/30">
                        <Star className="w-4 h-4 mr-1 fill-yellow-500 text-yellow-500" />
                        Editor's Pick
                      </span>
                    </div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="flex items-center space-x-4 text-white">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-600/50 backdrop-blur-sm rounded-full border-2 border-white/50"></div>
                          <span className="ml-2 font-medium drop-shadow">{featuredPost.author.name}</span>
                        </div>
                        <div className="flex items-center text-white/90">
                          <Calendar className="w-4 h-4 mr-1" />
                          {featuredPost.date}
                        </div>
                        <div className="flex items-center text-white/90">
                          <Clock className="w-4 h-4 mr-1" />
                          {featuredPost.readTime}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                      <span className="text-yellow-500 font-semibold">✨ Featured Story</span>
                      <span>•</span>
                      <span>Updated {featuredPost.modifiedDate || featuredPost.date}</span>
                    </div>
                    <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 group-hover:text-yellow-500 transition-colors line-clamp-3">
                      {featuredPost.title}
                    </h3>
                    <p className="text-lg text-gray-600 mb-6 line-clamp-3">
                      {featuredPost.excerpt}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      {featuredPost.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-yellow-500 hover:text-white transition-colors cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedTag(tag);
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Author Bio */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-left">
                          <p className="text-sm text-gray-500">Written by</p>
                          <p className="font-semibold text-gray-900 text-lg">{featuredPost.author.name}</p>
                          <p className="text-sm text-gray-500">{featuredPost.author.role}</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center text-yellow-500 font-semibold group-hover:text-yellow-600 text-lg">
                        Read Full Article
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ========== TRENDING POSTS SECTION ========== */}
      {trendingPosts.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-6 h-6 text-yellow-500" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Trending <span className="text-yellow-500">Now</span>
                </h2>
              </div>
              <Link 
                href="/blog/trending" 
                className="text-yellow-500 hover:text-yellow-600 font-semibold flex items-center group"
              >
                View All Trending
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingPosts.map((post, index) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="relative h-40 overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.imageAlt}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                      <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-2 py-1 rounded text-xs font-semibold shadow-lg">
                        🔥 #{index + 1} Trending
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded text-xs flex items-center border border-white/30">
                        <Eye className="w-3 h-3 mr-1" />
                        1.2K
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center text-xs text-gray-500 mb-2">
                        <span className="text-yellow-500 font-semibold">{post.category}</span>
                        <span className="mx-2">•</span>
                        <Clock className="w-3 h-3 mr-1" />
                        {post.readTime}
                      </div>
                      <h3 className="font-bold text-gray-900 group-hover:text-yellow-500 transition-colors line-clamp-2 mb-2">
                        {post.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          {post.date}
                        </div>
                        <div className="flex items-center space-x-2">
                          <ThumbsUp className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">128</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========== MAIN CONTENT SECTION ========== */}
      <section className="py-16">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* ========== SIDEBAR - FILTERS ========== */}
            <div className="lg:w-1/4">
              {/* Mobile Filter Button */}
              <div className="lg:hidden mb-4">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="w-full flex items-center justify-between bg-white p-4 rounded-xl shadow-lg border border-gray-100"
                >
                  <span className="font-semibold flex items-center text-gray-900">
                    <Filter className="w-5 h-5 mr-2 text-yellow-500" />
                    Filters & Categories
                  </span>
                  {isFilterOpen ? <X className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              {/* Filter Content */}
              <div className={`space-y-6 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
                
                {/* Categories Card */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                      <BookOpen className="w-5 h-5 mr-2 text-yellow-500" />
                      Categories
                    </h3>
                    {selectedCategory !== 'All Posts' && (
                      <button
                        onClick={() => setSelectedCategory('All Posts')}
                        className="text-sm text-yellow-500 hover:text-yellow-600 font-medium"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.name}
                        onClick={() => setSelectedCategory(category.name)}
                        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-all duration-300 ${
                          selectedCategory === category.name
                            ? 'bg-gradient-to-r from-yellow-50 to-yellow-100/50 text-yellow-700 border border-yellow-200 shadow-md'
                            : 'hover:bg-gray-50 text-gray-700 hover:translate-x-1'
                        }`}
                      >
                        <span className="flex items-center">
                          <span className={`mr-2 ${selectedCategory === category.name ? 'text-yellow-500' : 'text-gray-400'}`}>
                            {category.icon}
                          </span>
                          <span className="font-medium">{category.name}</span>
                        </span>
                        <span className={`text-sm font-semibold px-2 py-0.5 rounded-full ${
                          selectedCategory === category.name 
                            ? 'bg-yellow-100 text-yellow-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {category.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Options Card */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Filter className="w-5 h-5 mr-2 text-yellow-500" />
                    Sort By
                  </h3>
                  <div className="space-y-2">
                    {[
                      { value: 'latest', label: 'Latest', icon: <Clock className="w-4 h-4" /> },
                      { value: 'oldest', label: 'Oldest', icon: <Calendar className="w-4 h-4" /> },
                      { value: 'popular', label: 'Most Popular', icon: <TrendingUp className="w-4 h-4" /> },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value)}
                        className={`w-full flex items-center px-4 py-2.5 rounded-lg transition-all duration-300 ${
                          sortBy === option.value
                            ? 'bg-gradient-to-r from-yellow-50 to-yellow-100/50 text-yellow-700 border border-yellow-200 shadow-md'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <span className={`mr-2 ${sortBy === option.value ? 'text-yellow-500' : 'text-gray-400'}`}>
                          {option.icon}
                        </span>
                        <span className="font-medium">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Popular Tags Card */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                      <Tag className="w-5 h-5 mr-2 text-yellow-500" />
                      Popular Tags
                    </h3>
                    {selectedTag && (
                      <button
                        onClick={() => setSelectedTag('')}
                        className="text-sm text-yellow-500 hover:text-yellow-600 font-medium"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map(([tag, count]) => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className={`px-3 py-1.5 rounded-full text-sm transition-all duration-300 ${
                          selectedTag === tag
                            ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-md scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                        }`}
                      >
                        #{tag} <span className={`text-xs ml-1 ${selectedTag === tag ? 'text-yellow-100' : 'text-gray-500'}`}>({count})</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Editor's Picks Card */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg p-6 text-white border border-gray-700">
                  <h3 className="text-lg font-bold mb-4 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-yellow-500" />
                    Editor's Picks
                  </h3>
                  <div className="space-y-4">
                    {editorsPicks.map((post) => (
                      <Link key={post.id} href={`/blog/${post.slug}`} className="block group">
                        <div className="flex items-start space-x-3">
                          <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg overflow-hidden flex-shrink-0 shadow-lg">
                            <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-600"></div>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-white group-hover:text-yellow-500 transition-colors text-sm line-clamp-2">
                              {post.title}
                            </h4>
                            <p className="text-xs text-gray-400 mt-1 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {post.readTime} • {post.date}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Recent Posts Card */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-yellow-500" />
                    Recent Posts
                  </h3>
                  <div className="space-y-4">
                    {recentPosts.map((post) => (
                      <Link key={post.id} href={`/blog/${post.slug}`} className="block group">
                        <div className="flex items-start space-x-3">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400"></div>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 group-hover:text-yellow-500 transition-colors text-sm line-clamp-2">
                              {post.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                              {post.date}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Newsletter Card */}
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white border border-yellow-400">
                  <h3 className="text-lg font-bold mb-2 flex items-center">
                    <Mail className="w-5 h-5 mr-2" />
                    📬 Newsletter
                  </h3>
                  <p className="text-sm text-yellow-100 mb-4">
                    Get the latest financial tips and updates delivered to your inbox
                  </p>
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-4 py-3 bg-white/20 backdrop-blur-lg border border-white/30 rounded-lg text-white placeholder-yellow-100 focus:outline-none focus:ring-2 focus:ring-white mb-3"
                  />
                  <button className="w-full bg-white text-yellow-600 px-4 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
                    Subscribe Now
                  </button>
                  <p className="text-xs text-yellow-100 mt-3 text-center">
                    No spam, unsubscribe anytime.
                  </p>
                </div>

                {/* Active Filters */}
                {(selectedCategory !== 'All Posts' || searchQuery || selectedTag || sortBy !== 'latest') && (
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900 flex items-center">
                        <Filter className="w-4 h-4 mr-2 text-yellow-500" />
                        Active Filters
                      </h4>
                      <button
                        onClick={clearFilters}
                        className="text-sm text-red-500 hover:text-red-600 font-medium"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="space-y-2">
                      {selectedCategory !== 'All Posts' && (
                        <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                          <span className="text-sm text-gray-700">Category: <span className="font-semibold">{selectedCategory}</span></span>
                          <button onClick={() => setSelectedCategory('All Posts')} className="hover:bg-gray-200 p-1 rounded-full">
                            <X className="w-4 h-4 text-gray-500 hover:text-red-500" />
                          </button>
                        </div>
                      )}
                      {selectedTag && (
                        <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                          <span className="text-sm text-gray-700">Tag: <span className="font-semibold">#{selectedTag}</span></span>
                          <button onClick={() => setSelectedTag('')} className="hover:bg-gray-200 p-1 rounded-full">
                            <X className="w-4 h-4 text-gray-500 hover:text-red-500" />
                          </button>
                        </div>
                      )}
                      {sortBy !== 'latest' && (
                        <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                          <span className="text-sm text-gray-700">Sort: <span className="font-semibold">{sortBy}</span></span>
                          <button onClick={() => setSortBy('latest')} className="hover:bg-gray-200 p-1 rounded-full">
                            <X className="w-4 h-4 text-gray-500 hover:text-red-500" />
                          </button>
                        </div>
                      )}
                      {searchQuery && (
                        <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                          <span className="text-sm text-gray-700">Search: <span className="font-semibold">"{searchQuery}"</span></span>
                          <button onClick={() => setSearchQuery('')} className="hover:bg-gray-200 p-1 rounded-full">
                            <X className="w-4 h-4 text-gray-500 hover:text-red-500" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ========== MAIN CONTENT - BLOG POSTS GRID ========== */}
            <div className="lg:w-3/4">
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    {getCategoryIcon(selectedCategory)}
                    <span className="ml-2">{selectedCategory === 'All Posts' ? 'All Articles' : selectedCategory}</span>
                  </h2>
                  <p className="text-gray-600 mt-1 flex items-center">
                    <FileText className="w-4 h-4 mr-1 text-gray-400" />
                    Showing {filteredPosts.length > 0 ? indexOfFirstPost + 1 : 0}-{Math.min(indexOfLastPost, filteredPosts.length)} of {filteredPosts.length} articles
                  </p>
                </div>
                
                {/* View Toggle */}
                <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    aria-label="Grid view"
                  >
                    <div className="grid grid-cols-2 gap-0.5">
                      <div className="w-2 h-2 bg-current rounded-sm"></div>
                      <div className="w-2 h-2 bg-current rounded-sm"></div>
                      <div className="w-2 h-2 bg-current rounded-sm"></div>
                      <div className="w-2 h-2 bg-current rounded-sm"></div>
                    </div>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    aria-label="List view"
                  >
                    <div className="flex flex-col space-y-0.5">
                      <div className="w-4 h-0.5 bg-current rounded-full"></div>
                      <div className="w-4 h-0.5 bg-current rounded-full"></div>
                      <div className="w-4 h-0.5 bg-current rounded-full"></div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Blog Posts Grid/List */}
              {currentPosts.length > 0 ? (
                <div className={
                  viewMode === 'grid' 
                    ? 'grid md:grid-cols-2 gap-6' 
                    : 'space-y-6'
                }>
                  {currentPosts.map((post) => (
                    <article
                      key={post.id}
                      className={`
                        group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100
                        ${viewMode === 'grid' ? 'flex flex-col' : 'flex flex-col md:flex-row'}
                        hover:-translate-y-1
                      `}
                    >
                      {/* Image Container */}
                      <div className={`
                        relative overflow-hidden
                        ${viewMode === 'grid' ? 'h-48' : 'md:w-1/3 h-48 md:h-auto'}
                      `}>
                        <Image
                          src={post.image}
                          alt={post.imageAlt}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                          sizes={viewMode === 'grid' ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 33vw'}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Category Badge */}
                        <div className="absolute top-4 left-4">
                          <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                            {post.category}
                          </span>
                        </div>

                        {/* Bookmark Button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleBookmark(post.id);
                          }}
                          className="absolute top-4 right-4 w-8 h-8 bg-black/50 backdrop-blur-lg rounded-full flex items-center justify-center text-white hover:bg-yellow-500 transition-colors border border-white/30"
                        >
                          <Bookmark className={`w-4 h-4 ${bookmarkedPosts.includes(post.id) ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                        </button>

                        {/* Reading Time */}
                        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded text-xs flex items-center border border-white/30">
                          <Clock className="w-3 h-3 mr-1" />
                          {post.readTime}
                        </div>
                      </div>

                      {/* Content Container */}
                      <div className={`
                        p-6 flex flex-col flex-1
                        ${viewMode === 'list' ? 'md:w-2/3' : ''}
                      `}>
                        {/* Meta Info */}
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <div className="flex items-center">
                            <div className="w-6 h-6 bg-gray-200 rounded-full mr-2"></div>
                            <span className="font-medium text-gray-700">{post.author.name}</span>
                          </div>
                          <span className="mx-2">•</span>
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {post.date}
                          </div>
                        </div>

                        {/* Title */}
                        <Link href={`/blog/${post.slug}`} className="block">
                          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-yellow-500 transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                        </Link>

                        {/* Excerpt */}
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.slice(0, 3).map((tag) => (
                            <button
                              key={tag}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSelectedTag(tag);
                              }}
                              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-full transition-colors"
                            >
                              #{tag}
                            </button>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                              +{post.tags.length - 3}
                            </span>
                          )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              1.2K
                            </div>
                            <div className="flex items-center">
                              <ThumbsUp className="w-4 h-4 mr-1" />
                              128
                            </div>
                          </div>
                          <Link
                            href={`/blog/${post.slug}`}
                            className="inline-flex items-center text-yellow-500 font-semibold group-hover:text-yellow-600"
                          >
                            Read More
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                // No Results
                <div className="bg-white rounded-xl shadow-lg p-16 text-center border border-gray-100">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No articles found</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    We couldn't find any articles matching your search criteria. Try adjusting your filters or search terms.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}

              {/* ========== PAGINATION ========== */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <nav className="flex items-center space-x-2" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center text-gray-700"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Previous
                    </button>
                    
                    {/* Page Numbers */}
                    <div className="flex items-center space-x-1">
                      {[...Array(totalPages)].map((_, i) => {
                        const pageNumber = i + 1;
                        // Show current page, first, last, and adjacent pages
                        if (
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          Math.abs(pageNumber - currentPage) <= 1
                        ) {
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => setCurrentPage(pageNumber)}
                              className={`w-10 h-10 rounded-lg transition-all duration-300 ${
                                currentPage === pageNumber
                                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-md'
                                  : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        } else if (
                          pageNumber === 2 &&
                          currentPage > 3
                        ) {
                          return <span key="ellipsis1" className="px-2 text-gray-500">...</span>;
                        } else if (
                          pageNumber === totalPages - 1 &&
                          currentPage < totalPages - 2
                        ) {
                          return <span key="ellipsis2" className="px-2 text-gray-500">...</span>;
                        }
                        return null;
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors flex items-center text-gray-700"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </nav>
                </div>
              )}
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
              Ready to Transform Your Financial Future?
            </h2>
            <p className="text-xl text-white/90 mb-8 drop-shadow">
              Our team of expert CPAs and financial advisors is here to help you achieve your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/Contact"
                className="group bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-yellow-500/30 inline-flex items-center justify-center"
              >
                Schedule Free Consultation
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link
                href="/Services"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center"
              >
                Explore Our Services
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
    </main>
  );
}