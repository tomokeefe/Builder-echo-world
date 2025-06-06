export interface CSVRow {
  [key: string]: string;
}

export interface ParsedCSVData {
  headers: string[];
  rows: CSVRow[];
  totalRows: number;
}

export interface ColumnMapping {
  email?: string;
  name?: string;
  age?: string;
  gender?: string;
  location?: string;
  income?: string;
  interests?: string;
  behaviors?: string;
  purchaseHistory?: string;
  [key: string]: string | undefined;
}

export interface CustomerRecord {
  email: string;
  name?: string;
  demographics: {
    age?: string;
    gender?: string;
    location?: string;
    income?: string;
  };
  interests: string[];
  behaviors: string[];
  purchaseHistory?: string;
}

export const parseCSV = async (file: File): Promise<ParsedCSVData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const csvText = event.target?.result as string;
        const lines = csvText.split("\n").filter((line) => line.trim() !== "");

        if (lines.length === 0) {
          reject(new Error("CSV file is empty"));
          return;
        }

        // Parse headers
        const headers = parseCSVLine(lines[0]);

        // Parse rows
        const rows: CSVRow[] = [];
        for (let i = 1; i < lines.length; i++) {
          const values = parseCSVLine(lines[i]);
          if (values.length > 0) {
            const row: CSVRow = {};
            headers.forEach((header, index) => {
              row[header] = values[index] || "";
            });
            rows.push(row);
          }
        }

        resolve({
          headers,
          rows,
          totalRows: rows.length,
        });
      } catch (error) {
        reject(
          new Error("Failed to parse CSV file: " + (error as Error).message),
        );
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsText(file);
  });
};

const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result.map((field) => field.replace(/^"|"$/g, ""));
};

export const mapCSVToCustomers = (
  data: ParsedCSVData,
  mapping: ColumnMapping,
): CustomerRecord[] => {
  return data.rows.map((row) => {
    const customer: CustomerRecord = {
      email:
        row[mapping.email || ""] ||
        `customer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}@example.com`,
      demographics: {},
      interests: [],
      behaviors: [],
    };

    // Map basic fields
    if (mapping.name && row[mapping.name]) {
      customer.name = row[mapping.name];
    }

    // Map demographics
    if (mapping.age && row[mapping.age]) {
      customer.demographics.age = row[mapping.age];
    }
    if (mapping.gender && row[mapping.gender]) {
      customer.demographics.gender = row[mapping.gender];
    }
    if (mapping.location && row[mapping.location]) {
      customer.demographics.location = row[mapping.location];
    }
    if (mapping.income && row[mapping.income]) {
      customer.demographics.income = row[mapping.income];
    }

    // Map interests (comma-separated)
    if (mapping.interests && row[mapping.interests]) {
      customer.interests = row[mapping.interests]
        .split(",")
        .map((interest) => interest.trim())
        .filter((interest) => interest.length > 0);
    }

    // Map behaviors (comma-separated)
    if (mapping.behaviors && row[mapping.behaviors]) {
      customer.behaviors = row[mapping.behaviors]
        .split(",")
        .map((behavior) => behavior.trim())
        .filter((behavior) => behavior.length > 0);
    }

    // Map purchase history
    if (mapping.purchaseHistory && row[mapping.purchaseHistory]) {
      customer.purchaseHistory = row[mapping.purchaseHistory];
    }

    return customer;
  });
};

export const generateAudienceFromCustomers = (
  customers: CustomerRecord[],
  audienceName: string,
) => {
  // Analyze customer data to generate audience insights
  const totalCustomers = customers.length;

  // Extract demographics
  const ages = customers
    .map((c) => c.demographics.age)
    .filter((age) => age)
    .reduce(
      (acc, age) => {
        acc[age!] = (acc[age!] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

  const genders = customers
    .map((c) => c.demographics.gender)
    .filter((gender) => gender)
    .reduce(
      (acc, gender) => {
        acc[gender!] = (acc[gender!] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

  const locations = customers
    .map((c) => c.demographics.location)
    .filter((location) => location)
    .reduce(
      (acc, location) => {
        acc[location!] = (acc[location!] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

  // Extract top interests and behaviors
  const allInterests = customers.flatMap((c) => c.interests);
  const allBehaviors = customers.flatMap((c) => c.behaviors);

  const topInterests = getTopItems(allInterests, 5);
  const topBehaviors = getTopItems(allBehaviors, 5);
  const topDemographics = [
    ...Object.keys(ages).slice(0, 3),
    ...Object.keys(genders).slice(0, 2),
    ...Object.keys(locations).slice(0, 3),
  ];

  // Calculate estimated similarity based on data quality
  const dataQuality = calculateDataQuality(customers);
  const similarity = Math.floor(70 + dataQuality * 25); // 70-95% based on data quality

  return {
    name: audienceName,
    description: `Customer list imported from CSV with ${totalCustomers} customers`,
    size: Math.floor(totalCustomers * (1.5 + Math.random() * 3)), // Estimated expanded audience size
    similarity,
    status: "Draft" as const,
    performance: "Medium" as const,
    source: "CSV Upload",
    targetingCriteria: {
      demographics: topDemographics,
      interests: topInterests,
      behaviors: topBehaviors,
    },
    campaignData: {
      reach: 0,
      engagement: 0,
      conversion: 0,
      clicks: 0,
      impressions: 0,
    },
  };
};

const getTopItems = (items: string[], limit: number): string[] => {
  const counts = items.reduce(
    (acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([item]) => item);
};

const calculateDataQuality = (customers: CustomerRecord[]): number => {
  if (customers.length === 0) return 0;

  let totalFields = 0;
  let filledFields = 0;

  customers.forEach((customer) => {
    totalFields += 7; // email, name, age, gender, location, interests, behaviors

    if (customer.email) filledFields++;
    if (customer.name) filledFields++;
    if (customer.demographics.age) filledFields++;
    if (customer.demographics.gender) filledFields++;
    if (customer.demographics.location) filledFields++;
    if (customer.interests.length > 0) filledFields++;
    if (customer.behaviors.length > 0) filledFields++;
  });

  return filledFields / totalFields;
};

export const validateCSVFile = (file: File): string | null => {
  // Check file type
  if (!file.name.toLowerCase().endsWith(".csv")) {
    return "Please upload a CSV file";
  }

  // Check file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    return "File size must be less than 10MB";
  }

  return null;
};
