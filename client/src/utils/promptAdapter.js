const fallbackImage = 'https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=1200&q=80';
const fallbackAvatar = 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80';

export function normalizePrompt(prompt = {}) {
  const creator = prompt.creator || {};
  const firstMedia = prompt.previewMedia?.[0];
  const firstSample = prompt.sampleOutputs?.[0];

  return {
    ...prompt,
    _id: prompt._id || prompt.id,
    title: prompt.title || 'Untitled prompt',
    description: prompt.description || 'No description provided yet.',
    category: prompt.categoryName || prompt.category?.name || prompt.category || 'General',
    tags: Array.isArray(prompt.tags) ? prompt.tags : [],
    platforms: Array.isArray(prompt.platforms) ? prompt.platforms : [],
    price: Number(prompt.price || 0),
    preview: prompt.preview || firstMedia?.url || firstSample?.mediaUrl || fallbackImage,
    sampleOutput: prompt.sampleOutput || firstSample?.content || 'Sample output will appear here after the creator adds examples.',
    rating: Number(prompt.rating || prompt.averageRating || 0).toFixed(1),
    reviewsCount: prompt.reviewsCount || 0,
    likesCount: Array.isArray(prompt.likes) ? prompt.likes.length : (prompt.likesCount || 0),
    sales: prompt.sales || prompt.purchasesCount || 0,
    promptText: prompt.promptText,
    creator: {
      name: creator.name || 'PromptVault Creator',
      avatar: creator.avatar || fallbackAvatar,
      verified: Boolean(creator.verified || creator.isVerified)
    }
  };
}

export function sortToApiValue(sort) {
  const map = {
    Popular: 'popular',
    Latest: 'latest',
    'Highest rated': 'rating',
    Free: 'free',
    Premium: 'premium'
  };
  return map[sort] || 'popular';
}
