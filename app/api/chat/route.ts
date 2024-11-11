import { NextResponse } from 'next/server'
import OpenAI from 'openai'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface APIError {
  response?: {
    status?: number
    data?: {
      error?: {
        message?: string
      }
    }
  }
  code?: string
  message?: string
}

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API Key')
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API Key is missing')
      return NextResponse.json(
        { error: 'OpenAI API Key is not configured' },
        { status: 500 }
      )
    }

    if (!req.body) {
      console.error('Request body is missing')
      return NextResponse.json(
        { error: 'Request body is required' },
        { status: 400 }
      )
    }

    const { messages } = await req.json()

    if (!Array.isArray(messages) || messages.length === 0) {
      console.error('Invalid messages format:', messages)
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      )
    }

    const isValidMessage = (msg: unknown): msg is Message => {
      return (
        typeof msg === 'object' &&
        msg !== null &&
        'role' in msg &&
        'content' in msg &&
        (msg.role === 'user' || msg.role === 'assistant') &&
        typeof msg.content === 'string'
      )
    }

    if (!messages.every(isValidMessage)) {
      console.error('Invalid message format in array:', messages)
      return NextResponse.json(
        { error: 'Invalid message format in array' },
        { status: 400 }
      )
    }

    const systemMessage = {
      role: 'system',
      content: `你是一位专业的教育助手，主要面向大学生群体。请遵循以下原则：
      1. 使用清晰、易懂的语言，避免过于晦涩的专业术语
      2. 在解释概念时，多举具体的例子
      3. 适当使用类比来解释复杂概念
      4. 回答要有层次性，先说基础，再深入
      5. 鼓励学生思考和提问
      6. 在合适的时候给出延伸阅读建议
      7. 保持耐心和友好的态度
      8. 如果涉及编程，提供详细的代码注释和解释`
    }

    console.log('Sending request to OpenAI:', [systemMessage, ...messages])
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      max_tokens: 2000,
    })

    if (!completion.choices[0].message?.content) {
      console.error('No response content from OpenAI')
      throw new Error('No response from OpenAI')
    }

    console.log('Received response from OpenAI:', completion.choices[0].message)
    return NextResponse.json({
      message: completion.choices[0].message.content,
    })
  } catch (error: unknown) {
    console.error('OpenAI API error:', error)
    
    const apiError = error as APIError
    
    if (apiError.response) {
      return NextResponse.json(
        { error: `OpenAI API error: ${apiError.response.data?.error?.message || 'Unknown error'}` },
        { status: apiError.response.status || 500 }
      )
    } else if (apiError.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { error: 'Failed to connect to OpenAI API' },
        { status: 503 }
      )
    } else {
      return NextResponse.json(
        { error: apiError.message || 'Internal server error' },
        { status: 500 }
      )
    }
  }
} 