'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Car, Settings, HelpCircle, Activity, Zap, Shield, Gauge, Navigation, Battery } from 'lucide-react';

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
    <div className="flex h-screen flex-col bg-slate-950 text-white font-sans overflow-hidden relative">
      {/* 动态背景 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* 速度线效果 */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse" />
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-2/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse" style={{ animationDelay: '1.5s' }} />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* 汽车光晕效果 */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-3xl" />

        {/* 科技网格 */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="techGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-cyan-500" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#techGrid)" />
        </svg>
      </div>

      {/* 头部 - 科技车机风格 */}
      <header className="relative z-10 flex-none border-b border-cyan-900/30 bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            {/* Logo 和标题 */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/40 border border-cyan-400/30">
                  <Car className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 shadow-lg shadow-green-500/50 border-2 border-slate-950">
                  <div className="h-2 w-2 animate-ping rounded-full bg-white" />
                  <div className="absolute h-2 w-2 rounded-full bg-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent tracking-wide">
                  车圈红娘
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
                  <p className="text-xs text-cyan-400/80">智能汽车顾问系统</p>
                </div>
              </div>
            </div>

            {/* 汽车状态指示器 */}
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-950/50 border border-cyan-500/30 backdrop-blur">
                <Zap className="h-4 w-4 text-yellow-400" />
                <span className="text-xs text-cyan-300">智能推荐</span>
              </div>
              <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-950/50 border border-blue-500/30 backdrop-blur">
                <Shield className="h-4 w-4 text-green-400" />
                <span className="text-xs text-blue-300">专业认证</span>
              </div>
              <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-950/50 border border-purple-500/30 backdrop-blur">
                <Gauge className="h-4 w-4 text-purple-400" />
                <span className="text-xs text-purple-300">实时响应</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/50 border border-slate-700/50 backdrop-blur">
                <Activity className="h-4 w-4 text-green-500" />
                <span className="text-xs text-green-400">在线</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 消息列表区域 */}
      <div className="relative z-10 flex-1 overflow-y-auto">
        <div className="container mx-auto max-w-5xl px-6 py-8">
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-4 animate-fadeIn ${
                  message.role === 'user' ? 'flex-row-reverse' : ''
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* 头像 */}
                <div
                  className={`flex-none flex h-11 w-11 items-center justify-center rounded-xl shadow-lg ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-purple-600 to-pink-600 border border-purple-400/30 shadow-purple-500/30'
                      : 'bg-gradient-to-br from-cyan-500 to-blue-600 border border-cyan-400/30 shadow-cyan-500/30'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="h-5 w-5 text-white" />
                  ) : (
                    <Car className="h-5 w-5 text-white" />
                  )}
                </div>

                {/* 消息内容 */}
                <div
                  className={`flex-none max-w-[70%] rounded-2xl px-6 py-4 shadow-2xl backdrop-blur-sm border ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-purple-600/90 to-pink-600/90 border-purple-400/30 text-white'
                      : 'bg-slate-900/90 border-cyan-500/30 text-cyan-50'
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
              <div className="flex gap-4 animate-fadeIn">
                <div className="flex-none flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 border border-cyan-400/30 shadow-lg shadow-cyan-500/30">
                  <Car className="h-5 w-5 text-white" />
                </div>
                <div className="flex-none rounded-2xl px-6 py-4 shadow-2xl backdrop-blur-sm border border-cyan-500/30 bg-slate-900/90">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-cyan-500 animate-bounce" />
                      <div className="h-2 w-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '0.15s' }} />
                      <div className="h-2 w-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '0.3s' }} />
                    </div>
                    <span className="text-sm text-cyan-400 ml-2">智能分析中...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* 输入区域 - 科技车机风格 */}
      <div className="relative z-10 flex-none border-t border-cyan-900/30 bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto max-w-5xl px-6 py-6">
          <form onSubmit={handleSubmit} className="relative group">
            {/* 发光边框效果 */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl opacity-30 blur group-hover:opacity-50 transition-opacity duration-300" />
            <div className="relative flex items-center gap-3 bg-slate-900 rounded-2xl p-2 border border-cyan-500/30">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="输入您的问题，车圈红娘为您智能分析..."
                  disabled={isLoading}
                  className="w-full h-12 px-5 pr-12 text-sm text-white placeholder-cyan-600 bg-transparent focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {input.trim() && !isLoading && (
                  <button
                    type="button"
                    onClick={() => setInput('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-600 hover:text-cyan-400 transition-colors"
                  >
                    ×
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="flex-none h-12 w-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:scale-110 hover:shadow-cyan-500/50 disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </div>
          </form>

          {/* 底部状态栏 */}
          <div className="mt-4 flex items-center justify-center gap-6 text-xs">
            <div className="flex items-center gap-2 text-cyan-600">
              <Navigation className="h-3.5 w-3.5" />
              <span>AI 驱动</span>
            </div>
            <span className="text-cyan-800">•</span>
            <div className="flex items-center gap-2 text-cyan-600">
              <Battery className="h-3.5 w-3.5" />
              <span>实时响应</span>
            </div>
            <span className="text-cyan-800">•</span>
            <div className="flex items-center gap-2 text-cyan-600">
              <Zap className="h-3.5 w-3.5" />
              <span>智能分析</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
