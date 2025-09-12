"use client"
// hooks
import {
  // 很重要面试的时候要讲
  useChat
} from '@ai-sdk/react'
import ChatOutput from '@/components/ChatOutput'
import ChatInput from '@/components/ChatInput'

export default function Home() {
  // chat llm 业务 抽离
  const {
    input, // 输入框的值
    messages, // 消息列表
    status, // 状态
    handleInputChange, // 输入框变化
    handleSubmit, // 提交
  } = useChat();
  return (
    <div className="min-h-screen paw-cursor">
      <main className="max-w-4xl mx-auto p-6">
        {/* 标题区域 */}
        <div className="text-center mb-8">
          <div className="floating">
            <h1 className="text-4xl font-bold text-primary mb-2 breathing-glow">
              🐾 Pet Care Assistant
            </h1>
          </div>
          <p className="text-muted-foreground text-lg font-medium">
            Professional pet care advice for happy and healthy furry friends ✨
          </p>
        </div>

        {/* 聊天区域 */}
        <div className="bg-card/80 backdrop-blur-sm rounded-3xl shadow-lg border border-border/50 overflow-hidden">
          <div className="p-6 space-y-6 min-h-[60vh] max-h-[60vh] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 floating">🐱</div>
                <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                  Hello! I'm your pet care assistant
                </h3>
                <p className="text-muted-foreground">
                  What questions do you have about your furry friend?
                </p>
                <div className="flex justify-center gap-3 mt-6 flex-wrap">
                  <div className="bg-secondary/50 px-4 py-2 rounded-full text-sm font-medium soft-glow">
                    🍽️ Feeding Tips
                  </div>
                  <div className="bg-secondary/50 px-4 py-2 rounded-full text-sm font-medium soft-glow">
                    🏥 Health Care
                  </div>
                  <div className="bg-secondary/50 px-4 py-2 rounded-full text-sm font-medium soft-glow">
                    🎾 Training Tips
                  </div>
                </div>
              </div>
            ) : (
              <ChatOutput messages={messages} status={status} />
            )}
          </div>

          {/* 输入区域 */}
          <div className="border-t border-border/30 p-6 bg-secondary/20">
            <ChatInput
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
            />
          </div>
        </div>

        {/* 底部装饰 */}
        <div className="text-center mt-8 text-muted-foreground text-sm">
          <div className="flex justify-center items-center gap-2">
            <span>Caring for every furry friend with love</span>
            <span className="text-primary">💖</span>
          </div>
        </div>
      </main>
    </div>
  )
}