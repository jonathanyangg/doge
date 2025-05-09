// API service for eCFR data

const BASE_URL = 'https://www.ecfr.gov';

/**
 * Fetch list of all agencies
 */
export async function fetchAgencies() {
  try {
    const response = await fetch(`${BASE_URL}/api/admin/v1/agencies.json`);
    
    if (!response.ok) {
      throw new Error(`Error fetching agencies: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch agencies:', error);
    throw error;
  }
}

/**
 * Fetch word count data for an agency
 * This is a placeholder - we'll implement the actual calculation later
 */
export async function fetchWordCountByAgency(agencySlug: string) {
  try {
    // First, we need to get all titles for this agency
    const agencies = await fetchAgencies();
    const agency = agencies.find((a: any) => 
      a.slug === agencySlug || a.name.toLowerCase().includes(agencySlug.toLowerCase())
    );
    
    if (!agency) {
      throw new Error(`Agency not found: ${agencySlug}`);
    }
    
    // This is a placeholder - actual implementation will come later
    return {
      agency: agency.name,
      totalWordCount: 0,
      titleCounts: []
    };
  } catch (error) {
    console.error('Failed to fetch word count:', error);
    throw error;
  }
}

/**
 * Fetch historical changes for an agency
 */
export async function fetchHistoricalChangesByAgency(agencySlug: string) {
  try {
    // We'll use the search API with the last_modified params
    const searchParams = new URLSearchParams({
      'agency_slugs[]': agencySlug,
    });
    
    const response = await fetch(`${BASE_URL}/api/search/v1/counts/daily?${searchParams}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching changes: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch historical changes:', error);
    throw error;
  }
}

/**
 * Fetch content structure for an agency
 */
export async function fetchContentStructureByAgency(agencySlug: string) {
  try {
    // First, get titles for this agency
    const agencies = await fetchAgencies();
    const agency = agencies.find((a: any) => 
      a.slug === agencySlug || a.name.toLowerCase().includes(agencySlug.toLowerCase())
    );
    
    if (!agency) {
      throw new Error(`Agency not found: ${agencySlug}`);
    }
    
    // Get titles summary
    const titlesResponse = await fetch(`${BASE_URL}/api/versioner/v1/titles.json`);
    
    if (!titlesResponse.ok) {
      throw new Error(`Error fetching titles: ${titlesResponse.statusText}`);
    }
    
    const titles = await titlesResponse.json();
    
    // Filter titles for this agency - this is a placeholder implementation
    const agencyTitles = titles.filter((title: any) => 
      title.agencies && title.agencies.some((a: any) => a.slug === agency.slug)
    );
    
    return {
      agency: agency.name,
      titles: agencyTitles
    };
  } catch (error) {
    console.error('Failed to fetch content structure:', error);
    throw error;
  }
} 