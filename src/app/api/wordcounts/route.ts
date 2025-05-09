import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const agencySlug = searchParams.get('agency');
  
  if (!agencySlug) {
    return NextResponse.json(
      { error: 'Agency parameter is required' },
      { status: 400 }
    );
  }
  
  try {
    // Get agencies
    const agenciesResponse = await fetch('https://www.ecfr.gov/api/admin/v1/agencies.json');
    
    if (!agenciesResponse.ok) {
      throw new Error(`Error fetching agencies: ${agenciesResponse.statusText}`);
    }
    
    const agencies = await agenciesResponse.json();
    
    // Find the agency
    const agency = agencies.find((a: any) => 
      a.slug === agencySlug || a.name.toLowerCase().includes(agencySlug.toLowerCase())
    );
    
    if (!agency) {
      return NextResponse.json(
        { error: `Agency not found: ${agencySlug}` },
        { status: 404 }
      );
    }
    
    // Get titles
    const titlesResponse = await fetch('https://www.ecfr.gov/api/versioner/v1/titles.json');
    
    if (!titlesResponse.ok) {
      throw new Error(`Error fetching titles: ${titlesResponse.statusText}`);
    }
    
    const titles = await titlesResponse.json();
    
    // For the MVP, we'll return placeholder data
    // In a real implementation, we would need to fetch the content for each title
    // and calculate the word count
    
    return NextResponse.json({
      agency: agency.name,
      slug: agency.slug,
      totalWordCount: 0, // Placeholder
      titleCounts: titles
        .filter((title: any) => 
          title.agencies && title.agencies.some((a: any) => a.slug === agency.slug)
        )
        .map((title: any) => ({
          title: title.number,
          name: title.name,
          wordCount: Math.floor(Math.random() * 100000), // Random placeholder data
        })),
    });
  } catch (error) {
    console.error('Failed to fetch word count data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch word count data' },
      { status: 500 }
    );
  }
}
