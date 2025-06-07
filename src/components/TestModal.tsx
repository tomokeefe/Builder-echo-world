import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TestModal({ open, onOpenChange }: TestModalProps) {
  console.log("TestModal rendered with open:", open);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Test Modal</DialogTitle>
          <DialogDescription>
            This is a test modal to verify the dialog system is working.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <p>If you can see this, the dialog system is working correctly!</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button onClick={() => alert("Test button clicked!")}>
              Test Action
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
