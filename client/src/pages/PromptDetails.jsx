import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Copy, Download, ShieldCheck, Star, ThumbsUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button.jsx';
import Section from '../components/ui/Section.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import { promptService, reviewService } from '../services/api.js';
import { normalizePrompt } from '../utils/promptAdapter.js';

export default function PromptDetails() {
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['prompt', id],
    queryFn: () => promptService.get(id),
    enabled: Boolean(id)
  });
  const { data: reviewData } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => reviewService.list(id),
    enabled: Boolean(id)
  });
  const prompt = normalizePrompt(data?.prompt);
  const reviews = reviewData?.reviews || [];
  const media = useMemo(() => (data?.prompt?.previewMedia || []).filter(Boolean), [data?.prompt?.previewMedia]);
  const [selectedMediaUrl, setSelectedMediaUrl] = useState(null);

  const heroImage = selectedMediaUrl || prompt.preview;

  if (isLoading) {
    return (
      <Section>
        <div className="grid gap-8 lg:grid-cols-[1fr_.8fr]">
          <Skeleton className="h-[520px]" />
          <Skeleton className="h-[520px]" />
        </div>
      </Section>
    );
  }

  if (isError || !data?.prompt) {
    return (
      <Section>
        <div className="glass rounded-3xl p-8">
          <h1 className="text-3xl font-black">Prompt not found</h1>
          <p className="mt-3 text-slate-300">This prompt could not be loaded from the API.</p>
          <Button as={Link} to="/explore" className="mt-6">Back to Explore</Button>
        </div>
      </Section>
    );
  }

  return (
    <Section>
      <div className="grid gap-8 lg:grid-cols-[1fr_.8fr]">
        <div>
          <img src={heroImage} alt={prompt.title} className="aspect-video w-full rounded-3xl object-cover shadow-violet" />
          {media.length > 1 && (
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
              {media.slice(0, 6).map((item) => (
                <button
                  type="button"
                  key={item.url}
                  className={`overflow-hidden rounded-xl border ${heroImage === item.url ? 'border-cyan-300' : 'border-slate-200 dark:border-white/10'}`}
                  onClick={() => setSelectedMediaUrl(item.url)}
                >
                  <img src={item.url} alt="Preview" className="aspect-video w-full object-cover" />
                </button>
              ))}
            </div>
          )}
          <div className="mt-8 glass rounded-3xl p-6">
            <h2 className="mb-4 text-2xl font-black">Preview output</h2>
            <p className="leading-7 text-slate-600 dark:text-slate-300">{prompt.sampleOutput}</p>
          </div>
          <div className="mt-6 glass rounded-3xl p-6">
            <h2 className="mb-4 text-2xl font-black">Reviews</h2>
            {reviews.length === 0 && <p className="text-sm text-slate-400">No reviews yet.</p>}
            {reviews.map((review) => (
              <div key={review._id} className="border-b border-white/10 py-4 last:border-0">
                <div className="mb-2 flex text-amber-300"><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /></div>
                <p className="text-sm text-slate-600 dark:text-slate-300">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="gradient-border glass rounded-3xl p-6">
            <div className="mb-4 inline-flex rounded-full bg-cyan-300/15 px-3 py-1 text-sm font-bold text-cyan-200">{prompt.category}</div>
            <h1 className="text-4xl font-black tracking-tight">{prompt.title}</h1>
            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">{prompt.description}</p>
            <div className="mt-5 flex items-center gap-2 text-amber-300"><Star fill="currentColor" size={18} /> {prompt.rating} <span className="text-slate-400">from {prompt.reviewsCount} reviews</span></div>
            <div className="mt-3 flex items-center justify-between gap-2 text-sm text-slate-500 dark:text-slate-300">
              <div className="flex items-center gap-2"><ThumbsUp size={16} /> {data.prompt.likes?.length || 0} likes</div>
              <Button
                variant="subtle"
                type="button"
                className="min-h-9 px-4"
                onClick={async () => {
                  try {
                    await promptService.like(id);
                    toast.success('Updated like');
                  } catch (e) {
                    toast.error(e.response?.data?.message || 'Like failed');
                  }
                }}
              >
                <ThumbsUp size={16} /> Like
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {prompt.tags.map((tag) => <span key={tag} className="rounded-full bg-white/10 px-3 py-1 text-xs">#{tag}</span>)}
            </div>
            <div className="mt-6 rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-slate-400">Unlocked prompt</p>
              <code className="mt-2 block whitespace-pre-wrap text-sm text-cyan-100">{data.unlocked ? data.promptText : 'Purchase to reveal the full prompt text.'}</code>
            </div>
            <div className="mt-6 grid gap-3">
              <Button onClick={() => toast.success(prompt.isPremium ? 'Razorpay checkout opens after backend keys are configured.' : 'Free prompt saved to downloads.')}>
                {prompt.isPremium ? `Buy for $${prompt.price}` : 'Use free prompt'} <Download size={18} />
              </Button>
              <Button
                variant="ghost"
                onClick={async () => {
                  if (!data.unlocked) return toast.error('Unlock this prompt to copy it.');
                  try {
                    await navigator.clipboard.writeText(data.promptText || '');
                    toast.success('Prompt copied to clipboard');
                  } catch (e) {
                    toast.error('Copy failed. Your browser may block clipboard access.');
                  }
                }}
              >
                <Copy size={18} /> Copy prompt
              </Button>
              <Button as={Link} to="/explore" variant="subtle">Find similar prompts</Button>
            </div>
            <div className="mt-6 flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300"><ShieldCheck className="text-mint" /> Secure unlocks, verified creator, protected downloads.</div>
          </div>
        </aside>
      </div>
    </Section>
  );
}
