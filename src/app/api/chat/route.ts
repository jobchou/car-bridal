import { NextRequest } from 'next/server';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// 从环境变量中获取配置
const COZE_API_URL = process.env.COZE_API_URL || 'https://26gpw6v7pz.coze.site/stream_run';
const COZE_API_TOKEN = process.env.COZE_API_TOKEN;
const COZE_PROJECT_ID = process.env.COZE_PROJECT_ID || '7601039291392753716';

export async function POST(request: NextRequest) {
  try {
    const { messages, session_id } = await request.json();

    if (!COZE_API_TOKEN) {
      return new Response(
        JSON.stringify({ error: 'COZE_API_TOKEN is not configured' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 获取最后一条用户消息
    const lastUserMessage = messages.filter((m: Message) => m.role === 'user').pop();
    if (!lastUserMessage) {
      return new Response(
        JSON.stringify({ error: 'No user message found' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 生成或使用现有的 session_id
    const sessionId = session_id || generateSessionId();

    // 准备请求体
    const requestBody = {
      content: {
        query: {
          prompt: [
            {
              type: 'text',
              content: {
                text: lastUserMessage.content,
              },
            },
          ],
        },
      },
      type: 'query',
      session_id: sessionId,
      project_id: parseInt(COZE_PROJECT_ID, 10),
    };

    // 调用扣子 API
    const response = await fetch(COZE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COZE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Coze API error:', errorText);
      return new Response(
        JSON.stringify({
          error: 'Failed to call Coze API',
          status: response.status,
          details: errorText,
        }),
        {
          status: response.status,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 处理流式响应
    const encoder = new TextEncoder();
    let controllerClosed = false;
    let returnedSessionId = sessionId; // 默认使用传入的 session_id

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const reader = response.body?.getReader();
          const decoder = new TextDecoder();

          if (!reader) {
            throw new Error('No response body');
          }

          let buffer = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.trim() && !controllerClosed) {
                // 处理 SSE 格式：event: message
                if (line.startsWith('event: ')) {
                  continue;
                }

                // 处理 SSE 格式：data: {...}
                if (line.startsWith('data: ')) {
                  try {
                    const data = JSON.parse(line.slice(6));

                    // 更新 session_id（如果响应中包含）
                    if (data.session_id && data.session_id !== returnedSessionId) {
                      returnedSessionId = data.session_id;
                    }

                    // 从响应中提取内容
                    const content = data.content?.answer;

                    if (content && !controllerClosed) {
                      try {
                        controller.enqueue(
                          encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
                        );
                      } catch (e) {
                        controllerClosed = true;
                        break;
                      }
                    }
                  } catch (e) {
                    // 忽略解析错误
                  }
                }
              }
            }
          }

          if (!controllerClosed) {
            try {
              controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              controller.close();
            } catch (e) {
              // Controller already closed
            }
          }
        } catch (error) {
          console.error('Stream error:', error);
          if (!controllerClosed) {
            try {
              controller.error(error);
            } catch (e) {
              // Controller already closed
            }
          }
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Session-ID': returnedSessionId,
      },
    });
  } catch (error) {
    console.error('API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// 生成随机的 session_id
function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
}
