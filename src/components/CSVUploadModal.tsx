import { useState, useCallback } from "react";
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
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Download,
  Users,
  Eye,
  X,
} from "lucide-react";
import {
  parseCSV,
  mapCSVToCustomers,
  generateAudienceFromCustomers,
  validateCSVFile,
  type ParsedCSVData,
  type ColumnMapping,
  type CustomerRecord,
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
  const [currentStep, setCurrentStep] = useState<
    "upload" | "mapping" | "preview" | "confirm"
  >("upload");
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<ParsedCSVData | null>(null);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({});
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [audienceName, setAudienceName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (!uploadedFile) return;

    const validationError = validateCSVFile(uploadedFile);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setFile(uploadedFile);
    setAudienceName(uploadedFile.name.replace(".csv", ""));
    setIsProcessing(true);

    try {
      const parsedData = await parseCSV(uploadedFile);
      setCsvData(parsedData);
      setCurrentStep("mapping");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".csv"],
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleColumnMapping = () => {
    if (!csvData) return;

    try {
      const mappedCustomers = mapCSVToCustomers(csvData, columnMapping);
      setCustomers(mappedCustomers);
      setCurrentStep("preview");
    } catch (err) {
      setError("Failed to map columns: " + (err as Error).message);
    }
  };

  const handleCreateAudience = () => {
    if (customers.length === 0 || !audienceName) return;

    const audienceData = generateAudienceFromCustomers(customers, audienceName);
    onCreateAudience(audienceData);
    handleClose();
  };

  const handleClose = () => {
    setCurrentStep("upload");
    setFile(null);
    setCsvData(null);
    setColumnMapping({});
    setCustomers([]);
    setAudienceName("");
    setError(null);
    onOpenChange(false);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Customer Data from CSV</DialogTitle>
          <DialogDescription>
            Import your customer list to create a new lookalike audience
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

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
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
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25 hover:border-primary/50"
                  }`}
                >
                  <input {...getInputProps()} />
                  {isProcessing ? (
                    <div className="space-y-4">
                      <div className="animate-spin mx-auto w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
                      <p className="text-muted-foreground">
                        Processing CSV file...
                      </p>
                    </div>
                  ) : file ? (
                    <div className="space-y-4">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <Button onClick={() => setCurrentStep("mapping")}>
                        Continue to Column Mapping
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
                      <div>
                        <p className="text-lg font-medium">
                          {isDragActive
                            ? "Drop the CSV file here"
                            : "Drag & drop CSV file here"}
                        </p>
                        <p className="text-muted-foreground">
                          or click to select a file (max 10MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <h4 className="font-medium mb-2">CSV Format Requirements:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• First row should contain column headers</li>
                    <li>
                      • Include at least an email or customer identifier column
                    </li>
                    <li>
                      • Optional: demographics (age, gender, location, income)
                    </li>
                    <li>
                      • Optional: interests and behaviors (comma-separated)
                    </li>
                    <li>• File size limit: 10MB</li>
                  </ul>
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
                  Match your CSV columns to customer data fields
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {csvData && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Email/Customer ID *</Label>
                        <Select
                          value={columnMapping.email || ""}
                          onValueChange={(value) =>
                            setColumnMapping({ ...columnMapping, email: value })
                          }
                        >
                          <SelectTrigger>
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

                      <div>
                        <Label>Customer Name</Label>
                        <Select
                          value={columnMapping.name || ""}
                          onValueChange={(value) =>
                            setColumnMapping({ ...columnMapping, name: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select name column" />
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

                      <div>
                        <Label>Age</Label>
                        <Select
                          value={columnMapping.age || ""}
                          onValueChange={(value) =>
                            setColumnMapping({ ...columnMapping, age: value })
                          }
                        >
                          <SelectTrigger>
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

                      <div>
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
                          <SelectTrigger>
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

                      <div>
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
                          <SelectTrigger>
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

                      <div>
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
                          <SelectTrigger>
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
                    </div>

                    <div className="space-y-2">
                      <Label>CSV Preview (first 5 rows)</Label>
                      <ScrollArea className="h-64 w-full border rounded-md">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              {csvData.headers.map((header) => (
                                <TableHead
                                  key={header}
                                  className="whitespace-nowrap"
                                >
                                  {header}
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
                                    className="whitespace-nowrap"
                                  >
                                    {row[header] || "-"}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </div>

                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep("upload")}
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handleColumnMapping}
                        disabled={!columnMapping.email}
                      >
                        Continue to Preview
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
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Customers
                      </p>
                      <p className="text-lg font-semibold">
                        {customers.length}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Valid Records
                      </p>
                      <p className="text-lg font-semibold">
                        {customers.filter((c) => c.email).length}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Data Quality
                      </p>
                      <p className="text-lg font-semibold">Good</p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Audience Name</Label>
                  <Input
                    value={audienceName}
                    onChange={(e) => setAudienceName(e.target.value)}
                    placeholder="Enter audience name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Customer Preview (first 10 records)</Label>
                  <ScrollArea className="h-64 w-full border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Email</TableHead>
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
                              <div className="space-y-1">
                                {customer.demographics.age && (
                                  <Badge variant="outline" className="text-xs">
                                    {customer.demographics.age}
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
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep("mapping")}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleCreateAudience}
                    disabled={!audienceName.trim() || customers.length === 0}
                  >
                    Create Audience
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          {currentStep === "upload" && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Download className="w-4 h-4" />
              <span>
                Need a template?
                <Button variant="link" className="p-0 h-auto text-primary">
                  Download sample CSV
                </Button>
              </span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
