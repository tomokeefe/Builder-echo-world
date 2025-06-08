export interface BrandData {
  name: string;
  domain: string;
  logo?: string;
  icon?: string;
  colors?: {
    hex: string;
    type: string;
    brightness: number;
  }[];
  fonts?: {
    name: string;
    type: string;
    origin: string;
  }[];
  images?: {
    name: string;
    type: string;
    url: string;
  }[];
  company?: {
    employees?: string;
    industry?: string;
    location?: string;
    founded?: string;
    revenue?: string;
  };
}

export interface BrandfetchResponse {
  name: string;
  domain: string;
  claimed: boolean;
  description?: string;
  longDescription?: string;
  links: Array<{
    name: string;
    url: string;
  }>;
  logos: Array<{
    theme: string;
    formats: Array<{
      format: string;
      src: string;
      background: string;
      size?: number;
      width?: number;
      height?: number;
    }>;
  }>;
  colors: Array<{
    hex: string;
    type: string;
    brightness: number;
  }>;
  fonts: Array<{
    name: string;
    type: string;
    origin: string;
  }>;
  images: Array<{
    name: string;
    type: string;
    url: string;
  }>;
  company?: {
    employees?: string;
    industry?: string;
    location?: string;
    founded?: string;
    revenue?: string;
  };
}

class BrandfetchService {
  private readonly baseUrl = "https://api.brandfetch.io/v2";
  private readonly apiKey = import.meta.env.VITE_BRANDFETCH_API_KEY;

  constructor() {
    if (!this.apiKey) {
      console.warn(
        "Brandfetch API key not found. Using mock data for development.",
      );
    }
  }

