
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

const FloatingChatWidget = () => {
  const handleOpenChat = () => {
    window.open('https://automations.aitamate.com/webhook/ffee829f-6076-453e-9e6a-ba27f1c00fad/chat', '_blank', 'width=400,height=600,scrollbars=yes,resizable=yes');
  };

  return (
    <Button
      onClick={handleOpenChat}
      className="fixed bottom-4 right-4 z-50 rounded-full w-16 h-16 shadow-lg hover:shadow-xl transition-all duration-300"
      size="icon"
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  );
};

export default FloatingChatWidget;
