import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Ban, CreditCard, Flag, ShieldCheck, Users } from 'lucide-react';
import Section from '../components/ui/Section.jsx';
import Button from '../components/ui/Button.jsx';
import { adminService } from '../services/api.js';

export default function AdminPanel() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: adminService.stats
  });

  const rows = [
    ['Total users', isLoading ? '...' : data?.users || 0, Users],
    ['Total prompts', isLoading ? '...' : data?.prompts || 0, ShieldCheck],
    ['Revenue', isLoading ? '...' : `₹${data?.revenue || 0}`, CreditCard],
    ['Open reports', isLoading ? '...' : data?.openReports || 0, Flag],
    ['Suspensions', 'Manage', Ban]
  ];

  return (
    <Section eyebrow="Admin panel" title="Moderation, users, payments, reports, and platform analytics.">
      <div className="mb-6 flex flex-wrap gap-3">
        <Button as={Link} to="/admin/prompts">Manage prompts</Button>
        <Button as={Link} to="/admin" variant="ghost">Overview</Button>
        <Button as={Link} to="/explore" variant="ghost">View marketplace</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {rows.map(([label, value, Icon]) => (
          <div key={label} className="glass rounded-3xl p-5">
            <Icon className="text-cyan-300" />
            <p className="mt-5 text-2xl font-black">{value}</p>
            <p className="text-sm text-slate-400">{label}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 overflow-hidden rounded-3xl border border-white/10">
        {(data?.recentPurchases || []).length === 0 && <div className="p-5 text-sm text-slate-400">No recent purchases yet.</div>}
        {(data?.recentPurchases || []).map((purchase) => (
          <div key={purchase._id} className="grid gap-3 border-b border-white/10 p-5 last:border-0 md:grid-cols-[1fr_auto]">
            <div><p className="font-bold">{purchase.prompt?.title || 'Prompt purchase'}</p><p className="text-sm text-slate-400">{purchase.user?.email} · ₹{purchase.amount}</p></div>
            <span className="rounded-full bg-cyan-300/15 px-4 py-2 text-sm text-cyan-200">{purchase.status}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}
