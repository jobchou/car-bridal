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
    <div className="flex h-screen flex-col" style={{ backgroundColor: '#f5f3f0' }}>
      {/* 头部 - 莫兰迪风格 */}
      <header className="flex-none border-b" style={{ borderColor: '#e8e4df', backgroundColor: '#f9f7f4' }}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo 和标题 */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ backgroundColor: '#9ab8c4' }}
                >
                  <Car className="h-6 w-6" style={{ color: '#ffffff' }} />
                </div>
                <div
                  className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2"
                  style={{ backgroundColor: '#a8c4a0', borderColor: '#f9f7f4' }}
                />
              </div>
              <div>
                <h1
                  className="text-xl font-semibold tracking-wide"
                  style={{ color: '#4a5a6a' }}
                >
                  车圈红娘
                </h1>
                <p className="text-xs mt-0.5" style={{ color: '#9aa8a8' }}>
                  智能汽车顾问
                </p>
              </div>
            </div>

            {/* 状态指示器 */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4" style={{ color: '#a8c4a0' }} />
                <span className="text-xs" style={{ color: '#9aa8a8' }}>
                  在线
                </span>
              </div>
              <div className="hidden md:flex items-center gap-4 text-xs" style={{ color: '#9aa8a8' }}>
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                  style={{ backgroundColor: '#e8e4df' }}
                >
                  <Settings className="h-3.5 w-3.5" style={{ color: '#7a8a9a' }} />
                  <span>智能推荐</span>
                </div>
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                  style={{ backgroundColor: '#e8e4df' }}
                >
                  <HelpCircle className="h-3.5 w-3.5" style={{ color: '#7a8a9a' }} />
                  <span>专业解答</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 消息列表区域 */}
      <div className="flex-1 overflow-y-auto" style={{ backgroundColor: '#f5f3f0' }}>
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
                      ? ''
                      : ''
                  }`}
                  style={{
                    backgroundColor: message.role === 'user' ? '#d4c4b0' : '#9ab8c4',
                  }}
                >
                  {message.role === 'user' ? (
                    <User className="h-5 w-5" style={{ color: '#6a5a4a' }} />
                  ) : (
                    <Car className="h-5 w-5" style={{ color: '#ffffff' }} />
                  )}
                </div>

                {/* 消息内容 */}
                <div
                  className={`flex-none max-w-[70%] rounded-2xl px-5 py-4 shadow-sm`}
                  style={{
                    backgroundColor: message.role === 'user' ? '#e8e4df' : '#ffffff',
                    color: '#4a5a6a',
                  }}
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
                <div
                  className="flex-none flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: '#9ab8c4' }}
                >
                  <Car className="h-5 w-5" style={{ color: '#ffffff' }} />
                </div>
                <div
                  className="flex-none rounded-2xl px-5 py-4 shadow-sm"
                  style={{ backgroundColor: '#ffffff', color: '#4a5a6a' }}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div
                        className="h-2 w-2 rounded-full animate-bounce"
                        style={{ backgroundColor: '#9ab8c4' }}
                      />
                      <div
                        className="h-2 w-2 rounded-full animate-bounce"
                        style={{ backgroundColor: '#9ab8c4', animationDelay: '0.15s' }}
                      />
                      <div
                        className="h-2 w-2 rounded-full animate-bounce"
                        style={{ backgroundColor: '#9ab8c4', animationDelay: '0.3s' }}
                      />
                    </div>
                    <span className="text-sm ml-2" style={{ color: '#9aa8a8' }}>
                      思考中...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* 输入区域 - 莫兰迪风格 */}
      <div
        className="flex-none border-t"
        style={{ borderColor: '#e8e4df', backgroundColor: '#f9f7f4' }}
      >
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
                className="w-full h-12 px-5 pr-12 text-sm rounded-xl border focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: '#ffffff',
                  color: '#4a5a6a',
                  borderColor: '#e0dcd7',
                }}
              />
              {input.trim() && !isLoading && (
                <button
                  type="button"
                  onClick={() => setInput('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#9aa8a8' }}
                >
                  ×
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex-none h-12 w-12 flex items-center justify-center rounded-xl text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: '#9ab8c4',
              }}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </form>
          <div className="mt-4 flex items-center justify-center gap-4 text-xs" style={{ color: '#9aa8a8' }}>
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
