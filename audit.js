// audit.js
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const report = [];

function checkFile(filePath, requiredContent = null) {
  const fullPath = path.join(root, filePath);
  if (!fs.existsSync(fullPath)) {
    report.push(`❌ MISSING: ${filePath}`);
    return false;
  }
  if (requiredContent) {
    const content = fs.readFileSync(fullPath, 'utf8');
    if (!content.includes(requiredContent)) {
      report.push(`⚠️  INCOMPLETE: ${filePath} (missing "${requiredContent}")`);
      return false;
    }
  }
  report.push(`✅ OK: ${filePath}`);
  return true;
}

function checkFolder(folderPath) {
  const fullPath = path.join(root, folderPath);
  if (!fs.existsSync(fullPath)) {
    report.push(`❌ MISSING FOLDER: ${folderPath}`);
    return false;
  }
  report.push(`✅ FOLDER EXISTS: ${folderPath}`);
  return true;
}

console.log('\n🔍 Tech Current Project Audit\n');

// ============================================================
// 1. ROOT FILES
// ============================================================
checkFile('package.json');
checkFile('next.config.js');
checkFile('tailwind.config.js');
checkFile('tsconfig.json');
checkFile('.env.local');
checkFile('middleware.ts');
checkFile('app/globals.css');

// ============================================================
// 2. APP PAGES
// ============================================================
checkFile('app/layout.tsx');
checkFile('app/page.tsx');
checkFile('app/providers.tsx');

// Public pages
const pages = [
  'about', 'ai', 'bookmarks', 'contact', 'cybersecurity',
  'news', 'newsletter', 'profile', 'programming', 'reviews',
  'search', 'startups', 'tutorials'
];
pages.forEach(p => checkFile(`app/(public)/${p}/page.tsx`));

// News detail
checkFile('app/(public)/news/[slug]/page.tsx');

// Auth pages
checkFile('app/(auth)/login/page.tsx');
checkFile('app/(auth)/register/page.tsx');

// Admin
checkFile('app/admin/layout.tsx');
checkFile('app/admin/page.tsx');
checkFile('app/admin/articles/page.tsx');
checkFile('app/admin/articles/new/page.tsx');

// ============================================================
// 3. COMPONENTS
// ============================================================
const uiComponents = [
  'Button', 'Input', 'Textarea', 'Skeleton', 'ArticleCard',
  'ArticleGrid', 'Navbar', 'Footer', 'BookmarkButton', 'FollowButton'
];
uiComponents.forEach(c => checkFile(`components/ui/${c}.tsx`));

const sections = [
  'Hero', 'FeaturedSection', 'TrendingCarousel',
  'CategorySection', 'NewsletterSignup', 'ArticleDetail'
];
sections.forEach(s => checkFile(`components/sections/${s}.tsx`));

const adminComponents = ['Sidebar', 'AnalyticsDashboard'];
adminComponents.forEach(a => checkFile(`components/admin/${a}.tsx`));

// ============================================================
// 4. LIBRARY
// ============================================================
checkFile('lib/utils.ts');
checkFile('lib/supabase/client.ts');
checkFile('lib/supabase/server.ts');
checkFile('lib/api/client.ts');

// ============================================================
// 5. HOOKS
// ============================================================
['useSupabase', 'useAuth', 'useBookmarks', 'useSearch'].forEach(h =>
  checkFile(`hooks/${h}.ts`)
);

// ============================================================
// 6. TYPES
// ============================================================
checkFile('types/article.ts');
checkFile('types/user.ts');

// ============================================================
// 7. API ROUTES
// ============================================================
['news', 'search', 'newsletter/subscribe', 'bookmarks', 'preferences'].forEach(r =>
  checkFile(`app/api/${r}/route.ts`)
);

// ============================================================
// 8. ENVIRONMENT VARIABLES (check .env.local)
// ============================================================
const envPath = path.join(root, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const needed = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'];
  needed.forEach(key => {
    if (!envContent.includes(key)) {
      report.push(`⚠️  MISSING ENV VAR: ${key} in .env.local`);
    } else {
      report.push(`✅ ENV VAR FOUND: ${key}`);
    }
  });
} else {
  report.push('❌ .env.local is missing');
}

// ============================================================
// 9. CHECK FOR COMMON SYNTAX ERRORS (tsx imports, etc.)
// ============================================================
// We'll just check a few key files for typical mistakes
function checkImport(filePath, importName) {
  const full = path.join(root, filePath);
  if (!fs.existsSync(full)) return;
  const content = fs.readFileSync(full, 'utf8');
  if (!content.includes(`import { ${importName} }`) && !content.includes(`import ${importName} from`)) {
    report.push(`⚠️  MISSING IMPORT: ${importName} in ${filePath}`);
  }
}

// Check a few common ones
checkImport('components/ui/ArticleCard.tsx', 'FollowButton');
checkImport('components/ui/ArticleCard.tsx', 'BookmarkButton');
checkImport('app/(public)/page.tsx', 'fetchArticles');
checkImport('components/sections/NewsletterSignup.tsx', 'toast');

// ============================================================
// SUMMARY
// ============================================================
console.log('\n📋 Audit Report:\n');
report.forEach(line => console.log(line));
console.log(`\n${report.filter(r => r.includes('❌')).length} errors, ${report.filter(r => r.includes('⚠️')).length} warnings.`);
console.log('\n✅ Audit complete.');