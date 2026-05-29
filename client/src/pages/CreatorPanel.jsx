import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { BarChart3, DollarSign, ImagePlus, Trash2, Upload, Wallet } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Button from '../components/ui/Button.jsx';
import Section from '../components/ui/Section.jsx';
import { adminService, promptService, uploadService } from '../services/api.js';

const chart = [
  { day: 'Mon', sales: 120 },
  { day: 'Tue', sales: 220 },
  { day: 'Wed', sales: 180 },
  { day: 'Thu', sales: 360 },
  { day: 'Fri', sales: 440 },
  { day: 'Sat', sales: 390 }
];

const platformNames = ['ChatGPT', 'Midjourney', 'Claude', 'Gemini', 'Stable Diffusion', 'Sora', 'Suno', 'Runway', 'Pika', 'Other'];

function normalizePlatformName(value) {
  const match = platformNames.find((name) => name.toLowerCase() === value.trim().toLowerCase());
  return match || 'Other';
}

export default function CreatorPanel() {
  const queryClient = useQueryClient();
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreviewUrls, setMediaPreviewUrls] = useState([]);
  const { register, handleSubmit, reset, watch, formState: { isSubmitting } } = useForm({
    defaultValues: {
      isPremium: 'false',
      price: 0,
      platforms: 'ChatGPT'
    }
  });
  const isPremium = watch('isPremium') === 'true';

  const { data } = useQuery({
    queryKey: ['admin-prompts'],
    queryFn: adminService.prompts,
    retry: false
  });

  const createPromptMutation = useMutation({
    mutationFn: promptService.create,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['admin-prompts'] });
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
      toast.success('Prompt published');
      reset({ isPremium: 'false', price: 0, platforms: 'ChatGPT' });
      setMediaFiles([]);
      setMediaPreviewUrls([]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Prompt upload failed. Make sure you are logged in as an admin.');
    }
  });

  const onSubmit = async (formData) => {
    let previewMedia = [];
    if (mediaFiles.length > 0) {
      const uploaded = await uploadService.media(mediaFiles);
      previewMedia = uploaded.media || [];
    }
    const payload = {
      title: formData.title,
      description: formData.description,
      categoryName: formData.categoryName,
      tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      platforms: formData.platforms.split(',').map(normalizePlatformName).filter(Boolean),
      promptText: formData.promptText,
      usageInstructions: formData.usageInstructions,
      isPremium,
      price: isPremium ? Number(formData.price || 0) : 0,
      previewMedia,
      sampleOutputs: formData.sampleOutput ? [{ title: 'Sample output', content: formData.sampleOutput }] : []
    };
    await createPromptMutation.mutateAsync(payload);
  };

  const prompts = data?.prompts || [];

  const deletePromptMutation = useMutation({
    mutationFn: (id) => promptService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-prompts'] });
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
      toast.success('Prompt deleted');
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Delete failed')
  });

  return (
    <Section eyebrow="Admin prompt manager" title="Create, publish, price, and manage Prompt Vault listings.">
      <div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
        <form onSubmit={handleSubmit(onSubmit)} className="glass rounded-3xl p-6">
          <h2 className="mb-5 text-xl font-black">New prompt</h2>
          <div className="grid gap-3">
            <input {...register('title', { required: true })} placeholder="Title" className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none" />
            <textarea {...register('description', { required: true })} rows="3" placeholder="Description" className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none" />
            <input {...register('categoryName', { required: true })} placeholder="Category, e.g. Marketing" className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none" />
            <input {...register('tags')} placeholder="Tags separated by commas, e.g. launch, ads, seo" className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none" />
            <input {...register('platforms', { required: true })} placeholder="Compatible platforms, e.g. ChatGPT, Claude" className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none" />
            <select {...register('isPremium')} className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 outline-none">
              <option value="false">Free prompt</option>
              <option value="true">Premium prompt</option>
            </select>
            {isPremium && <input {...register('price', { min: 1 })} type="number" min="1" placeholder="Price in INR" className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none" />}
            <textarea {...register('promptText', { required: true })} rows="5" placeholder="Full prompt text" className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none" />
            <textarea {...register('usageInstructions')} rows="3" placeholder="Usage instructions" className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none" />
            <textarea {...register('sampleOutput')} rows="3" placeholder="Sample output preview" className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 outline-none" />
            <label className="glass flex cursor-pointer items-center justify-between gap-3 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <ImagePlus size={18} className="text-cyan-300" />
                Upload preview images
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(event) => {
                  const files = Array.from(event.target.files || []).slice(0, 6);
                  setMediaFiles(files);
                  setMediaPreviewUrls(files.map((file) => URL.createObjectURL(file)));
                }}
              />
              <span className="text-xs text-slate-500 dark:text-slate-300">{mediaFiles.length}/6</span>
            </label>
            {mediaPreviewUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {mediaPreviewUrls.map((url) => (
                  <img key={url} src={url} alt="Preview" className="aspect-video w-full rounded-xl object-cover" />
                ))}
              </div>
            )}
            <Button disabled={isSubmitting || createPromptMutation.isPending}><Upload size={18} /> {createPromptMutation.isPending ? 'Uploading...' : 'Upload prompt'}</Button>
            <p className="text-xs leading-5 text-slate-400">Only admins can create or edit prompts. New prompts are saved in MongoDB and published immediately unless you set a different status later.</p>
          </div>
        </form>
        <div className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ['Premium prompts', String(prompts.filter((prompt) => prompt.isPremium).length), DollarSign],
              ['Published', String(prompts.filter((prompt) => prompt.status === 'approved').length), BarChart3],
              ['Prompts', String(prompts.length), Wallet]
            ].map(([label, value, Icon]) => (
              <div key={label} className="glass rounded-3xl p-5"><Icon className="text-cyan-300" /><p className="mt-4 text-3xl font-black">{value}</p><p className="text-sm text-slate-400">{label}</p></div>
            ))}
          </div>
          <div className="glass h-80 rounded-3xl p-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chart}>
                <defs><linearGradient id="sales" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#22d3ee" stopOpacity={0.7} /><stop offset="100%" stopColor="#22d3ee" stopOpacity={0} /></linearGradient></defs>
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Area dataKey="sales" stroke="#22d3ee" fill="url(#sales)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="glass rounded-3xl p-6">
            <h2 className="mb-4 text-xl font-black">Your prompts</h2>
            {prompts.length === 0 && <p className="text-sm text-slate-400">No prompts uploaded yet.</p>}
            <div className="grid gap-3">
              {prompts.map((prompt) => (
                <div key={prompt._id} className="grid gap-2 rounded-2xl bg-white/10 p-4 md:grid-cols-[1fr_auto]">
                  <div>
                    <p className="font-semibold">{prompt.title}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{prompt.categoryName || 'General'} · {prompt.isPremium ? `INR ${prompt.price}` : 'Free'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-cyan-300/15 px-3 py-1 text-sm font-semibold text-cyan-700 dark:text-cyan-200">{prompt.status}</span>
                    <button
                      type="button"
                      className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-700 transition hover:border-rose-400 hover:text-rose-600 dark:border-white/10 dark:text-slate-200"
                      aria-label="Delete prompt"
                      onClick={() => {
                        if (!window.confirm('Delete this prompt?')) return;
                        deletePromptMutation.mutate(prompt._id);
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
