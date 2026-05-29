import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Check, ChevronDown, ChevronUp, ImagePlus, Pencil, Plus, RotateCcw, Search, Skull, Trash2, Upload, X } from 'lucide-react';
import Section from '../components/ui/Section.jsx';
import Button from '../components/ui/Button.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import { adminService, promptService, uploadService } from '../services/api.js';

function StatusPill({ status }) {
  const map = {
    approved: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-200',
    pending: 'bg-amber-500/10 text-amber-700 dark:text-amber-200',
    rejected: 'bg-rose-500/10 text-rose-700 dark:text-rose-200',
    draft: 'bg-slate-500/10 text-slate-700 dark:text-slate-200',
    archived: 'bg-slate-500/10 text-slate-600 dark:text-slate-300'
  };
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${map[status] || map.draft}`}>{status}</span>;
}

export default function AdminPrompts() {
  const queryClient = useQueryClient();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');
  const [premium, setPremium] = useState('all');
  const [selected, setSelected] = useState({});
  const [editing, setEditing] = useState(null);
  const [createOpen, setCreateOpen] = useState(true);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreviewUrls, setMediaPreviewUrls] = useState([]);
  const [showArchived, setShowArchived] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-prompts', { showArchived }],
    queryFn: () => adminService.prompts(showArchived ? { includeArchived: 'true' } : undefined)
  });

  const prompts = data?.prompts || [];

  const { register, handleSubmit, reset, watch, formState: { isSubmitting } } = useForm({
    defaultValues: { isPremium: 'false', price: 0, platforms: 'ChatGPT' }
  });

  const isPremiumValue = watch('isPremium') === 'true';

  const createPrompt = useMutation({
    mutationFn: promptService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-prompts'] });
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
      toast.success('Prompt published');
      reset({ isPremium: 'false', price: 0, platforms: 'ChatGPT' });
      setMediaFiles([]);
      setMediaPreviewUrls([]);
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Create failed')
  });

  const onCreate = async (formData) => {
    let previewMedia = [];
    if (mediaFiles.length > 0) {
      try {
        const uploaded = await uploadService.media(mediaFiles);
        previewMedia = uploaded.media || [];
      } catch (e) {
        const msg = e.response?.data?.message || 'Preview image upload failed.';
        toast.error(msg);
        throw e;
      }
    }
    const payload = {
      title: formData.title,
      description: formData.description,
      categoryName: formData.categoryName,
      tags: (formData.tags || '').split(',').map((t) => t.trim()).filter(Boolean),
      platforms: (formData.platforms || '').split(',').map((t) => t.trim()).filter(Boolean),
      promptText: formData.promptText,
      usageInstructions: formData.usageInstructions,
      isPremium: isPremiumValue,
      price: isPremiumValue ? Number(formData.price || 0) : 0,
      previewMedia,
      sampleOutputs: formData.sampleOutput ? [{ title: 'Sample output', content: formData.sampleOutput }] : []
    };
    await createPrompt.mutateAsync(payload);
  };

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return prompts
      .filter((p) => (status === 'all' ? true : p.status === status))
      .filter((p) => (premium === 'all' ? true : premium === 'premium' ? Boolean(p.isPremium) : !p.isPremium))
      .filter((p) => {
        if (!term) return true;
        return `${p.title} ${p.categoryName || ''} ${(p.tags || []).join(' ')}`.toLowerCase().includes(term);
      });
  }, [prompts, q, status, premium]);

  const bulkArchive = useMutation({
    mutationFn: async (ids) => {
      await Promise.all(ids.map((id) => promptService.remove(id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-prompts'] });
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
      setSelected({});
      toast.success('Archived selected prompts');
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Bulk archive failed')
  });

  const updatePrompt = useMutation({
    mutationFn: ({ id, payload }) => promptService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-prompts'] });
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
      toast.success('Prompt updated');
      setEditing(null);
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Update failed')
  });

  const selectedIds = Object.keys(selected).filter((id) => selected[id]);

  const hardDelete = useMutation({
    mutationFn: (id) => adminService.hardDeletePrompt(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-prompts'] });
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
      toast.success('Prompt permanently deleted');
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Hard delete failed')
  });

  const restore = useMutation({
    mutationFn: (id) => promptService.update(id, { status: 'approved', changeNote: 'Restored from archive' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-prompts'] });
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
      toast.success('Prompt restored');
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Restore failed')
  });

  return (
    <Section eyebrow="Admin" title="Manage Prompts">
      <div className="glass rounded-3xl p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-cyan-300 text-ink"><Plus size={18} /></div>
            <div>
              <div className="text-sm font-semibold text-slate-950 dark:text-white">New prompt</div>
              <div className="text-xs text-slate-600 dark:text-slate-300">Create and publish prompts with preview images.</div>
            </div>
          </div>
          <Button type="button" variant="ghost" onClick={() => setCreateOpen((v) => !v)}>
            {createOpen ? <><ChevronUp size={18} /> Collapse</> : <><ChevronDown size={18} /> Expand</>}
          </Button>
        </div>

        {createOpen && (
          <form onSubmit={handleSubmit(onCreate)} className="mt-4 grid gap-3">
            <input {...register('title', { required: true })} placeholder="Title" className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 outline-none dark:border-white/10 dark:bg-white/10" />
            <textarea {...register('description', { required: true })} rows="3" placeholder="Description" className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 outline-none dark:border-white/10 dark:bg-white/10" />
            <div className="grid gap-3 sm:grid-cols-2">
              <input {...register('categoryName', { required: true })} placeholder="Category, e.g. Marketing" className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 outline-none dark:border-white/10 dark:bg-white/10" />
              <input {...register('tags')} placeholder="Tags (comma separated)" className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 outline-none dark:border-white/10 dark:bg-white/10" />
            </div>
            <input {...register('platforms', { required: true })} placeholder="Platforms, e.g. ChatGPT, Claude" className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 outline-none dark:border-white/10 dark:bg-white/10" />
            <div className="grid gap-3 sm:grid-cols-2">
              <select {...register('isPremium')} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none dark:border-white/10 dark:bg-slate-950">
                <option value="false">Free prompt</option>
                <option value="true">Premium prompt</option>
              </select>
              <input {...register('price')} type="number" min="0" placeholder="Price (INR)" className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 outline-none dark:border-white/10 dark:bg-white/10" />
            </div>
            <textarea {...register('promptText', { required: true })} rows="5" placeholder="Full prompt text" className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 outline-none dark:border-white/10 dark:bg-white/10" />
            <textarea {...register('usageInstructions')} rows="3" placeholder="Usage instructions" className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 outline-none dark:border-white/10 dark:bg-white/10" />
            <textarea {...register('sampleOutput')} rows="3" placeholder="Sample output preview" className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 outline-none dark:border-white/10 dark:bg-white/10" />

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
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {mediaPreviewUrls.map((url) => (
                  <img key={url} src={url} alt="Preview" className="aspect-video w-full rounded-xl object-cover" />
                ))}
              </div>
            )}

            <div className="mt-1 flex justify-end">
              <Button type="submit" disabled={isSubmitting || createPrompt.isPending}>
                <Upload size={18} /> {createPrompt.isPending ? 'Publishing...' : 'Publish prompt'}
              </Button>
            </div>
          </form>
        )}
      </div>

      <div className="glass rounded-3xl p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto_auto]">
          <label className="flex min-h-12 items-center gap-3 rounded-2xl bg-slate-100 px-4 dark:bg-white/10">
            <Search size={18} className="text-cyan-300" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title, category, tags..." className="w-full bg-transparent text-slate-950 outline-none placeholder:text-slate-500 dark:text-white" />
          </label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="min-h-12 rounded-2xl border border-slate-200 bg-white px-4 text-slate-950 dark:border-white/10 dark:bg-slate-950 dark:text-white">
            {['all', 'approved', 'pending', 'draft', 'rejected', 'archived'].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={premium} onChange={(e) => setPremium(e.target.value)} className="min-h-12 rounded-2xl border border-slate-200 bg-white px-4 text-slate-950 dark:border-white/10 dark:bg-slate-950 dark:text-white">
            <option value="all">all</option>
            <option value="free">free</option>
            <option value="premium">premium</option>
          </select>
          <label className="flex min-h-12 items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 dark:border-white/10 dark:bg-slate-950 dark:text-slate-200">
            <span className="font-semibold">Show archived</span>
            <input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} />
          </label>
          <Button
            type="button"
            disabled={selectedIds.length === 0 || bulkArchive.isPending}
            onClick={() => {
              if (!window.confirm(`Archive ${selectedIds.length} prompts?`)) return;
              bulkArchive.mutate(selectedIds);
            }}
          >
            {bulkArchive.isPending ? 'Archiving...' : `Archive selected (${selectedIds.length})`}
          </Button>
        </div>
      </div>

      {isLoading && <Skeleton className="mt-6 h-96" />}
      {isError && <div className="mt-6 glass rounded-3xl p-6 text-slate-700 dark:text-slate-300">Could not load prompts.</div>}

      {!isLoading && !isError && (
        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5">
          <div className="grid grid-cols-[48px_1.2fr_0.7fr_0.35fr_0.35fr_0.5fr_120px] gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
            <div />
            <div>Title</div>
            <div>Category</div>
            <div>Type</div>
            <div>Price</div>
            <div>Status</div>
            <div className="text-right">Actions</div>
          </div>
          {filtered.length === 0 && <div className="px-4 py-10 text-center text-sm text-slate-600 dark:text-slate-300">No prompts match your filters.</div>}
          {filtered.map((p) => (
            <div key={p._id} className="grid grid-cols-[48px_1.2fr_0.7fr_0.35fr_0.35fr_0.5fr_120px] items-center gap-3 border-b border-slate-200 px-4 py-3 last:border-0 dark:border-white/10">
              <div>
                <input
                  type="checkbox"
                  checked={Boolean(selected[p._id])}
                  onChange={(e) => setSelected((prev) => ({ ...prev, [p._id]: e.target.checked }))}
                />
              </div>
              <div className="min-w-0">
                <div className="truncate font-semibold text-slate-950 dark:text-white">{p.title}</div>
                <div className="truncate text-xs text-slate-500 dark:text-slate-300">{(p.tags || []).slice(0, 4).map((t) => `#${t}`).join(' ')}</div>
              </div>
              <div className="truncate text-sm text-slate-700 dark:text-slate-200">{p.categoryName || 'General'}</div>
              <div className="text-sm text-slate-700 dark:text-slate-200">{p.isPremium ? 'premium' : 'free'}</div>
              <div className="text-sm text-slate-700 dark:text-slate-200">{p.isPremium ? `INR ${p.price}` : '-'}</div>
              <div><StatusPill status={p.status} /></div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-700 transition hover:border-cyan-300 dark:border-white/10 dark:text-slate-200"
                  aria-label="Edit prompt"
                  onClick={() => setEditing(p)}
                >
                  <Pencil size={18} />
                </button>
                {p.status === 'archived' && (
                  <button
                    type="button"
                    className="grid h-10 w-10 place-items-center rounded-full border border-emerald-200 text-emerald-700 transition hover:border-emerald-400 hover:bg-emerald-50 disabled:opacity-50 dark:border-emerald-500/30 dark:text-emerald-200 dark:hover:bg-emerald-500/10"
                    aria-label="Restore prompt"
                    disabled={restore.isPending}
                    onClick={() => restore.mutate(p._id)}
                  >
                    <RotateCcw size={18} />
                  </button>
                )}
                <button
                  type="button"
                  className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-700 transition hover:border-rose-400 hover:text-rose-600 dark:border-white/10 dark:text-slate-200"
                  aria-label="Archive prompt"
                  onClick={() => {
                    if (!window.confirm('Archive this prompt?')) return;
                    bulkArchive.mutate([p._id]);
                  }}
                >
                  <Trash2 size={18} />
                </button>
                <button
                  type="button"
                  className="grid h-10 w-10 place-items-center rounded-full border border-rose-200 text-rose-600 transition hover:border-rose-400 hover:bg-rose-50 disabled:opacity-50 dark:border-rose-500/30 dark:text-rose-300 dark:hover:bg-rose-500/10"
                  aria-label="Hard delete prompt"
                  disabled={hardDelete.isPending}
                  onClick={() => {
                    const ok = window.prompt('Type DELETE to permanently remove this prompt and its images:');
                    if (ok !== 'DELETE') return;
                    hardDelete.mutate(p._id);
                  }}
                >
                  <Skull size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <EditModal
          prompt={editing}
          onClose={() => setEditing(null)}
          onSave={(payload) => updatePrompt.mutate({ id: editing._id, payload })}
          saving={updatePrompt.isPending}
        />
      )}
    </Section>
  );
}

