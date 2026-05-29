export const categories = ['Marketing', 'Image', 'Writing', 'Video', 'Music', 'Code', 'Business', 'Education'];

export const prompts = [
  {
    _id: 'pv-1',
    title: 'Cinematic Product Launch Kit',
    description: 'A complete prompt pack for generating launch visuals, taglines, landing copy, and social variants.',
    category: 'Marketing',
    tags: ['launch', 'brand', 'copywriting'],
    platforms: ['ChatGPT', 'Midjourney', 'Claude'],
    price: 29,
    isPremium: true,
    rating: 4.9,
    reviewsCount: 184,
    sales: 3210,
    creator: { name: 'Mira K.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80', verified: true },
    preview: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=1200&q=80',
    sampleOutput: 'A dramatic launch narrative with polished conversion copy and cinematic image directions.',
    promptText: 'Act as a senior launch strategist. Build a product launch narrative for {{product}}...'
  },
  {
    _id: 'pv-2',
    title: 'Midjourney Editorial Portrait Engine',
    description: 'Create art-directed portraits with lighting, wardrobe, camera, and finish controls.',
    category: 'Image',
    tags: ['portrait', 'midjourney', 'photography'],
    platforms: ['Midjourney', 'Stable Diffusion'],
    price: 0,
    isPremium: false,
    rating: 4.8,
    reviewsCount: 92,
    sales: 1280,
    creator: { name: 'Ayan Studio', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80', verified: true },
    preview: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80',
    sampleOutput: 'Editorial portraits with rich lighting, confident composition, and production-grade styling.',
    promptText: 'Editorial portrait of {{subject}}, photographed with {{camera}}, lighting: {{lighting}}...'
  },
  {
    _id: 'pv-3',
    title: 'Sora Storyboard Sequencer',
    description: 'Turn product ideas into short video sequences with shot lists, camera moves, and scene prompts.',
    category: 'Video',
    tags: ['sora', 'video', 'storyboard'],
    platforms: ['Sora', 'Runway', 'Pika'],
    price: 39,
    isPremium: true,
    rating: 4.7,
    reviewsCount: 67,
    sales: 740,
    creator: { name: 'Nova Frames', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80', verified: false },
    preview: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
    sampleOutput: 'Scene-by-scene production notes with transitions, pacing, visual motifs, and prompt-ready clips.',
    promptText: 'Create a 30-second cinematic storyboard for {{concept}} with 6 shots...'
  },
  {
    _id: 'pv-4',
    title: 'Claude Research Synthesizer',
    description: 'Summarize dense research into briefs, decision memos, and source-backed recommendations.',
    category: 'Education',
    tags: ['research', 'claude', 'analysis'],
    platforms: ['Claude', 'Gemini', 'ChatGPT'],
    price: 15,
    isPremium: true,
    rating: 4.9,
    reviewsCount: 221,
    sales: 4022,
    creator: { name: 'PromptLab Pro', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80', verified: true },
    preview: 'https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?auto=format&fit=crop&w=1200&q=80',
    sampleOutput: 'A concise briefing with assumptions, evidence quality, risks, and action-ready recommendations.',
    promptText: 'Analyze the provided documents and produce an executive research memo...'
  }
];

export const stats = [
  { label: 'Curated prompts', value: '42K+' },
  { label: 'Creator payouts', value: '$1.8M' },
  { label: 'AI platforms', value: '18' },
  { label: 'Avg rating', value: '4.8' }
];
