// app/api/news/route.ts
import { NextResponse } from 'next/server';

export const revalidate = 60;

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// ============================================================
// 1. STORY PARAGRAPH POOL
// ============================================================
const openings = [
  'In a significant development, the technology sector has witnessed a shift that could reshape the industry.',
  'A groundbreaking innovation has emerged, promising to solve long-standing challenges in the field.',
  'Tech giants are doubling down on their commitment to artificial intelligence, with new announcements coming daily.',
  'The startup ecosystem is buzzing with activity as venture capital flows into promising ventures.',
  'A new wave of cybersecurity threats has prompted urgent action from global regulators.',
];

const backgrounds = [
  'The company, which has been a leader in the space for over a decade, announced its latest initiative.',
  'Industry experts have long predicted the convergence of AI and cloud computing, and now it is becoming a reality.',
  'With the rapid adoption of 5G, new use cases are emerging across sectors, from healthcare to manufacturing.',
  'Recent breakthroughs in quantum computing have opened up possibilities that were once considered science fiction.',
  'The global chip shortage has accelerated the need for domestic semiconductor production.',
];

const analyses = [
  'This move is likely to have far-reaching implications for competitors, who will need to adapt quickly.',
  'Analysts are forecasting that the new technology could generate billions in revenue within the next five years.',
  'However, challenges remain – including regulatory hurdles and the need for skilled talent.',
  'The company’s strategy appears to be focused on creating an ecosystem that locks in customers.',
  'There is also a growing emphasis on ethical AI, with companies investing heavily in responsible development.',
];

const impacts = [
  'For consumers, this means more powerful tools at their fingertips, with personalised experiences.',
  'Businesses will benefit from increased efficiency and the ability to process data at unprecedented speeds.',
  'The job market will see a shift, with demand for new skills rising while others become obsolete.',
  'Smaller players may find it harder to compete, potentially leading to consolidation in the industry.',
  'In developing regions, these technologies could leapfrog traditional infrastructure and drive economic growth.',
];

const conclusions = [
  'As we look to the future, it is clear that technology will continue to be the driving force of change.',
  'The next decade will be defined by how we harness these tools to solve global challenges.',
  'Innovation will not slow down – it will accelerate, demanding adaptability from all stakeholders.',
  'The key takeaway is that staying informed is no longer optional; it is essential for survival in the digital age.',
  'Ultimately, the companies that prioritize user trust and transparency will emerge as the leaders of tomorrow.',
];

const details = [
  'According to a report by Gartner, the market for AI services is expected to grow by 30% annually.',
  'A recent study by McKinsey highlighted that companies adopting AI see a 20% increase in productivity.',
  'The World Economic Forum predicts that automation will displace 85 million jobs but create 97 million new ones.',
  'Cloud spending reached over $500 billion last year, with no signs of slowing down.',
  'Cybersecurity spending is projected to exceed $200 billion as threats become more sophisticated.',
];

const quotes = [
  'As the CEO put it: "We are at the beginning of a new era, and we intend to lead it."',
  'One industry insider remarked, "The pace of change is breathtaking, and we have to keep up."',
  'A leading analyst commented, "This is a game-changer that will redefine the competitive landscape."',
  'The company’s CTO stated, "Our goal is to make AI accessible to everyone, not just the tech elite."',
  'A spokesperson added: "We are committed to transparency and ethical practices in all our operations."',
];

const allParagraphs = [
  ...openings,
  ...backgrounds,
  ...analyses,
  ...impacts,
  ...conclusions,
  ...details,
  ...quotes,
];

// ------------------------------------------------------------
function buildStory(): string {
  const count = rand(6, 8);
  const usedIndices = new Set<number>();
  const selected: string[] = [];

  const categories = [openings, backgrounds, analyses, impacts, conclusions];
  for (const cat of categories) {
    const idx = rand(0, cat.length - 1);
    selected.push(cat[idx]);
  }

  while (selected.length < count) {
    let idx;
    do {
      idx = rand(0, allParagraphs.length - 1);
    } while (usedIndices.has(idx));
    usedIndices.add(idx);
    selected.push(allParagraphs[idx]);
  }

  for (let i = selected.length - 1; i > 0; i--) {
    const j = rand(0, i);
    [selected[i], selected[j]] = [selected[j], selected[i]];
  }

  return selected.map(p => `<p>${p}</p>`).join('');
}

