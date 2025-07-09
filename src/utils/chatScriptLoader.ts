
export const loadChatScript = (webhookUrl: string): HTMLScriptElement => {
  const script = document.createElement('script');
  script.type = 'module';
  script.innerHTML = `
    import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';

    createChat({
      webhookUrl: '${webhookUrl}'
    });
  `;
  return script;
};
