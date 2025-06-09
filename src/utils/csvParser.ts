import Papa from "papaparse";

export interface CSVRow {
  [key: string]: string;
}

export interface ParsedCSVData {
  headers: string[];
  rows: CSVRow[];
  totalRows: number;
  errors: string[];
  warnings: string[];
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

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

// Common column name patterns for auto-detection
const COLUMN_PATTERNS = {
  email: /^(email|e-?mail|email_address|contact|user_email)$/i,
  name: /^(name|full_name|customer_name|first_name|last_name|user_name)$/i,
  age: /^(age|user_age|customer_age)$/i,
  gender: /^(gender|sex)$/i,
  location: /^(location|city|state|country|address|region)$/i,
  income: /^(income|salary|revenue|annual_income)$/i,
  interests: /^(interests|hobbies|preferences|likes)$/i,
  behaviors: /^(behaviors|behaviour|activities|actions)$/i,
  purchaseHistory: /^(purchase_history|purchases|orders|transactions)$/i,
};

export const parseCSV = async (file: File): Promise<ParsedCSVData> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file provided"));
      return;
    }

    const errors: string[] = [];
    const warnings: string[] = [];

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim(),
      transform: (value: string) => value.trim(),
      complete: (results) => {
        try {
          // Check for parsing errors
          if (results.errors.length > 0) {
            const criticalErrors = results.errors.filter(
              (error) => error.type === "Delimiter",
            );
            if (criticalErrors.length > 0) {
              reject(
                new Error("Invalid CSV format: " + criticalErrors[0].message),
              );
              return;
            }

            // Add non-critical errors as warnings
            results.errors.forEach((error) => {
              if (error.type !== "Delimiter") {
                warnings.push(`Row ${error.row + 1}: ${error.message}`);
              }
            });
          }

          const headers = results.meta.fields || [];
          const rows = results.data as CSVRow[];

          // Validate CSV structure
          if (headers.length === 0) {
            reject(new Error("No headers found in CSV file"));
            return;
          }

          if (rows.length === 0) {
            reject(new Error("No data rows found in CSV file"));
            return;
          }

          // Check for empty headers
          const emptyHeaders = headers.filter(
            (header) => !header || header.trim() === "",
          );
          if (emptyHeaders.length > 0) {
            warnings.push(
              `Found ${emptyHeaders.length} empty column header(s)`,
            );
          }

          // Check for duplicate headers
          const duplicateHeaders = headers.filter(
            (header, index) => headers.indexOf(header) !== index,
          );
          if (duplicateHeaders.length > 0) {
            warnings.push(
              `Duplicate column headers found: ${duplicateHeaders.join(", ")}`,
            );
          }

          // Filter out completely empty rows
          const validRows = rows.filter((row) =>
            Object.values(row).some((value) => value && value.trim() !== ""),
          );

          if (validRows.length < rows.length) {
            warnings.push(
              `Removed ${rows.length - validRows.length} empty rows`,
            );
          }

          resolve({
            headers: headers.filter((header) => header && header.trim() !== ""),
            rows: validRows,
            totalRows: validRows.length,
            errors,
            warnings,
          });
        } catch (error) {
          reject(
            new Error(
              "Failed to process CSV data: " + (error as Error).message,
            ),
          );
        }
      },
      error: (error) => {
        reject(new Error("Failed to parse CSV file: " + error.message));
      },
    });
  });
};

export const validateCSVFile = (file: File): string | null => {
  // Check file type
  if (!file.name.toLowerCase().endsWith(".csv")) {
    return "Please upload a CSV file (.csv extension required)";
  }

  // Check file size (max 100MB)
  if (file.size > 100 * 1024 * 1024) {
    return "File size must be less than 100MB";
  }

  // Check minimum file size (should be at least 1KB for meaningful data)
  if (file.size < 1024) {
    return "File appears to be too small. Please ensure it contains data.";
  }

  return null;
};

