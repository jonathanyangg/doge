import { NextRequest, NextResponse } from 'next/server';

// Define a type for Agency
interface Agency {
  slug: string;
  name: string;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const agencySlug = searchParams.get('agency');
  const title = searchParams.get('title');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  
  // Handle title changes search
  if (title) {
    try {
      // Construct the API URL for title changes
      let apiUrl = `https://www.ecfr.gov/api/versioner/v1/versions/title-${title}.json`;
      
      // Add date parameters if provided
      const params = new URLSearchParams();
      
      if (startDate) {
        params.append('issue_date[gte]', startDate);
      }
      
      if (endDate) {
        params.append('issue_date[lte]', endDate);
      }
      
      if (params.toString()) {
        apiUrl += `?${params.toString()}`;
      }
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        // Handle specific error responses
        if (response.status === 400) {
          const errorData = await response.json();
          return NextResponse.json(
            { error: errorData.error || 'Invalid request parameters' },
            { status: 400 }
          );
        }
        
        if (response.status === 503) {
          return NextResponse.json(
            { error: 'This title is currently unavailable. Please try again later.' },
            { status: 503 }
          );
        }
        
        throw new Error(`Error fetching title changes: ${response.statusText}`);
      }
      
      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      console.error('Failed to fetch title changes:', error);
      return NextResponse.json(
        { error: 'Failed to fetch title changes' },
        { status: 500 }
      );
    }
  }
  
  // Handle agency changes search (original functionality)
  if (!agencySlug) {
    return NextResponse.json(
      { error: 'Either agency or title parameter is required' },
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
    const agency = agencies.find((a: Agency) => 
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
    const formattedEndDate = endDate || new Date().toISOString().split('T')[0];
    let formattedStartDate;
    
    if (startDate) {
      formattedStartDate = startDate;
    } else {
      const startDateObj = new Date();
      startDateObj.setFullYear(startDateObj.getFullYear() - 1);
      formattedStartDate = startDateObj.toISOString().split('T')[0];
    }
    
    const params = new URLSearchParams({
      'agency_slugs[]': agency.slug,
      'last_modified_after': formattedStartDate,
      'last_modified_before': formattedEndDate,
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
        start: formattedStartDate,
        end: formattedEndDate,
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
