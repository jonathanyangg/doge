import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://www.ecfr.gov/api/admin/v1/agencies.json');
    
    if (!response.ok) {
      throw new Error(`Error fetching agencies: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to fetch agencies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agencies' },
      { status: 500 }
    );
  }
} 