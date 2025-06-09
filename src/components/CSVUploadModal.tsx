import React from "react";
import { useDropzone } from "react-dropzone";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Download,
  Users,
  Eye,
  X,
  FileSpreadsheet,
  Zap,
  AlertTriangle,
  Info,
  RefreshCw,
} from "lucide-react";
import {
  parseCSV,
  mapCSVToCustomers,
  generateAudienceFromCustomers,
  validateCSVFile,
  validateCSVData,
  autoDetectColumnMapping,
  type ParsedCSVData,
  type ColumnMapping,
  type CustomerRecord,
  type ValidationResult,
} from "@/utils/csvParser";
import { Audience } from "@/types/audience";

interface CSVUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateAudience: (audience: Omit<Audience, "id" | "created">) => void;
}

export function CSVUploadModal({
  open,
  onOpenChange,
  onCreateAudience,
}: CSVUploadModalProps) {
  const [currentStep, setCurrentStep] = React.useState<
    "upload" | "mapping" | "preview" | "confirm"
  >("upload");
  const [file, setFile] = React.useState<File | null>(null);
  const [csvData, setCsvData] = React.useState<ParsedCSVData | null>(null);
  const [columnMapping, setColumnMapping] = React.useState<ColumnMapping>({});
  const [customers, setCustomers] = React.useState<CustomerRecord[]>([]);
  const [audienceName, setAudienceName] = React.useState("");
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [validation, setValidation] = React.useState<ValidationResult | null>(
    null,
  );
  const [processingProgress, setProcessingProgress] = React.useState(0);

  const { toast } = useToast();

  const onDrop = React.useCallback(
    async (acceptedFiles: File[]) => {
      const uploadedFile = acceptedFiles[0];
      if (!uploadedFile) return;

      // Reset state
      setError(null);
      setValidation(null);
      setCsvData(null);
      setCustomers([]);
      setColumnMapping({});

      // Validate file
      const validationError = validateCSVFile(uploadedFile);
      if (validationError) {
        setError(validationError);
        toast({
          title: "Invalid File",
          description: validationError,
          variant: "destructive",
        });
        return;
      }

      setFile(uploadedFile);
      setAudienceName(
        uploadedFile.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " "),
      );
      setIsProcessing(true);
      setProcessingProgress(0);

      try {
        // Simulate progress for better UX
        const progressInterval = setInterval(() => {
          setProcessingProgress((prev) => Math.min(prev + 10, 90));
        }, 100);

        const parsedData = await parseCSV(uploadedFile);

        clearInterval(progressInterval);
        setProcessingProgress(100);

        // Validate the parsed data
        const validationResult = validateCSVData(parsedData);
        setValidation(validationResult);

        if (!validationResult.isValid) {
          setError(validationResult.errors.join(", "));
          toast({
            title: "CSV Validation Failed",
            description: validationResult.errors[0],
            variant: "destructive",
          });
          return;
        }

        setCsvData(parsedData);

        // Auto-detect column mapping
        const autoMapping = autoDetectColumnMapping(parsedData.headers);
        setColumnMapping(autoMapping);

        // Show warnings and suggestions
        if (validationResult.warnings.length > 0) {
          toast({
            title: "CSV Warnings",
            description: validationResult.warnings[0],
            variant: "default",
          });
        }

        if (validationResult.suggestions.length > 0) {
          toast({
            title: "CSV Processing Complete",
            description: validationResult.suggestions[0],
          });
        }

        setCurrentStep("mapping");
      } catch (err) {
        setError((err as Error).message);
        toast({
          title: "Processing Failed",
          description: (err as Error).message,
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
        setProcessingProgress(0);
      }
    },
    [toast],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "text/csv": [".csv"],
        "application/vnd.ms-excel": [".csv"],
      },
      maxFiles: 1,
      multiple: false,
      maxSize: 100 * 1024 * 1024, // 100MB
    });

  const handleColumnMapping = () => {
    if (!csvData) return;

    if (!columnMapping.email) {
      setError("Please select an email/customer ID column");
      toast({
        title: "Column Mapping Required",
        description: "Email or customer ID column is required to continue",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const mappedCustomers = mapCSVToCustomers(csvData, columnMapping);

      if (mappedCustomers.length === 0) {
        setError("No valid customer records found after mapping");
        return;
      }

      setCustomers(mappedCustomers);

      toast({
        title: "Column Mapping Success",
        description: `Successfully mapped ${mappedCustomers.length} customer records`,
      });

      setCurrentStep("preview");
    } catch (err) {
      const errorMessage = "Failed to map columns: " + (err as Error).message;
      setError(errorMessage);
      toast({
        title: "Mapping Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateAudience = () => {
    if (customers.length === 0 || !audienceName.trim()) {
      setError(
        "Please provide an audience name and ensure customer data is available",
      );
      return;
    }

    try {
      const audienceData = generateAudienceFromCustomers(
        customers,
        audienceName.trim(),
      );
      onCreateAudience(audienceData);

      toast({
        title: "Audience Created Successfully",
        description: `Created "${audienceName}" with ${customers.length} customers`,
      });

      handleClose();
    } catch (err) {
      setError("Failed to create audience: " + (err as Error).message);
      toast({
        title: "Creation Failed",
        description: (err as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setCurrentStep("upload");
    setFile(null);
    setCsvData(null);
    setColumnMapping({});
    setCustomers([]);
    setAudienceName("");
    setError(null);
    setValidation(null);
    setProcessingProgress(0);
    onOpenChange(false);
  };

  const handleBack = () => {
    switch (currentStep) {
      case "mapping":
        setCurrentStep("upload");
        break;
      case "preview":
        setCurrentStep("mapping");
        break;
      case "confirm":
        setCurrentStep("preview");
        break;
    }
  };

  const getStepProgress = () => {
    switch (currentStep) {
      case "upload":
        return 25;
      case "mapping":
        return 50;
      case "preview":
        return 75;
      case "confirm":
        return 100;
      default:
        return 0;
    }
  };

  const generateSampleCSV = () => {
    const sampleData = `email,name,age,gender,location,interests,behaviors
john.doe@example.com,John Doe,32,Male,New York,technology;sports,online_shopping;mobile_usage
jane.smith@example.com,Jane Smith,28,Female,California,fashion;travel,social_media;content_creation
mike.johnson@example.com,Mike Johnson,45,Male,Texas,finance;cars,research;comparison_shopping`;

    const blob = new Blob([sampleData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_customer_data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Sample CSV Downloaded",
      description: "Check your downloads folder for the sample template",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            Upload Customer Data from CSV
          </DialogTitle>
          <DialogDescription>
            Import your customer list to create a new lookalike audience with
            advanced targeting capabilities
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Upload CSV</span>
            <span>Map Columns</span>
            <span>Preview Data</span>
            <span>Create Audience</span>
          </div>
          <Progress value={getStepProgress()} className="h-2" />
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Validation Results */}
        {validation && (
          <div className="space-y-2">
            {validation.warnings.length > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    {validation.warnings.map((warning, index) => (
                      <div key={index}>• {warning}</div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}
            {validation.suggestions.length > 0 && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    {validation.suggestions.map((suggestion, index) => (
                      <div key={index}>💡 {suggestion}</div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <Tabs value={currentStep} className="w-full">
          {/* Step 1: Upload */}
          <TabsContent value="upload" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload CSV File
                </CardTitle>
                <CardDescription>
                  Select or drag a CSV file containing your customer data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
                    isDragActive && !isDragReject
                      ? "border-primary bg-primary/5 scale-105"
                      : isDragReject
                        ? "border-red-500 bg-red-50"
                        : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/20"
                  }`}
                >
                  <input {...getInputProps()} />
                  {isProcessing ? (
                    <div className="space-y-4">
                      <div className="flex flex-col items-center space-y-2">
                        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                        <div className="w-64 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${processingProgress}%` }}
                          />
                        </div>
                      </div>
                      <p className="text-muted-foreground">
                        Processing CSV file... {processingProgress}%
                      </p>
                    </div>
                  ) : file ? (
                    <div className="space-y-4">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(file.size / 1024).toFixed(1)} KB •{" "}
                          {csvData?.totalRows || 0} rows
                        </p>
                        {csvData && (
                          <div className="flex items-center justify-center gap-4 mt-2">
                            <Badge variant="outline">
                              {csvData.headers.length} columns
                            </Badge>
                            {csvData.warnings.length > 0 && (
                              <Badge variant="secondary">
                                {csvData.warnings.length} warnings
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                      <Button onClick={() => setCurrentStep("mapping")}>
                        Continue to Column Mapping
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {isDragReject ? (
                        <>
                          <X className="w-12 h-12 text-red-500 mx-auto" />
                          <div>
                            <p className="text-lg font-medium text-red-600">
                              Invalid file type
                            </p>
                            <p className="text-muted-foreground">
                              Please upload a CSV file only
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                          <div>
                            <p className="text-lg font-medium">
                              {isDragActive
                                ? "Drop the CSV file here"
                                : "Drag & drop CSV file here"}
                            </p>
                            <p className="text-muted-foreground">
                              or click to select a file (max 100MB)
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <Separator className="my-6" />

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      CSV Format Requirements
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full" />
                        First row should contain column headers
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full" />
                        Include at least an email or customer identifier column
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full" />
                        Optional: demographics (age, gender, location, income)
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full" />
                        Optional: interests and behaviors (comma-separated)
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full" />
                        File size limit: 100MB
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-blue-500" />
                      Supported Data Types
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <Badge variant="outline">Email</Badge>
                      <Badge variant="outline">Name</Badge>
                      <Badge variant="outline">Age</Badge>
                      <Badge variant="outline">Gender</Badge>
                      <Badge variant="outline">Location</Badge>
                      <Badge variant="outline">Income</Badge>
                      <Badge variant="outline">Interests</Badge>
                      <Badge variant="outline">Behaviors</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 2: Mapping */}
          <TabsContent value="mapping" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Map CSV Columns
                </CardTitle>
                <CardDescription>
                  Match your CSV columns to customer data fields. Auto-detection
                  has been applied where possible.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {csvData && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <span className="text-red-500">*</span>
                          Email/Customer ID
                        </Label>
                        <Select
                          value={columnMapping.email || ""}
                          onValueChange={(value) =>
                            setColumnMapping({ ...columnMapping, email: value })
                          }
                        >
                          <SelectTrigger
                            className={
                              columnMapping.email ? "border-green-500" : ""
                            }
                          >
                            <SelectValue placeholder="Select email column" />
                          </SelectTrigger>
                          <SelectContent>
                            {csvData.headers.map((header) => (
                              <SelectItem key={header} value={header}>
                                {header}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Customer Name</Label>
                        <Select
                          value={columnMapping.name || ""}
                          onValueChange={(value) =>
                            setColumnMapping({ ...columnMapping, name: value })
                          }
                        >
                          <SelectTrigger
                            className={
                              columnMapping.name ? "border-green-500" : ""
                            }
                          >
                            <SelectValue placeholder="Select name column" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {csvData.headers.map((header) => (
                              <SelectItem key={header} value={header}>
                                {header}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Age</Label>
                        <Select
                          value={columnMapping.age || ""}
                          onValueChange={(value) =>
                            setColumnMapping({ ...columnMapping, age: value })
                          }
                        >
                          <SelectTrigger
                            className={
                              columnMapping.age ? "border-green-500" : ""
                            }
                          >
                            <SelectValue placeholder="Select age column" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            {csvData.headers.map((header) => (
                              <SelectItem key={header} value={header}>
                                {header}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Gender</Label>
                        <Select
                          value={columnMapping.gender || ""}
                          onValueChange={(value) =>
                            setColumnMapping({
                              ...columnMapping,
                              gender: value,
                            })
                          }
                        >
                          <SelectTrigger
                            className={
                              columnMapping.gender ? "border-green-500" : ""
                            }
                          >
                            <SelectValue placeholder="Select gender column" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            {csvData.headers.map((header) => (
                              <SelectItem key={header} value={header}>
                                {header}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Select
                          value={columnMapping.location || ""}
                          onValueChange={(value) =>
                            setColumnMapping({
                              ...columnMapping,
                              location: value,
                            })
                          }
                        >
                          <SelectTrigger
                            className={
                              columnMapping.location ? "border-green-500" : ""
                            }
                          >
                            <SelectValue placeholder="Select location column" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            {csvData.headers.map((header) => (
                              <SelectItem key={header} value={header}>
                                {header}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Income</Label>
                        <Select
                          value={columnMapping.income || ""}
                          onValueChange={(value) =>
                            setColumnMapping({
                              ...columnMapping,
                              income: value,
                            })
                          }
                        >
                          <SelectTrigger
                            className={
                              columnMapping.income ? "border-green-500" : ""
                            }
                          >
                            <SelectValue placeholder="Select income column" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            {csvData.headers.map((header) => (
                              <SelectItem key={header} value={header}>
                                {header}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Interests</Label>
                        <Select
                          value={columnMapping.interests || ""}
                          onValueChange={(value) =>
                            setColumnMapping({
                              ...columnMapping,
                              interests: value,
                            })
                          }
                        >
                          <SelectTrigger
                            className={
                              columnMapping.interests ? "border-green-500" : ""
                            }
                          >
                            <SelectValue placeholder="Select interests column" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            {csvData.headers.map((header) => (
                              <SelectItem key={header} value={header}>
                                {header}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Behaviors</Label>
                        <Select
                          value={columnMapping.behaviors || ""}
                          onValueChange={(value) =>
                            setColumnMapping({
                              ...columnMapping,
                              behaviors: value,
                            })
                          }
                        >
                          <SelectTrigger
                            className={
                              columnMapping.behaviors ? "border-green-500" : ""
                            }
                          >
                            <SelectValue placeholder="Select behaviors column" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            {csvData.headers.map((header) => (
                              <SelectItem key={header} value={header}>
                                {header}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Purchase History</Label>
                        <Select
                          value={columnMapping.purchaseHistory || ""}
                          onValueChange={(value) =>
                            setColumnMapping({
                              ...columnMapping,
                              purchaseHistory: value,
                            })
                          }
                        >
                          <SelectTrigger
                            className={
                              columnMapping.purchaseHistory
                                ? "border-green-500"
                                : ""
                            }
                          >
                            <SelectValue placeholder="Select purchase history column" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            {csvData.headers.map((header) => (
                              <SelectItem key={header} value={header}>
                                {header}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <Label className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        CSV Preview (first 5 rows)
                      </Label>
                      <ScrollArea className="h-64 w-full border rounded-md">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              {csvData.headers.map((header) => (
                                <TableHead
                                  key={header}
                                  className={`whitespace-nowrap ${
                                    Object.values(columnMapping).includes(
                                      header,
                                    )
                                      ? "bg-green-50 font-semibold"
                                      : ""
                                  }`}
                                >
                                  {header}
                                  {Object.values(columnMapping).includes(
                                    header,
                                  ) && (
                                    <CheckCircle className="w-3 h-3 text-green-500 ml-1 inline" />
                                  )}
                                </TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {csvData.rows.slice(0, 5).map((row, index) => (
                              <TableRow key={index}>
                                {csvData.headers.map((header) => (
                                  <TableCell
                                    key={header}
                                    className={`whitespace-nowrap text-xs ${
                                      Object.values(columnMapping).includes(
                                        header,
                                      )
                                        ? "bg-green-50"
                                        : ""
                                    }`}
                                  >
                                    {row[header] || (
                                      <span className="text-muted-foreground">
                                        -
                                      </span>
                                    )}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </div>

                    <div className="flex justify-between items-center">
                      <Button variant="outline" onClick={handleBack}>
                        Back
                      </Button>
                      <div className="text-sm text-muted-foreground">
                        <span className="text-red-500">*</span> Required field
                      </div>
                      <Button
                        onClick={handleColumnMapping}
                        disabled={!columnMapping.email || isProcessing}
                      >
                        {isProcessing ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          "Continue to Preview"
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 3: Preview */}
          <TabsContent value="preview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Preview Customer Data
                </CardTitle>
                <CardDescription>
                  Review the processed customer data before creating the
                  audience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Users className="w-8 h-8 text-blue-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Customers
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {customers.length}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Valid Records
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {
                          customers.filter(
                            (c) => c.email && c.email.includes("@"),
                          ).length
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <FileText className="w-8 h-8 text-purple-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Data Quality
                      </p>
                      <p className="text-2xl font-bold text-purple-600">
                        {csvData && customers.length > 0
                          ? Math.round(
                              (customers.filter(
                                (c) =>
                                  c.name ||
                                  c.demographics.age ||
                                  c.demographics.location,
                              ).length /
                                customers.length) *
                                100,
                            )
                          : 0}
                        %
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                    <Zap className="w-8 h-8 text-orange-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Enriched</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {
                          customers.filter(
                            (c) =>
                              c.interests.length > 0 || c.behaviors.length > 0,
                          ).length
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Audience Name</Label>
                  <Input
                    value={audienceName}
                    onChange={(e) => setAudienceName(e.target.value)}
                    placeholder="Enter audience name"
                    className="text-lg"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Customer Preview (first 10 records)</Label>
                  <ScrollArea className="h-80 w-full border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">Email</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Demographics</TableHead>
                          <TableHead>Interests</TableHead>
                          <TableHead>Behaviors</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {customers.slice(0, 10).map((customer, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-mono text-xs">
                              {customer.email}
                            </TableCell>
                            <TableCell>{customer.name || "-"}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {customer.demographics.age && (
                                  <Badge variant="outline" className="text-xs">
                                    Age: {customer.demographics.age}
                                  </Badge>
                                )}
                                {customer.demographics.gender && (
                                  <Badge variant="outline" className="text-xs">
                                    {customer.demographics.gender}
                                  </Badge>
                                )}
                                {customer.demographics.location && (
                                  <Badge variant="outline" className="text-xs">
                                    {customer.demographics.location}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {customer.interests
                                  .slice(0, 2)
                                  .map((interest, i) => (
                                    <Badge
                                      key={i}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {interest}
                                    </Badge>
                                  ))}
                                {customer.interests.length > 2 && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    +{customer.interests.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {customer.behaviors
                                  .slice(0, 2)
                                  .map((behavior, i) => (
                                    <Badge
                                      key={i}
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {behavior}
                                    </Badge>
                                  ))}
                                {customer.behaviors.length > 2 && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    +{customer.behaviors.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                  <Button
                    onClick={handleCreateAudience}
                    disabled={!audienceName.trim() || customers.length === 0}
                    className="bg-primary"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Create Audience
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          {currentStep === "upload" && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Download className="w-4 h-4" />
              <span>Need a template?</span>
              <Button
                variant="link"
                className="p-0 h-auto text-primary font-medium"
                onClick={generateSampleCSV}
              >
                Download sample CSV
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
