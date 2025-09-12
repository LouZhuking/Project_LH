"use client"
import type {
  Message
} from 'ai';
import ReactMarkdown from 'react-markdown';

interface ChatOutputProps {
  messages: Message[];
  status: string;
}

export default function ChatOutput({
  messages,
  status
}: ChatOutputProps) {
  return (
    <>
      {
        messages.map((message, index) => {
          return message.role === "user" ? (
            <UserChat key={index} content={message.content} />
          ) : (
            <AssistantChat key={index} content={message.content} />
          )
        })
      }
      {
        status === "submitted" && (
          <div className='flex justify-start mb-6'>
            <div className='bg-secondary/50 backdrop-blur-sm rounded-3xl px-6 py-4 shadow-md border border-border/30 soft-glow'>
              <div className="flex items-center gap-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className='text-muted-foreground font-medium'>Pet assistant is thinking...</span>
              </div>
            </div>
          </div>
        )
      }
      {
        status === "error" && (
          <div className='flex justify-start mb-6'>
            <div className='bg-destructive/10 border border-destructive/20 rounded-3xl px-6 py-4 shadow-md'>
              <div className="flex items-center gap-2">
                <span className="text-lg">⚠️</span>
                <span className='text-destructive font-medium'>Sorry, something went wrong. Please try again later</span>
              </div>
            </div>
          </div>
        )
      }
    </>
  )
}

const UserChat = ({ content }: { content: string }) => {
  return (
    <div className='flex justify-end mb-6'>
      <div className='bg-primary text-primary-foreground rounded-3xl px-6 py-4 max-w-[80%] shadow-lg breathing-glow font-medium'>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm opacity-90">🙋‍♀️ You</span>
        </div>
        {content}
      </div>
    </div>
  )
}

const AssistantChat = ({ content }: { content: string }) => {
  return (
    <div className='flex justify-start mb-6'>
      <div className='bg-secondary/70 backdrop-blur-sm rounded-3xl px-6 py-4 max-w-[85%] shadow-md border border-border/30 soft-glow'>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🐾</span>
          <span className="text-sm font-semibold text-primary">Pet Assistant</span>
        </div>
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown
            components={{
              a: ({ href, children }) => (
                <a
                  target='_blank'
                  href={href}
                  className="text-primary hover:text-coral-orange underline font-medium"
                >
                  {children}
                </a>
              ),
              p: ({ children }) => (
                <p className="mb-3 leading-relaxed text-foreground">{children}</p>
              ),
              strong: ({ children }) => (
                <strong className="text-primary font-bold">{children}</strong>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside mb-3 space-y-1 text-foreground">{children}</ul>
              ),
              li: ({ children }) => (
                <li className="leading-relaxed">{children}</li>
              )
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}