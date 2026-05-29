import { useQuery } from '@tanstack/react-query';
import { Bell, Download, Heart, Lock, Moon, Settings } from 'lucide-react';
import Section from '../components/ui/Section.jsx';
import PromptCard from '../components/prompts/PromptCard.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import { paymentService, promptService } from '../services/api.js';

export default function Dashboard() {
  const { data: promptData, isLoading } = useQuery({
    queryKey: ['dashboard-recent-prompts'],
    queryFn: () => promptService.list({ sort: 'latest', limit: 2 })
  });
  const { data: purchaseData } = useQuery({
    queryKey: ['purchase-history'],
    queryFn: paymentService.history,
    retry: false
  });

  const prompts = promptData?.items || [];
  const purchases = purchaseData?.purchases || [];

  return (
    <Section eyebrow="User dashboard" title="Your prompts, settings, notifications, and secure downloads.">
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        {[
          ['Purchased', String(purchases.length), Download],
          ['Saved', '0', Heart],
          ['Notifications', '0', Bell],
          ['Security score', '98%', Lock]
        ].map(([label, value, Icon]) => (
          <div key={label} className="glass rounded-3xl p-5">
            <Icon className="mb-4 text-cyan-300" />
            <p className="text-3xl font-black">{value}</p>
            <p className="text-sm text-slate-400">{label}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-6 md:grid-cols-2">
          {isLoading && Array.from({ length: 2 }).map((_, index) => <Skeleton key={index} className="h-96" />)}
          {!isLoading && prompts.length === 0 && <div className="glass rounded-3xl p-6 text-slate-300 md:col-span-2">No recent approved prompts found yet.</div>}
          {!isLoading && prompts.map((prompt) => <PromptCard key={prompt._id} prompt={prompt} />)}
        </div>
        <aside className="glass rounded-3xl p-6">
          <h2 className="text-xl font-black">Profile settings</h2>
          <div className="mt-5 grid gap-3 text-sm text-slate-300">
            {['Dark mode toggle', 'Email verification', 'Two-factor authentication', 'Download history'].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-2xl bg-white/10 p-4">
                <span>{item}</span>
                {item.includes('Dark') ? <Moon size={18} /> : <Settings size={18} />}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </Section>
  );
}