  public async fetchBrandData(domain: string): Promise<BrandData | null> {
    try {
      // Clean the domain input
      const cleanDomain = this.cleanDomain(domain);

      if (!cleanDomain) {
        throw new Error("Invalid domain provided");
      }

      // If no API key, return mock data for development
      if (!this.apiKey) {
        return this.getMockBrandData(cleanDomain);
      }

      const response = await fetch(`${this.baseUrl}/brands/${cleanDomain}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`Brand not found for domain: ${cleanDomain}`);
          return null;
        }
        throw new Error(
          `Brandfetch API error: ${response.status} ${response.statusText}`,
        );
      }

      const data: BrandfetchResponse = await response.json();
      return this.transformBrandData(data);
    } catch (error) {
      console.error("Error fetching brand data:", error);

      // Fallback to mock data if API fails
      return this.getMockBrandData(domain);
    }
  }

  public async searchBrands(
    query: string,
  ): Promise<Array<{ name: string; domain: string }>> {
    try {
      if (!this.apiKey) {
        return this.getMockSearchResults(query);
      }

      const response = await fetch(
        `${this.baseUrl}/search/${encodeURIComponent(query)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Brandfetch search error: ${response.status}`);
      }

      const data = await response.json();
      return data.map((item: any) => ({
        name: item.name,
        domain: item.domain,
      }));
    } catch (error) {
      console.error("Error searching brands:", error);
      return this.getMockSearchResults(query);
    }
  }

  private cleanDomain(input: string): string {
    // Remove protocol, www, and trailing slashes
    let domain = input
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .replace(/\/.*$/, "")
      .trim();

    // Validate domain format
    const domainRegex =
      /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
    if (!domainRegex.test(domain)) {
      throw new Error("Invalid domain format");
    }

    return domain;
  }

  private transformBrandData(data: BrandfetchResponse): BrandData {
    // Get the best logo
    const logo = this.getBestLogo(data.logos);
    const icon = this.getBestIcon(data.logos);

    return {
      name: data.name,
      domain: data.domain,
      logo,
      icon,
      colors: data.colors,
      fonts: data.fonts,
      images: data.images,
      company: data.company,
    };
  }

  private getBestLogo(logos: BrandfetchResponse["logos"]): string | undefined {
    if (!logos || logos.length === 0) return undefined;

    // Prefer light theme logos
    const lightLogos = logos.filter((logo) => logo.theme === "light");
    const logosToCheck = lightLogos.length > 0 ? lightLogos : logos;

    // Find the best format (prefer SVG, then PNG)
    for (const logo of logosToCheck) {
      const svgFormat = logo.formats.find((f) => f.format === "svg");
      if (svgFormat) return svgFormat.src;

      const pngFormat = logo.formats.find((f) => f.format === "png");
      if (pngFormat) return pngFormat.src;

      // Fallback to any format
      if (logo.formats.length > 0) return logo.formats[0].src;
    }

    return undefined;
  }

  private getBestIcon(logos: BrandfetchResponse["logos"]): string | undefined {
    if (!logos || logos.length === 0) return undefined;

    // Look for icon-type logos or small logos
    for (const logo of logos) {
      const iconFormat = logo.formats.find(
        (f) => f.format === "png" && f.width && f.width <= 128,
      );
      if (iconFormat) return iconFormat.src;
    }

    // Fallback to regular logo
    return this.getBestLogo(logos);
  }

  // Mock data for development/fallback
  private getMockBrandData(domain: string): BrandData {
    const mockData: Record<string, BrandData> = {
      "apple.com": {
        name: "Apple Inc.",
        domain: "apple.com",
        logo: "https://logo.clearbit.com/apple.com",
        icon: "https://logo.clearbit.com/apple.com",
        colors: [
          { hex: "#000000", type: "primary", brightness: 0 },
          { hex: "#ffffff", type: "secondary", brightness: 100 },
        ],
        company: {
          industry: "Technology",
          location: "Cupertino, CA",
          founded: "1976",
          employees: "100,000+",
        },
      },
      "google.com": {
        name: "Google LLC",
        domain: "google.com",
        logo: "https://logo.clearbit.com/google.com",
        icon: "https://logo.clearbit.com/google.com",
        colors: [
          { hex: "#4285f4", type: "primary", brightness: 60 },
          { hex: "#ea4335", type: "secondary", brightness: 55 },
        ],
        company: {
          industry: "Technology",
          location: "Mountain View, CA",
          founded: "1998",
          employees: "100,000+",
        },
      },
      "microsoft.com": {
        name: "Microsoft Corporation",
        domain: "microsoft.com",
        logo: "https://logo.clearbit.com/microsoft.com",
        icon: "https://logo.clearbit.com/microsoft.com",
        colors: [{ hex: "#0078d4", type: "primary", brightness: 50 }],
        company: {
          industry: "Technology",
          location: "Redmond, WA",
          founded: "1975",
          employees: "100,000+",
        },
      },
    };

    // Return mock data if available, otherwise generate generic data
    if (mockData[domain]) {
      return mockData[domain];
    }

    // Generate generic brand data using Clearbit logos as fallback
    return {
      name:
        domain.split(".")[0].charAt(0).toUpperCase() +
        domain.split(".")[0].slice(1),
      domain,
      logo: `https://logo.clearbit.com/${domain}`,
      icon: `https://logo.clearbit.com/${domain}`,
      colors: [{ hex: "#3B82F6", type: "primary", brightness: 60 }],
      company: {
        industry: "Business",
        location: "Unknown",
      },
    };
  }

  private getMockSearchResults(
    query: string,
  ): Array<{ name: string; domain: string }> {
    const mockResults = [
      { name: "Apple Inc.", domain: "apple.com" },
      { name: "Google LLC", domain: "google.com" },
      { name: "Microsoft Corporation", domain: "microsoft.com" },
      { name: "Amazon.com Inc.", domain: "amazon.com" },
      { name: "Meta Platforms Inc.", domain: "meta.com" },
    ];

    return mockResults.filter(
      (result) =>
        result.name.toLowerCase().includes(query.toLowerCase()) ||
        result.domain.toLowerCase().includes(query.toLowerCase()),
    );
  }
}

export const brandfetchService = new BrandfetchService();
