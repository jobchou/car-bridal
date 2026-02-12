import { NextRequest } from 'next/server';
import { LLMClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    // 提取并转发请求头
    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);

    // 创建客户端配置
    const config = new Config();
    const client = new LLMClient(config, customHeaders);

    // 设置流式响应头
    const encoder = new TextEncoder();
    let controllerClosed = false;

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const responseStream = client.stream(
            messages as Message[],
            {
              temperature: 0.7,
              streaming: true,
            }
          );

          for await (const chunk of responseStream) {
            if (chunk.content && !controllerClosed) {
              const content = chunk.content.toString();
              const data = JSON.stringify({ content });
              try {
                controller.enqueue(encoder.encode(`data: ${data}\n\n`));
              } catch (e) {
                // Controller already closed, ignore
                controllerClosed = true;
                break;
              }
            }
          }

          if (!controllerClosed) {
            try {
              controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              controller.close();
            } catch (e) {
              // Controller already closed, ignore
            }
          }
        } catch (error) {
          console.error('Stream error:', error);
          if (!controllerClosed) {
            try {
              controller.error(error);
            } catch (e) {
              // Controller already closed, ignore
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
