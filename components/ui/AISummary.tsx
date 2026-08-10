// components/ui/AISummary.tsx
'use client';
import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { toast } from 'sonner';

interface AISummaryProps {
  articleId: string;
  articleTitle: string;
  articleContent: string;
}

export function AISummary({ articleId, articleTitle, articleContent }: AISummaryProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const fetchSummary = async () => {
    if (summary) {
      setIsExpanded(!isExpanded);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId,
          title: articleTitle,
          content: articleContent,
        }),
      });
      if (!res.ok) throw new Error('Failed to generate summary');
      const data = await res.json();
      setSummary(data.summary || 'No summary available.');
      setIsExpanded(true);
    } catch (error) {
      console.error('AI summary error:', error);
      toast.error('Failed to generate summary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 border-t border-border pt-6">
      <Button
        variant="outline"
        onClick={fetchSummary}
        disabled={isLoading}
        className="flex items-center gap-2"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
        {isLoading ? 'Generating...' : summary ? 'Show Summary' : 'TL;DR – AI Summary'}
      </Button>

      {summary && isExpanded && (
        <div className="mt-4 p-4 rounded-xl bg-muted/50 border border-border/60">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-gold shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">AI Summary</p>
              <p className="text-sm text-muted-foreground mt-1">{summary}</p>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(false)}
            className="mt-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Hide summary
          </button>
        </div>
      )}
    </div>
  );
}