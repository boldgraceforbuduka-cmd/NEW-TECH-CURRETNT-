// app/api/news/route.ts
import { NextResponse } from 'next/server';

export const revalidate = 60;

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// ============================================================
// 1. EXPANDED PARAGRAPH POOLS (same as yours)
// ============================================================
const openings = [
  'In a significant development, the technology sector has witnessed a shift that could reshape the industry.',
  'A groundbreaking innovation has emerged, promising to solve long-standing challenges in the field.',
  'Tech giants are doubling down on their commitment to artificial intelligence, with new announcements coming daily.',
  'The startup ecosystem is buzzing with activity as venture capital flows into promising ventures.',
  'A new wave of cybersecurity threats has prompted urgent action from global regulators.',
  'The convergence of AI and cloud computing is accelerating at an unprecedented pace.',
  'Quantum computing is no longer a distant dream – it is becoming a reality.',
  'The global chip shortage has exposed critical vulnerabilities in supply chains.',
  'Sustainability is now a key driver of technology innovation.',
  'The future of work is being reshaped by automation and remote collaboration.',
];

const backgrounds = [
  'The company, which has been a leader in the space for over a decade, announced its latest initiative.',
  'Industry experts have long predicted the convergence of AI and cloud computing, and now it is becoming a reality.',
  'With the rapid adoption of 5G, new use cases are emerging across sectors, from healthcare to manufacturing.',
  'Recent breakthroughs in quantum computing have opened up possibilities that were once considered science fiction.',
  'The global chip shortage has accelerated the need for domestic semiconductor production.',
  'Investment in green tech has surged as climate concerns take centre stage.',
  'The rise of open‑source software has democratised access to powerful tools.',
  'Data privacy regulations are becoming stricter, forcing companies to adapt.',
  'Edge computing is bringing processing power closer to the source of data.',
  'The Internet of Things (IoT) is connecting billions of devices worldwide.',
];

const analyses = [
  'This move is likely to have far‑reaching implications for competitors, who will need to adapt quickly.',
  'Analysts are forecasting that the new technology could generate billions in revenue within the next five years.',
  'However, challenges remain – including regulatory hurdles and the need for skilled talent.',
  'The company’s strategy appears to be focused on creating an ecosystem that locks in customers.',
  'There is also a growing emphasis on ethical AI, with companies investing heavily in responsible development.',
  'The shift towards cloud‑native architectures is changing how software is built and deployed.',
  'The adoption of AI in healthcare could revolutionise patient outcomes.',
  'The rise of autonomous vehicles will reshape transportation and logistics.',
  'Blockchain technology is finding use cases beyond cryptocurrencies.',
  'The metaverse is evolving, but its full potential remains untapped.',
];

const impacts = [
  'For consumers, this means more powerful tools at their fingertips, with personalised experiences.',
  'Businesses will benefit from increased efficiency and the ability to process data at unprecedented speeds.',
  'The job market will see a shift, with demand for new skills rising while others become obsolete.',
  'Smaller players may find it harder to compete, potentially leading to consolidation in the industry.',
  'In developing regions, these technologies could leapfrog traditional infrastructure and drive economic growth.',
  'The digital divide could widen unless access to technology is prioritised.',
  'Remote work is becoming the new normal, with significant implications for real estate and urban planning.',
  'Cybersecurity spending is projected to exceed $200 billion as threats become more sophisticated.',
  'The rise of digital payments is transforming financial inclusion.',
  'Tech education is crucial for bridging the skills gap in emerging economies.',
];

const conclusions = [
  'As we look to the future, it is clear that technology will continue to be the driving force of change.',
  'The next decade will be defined by how we harness these tools to solve global challenges.',
  'Innovation will not slow down – it will accelerate, demanding adaptability from all stakeholders.',
  'The key takeaway is that staying informed is no longer optional; it is essential for survival in the digital age.',
  'Ultimately, the companies that prioritize user trust and transparency will emerge as the leaders of tomorrow.',
  'The journey is just beginning, and the opportunities are boundless.',
  'Collaboration between public and private sectors will be critical for success.',
  'The future belongs to those who embrace change and continuously learn.',
  'We are at the dawn of a new era of human‑machine collaboration.',
  'The next generation of technology will be shaped by inclusivity and diversity.',
];

const details = [
  'According to a report by Gartner, the market for AI services is expected to grow by 30% annually.',
  'A recent study by McKinsey highlighted that companies adopting AI see a 20% increase in productivity.',
  'The World Economic Forum predicts that automation will displace 85 million jobs but create 97 million new ones.',
  'Cloud spending reached over $500 billion last year, with no signs of slowing down.',
  'Cybersecurity spending is projected to exceed $200 billion as threats become more sophisticated.',
  'The semiconductor market is expected to reach $1 trillion by 2030.',
  'Global venture capital investment in tech startups hit a record $300 billion in 2025.',
  'The number of IoT devices is expected to surpass 75 billion by 2030.',
  '5G subscriptions are forecast to reach 4.5 billion by the end of 2027.',
  'The global AI software market is projected to grow to $250 billion by 2028.',
];

