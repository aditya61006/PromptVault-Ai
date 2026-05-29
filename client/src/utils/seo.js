export function setMeta(title, description) {
  document.title = `${title} | PromptVault AI`;
  const tag = document.querySelector('meta[name="description"]');
  if (tag) tag.setAttribute('content', description);
}
