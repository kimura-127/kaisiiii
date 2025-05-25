import { NextRequest, NextResponse } from 'next/server';
import { TavilyClient } from '@/lib/tavily';

export async function POST(request: NextRequest) {
  try {
    const { searchTerm } = await request.json();

    if (!searchTerm) {
      return NextResponse.json({ error: 'Search term is required' }, { status: 400 });
    }

    const apiKey = process.env.TAVILY_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Tavily API key is not configured' }, { status: 500 });
    }

    const client = new TavilyClient(apiKey);
    const results = await client.searchVGProducts(searchTerm);

    return NextResponse.json({ 
      success: true, 
      data: results,
      searchTerm 
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to search products',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}