const quotes = [
  'As the CEO put it: "We are at the beginning of a new era, and we intend to lead it."',
  'One industry insider remarked, "The pace of change is breathtaking, and we have to keep up."',
  'A leading analyst commented, "This is a game-changer that will redefine the competitive landscape."',
  'The company’s CTO stated, "Our goal is to make AI accessible to everyone, not just the tech elite."',
  'A spokesperson added: "We are committed to transparency and ethical practices in all our operations."',
  'A prominent investor noted, "The biggest risk is not investing in technology fast enough."',
  'A government official said, "We must ensure that innovation serves the public good."',
  'A university researcher remarked, "The potential of quantum computing is truly mind‑boggling."',
  'A developer community leader said, "Open source is the backbone of modern software."',
  'A consumer advocate added, "We need to prioritise user privacy in every design decision."',
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

// ============================================================
// 2. GENERATE UNIQUE PARAGRAPHS (UNSHUFFLED)
// ============================================================
function generateParagraphs(): string[] {
  const count = rand(80, 120);
  const usedIndices = new Set<number>();
  const selected: string[] = [];

  const categories = [openings, backgrounds, analyses, impacts, conclusions];
  for (const cat of categories) {
    for (let i = 0; i < 10; i++) {
      const idx = rand(0, cat.length - 1);
      selected.push(cat[idx]);
    }
  }

  while (selected.length < count) {
    let idx;
    do {
      idx = rand(0, allParagraphs.length - 1);
    } while (usedIndices.has(idx));
    usedIndices.add(idx);
    selected.push(allParagraphs[idx]);
  }

  // ⚠️ DO NOT SHUFFLE HERE – we need the first paragraphs for the summary.
  return selected;
}

// ============================================================
// 3. BUILD ARTICLE CONTENT WITH HEADINGS (NO IMAGES)
// ============================================================
const headingPool = [
  'The Big Picture',
  'Understanding the Context',
  'Key Implications',
  'What This Means for You',
  'The Road Ahead',
  'Challenges and Opportunities',
  'Expert Perspectives',
  'Real‑World Impact',
  'The Future Outlook',
  'A Closer Look',
  'Why This Matters',
  'What Experts Are Saying',
  'The Bottom Line',
  'Actionable Takeaways',
  'Deep Dive',
  'Analysis',
  'Contextualizing the News',
  'The Global View',
  'Tech Industry Reaction',
  'Consumer Impact',
  'Regulatory Implications',
  'Investment Landscape',
  'Competitive Dynamics',
  'Strategic Significance',
];

const subHeadingPool = [
  'A Deeper Dive',
  'Key Takeaways',
  'Industry Impact',
  'What’s Next',
  'Expert Opinion',
  'The Data Behind the News',
  'The Human Element',
  'Technology at Work',
  'Global Trends',
  'Local Perspectives',
  'Innovation Spotlight',
  'The Competitive Edge',
  'The Human Factor',
  'Market Reactions',
  'Future Projections',
  'Lessons Learned',
];

function buildArticleContent(paragraphs: string[]): string {
  const result: string[] = [];
  let headingIndex = 0;
  let subHeadingIndex = 0;
  let paragraphCounter = 0;
  let subCounter = 0;
  let nextHeadingAt = rand(15, 20);
  let nextSubheadingAt = rand(8, 12);

  for (let i = 0; i < paragraphs.length; i++) {
    result.push(`<p>${paragraphs[i]}</p>`);
    paragraphCounter++;
    subCounter++;

    if (paragraphCounter >= nextHeadingAt && i < paragraphs.length - 5) {
      const heading = headingPool[headingIndex % headingPool.length];
      result.push(`<h2>${heading}</h2>`);
      headingIndex++;
      paragraphCounter = 0;
      nextHeadingAt = rand(15, 20);
    }

    if (subCounter >= nextSubheadingAt && i < paragraphs.length - 5 && paragraphCounter > 5) {
      const sub = subHeadingPool[subHeadingIndex % subHeadingPool.length];
      result.push(`<h3>${sub}</h3>`);
      subHeadingIndex++;
      subCounter = 0;
      nextSubheadingAt = rand(8, 12);
    }
  }

  return result.join('');
}

// ============================================================
// 4. GENERATE SUMMARY (TL;DR) – first sentences from intro
// ============================================================
function generateSummary(plainText: string): string {
  const cleaned = plainText.replace(/\s+/g, ' ').trim();
  const sentences = cleaned.match(/[^.!?]+[.!?]+/g) || [cleaned];
  const count = Math.min(3, sentences.length);
  const selected = sentences.slice(0, count).map(s => s.trim());
  let summary = selected.join(' ');
  if (summary.length > 0 && !summary.endsWith('.')) {
    summary += '.';
  }
  return summary;
}

// ============================================================
// 5. UNSPLASH IMAGE POOL (only for hero image, no inline images)
// ============================================================
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
  'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80',
  'https://images.unsplash.com/photo-1504639725596-34d2e8e3e5b5?w=800&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
  'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&q=80',
  'https://images.unsplash.com/photo-1552083974-186346191183?w=800&q=80',
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
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
// 6. HASH FUNCTION FOR DETERMINISTIC IMAGE SELECTION
// ============================================================
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// ============================================================
// 7. GENERATE ARTICLE (with coherent summary, headings, hero image)
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

  // Generate paragraphs (unshuffled for summary)
  const paragraphs = generateParagraphs();

  // Extract summary from the first 2‑3 paragraphs (coherent intro)
  const introText = paragraphs.slice(0, 3).join(' ');
  const summary = generateSummary(introText);

  // Shuffle the rest for the main content
  for (let i = paragraphs.length - 1; i > 0; i--) {
    const j = rand(0, i);
    [paragraphs[i], paragraphs[j]] = [paragraphs[j], paragraphs[i]];
  }

  // Build content with headings (no inline images)
  const content = buildArticleContent(paragraphs);

  const plainText = content.replace(/<[^>]*>?/gm, '');
  const description = plainText.slice(0, 180) + '...';

  // Deterministic image selection using hash of the article's URL
  const url = `https://techcurrent.com/article-${index}`;
  const hash = hashCode(url);
  const imageIndex = hash % images.length;
  const image_url = images[imageIndex];

  const categoryTags: Record<string, string[]> = {
    'ai': ['AI', 'Machine Learning', 'Deep Learning', 'LLM', 'NLP'],
    'programming': ['Coding', 'Software', 'DevOps', 'Python', 'Rust'],
    'cybersecurity': ['Security', 'Privacy', 'Hacking', 'Ransomware', 'Zero-Day'],
    'startups': ['Entrepreneurship', 'VC', 'Innovation', 'Fintech', 'SaaS'],
    'gadget-reviews': ['Reviews', 'Apple', 'Samsung', 'Google', 'Tech'],
    'space': ['NASA', 'SpaceX', 'Astronomy', 'Rocket', 'Mars'],
    'robotics': ['Robots', 'Automation', 'AI', 'Industrial', 'Mechatronics'],
    'quantum': ['Quantum', 'Computing', 'Physics', 'Qubit', 'Superposition'],
    'biotech': ['Biology', 'Genetics', 'Healthcare', 'CRISPR', 'Bioengineering'],
    'nigeria-tech': ['Nigeria', 'Africa', 'Innovation', 'Lagos', 'Tech Hub'],
    'students': ['Education', 'Scholarships', 'Career', 'Learning', 'Future'],
    'scholarships': ['Scholarships', 'Grants', 'Funding', 'Study', 'Abroad'],
    'internships': ['Internships', 'Jobs', 'Students', 'Experience', 'Career'],
    'hackathons': ['Hackathons', 'Coding', 'Events', 'AI', 'Innovation'],
    'tools': ['Tools', 'Productivity', 'Development', 'Design', 'AI'],
    'directory': ['Resources', 'Companies', 'Startups', 'Investors', 'Mentors'],
    'explainers': ['Explainers', 'Simplified', 'Education', 'Tech', 'Concepts'],
    'intelligence': ['Analysis', 'Trends', 'Forecasting', 'Strategy', 'Future'],
    'the-current': ['Briefing', 'Daily', 'News', 'AI', 'Startups'],
    'africa-startups': ['Africa', 'Innovation', 'Funding', 'Entrepreneurship', 'Growth'],
  };
  const tags = categoryTags[category] || ['Tech', 'Innovation', 'Trending'];

  return {
    id: String(index),
    url,
    title,
    description,
    summary,
    content,
    image_url,
    source: ['Tech Current', 'Reuters', 'TechCrunch', 'Wired', 'Ars Technica'][rand(0, 4)],
    author: ['Buduka Oyagiri', 'AI Team', 'Dev Team', 'Security Team', 'Startup Editor'][rand(0, 4)],
    published_at: new Date(Date.now() - rand(0, 30) * 3600000).toISOString(),
    category,
    tags,
    reading_time: Math.ceil(plainText.split(' ').length / 200) + 3,
    is_pinned: index < 5,
    likes: rand(10, 500),
    bookmarks: rand(5, 200),
  };
}

// ============================================================
// 8. CACHING & API ROUTE
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