// ============================================================
// 2. UNSPLASH IMAGE POOL
// ============================================================
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
  'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80',
];

let unsplashImages: string[] | null = null;

async function getUnsplashImages(): Promise<string[]> {
  if (unsplashImages && unsplashImages.length > 0) return unsplashImages;

  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    console.warn('UNSPLASH_ACCESS_KEY is missing. Using fallback images.');
    return FALLBACK_IMAGES;
  }

  try {
    const response = await fetch(
      'https://api.unsplash.com/search/photos?query=technology&per_page=30&orientation=landscape',
      {
        headers: { Authorization: `Client-ID ${accessKey}` },
        next: { revalidate: 3600 },
      }
    );
    if (!response.ok) throw new Error(`Unsplash API returned ${response.status}`);
    const data = await response.json();
    const images = data.results?.map((photo: any) => photo?.urls?.regular).filter(Boolean);
    if (images?.length) {
      unsplashImages = images;
      return images;
    }
    return FALLBACK_IMAGES;
  } catch (error) {
    console.error('Unsplash image fetch failed:', error);
    return FALLBACK_IMAGES;
  }
}

// ============================================================
// 3. GENERATE ARTICLE
// ============================================================
function generateArticle(index: number, images: string[]) {
  const categories = [
    'ai', 'programming', 'cybersecurity', 'startups', 'general',
    'breaking', 'latest', 'trending', 'ai-tools', 'ai-models', 'ai-research', 'ai-explained',
    'startup-funding', 'founder-stories', 'african-startups', 'gadget-reviews', 'gadget-comparisons',
    'wearables', 'space', 'robotics', 'quantum', 'biotech', 'nigeria-tech', 'africa-startups',
    'africa-innovation', 'africa-founders', 'campus-innovation', 'business-tech', 'cybersecurity',
    'security-guides', 'tools', 'explainers', 'intelligence', 'the-current', 'directory',
    'students', 'scholarships', 'internships', 'hackathons'
  ];
  const category = categories[rand(0, categories.length - 1)];

  const titles = [
    'AI Breakthrough: New Model Achieves Human-Level Reasoning',
    'Next.js 15: The Future of Web Development',
    'Critical Zero-Day Vulnerability Patched',
    'African Fintech Startup Raises $50M Series B',
    'Rust vs Go: Which Language Should You Learn in 2026?',
    'OpenAI Announces GPT-5 with Advanced Reasoning',
    'Google Unveils Quantum Computing Breakthrough',
    'Meta’s New AI Model Beats Human Benchmarks',
    'Apple’s Vision Pro 2: A New Era of Spatial Computing',
    'Microsoft’s Copilot AI Now Integrates with Everything',
    'Amazon’s Drone Delivery Goes Mainstream',
    'Tesla’s Full Self-Driving Finally Approved',
    'The Rise of WebAssembly in 2026',
    'React 19: What Developers Need to Know',
    'The Future of Cryptocurrency Regulation',
    'How to Build a Scalable Microservices Architecture',
    'The State of Cloud Computing in 2026',
    'The Impact of 5G on IoT',
    'Cybersecurity Trends to Watch',
    'How Startups Are Leveraging AI for Growth',
  ];
  const title = titles[rand(0, titles.length - 1)];

  const content = buildStory();
  const plainText = content.replace(/<[^>]*>?/gm, '');
  const description = plainText.slice(0, 160) + '...';

  const categoryTags: Record<string, string[]> = {
    'ai': ['AI', 'Machine Learning', 'Deep Learning'],
    'programming': ['Coding', 'Software', 'DevOps'],
    'cybersecurity': ['Security', 'Privacy', 'Hacking'],
    'startups': ['Entrepreneurship', 'VC', 'Innovation'],
    'gadget-reviews': ['Reviews', 'Apple', 'Samsung'],
    'space': ['NASA', 'SpaceX', 'Astronomy'],
    'robotics': ['Robots', 'Automation', 'AI'],
    'quantum': ['Quantum', 'Computing', 'Physics'],
    'biotech': ['Biology', 'Genetics', 'Healthcare'],
    'nigeria-tech': ['Nigeria', 'Africa', 'Innovation'],
    'students': ['Education', 'Scholarships', 'Career'],
    'scholarships': ['Scholarships', 'Grants', 'Funding'],
    'internships': ['Internships', 'Jobs', 'Students'],
    'hackathons': ['Hackathons', 'Coding', 'Events'],
    'tools': ['Tools', 'Productivity', 'Development'],
    'directory': ['Resources', 'Companies', 'Startups'],
    'explainers': ['Explainers', 'Simplified', 'Education'],
    'intelligence': ['Analysis', 'Trends', 'Forecasting'],
    'the-current': ['Briefing', 'Daily', 'News'],
    'africa-startups': ['Africa', 'Innovation', 'Funding'],
  };
  const tags = categoryTags[category] || ['Tech', 'Innovation', 'Trending'];

  return {
    id: String(index),
    url: `https://techcurrent.com/article-${index}`,
    title,
    description,
    content,
    image_url: images[(index - 1) % images.length],
    source: ['Tech Current', 'Reuters', 'TechCrunch', 'Wired', 'Ars Technica'][rand(0, 4)],
    author: ['Buduka Oyagiri', 'AI Team', 'Dev Team', 'Security Team', 'Startup Editor'][rand(0, 4)],
    published_at: new Date(Date.now() - rand(0, 30) * 3600000).toISOString(),
    category,
    tags,
    reading_time: Math.ceil(content.split(' ').length / 200) + 1,
    is_pinned: index < 5,
    likes: rand(10, 500),
    bookmarks: rand(5, 200),
  };
}

