import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function OptionsModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Options</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Options</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="language">Language</label>
            <Select defaultValue="en">
              <SelectTrigger id="language">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="no">Norwegian</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="secondary" className="w-full">Download Chat</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
