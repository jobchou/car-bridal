'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Car, Settings, HelpCircle, Activity } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '你好！我是车圈红娘，很高兴为你服务。有什么我可以帮助你的吗？',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // 添加用户消息
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }],
          session_id: sessionId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      // 从响应头中获取 session_id
      const newSessionId = response.headers.get('X-Session-ID');
      if (newSessionId && newSessionId !== sessionId) {
        setSessionId(newSessionId);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';

      if (reader) {
        // 添加空的助手消息，用于流式更新
        setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  assistantMessage += parsed.content;
                  // 实时更新最后一条消息
                  setMessages((prev) => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = {
                      role: 'assistant',
                      content: assistantMessage,
                    };
                    return newMessages;
                  });
                }
              } catch (e) {
                // 忽略解析错误
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `抱歉，发生了错误：${error instanceof Error ? error.message : '请稍后重试'}`,
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex h-screen flex-col bg-black text-white font-sans">
      {/* 头部 - 车机风格 */}
      <header className="flex-none border-b border-neutral-800 bg-neutral-900/95 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo 和标题 */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-600">
                  <Car className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-neutral-900" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white tracking-wide">
                  车圈红娘
                </h1>
                <p className="text-xs text-neutral-400 mt-0.5">智能汽车顾问</p>
              </div>
            </div>

            {/* 状态指示器 */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-500" />
                <span className="text-xs text-neutral-400">在线</span>
              </div>
              <div className="hidden md:flex items-center gap-4 text-xs text-neutral-500">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800">
                  <Settings className="h-3.5 w-3.5" />
                  <span>智能推荐</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800">
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>专业解答</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 消息列表区域 */}
      <div className="flex-1 overflow-y-auto bg-neutral-950">
        <div className="container mx-auto max-w-5xl px-6 py-8">
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-4 ${
                  message.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                {/* 头像 */}
                <div
                  className={`flex-none flex h-10 w-10 items-center justify-center rounded-lg ${
                    message.role === 'user'
                      ? 'bg-neutral-800'
                      : 'bg-orange-600'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="h-5 w-5 text-neutral-400" />
                  ) : (
                    <Car className="h-5 w-5 text-white" />
                  )}
                </div>

                {/* 消息内容 */}
                <div
                  className={`flex-none max-w-[70%] rounded-2xl px-5 py-4 ${
                    message.role === 'user'
                      ? 'bg-neutral-800 text-neutral-100'
                      : 'bg-neutral-900 text-neutral-100'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              </div>
            ))}

            {/* 加载状态 */}
            {isLoading && (
              <div className="flex gap-4">
                <div className="flex-none flex h-10 w-10 items-center justify-center rounded-lg bg-orange-600">
                  <Car className="h-5 w-5 text-white" />
                </div>
                <div className="flex-none rounded-2xl bg-neutral-900 px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 rounded-full bg-orange-500 animate-bounce" />
                      <div className="h-2 w-2 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '0.15s' }} />
                      <div className="h-2 w-2 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '0.3s' }} />
                    </div>
                    <span className="text-sm text-neutral-400 ml-2">思考中...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* 输入区域 - 车机风格 */}
      <div className="flex-none border-t border-neutral-800 bg-neutral-900/95 backdrop-blur-sm">
        <div className="container mx-auto max-w-5xl px-6 py-5">
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="输入您的问题..."
                disabled={isLoading}
                className="w-full h-12 px-5 pr-12 text-sm text-white placeholder-neutral-500 bg-neutral-800 rounded-xl border border-neutral-700 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {input.trim() && !isLoading && (
                <button
                  type="button"
                  onClick={() => setInput('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  ×
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex-none h-12 w-12 flex items-center justify-center rounded-xl bg-orange-600 text-white hover:bg-orange-500 active:bg-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-orange-600"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </form>
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-neutral-500">
            <span>AI 驱动</span>
            <span>•</span>
            <span>实时响应</span>
            <span>•</span>
            <span>智能分析</span>
          </div>
        </div>
      </div>
    </div>
  );
}
