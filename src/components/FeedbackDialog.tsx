import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { MessageSquarePlus } from "lucide-react";

const cosSupabase = createClient(
  "https://npngxiprlrsodvggbaqt.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wbmd4aXBybHJzb2R2Z2diYXF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3NTAyODMsImV4cCI6MjA4NTMyNjI4M30.E8f2QiwA84EI155cD2r15FG48pz0zf7MCDjx91eoJYg"
);
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const CATEGORIES = ["Bug", "Feature Request", "General"];

const FeedbackDialog = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [category, setCategory] = useState("General");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!feedback.trim()) return;

    setSubmitting(true);
    try {
      const parts: string[] = [];
      if (name) parts.push(`From: ${name}`);
      if (email) parts.push(`Email: ${email}`);
      parts.push(`\n${feedback}`);
      const description = parts.join("\n");
      const title = `[DealBreaker ${category}] ${feedback.slice(0, 80)}${feedback.length > 80 ? "..." : ""}`;

      const { error } = await cosSupabase.from("cos_ideas").insert({
        title,
        description,
        status: "New",
        category_id: "fec0d3b9-7a5b-4ab5-a526-b21b17cb09e8",
      });

      if (error) throw error;

      toast({ title: "Thanks for your feedback!", description: "We'll review it soon." });
      setName("");
      setEmail("");
      setFeedback("");
      setCategory("General");
      setOpen(false);
    } catch (e) {
      console.error("Feedback submit error:", e);
      toast({ title: "Couldn't send feedback", description: "Please try again later.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-muted-foreground hover:text-primary transition-colors" title="Send Feedback">
          <MessageSquarePlus className="h-5 w-5" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Feedback</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-10 rounded-md bg-input border border-input-border px-3 text-sm text-foreground focus:outline-none focus:border-primary"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              Your Feedback <span className="text-destructive">*</span>
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us what you think..."
              rows={4}
              className="w-full rounded-md bg-input border border-input-border px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                Name <span className="text-muted-foreground normal-case">(optional)</span>
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="bg-input border-input-border focus:border-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                Email <span className="text-muted-foreground normal-case">(optional)</span>
              </label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                type="email"
                className="bg-input border-input-border focus:border-primary"
              />
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!feedback.trim() || submitting}
            className="w-full"
          >
            {submitting ? "Sending..." : "Submit Feedback"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
