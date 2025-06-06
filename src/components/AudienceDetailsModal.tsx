import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Audience } from "@/types/audience";
import {
  Edit,
  Copy,
  Trash2,
  Users,
  Target,
  Activity,
  TrendingUp,
  Calendar,
  Database,
  BarChart3,
} from "lucide-react";

interface AudienceDetailsModalProps {
  audience: Audience | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateAudience: (id: string, updates: Partial<Audience>) => void;
  onDuplicateAudience: (id: string) => void;
  onDeleteAudience: (id: string) => void;
}

export function AudienceDetailsModal({
  audience,
  open,
  onOpenChange,
  onUpdateAudience,
  onDuplicateAudience,
  onDeleteAudience,
}: AudienceDetailsModalProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!audience) return null;

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    onUpdateAudience(audience.id, { status: newStatus as Audience["status"] });
    setIsUpdating(false);
  };

  const handleDelete = () => {
    onDeleteAudience(audience.id);
    setShowDeleteDialog(false);
    onOpenChange(false);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`;
    }
    return num.toString();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl">{audience.name}</DialogTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant={
                      audience.status === "Active" ? "default" : "secondary"
                    }
                  >
                    {audience.status}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={
                      audience.performance === "High"
                        ? "border-green-500 text-green-700"
                        : audience.performance === "Medium"
                          ? "border-yellow-500 text-yellow-700"
                          : "border-red-500 text-red-700"
                    }
                  >
                    {audience.performance} Performance
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={audience.status}
                  onValueChange={handleStatusChange}
                  disabled={isUpdating}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Paused">Paused</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDuplicateAudience(audience.id)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Audience Size
                      </p>
                      <p className="text-lg font-semibold">
                        {formatNumber(audience.size)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Similarity
                      </p>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={audience.similarity}
                          className="w-16 h-2"
                        />
                        <span className="text-lg font-semibold">
                          {audience.similarity}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Source</p>
                      <p className="text-lg font-semibold">{audience.source}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Created</p>
                      <p className="text-lg font-semibold">
                        {new Date(audience.created).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {audience.description && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {audience.description}
                  </p>
                </CardContent>
              </Card>
            )}

            <Tabs defaultValue="targeting" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="targeting">Targeting Criteria</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="targeting" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Demographics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {audience.targetingCriteria.demographics.map((demo) => (
                          <Badge key={demo} variant="outline">
                            {demo}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Interests</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {audience.targetingCriteria.interests.map(
                          (interest) => (
                            <Badge key={interest} variant="outline">
                              {interest}
                            </Badge>
                          ),
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Behaviors</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {audience.targetingCriteria.behaviors.map(
                          (behavior) => (
                            <Badge key={behavior} variant="outline">
                              {behavior}
                            </Badge>
                          ),
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Engagement Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Reach Rate</span>
                          <span>{audience.campaignData.engagement}%</span>
                        </div>
                        <Progress
                          value={audience.campaignData.engagement}
                          className="h-2"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Conversion Rate</span>
                          <span>{audience.campaignData.conversion}%</span>
                        </div>
                        <Progress
                          value={audience.campaignData.conversion}
                          className="h-2"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Activity className="w-5 h-5" />
                        Campaign Data
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Total Reach
                          </span>
                          <span className="font-medium">
                            {formatNumber(audience.campaignData.reach)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Clicks
                          </span>
                          <span className="font-medium">
                            {formatNumber(audience.campaignData.clicks)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Impressions
                          </span>
                          <span className="font-medium">
                            {formatNumber(audience.campaignData.impressions)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Audience Insights
                    </CardTitle>
                    <CardDescription>
                      Detailed analytics and performance trends for this
                      audience
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
                        <p className="text-muted-foreground">
                          Analytics chart would be displayed here
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Best Performing Day</p>
                          <p className="text-muted-foreground">Tuesday</p>
                        </div>
                        <div>
                          <p className="font-medium">Peak Activity Time</p>
                          <p className="text-muted-foreground">
                            2:00 PM - 4:00 PM
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">Top Device</p>
                          <p className="text-muted-foreground">Mobile (67%)</p>
                        </div>
                        <div>
                          <p className="font-medium">Avg. Session Duration</p>
                          <p className="text-muted-foreground">2m 34s</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Audience</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{audience.name}"? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
