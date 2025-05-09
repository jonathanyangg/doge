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
    // Get agencies to verify the slug
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
    
    // Get historical changes
    // We need to set a valid date range - let's use the last 12 months
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 1);
    
    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0];
    };
    
    const params = new URLSearchParams({
      'agency_slugs[]': agency.slug,
      'last_modified_after': formatDate(startDate),
      'last_modified_before': formatDate(endDate),
    });
    
    const changesResponse = await fetch(`https://www.ecfr.gov/api/search/v1/counts/daily?${params}`);
    
    if (!changesResponse.ok) {
      throw new Error(`Error fetching changes: ${changesResponse.statusText}`);
    }
    
    const changesData = await changesResponse.json();
    
    return NextResponse.json({
      agency: agency.name,
      slug: agency.slug,
      period: {
        start: formatDate(startDate),
        end: formatDate(endDate),
      },
      changes: changesData,
    });
  } catch (error) {
    console.error('Failed to fetch changes data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch changes data' },
      { status: 500 }
    );
  }
}