// ============================================================
// 4. CACHING & API ROUTE
// ============================================================
let cachedArticles: any[] | null = null;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;
  const limit = parseInt(searchParams.get('limit') || '20');
  const page = parseInt(searchParams.get('page') || '1');

  if (!cachedArticles) {
    cachedArticles = [];
    const images = await getUnsplashImages();
    for (let i = 1; i <= 5000; i++) {
      cachedArticles.push(generateArticle(i, images));
    }
  }

  let articles = cachedArticles;

  // Sub‑category mapping (fallback)
  const subCategoryMap: Record<string, string> = {
    'ai-tools': 'ai',
    'ai-models': 'ai',
    'ai-research': 'ai',
    'ai-explained': 'ai',
    'startup-funding': 'startups',
    'founder-stories': 'startups',
    'african-startups': 'startups',
    'gadget-reviews': 'gadgets',
    'gadget-comparisons': 'gadgets',
    'wearables': 'gadgets',
    'space': 'science',
    'robotics': 'science',
    'quantum': 'science',
    'biotech': 'science',
    'nigeria-tech': 'africa',
    'africa-startups': 'africa',
    'africa-innovation': 'africa',
    'africa-founders': 'africa',
    'campus-innovation': 'africa',
    'business-tech': 'business',
    'security-guides': 'cybersecurity',
    'scholarships': 'students',
    'internships': 'students',
    'hackathons': 'students',
  };

  if (category && category !== 'general' && category !== 'all') {
    const parent = subCategoryMap[category];
    let filtered = articles.filter(a => a.category === category);
    if (filtered.length < 10 && parent) {
      const parentArticles = articles.filter(a => a.category === parent);
      filtered = [...filtered, ...parentArticles];
    }
    if (filtered.length > 0) {
      articles = filtered;
    }
  }

  articles.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());

  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = articles.slice(start, end);

  return NextResponse.json({
    articles: paginated,
    total: articles.length,
    page,
    limit,
    totalPages: Math.ceil(articles.length / limit),
  });
}