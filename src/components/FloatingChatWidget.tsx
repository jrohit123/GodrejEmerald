
import { useChatLoader } from '@/hooks/useChatLoader';

const FloatingChatWidget = () => {
  useChatLoader('https://n8n-6421994137235212.kloudbeansite.com/webhook/ffee829f-6076-453e-9e6a-ba27f1c00fad/chat');

  return null; // The n8n chat widget will handle its own rendering
};

export default FloatingChatWidget;
