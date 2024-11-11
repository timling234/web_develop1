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

    console.log('Sending request to OpenAI:', messages)
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
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