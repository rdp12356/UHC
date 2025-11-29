import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, Check, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function CsvUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("idle"); // idle, uploading, success, error

  const handleUpload = () => {
    setStatus("uploading");
    setUploading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          setStatus("success");
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <div className="max-w-xl mx-auto py-12 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-serif font-bold">Bulk Data Upload</h1>
        <p className="text-muted-foreground">Upload CSV files for mass household updates.</p>
      </div>

      <Card className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-colors cursor-pointer bg-slate-50 dark:bg-slate-950/50">
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="p-4 bg-white dark:bg-slate-900 rounded-full shadow-sm">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <div className="text-center">
            <h3 className="font-medium text-lg">Drag & Drop or Click to Upload</h3>
            <p className="text-sm text-muted-foreground mt-1">Supported formats: .csv, .xlsx</p>
          </div>
          {status === "idle" && (
            <Button onClick={handleUpload} variant="secondary">Select File</Button>
          )}
        </CardContent>
      </Card>

      {status !== "idle" && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 text-green-600 rounded">
                <FileSpreadsheet className="h-6 w-6" />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-sm">ward_12_data.csv</span>
                  <span className="text-xs text-muted-foreground">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>
            
            {status === "success" && (
              <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 p-3 rounded border border-emerald-100">
                <Check className="h-4 w-4" />
                Upload complete! 45 records processed successfully.
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      <div className="text-center">
        <Button variant="link" className="text-muted-foreground">Download Template CSV</Button>
      </div>
    </div>
  );
}
