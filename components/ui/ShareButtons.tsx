// components/ui/ShareButtons.tsx
'use client';
import { Twitter, Linkedin, Facebook, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface ShareButtonsProps {
  url: string;
  title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } catch {
      toast.error('Failed to copy link.');
    }
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => window.open(shareLinks.twitter, '_blank')}
        className="p-1.5 text-muted-foreground hover:text-[#1DA1F2] transition-colors"
        aria-label="Share on Twitter"
      >
        <Twitter className="h-4 w-4" />
      </button>
      <button
        onClick={() => window.open(shareLinks.linkedin, '_blank')}
        className="p-1.5 text-muted-foreground hover:text-[#0A66C2] transition-colors"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="h-4 w-4" />
      </button>
      <button
        onClick={() => window.open(shareLinks.facebook, '_blank')}
        className="p-1.5 text-muted-foreground hover:text-[#1877F2] transition-colors"
        aria-label="Share on Facebook"
      >
        <Facebook className="h-4 w-4" />
      </button>
      <button
        onClick={handleCopy}
        className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Copy link"
      >
        <Copy className="h-4 w-4" />
      </button>
    </div>
  );
}