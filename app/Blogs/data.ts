export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: {
    name: string;
    role: string;
    avatar: string;
    bio: string;
  };
  date: string;
  modifiedDate?: string;
  readTime: string;
  image: string;
  imageAlt: string;
  tags: string[];
  featured: boolean;
  trending: boolean;
  seo?: {
    title: string;
    description: string;
    keywords: string[];
    canonicalUrl?: string;
  };
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: 'tax-planning-strategies-small-businesses-2026',
    title: 'Tax Planning Strategies for Small Businesses in 2026',
    excerpt: 'Learn the most effective tax planning strategies to minimize your tax liability and maximize deductions for your small business.',
    content: `
      <h2>Introduction to Tax Planning for 2026</h2>
      <p>As we move into 2026, small business owners face new challenges and opportunities in tax planning. The recent tax law changes have created both complexities and opportunities for savvy business owners who know where to look.</p>
      
      <h2>Key Tax Deductions You Shouldn't Miss</h2>
      <p>Many small business owners leave money on the table by missing important deductions. Here are the top deductions to consider for 2026:</p>
      <ul>
        <li><strong>Home Office Deduction:</strong> If you work from home, you may qualify for this valuable deduction.</li>
        <li><strong>Vehicle Expenses:</strong> Track your business mileage carefully.</li>
        <li><strong>Equipment Purchases:</strong> Section 179 allows immediate expensing of equipment.</li>
        <li><strong>Retirement Plans:</strong> SEP IRAs and Solo 401(k)s offer significant tax savings.</li>
      </ul>
    `,
    category: 'Tax Planning',
    author: {
      name: 'Sarah Johnson',
      role: 'Senior Tax Accountant, CPA',
      avatar: '/images/blog/authors/sarah-johnson.jpg',
      bio: 'Sarah has over 15 years of experience in tax planning and preparation. She specializes in small business taxation and has helped hundreds of clients optimize their tax strategies.'
    },
    date: 'Feb 12, 2026',
    readTime: '5 min read',
    image: '/images/blog/tax-planning.jpg',
    imageAlt: 'Tax planning strategies for small businesses - calculator and tax forms',
    tags: ['Tax Tips', 'Small Business', 'Deductions', 'IRS', '2026 Tax'],
    featured: true,
    trending: true,
    seo: {
      title: 'Tax Planning Strategies for Small Businesses in 2026 | Prime Accounting',
      description: 'Expert tax planning strategies for small businesses in 2026. Learn about key deductions, QBI, retirement planning, and year-round tax optimization.',
      keywords: ['tax planning', 'small business taxes', 'tax deductions', 'IRS', '2026 tax strategies'],
    }
  },
  {
    id: 2,
    slug: 'understanding-cash-flow-management-complete-guide',
    title: 'Understanding Cash Flow Management: A Complete Guide',
    excerpt: 'Master the art of cash flow management with our comprehensive guide covering forecasting, optimization, and common pitfalls.',
    content: `
      <h2>What is Cash Flow Management?</h2>
      <p>Cash flow management is the process of tracking, analyzing, and optimizing the net amount of cash receipts minus cash expenses. It's the lifeblood of any business, regardless of size or industry.</p>
    `,
    category: 'Financial Management',
    author: {
      name: 'Michael Chen',
      role: 'Financial Analyst, CFA',
      avatar: '/images/blog/authors/michael-chen.jpg',
      bio: 'Michael is a Chartered Financial Analyst with expertise in business financial management and cash flow optimization.'
    },
    date: 'Feb 10, 2026',
    readTime: '8 min read',
    image: '/images/blog/cash-flow.jpg',
    imageAlt: 'Cash flow management chart and analysis',
    tags: ['Cash Flow', 'Business Finance', 'Management', 'Forecasting'],
    featured: false,
    trending: true,
    seo: {
      title: 'Complete Guide to Cash Flow Management | Prime Accounting',
      description: 'Master cash flow management with our comprehensive guide. Learn forecasting, optimization strategies, and how to avoid common pitfalls.',
      keywords: ['cash flow', 'cash flow management', 'business finance', 'financial forecasting'],
    }
  },
  {
    id: 3,
    slug: 'new-tax-laws-2026-what-you-need-to-know',
    title: 'New Tax Laws for 2026: What You Need to Know',
    excerpt: 'Stay ahead of the curve with our analysis of the latest tax law changes and how they affect your personal and business finances.',
    content: `
      <h2>Overview of 2026 Tax Law Changes</h2>
      <p>The tax landscape for 2026 brings significant changes that every taxpayer should understand. From adjusted brackets to new credits and deductions, here's what you need to know.</p>
    `,
    category: 'Tax Updates',
    author: {
      name: 'John Smith',
      role: 'CPA, Tax Director',
      avatar: '/images/blog/authors/john-smith.jpg',
      bio: 'John leads our tax practice with over 20 years of experience. He specializes in complex tax planning for high-net-worth individuals and businesses.'
    },
    date: 'Feb 8, 2026',
    readTime: '6 min read',
    image: '/images/blog/tax-laws.jpg',
    imageAlt: 'New tax laws for 2026 document and gavel',
    tags: ['Tax Law', 'Updates', 'Compliance', 'IRS'],
    featured: true,
    trending: true,
    seo: {
      title: '2026 Tax Law Changes: Complete Guide | Prime Accounting',
      description: 'Stay compliant with our comprehensive guide to 2026 tax law changes. Updated brackets, business deductions, retirement rules, and more.',
      keywords: ['tax laws 2026', 'tax changes', 'IRS updates', 'tax compliance'],
    }
  }
];

export const getAllBlogPosts = () => blogPosts;
export const getBlogPostBySlug = (slug: string) => blogPosts.find(post => post.slug === slug);
export const getFeaturedPosts = () => blogPosts.filter(post => post.featured);
export const getTrendingPosts = () => blogPosts.filter(post => post.trending);
export const getPostsByCategory = (category: string) => blogPosts.filter(post => post.category === category);
export const getRelatedPosts = (currentPost: BlogPost, limit: number = 3) => {
  return blogPosts
    .filter(post => post.id !== currentPost.id && post.category === currentPost.category)
    .slice(0, limit);
};