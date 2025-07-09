
export const loadChatStyles = (): HTMLLinkElement[] => {
  // Load the original n8n chat styles
  const n8nLink = document.createElement('link');
  n8nLink.href = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css';
  n8nLink.rel = 'stylesheet';

  // Load our custom override styles
  const customLink = document.createElement('link');
  customLink.href = '/src/styles/customChatStyles.css';
  customLink.rel = 'stylesheet';

  return [n8nLink, customLink];
};
