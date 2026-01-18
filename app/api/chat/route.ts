import { NextRequest, NextResponse } from 'next/server';
import { ChatRequest, Message, ModelType } from '@/types';
import { getModelConfig } from '@/lib/modelConfigs';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

// 处理POST请求
export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { messages, model, temperature, maxTokens, apiKey } = body;

    // 验证参数
    if (!messages || !model) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 获取模型配置
    const modelConfig = getModelConfig(model);
    if (!modelConfig) {
      // 没有模型配置时返回写死的内容
      const fixedResponse = `你好！我是一个默认的聊天机器人。你刚才问的是："${messages[messages.length - 1].content}"。

这是我的默认回复内容：
- 我可以回答各种问题
- 我支持多轮对话
- 我会尽力帮助你解决问题

如果你有其他问题，请随时提问！`;

      // 创建流式响应
      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          
          // 模拟流式输出
          const words = fixedResponse.split(' ');
          for (const word of words) {
            controller.enqueue(encoder.encode(word + ' '));
            await new Promise(resolve => setTimeout(resolve, 50)); // 模拟延迟
          }
          
          controller.close();
        }
      });

      return new NextResponse(stream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Transfer-Encoding': 'chunked'
        }
      });
    }

    // 根据不同提供商处理请求
    switch (modelConfig.provider) {
      case 'openai':
        return handleOpenAIChat(body);
      case 'anthropic':
        return handleAnthropicChat(body);
      case 'deepseek':
        return handleDeepSeekChat(body);
      case 'google':
        return handleGoogleChat(body);
      default:
        return NextResponse.json(
          { error: '不支持的提供商' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('API错误:', error);
    return NextResponse.json(
      { error: error.message || '服务器内部错误' },
      { status: 500 }
    );
  }
}

// 处理OpenAI请求
async function handleOpenAIChat(request: ChatRequest) {
  const { messages, model, temperature, maxTokens, apiKey } = request;

  // 验证API密钥
  const openaiApiKey = apiKey || process.env.OPENAI_API_KEY;
  if (!openaiApiKey) {
    return NextResponse.json(
      { error: '请提供OpenAI API密钥' },
      { status: 401 }
    );
  }

  try {
    const openai = new OpenAI({ apiKey: openaiApiKey });

    // 调用OpenAI API
    const response = await openai.chat.completions.create({
      model,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature,
      max_tokens: maxTokens || 4000,
      stream: true,
    });

    // 创建流式响应
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        try {
          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
        } catch (error) {
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error: any) {
    console.error('OpenAI错误:', error);
    return NextResponse.json(
      { error: error.message || 'OpenAI API调用失败' },
      { status: error.status || 500 }
    );
  }
}

// 处理Anthropic请求
async function handleAnthropicChat(request: ChatRequest) {
  const { messages, model, temperature, maxTokens, apiKey } = request;

  // 验证API密钥
  const anthropicApiKey = apiKey || process.env.ANTHROPIC_API_KEY;
  if (!anthropicApiKey) {
    return NextResponse.json(
      { error: '请提供Anthropic API密钥' },
      { status: 401 }
    );
  }

  try {
    const anthropic = new Anthropic({
      apiKey: anthropicApiKey,
    });

    // 调用Anthropic API
    // 将系统消息分离出来，作为单独的system参数传递
    const userAssistantMessages = messages
      .filter(msg => msg.role === 'user' || msg.role === 'assistant')
      .map(msg => ({ role: msg.role as 'user' | 'assistant', content: msg.content }));
    const systemContent = messages.find(msg => msg.role === 'system')?.content;

    const response = await anthropic.messages.create({
      model,
      messages: userAssistantMessages,
      system: systemContent,
      temperature,
      max_tokens: maxTokens || 4000,
      stream: true,
    });

    // 创建流式响应
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        try {
          for await (const chunk of response) {
            if (chunk.type === 'content_block_delta') {
              let content = '';
              if ('text' in chunk.delta) {
                content = chunk.delta.text || '';
              } else if ('json' in chunk.delta) {
                content = JSON.stringify(chunk.delta.json) || '';
              }
              if (content) {
                controller.enqueue(encoder.encode(content));
              }
            }
          }
        } catch (error) {
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error: any) {
    console.error('Anthropic错误:', error);
    return NextResponse.json(
      { error: error.message || 'Anthropic API调用失败' },
      { status: error.status || 500 }
    );
  }
}

// 处理DeepSeek请求
async function handleDeepSeekChat(request: ChatRequest) {
  const { messages, model, temperature, maxTokens, apiKey } = request;

  // 验证API密钥
  const deepseekApiKey = apiKey || process.env.DEEPSEEK_API_KEY;
  if (!deepseekApiKey) {
    return NextResponse.json(
      { error: '请提供DeepSeek API密钥' },
      { status: 401 }
    );
  }

  try {
    // 使用OpenAI SDK调用DeepSeek API（兼容OpenAI格式）
    const openai = new OpenAI({
      apiKey: deepseekApiKey,
      baseURL: 'https://api.deepseek.com/v1',
    });

    // 调用DeepSeek API
    const response = await openai.chat.completions.create({
      model,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature,
      max_tokens: maxTokens || 4000,
      stream: true,
    });

    // 创建流式响应
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        try {
          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
        } catch (error) {
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error: any) {
    console.error('DeepSeek错误:', error);
    return NextResponse.json(
      { error: error.message || 'DeepSeek API调用失败' },
      { status: error.status || 500 }
    );
  }
}

// 处理Google请求
async function handleGoogleChat(request: ChatRequest) {
  const { messages, model, temperature, maxTokens, apiKey } = request;

  // 验证API密钥
  const googleApiKey = apiKey || process.env.GOOGLE_API_KEY;
  if (!googleApiKey) {
    return NextResponse.json(
      { error: '请提供Google API密钥' },
      { status: 401 }
    );
  }

  try {
    const genAI = new GoogleGenerativeAI(googleApiKey);
    const geminiModel = genAI.getGenerativeModel({ model });

    // 调用Google API
    const chatSession = geminiModel.startChat({
      history: messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      })),
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens || 4000,
      },
    });

    const result = await chatSession.sendMessageStream('');

    // 创建流式响应
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        try {
          for await (const chunk of result.stream) {
            const content = chunk.text();
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
        } catch (error) {
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error: any) {
    console.error('Google错误:', error);
    return NextResponse.json(
      { error: error.message || 'Google API调用失败' },
      { status: error.status || 500 }
    );
  }
}