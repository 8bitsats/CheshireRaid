import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Mic, Volume2 } from 'lucide-react';
import { generateChatResponse } from '@/lib/openai';
import { synthesizeSpeech, playAudio } from '@/lib/eleven';
import cheshireCharacter from '../../../cheshire.character.json';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await generateChatResponse(input, {
        character: cheshireCharacter
      });

      const assistantMessage = {
        role: 'assistant' as const,
        content: response
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Generate and play speech
      const audioBuffer = await synthesizeSpeech(response);
      if (audioBuffer) {
        setIsSpeaking(true);
        await playAudio(audioBuffer);
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px]">
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 p-3 rounded-lg ${
              message.role === 'user'
                ? 'bg-purple-500/20 ml-auto max-w-[80%]'
                : 'bg-green-500/20 mr-auto max-w-[80%]'
            }`}
          >
            <p className="text-sm">{message.content}</p>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2 text-purple-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Thinking...</span>
          </div>
        )}
      </ScrollArea>

      <form onSubmit={handleSubmit} className="flex items-center space-x-2 p-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          className="flex-1 bg-black/50 border-purple-500/50"
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-purple-500 hover:bg-purple-600"
        >
          Send
        </Button>
        {isSpeaking && (
          <Volume2 className="h-6 w-6 text-green-400 animate-pulse" />
        )}
      </form>
    </div>
  );
}
