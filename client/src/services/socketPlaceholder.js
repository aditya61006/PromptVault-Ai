export function subscribeToTrendingPrompts(onMessage) {
  const timer = window.setInterval(() => {
    onMessage({ title: 'Daily featured prompt refreshed', createdAt: new Date().toISOString() });
  }, 30000);
  return () => window.clearInterval(timer);
}