export const validateCSVData = (data: ParsedCSVData): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  // Check for minimum data requirements
  if (data.totalRows < 1) {
    errors.push("CSV file must contain at least 1 data row");
  }

  if (data.headers.length < 1) {
    errors.push("CSV file must contain at least 1 column");
  }

  // Check for potential email columns
  const potentialEmailColumns = data.headers.filter(
    (header) =>
      COLUMN_PATTERNS.email.test(header) ||
      header.toLowerCase().includes("email") ||
      header.toLowerCase().includes("contact"),
  );

  if (potentialEmailColumns.length === 0) {
    // Check if any column contains email-like data
    const emailLikeData = data.headers.some((header) => {
      const sampleValues = data.rows
        .slice(0, 5)
        .map((row) => row[header] || "");
      return sampleValues.some(
        (value) => value.includes("@") && value.includes("."),
      );
    });

    if (!emailLikeData) {
      warnings.push(
        "No obvious email column detected. You'll need to specify which column contains customer identifiers.",
      );
    } else {
      suggestions.push(
        "Detected email-like data in your CSV. Make sure to map the correct column during setup.",
      );
    }
  }

  // Check data quality
  const sampleSize = Math.min(10, data.totalRows);
  const sampleRows = data.rows.slice(0, sampleSize);

  // Calculate filled data percentage
  let totalCells = 0;
  let filledCells = 0;

  sampleRows.forEach((row) => {
    data.headers.forEach((header) => {
      totalCells++;
      if (row[header] && row[header].trim() !== "") {
        filledCells++;
      }
    });
  });

  const fillPercentage = (filledCells / totalCells) * 100;

  if (fillPercentage < 30) {
    warnings.push("Low data density detected. Many cells appear to be empty.");
  } else if (fillPercentage > 80) {
    suggestions.push(
      "Good data density detected. Your CSV appears to be well-formatted.",
    );
  }

  // Check for large datasets
  if (data.totalRows > 10000) {
    suggestions.push(
      "Large dataset detected. Processing may take a few moments.",
    );
  }

  // Check for common formatting issues
  data.headers.forEach((header) => {
    if (header.includes(" ") && !header.includes("_")) {
      suggestions.push(
        `Consider using underscores instead of spaces in column "${header}" for better compatibility.`,
      );
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestions,
  };
};

export const autoDetectColumnMapping = (
  headers: string[],
): Partial<ColumnMapping> => {
  const mapping: Partial<ColumnMapping> = {};

  headers.forEach((header) => {
    const lowerHeader = header.toLowerCase().trim();

    // Try to auto-detect column types
    for (const [fieldType, pattern] of Object.entries(COLUMN_PATTERNS)) {
      if (pattern.test(header)) {
        mapping[fieldType as keyof ColumnMapping] = header;
        break;
      }
    }
  });

  return mapping;
};

export const mapCSVToCustomers = (
  data: ParsedCSVData,
  mapping: ColumnMapping,
): CustomerRecord[] => {
  const customers: CustomerRecord[] = [];
  const processedEmails = new Set<string>();

  data.rows.forEach((row, index) => {
    try {
      // Get email/identifier
      let email = "";
      if (mapping.email && mapping.email !== "none" && row[mapping.email]) {
        email = row[mapping.email].toLowerCase().trim();
      }

      // If no email provided, generate a unique identifier
      if (!email || !isValidEmail(email)) {
        email = `customer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}@imported.local`;
      }

      // Skip duplicate emails
      if (processedEmails.has(email)) {
        return;
      }
      processedEmails.add(email);

      const customer: CustomerRecord = {
        email,
        demographics: {},
        interests: [],
        behaviors: [],
      };

      // Map basic fields
      if (mapping.name && mapping.name !== "none" && row[mapping.name]) {
        customer.name = cleanString(row[mapping.name]);
      }

      // Map demographics
      if (mapping.age && mapping.age !== "none" && row[mapping.age]) {
        const age = cleanString(row[mapping.age]);
        if (age && isValidAge(age)) {
          customer.demographics.age = age;
        }
      }

      if (mapping.gender && mapping.gender !== "none" && row[mapping.gender]) {
        const gender = cleanString(row[mapping.gender]);
        if (gender) {
          customer.demographics.gender = normalizeGender(gender);
        }
      }

      if (
        mapping.location &&
        mapping.location !== "none" &&
        row[mapping.location]
      ) {
        const location = cleanString(row[mapping.location]);
        if (location) {
          customer.demographics.location = location;
        }
      }

      if (mapping.income && mapping.income !== "none" && row[mapping.income]) {
        const income = cleanString(row[mapping.income]);
        if (income && isValidIncome(income)) {
          customer.demographics.income = income;
        }
      }

      // Map interests (comma-separated)
      if (
        mapping.interests &&
        mapping.interests !== "none" &&
        row[mapping.interests]
      ) {
        customer.interests = parseListField(row[mapping.interests]);
      }

      // Map behaviors (comma-separated)
      if (
        mapping.behaviors &&
        mapping.behaviors !== "none" &&
        row[mapping.behaviors]
      ) {
        customer.behaviors = parseListField(row[mapping.behaviors]);
      }

      // Map purchase history
      if (
        mapping.purchaseHistory &&
        mapping.purchaseHistory !== "none" &&
        row[mapping.purchaseHistory]
      ) {
        const purchaseHistory = cleanString(row[mapping.purchaseHistory]);
        if (purchaseHistory) {
          customer.purchaseHistory = purchaseHistory;
        }
      }

      customers.push(customer);
    } catch (error) {
      console.warn(`Error processing row ${index + 1}:`, error);
    }
  });

  return customers;
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

// Helper functions
const cleanString = (value: string): string => {
  return value?.trim().replace(/\s+/g, " ") || "";
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidAge = (age: string): boolean => {
  const ageNum = parseInt(age);
  return !isNaN(ageNum) && ageNum > 0 && ageNum < 150;
};

const isValidIncome = (income: string): boolean => {
  // Remove currency symbols and commas
  const cleaned = income.replace(/[$,€£¥]/g, "");
  const incomeNum = parseFloat(cleaned);
  return !isNaN(incomeNum) && incomeNum >= 0;
};

const normalizeGender = (gender: string): string => {
  const normalized = gender.toLowerCase();
  if (normalized.includes("m") || normalized.includes("male")) return "Male";
  if (normalized.includes("f") || normalized.includes("female"))
    return "Female";
  if (normalized.includes("other") || normalized.includes("non-binary"))
    return "Other";
  return gender; // Return original if can't normalize
};

const parseListField = (value: string): string[] => {
  if (!value) return [];

  return value
    .split(/[,;|]/) // Split on comma, semicolon, or pipe
    .map((item) => cleanString(item))
    .filter((item) => item.length > 0)
    .slice(0, 10); // Limit to 10 items per field
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
