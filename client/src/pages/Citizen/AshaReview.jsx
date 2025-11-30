import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Star, Plus, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function AshaReview() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [ashaWorkers, setAshaWorkers] = useState([]);
  const [selectedAshaId, setSelectedAshaId] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAshaWorkers();
  }, []);

  const fetchAshaWorkers = async () => {
    try {
      const res = await fetch("/api/asha-workers");
      if (res.ok) {
        const data = await res.json();
        setAshaWorkers(data || mockAshaWorkers);
      }
    } catch (err) {
      setAshaWorkers(mockAshaWorkers);
    }
  };

  const mockAshaWorkers = [
    { asha_id: "ASHA-12-001", name: "Priya Kumar", ward_id: "WARD-KL-ER-12", status: "active" },
    { asha_id: "ASHA-12-002", name: "Anjali Singh", ward_id: "WARD-KL-ER-12", status: "active" }
  ];

  const handleSubmitReview = async () => {
    if (!selectedAshaId || !rating) {
      alert("Please select a worker and rating");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/asha/${selectedAshaId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          citizen_id: user?.id,
          rating: parseInt(rating),
          review_text: reviewText || null,
          visit_date: new Date().toISOString().split('T')[0]
        })
      });

      if (res.ok) {
        alert("Review submitted successfully!");
        setReviewText("");
        setRating(5);
        setSelectedAshaId(null);
      }
    } catch (err) {
      console.error("Failed to submit review:", err);
    }
    setLoading(false);
  };

  const activeWorkers = ashaWorkers.filter(w => w.status === "active");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/citizen/dashboard")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Review ASHA Workers</h1>
          <p className="text-muted-foreground">Share your experience with health workers in your community</p>
        </div>
      </div>

      <div className="grid gap-6">
        {activeWorkers.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            No ASHA workers available for review
          </Card>
        ) : (
          activeWorkers.map((worker) => (
            <Card key={worker.asha_id} className="hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{worker.name}</h3>
                    <p className="text-sm text-muted-foreground">{worker.asha_id}</p>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button onClick={() => setSelectedAshaId(worker.asha_id)} className="gap-2" data-testid={`button-review-${worker.asha_id}`}>
                        <Plus className="h-4 w-4" /> Write Review
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Review {worker.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="rating">Rating</Label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => setRating(star)}
                                className={`p-2 rounded transition ${rating >= star ? "bg-yellow-400 text-white" : "bg-slate-200 dark:bg-slate-700"}`}
                                data-testid={`button-star-${star}`}
                              >
                                <Star className="h-5 w-5 fill-current" />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="review">Review (Optional)</Label>
                          <Textarea
                            id="review"
                            placeholder="Share your feedback about this ASHA worker..."
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            data-testid="textarea-review"
                          />
                        </div>
                        <Button
                          onClick={handleSubmitReview}
                          className="w-full"
                          disabled={loading}
                          data-testid="button-submit-review"
                        >
                          Submit Review
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
