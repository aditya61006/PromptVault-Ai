import { motion } from 'framer-motion';
import { Bookmark, Crown, Star, ThumbsUp, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button.jsx';
import { normalizePrompt } from '../../utils/promptAdapter.js';

export default function PromptCard({ prompt }) {
  const item = normalizePrompt(prompt);

  return (
    <motion.article
      whileHover={{ y: -8, rotateX: 2, rotateY: -2 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      className="gradient-border glass overflow-hidden rounded-3xl"
    >
      <Link to={`/prompts/${item._id}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden">
          <img src={item.preview} alt={item.title} className="h-full w-full object-cover transition duration-700 hover:scale-105" loading="lazy" />
          <div className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white">{item.category}</div>
          <div className="absolute right-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-black text-ink">{item.isPremium ? `₹${item.price}` : 'Free'}</div>
        </div>
      </Link>
      <div className="p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-300"><Star size={16} fill="currentColor" /> {item.rating} <span className="text-slate-500 dark:text-slate-400">({item.reviewsCount})</span></div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-300"><ThumbsUp size={14} /> {item.likesCount}</div>
            <button className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 transition hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20" aria-label="Bookmark prompt"><Bookmark size={17} /></button>
          </div>
        </div>
        <h3 className="mb-2 text-xl font-black text-slate-950 dark:text-white">{item.title}</h3>
        <p className="line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {item.platforms.slice(0, 3).map((platform) => <span key={platform} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700 dark:bg-white/10 dark:text-slate-200">{platform}</span>)}
        </div>
        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={item.creator.avatar} alt={item.creator.name} className="h-8 w-8 rounded-full object-cover" />
            <span className="text-sm font-semibold">{item.creator.name}</span>
            {item.creator.verified && <Crown size={15} className="text-cyan-300" />}
          </div>
          <Button as={Link} to={`/prompts/${item._id}`} variant="subtle" className="min-h-9 px-4"><Zap size={15} /> Open</Button>
        </div>
      </div>
    </motion.article>
  );
}
