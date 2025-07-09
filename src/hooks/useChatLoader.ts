
import { useEffect } from 'react';
import { loadChatStyles } from '@/utils/chatStylesLoader';
import { loadChatScript } from '@/utils/chatScriptLoader';

export const useChatLoader = (webhookUrl: string) => {
  useEffect(() => {
    const link = loadChatStyles();
    const script = loadChatScript(webhookUrl);

    document.head.appendChild(link);
    document.body.appendChild(script);

    // Cleanup function
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [webhookUrl]);
};
