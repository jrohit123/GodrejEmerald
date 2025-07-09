
import { useEffect } from "react";

const FloatingChatWidget = () => {
  useEffect(() => {
    // Add the CSS link
    const link = document.createElement('link');
    link.href = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Add the script and initialize the chat
    const script = document.createElement('script');
    script.type = 'module';
    script.innerHTML = `
      import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';

      createChat({
        webhookUrl: 'https://n8n-6421994137235212.kloudbeansite.com/webhook/e5900d67-79e6-4e4e-bb9a-1ac95774f84b/chat'
      });
    `;
    document.body.appendChild(script);

    // Cleanup function
    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
    };
  }, []);

  return null; // The n8n chat widget will handle its own rendering
};

export default FloatingChatWidget;
