
import { useEffect } from 'react';
import { loadChatStyles } from '@/utils/chatStylesLoader';
import { loadChatScript } from '@/utils/chatScriptLoader';

export const useChatLoader = (webhookUrl: string) => {
  useEffect(() => {
    const links = loadChatStyles();
    const script = loadChatScript(webhookUrl);

    // Append all stylesheets
    links.forEach(link => {
      document.head.appendChild(link);
    });
    
    document.body.appendChild(script);

    // Cleanup function
    return () => {
      links.forEach(link => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      });
      
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [webhookUrl]);
};
