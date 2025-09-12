"use client"
interface ChatInputProps {
  input: string;
  handleInputChange: (e: any) => void;
  handleSubmit: (e: any) => void;
}
import {
  Input
} from '@/components/ui/input'
import {
  Button
} from '@/components/ui/button'
import {
  ArrowUp
} from 'lucide-react'
// const ChatInput: React.FC<ChatInputProps> = ({})
export default function ChatInput({
  input,
  handleInputChange,
  handleSubmit
}: ChatInputProps) {
  return (
    <form onSubmit={handleSubmit} className="flex gap-4 items-end">
      <div className="flex-1">
        <Input
          onChange={handleInputChange}
          value={input}
          placeholder="Ask me anything about your pet! 🐾"
          className="bg-background/80 border-border/50 rounded-2xl px-6 py-4 text-base font-medium placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 shadow-sm"
        />
      </div>
      <Button
        type="submit"
        disabled={!input.trim()}
        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl px-6 py-4 h-auto font-semibold shadow-lg breathing-glow disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        <ArrowUp className="w-5 h-5" />
        <span className='sr-only'>Send message</span>
      </Button>
    </form>
  )
}