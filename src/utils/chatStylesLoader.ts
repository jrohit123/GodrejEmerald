
export const loadChatStyles = (): HTMLLinkElement => {
  const link = document.createElement('link');
  link.href = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css';
  link.rel = 'stylesheet';
  return link;
};