function EditModal({ prompt, onClose, onSave, saving }) {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      title: prompt.title,
      description: prompt.description,
      categoryName: prompt.categoryName || '',
      tags: (prompt.tags || []).join(', '),
      platforms: (prompt.platforms || []).join(', '),
      isPremium: prompt.isPremium ? 'true' : 'false',
      price: prompt.price || 0,
      status: prompt.status
    }
  });

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4">
      <div className="glass w-full max-w-2xl rounded-3xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-black">Edit prompt</h2>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-700 dark:border-white/10 dark:text-slate-200">
            <X size={18} />
          </button>
        </div>
        <form
          onSubmit={handleSubmit((form) => {
            const payload = {
              title: form.title,
              description: form.description,
              categoryName: form.categoryName,
              tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
              platforms: form.platforms.split(',').map((t) => t.trim()).filter(Boolean),
              isPremium: form.isPremium === 'true',
              price: form.isPremium === 'true' ? Number(form.price || 0) : 0,
              status: form.status
            };
            onSave(payload);
          })}
          className="grid gap-3"
        >
          <input {...register('title', { required: true })} className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 outline-none dark:border-white/10 dark:bg-white/10" placeholder="Title" />
          <textarea {...register('description', { required: true })} rows="3" className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 outline-none dark:border-white/10 dark:bg-white/10" placeholder="Description" />
          <div className="grid gap-3 sm:grid-cols-2">
            <input {...register('categoryName')} className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 outline-none dark:border-white/10 dark:bg-white/10" placeholder="Category" />
            <select {...register('status')} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none dark:border-white/10 dark:bg-slate-950">
              {['approved', 'pending', 'draft', 'rejected', 'archived'].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <input {...register('tags')} className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 outline-none dark:border-white/10 dark:bg-white/10" placeholder="Tags: comma separated" />
          <input {...register('platforms')} className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 outline-none dark:border-white/10 dark:bg-white/10" placeholder="Platforms: comma separated" />
          <div className="grid gap-3 sm:grid-cols-2">
            <select {...register('isPremium')} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none dark:border-white/10 dark:bg-slate-950">
              <option value="false">Free</option>
              <option value="true">Premium</option>
            </select>
            <input {...register('price')} type="number" min="0" className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 outline-none dark:border-white/10 dark:bg-white/10" placeholder="Price (INR)" />
          </div>
          <div className="mt-2 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : <><Check size={18} /> Save</>}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
