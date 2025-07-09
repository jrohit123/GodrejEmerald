
import { useChatLoader } from '@/hooks/useChatLoader';

const FloatingChatWidget = () => {
  useChatLoader('https://n8n-6421994137235212.kloudbeansite.com/webhook/e5900d67-79e6-4e4e-bb9a-1ac95774f84b/chat');

  return null; // The n8n chat widget will handle its own rendering
};

export default FloatingChatWidget;
