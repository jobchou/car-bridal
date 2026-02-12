'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Car, Zap, ShieldCheck, Gauge } from 'lucide-react';

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
    <div className="flex h-screen flex-col bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white overflow-hidden relative">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl" />

        {/* 科技线条装饰 */}
        <svg className="absolute top-0 left-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-cyan-400" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* 车辆图标装饰 */}
        <div className="absolute top-20 right-20 opacity-20">
          <Car className="w-32 h-32 text-cyan-400 animate-float" />
        </div>
        <div className="absolute bottom-20 left-20 opacity-20">
          <Car className="w-24 h-24 text-purple-400 animate-float" style={{ animationDelay: '2s' }} />
        </div>
      </div>

      {/* 头部 */}
      <header className="relative border-b border-white/10 bg-slate-950/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30">
                  <Car className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 shadow-lg">
                  <div className="h-2 w-2 animate-ping rounded-full bg-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  车圈红娘
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex h-1.5 w-1.5 rounded-full bg-green-500" />
                  <p className="text-sm text-cyan-200/80">AI 助手随时待命</p>
                </div>
              </div>
            </div>

            {/* 功能标签 */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur">
                <Zap className="h-4 w-4 text-yellow-400" />
                <span className="text-xs text-white/80">智能匹配</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur">
                <ShieldCheck className="h-4 w-4 text-green-400" />
                <span className="text-xs text-white/80">专业认证</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur">
                <Gauge className="h-4 w-4 text-purple-400" />
                <span className="text-xs text-white/80">实时响应</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 消息列表 */}
      <div className="relative flex-1 overflow-y-auto p-6">
        <div className="container mx-auto max-w-4xl space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-4 ${
                message.role === 'user' ? 'flex-row-reverse' : ''
              } animate-slideIn`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/30'
                    : 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30'
                }`}
              >
                {message.role === 'user' ? (
                  <User className="h-5 w-5 text-white" />
                ) : (
                  <Car className="h-5 w-5 text-white" />
                )}
              </div>
              <div
                className={`max-w-[75%] rounded-2xl px-5 py-4 shadow-2xl backdrop-blur ${
                  message.role === 'user'
                    ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white border border-white/20'
                    : 'bg-slate-900/80 text-cyan-50 border border-cyan-500/30'
                }`}
              >
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 animate-slideIn">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30">
                <Car className="h-5 w-5 text-white" />
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-slate-900/80 px-5 py-4 border border-cyan-500/30 backdrop-blur shadow-2xl">
                <div className="flex gap-1">
                  <div className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce" />
                  <div className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
                <span className="text-sm text-cyan-200/80">智能分析中...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 输入框 */}
      <div className="relative border-t border-white/10 bg-slate-950/50 backdrop-blur-xl">
        <div className="container mx-auto max-w-4xl p-6">
          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl opacity-30 blur group-hover:opacity-60 transition-opacity duration-300" />
            <div className="relative flex items-center gap-3 bg-slate-900 rounded-2xl p-2 border border-white/10">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="输入您的问题，车圈红娘为您解答..."
                disabled={isLoading}
                className="flex-1 bg-transparent px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 transition-all duration-300 hover:scale-110 hover:shadow-cyan-500/50 disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </div>
          </form>
          <div className="mt-3 flex items-center justify-center gap-6 text-xs text-white/40">
            <span>Powered by AI</span>
            <span>•</span>
            <span>实时智能分析</span>
            <span>•</span>
            <span>专业汽车顾问</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
