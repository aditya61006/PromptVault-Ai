import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal } from 'lucide-react';
import PromptCard from '../components/prompts/PromptCard.jsx';
import Section from '../components/ui/Section.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import { useDebounce } from '../hooks/useDebounce.js';
import { categoryService, promptService } from '../services/api.js';
import { sortToApiValue } from '../utils/promptAdapter.js';

export default function Explore() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('Popular');
  const debounced = useDebounce(query);

  const promptParams = useMemo(() => ({
    q: debounced || undefined,
    category: category === 'All' ? undefined : category,
    sort: sortToApiValue(sort),
    premium: sort === 'Free' ? 'false' : sort === 'Premium' ? 'true' : undefined,
    page: 1,
    limit: 24
  }), [category, debounced, sort]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['prompts', promptParams],
    queryFn: () => promptService.list(promptParams),
    keepPreviousData: true
  });

  const { data: categoryData } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.list
  });

  const categoryNames = categoryData?.categories?.map((item) => item.name) || [];
  const prompts = data?.items || [];

  return (
    <Section eyebrow="Explore prompts" title="Search the vault across tools, categories, and creator signals." className="min-h-[75vh]">
      <div className="glass mb-8 grid gap-4 rounded-3xl p-4 lg:grid-cols-[1fr_auto_auto]">
        <label className="flex min-h-12 items-center gap-3 rounded-2xl bg-slate-100 px-4 dark:bg-white/10">
          <Search size={18} className="text-cyan-300" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search prompts, tags, platforms..." className="w-full bg-transparent text-slate-950 outline-none placeholder:text-slate-500 dark:text-white" />
        </label>
        <select value={category} onChange={(event) => setCategory(event.target.value)} className="min-h-12 rounded-2xl border border-slate-200 bg-white px-4 text-slate-950 dark:border-white/10 dark:bg-slate-950 dark:text-white">
          {['All', ...categoryNames].map((item) => <option key={item}>{item}</option>)}
        </select>
        <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-slate-950 dark:border-white/10 dark:bg-slate-950 dark:text-white">
          <SlidersHorizontal size={18} />
          <select value={sort} onChange={(event) => setSort(event.target.value)} className="min-h-12 bg-transparent outline-none">
            {['Popular', 'Latest', 'Highest rated', 'Free', 'Premium'].map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      </div>
      {isLoading && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => <Skeleton key={index} className="h-96" />)}
        </div>
      )}
      {isError && <div className="glass rounded-3xl p-6 text-slate-700 dark:text-slate-300">Could not load prompts. Check that the backend is running and `VITE_API_URL` points to it.</div>}
      {!isLoading && !isError && prompts.length === 0 && <div className="glass rounded-3xl p-6 text-slate-700 dark:text-slate-300">No prompts found yet. Create or seed approved prompts in MongoDB to fill the marketplace.</div>}
      {!isLoading && !isError && prompts.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {prompts.map((prompt) => <PromptCard key={prompt._id} prompt={prompt} />)}
        </div>
      )}
    </Section>
  );
}
