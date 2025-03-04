import React, { useState } from "react";
import { ScammerResponse, Report } from "../../api/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Trash2, CalendarIcon, UserIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import { deleteReport } from "../../api/scammerApi";
import { useToast } from "../../components/ui/use-toast";
import { useAuth } from "../../hooks/useAuth";

interface ScammerCardProps {
  scammer: ScammerResponse;
  isUserReport: boolean;
  userId?: string;
  onReportDeleted?: () => void;
}

export const ScammerCard: React.FC<ScammerCardProps> = ({
  scammer,
  isUserReport,
  userId,
  onReportDeleted,
}) => {
  const { toast } = useToast();
  const { token } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  // Find user's report if this is in user reports section
  const userReport = isUserReport
    ? (scammer.reports?.find((report) => report?.reportedBy?._id === userId) as
        | Report
        | undefined)
    : null;

  // Use first report for community reports
  const primaryReport = userReport || (scammer.reports?.[0] as Report);
  const hasMultipleReports = scammer.reports?.length > 1;

  if (!primaryReport) return null; // Safety check

  const handleDeleteReport = async () => {
    if (!token || !userReport) return;

    try {
      setIsDeleting(true);
      await deleteReport(scammer._id, userReport._id, token);

      toast({
        title: "Report deleted",
        description: "Your report has been successfully deleted",
      });

      if (onReportDeleted) {
        onReportDeleted(); // Aggiorna i dati nel componente genitore
      }
    } catch (error) {
      console.error("Error deleting report:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete your report. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{primaryReport.name}</CardTitle>
          <div className="flex items-center gap-2">
            {hasMultipleReports && (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                {scammer.reports.length} reports
              </span>
            )}

            {/* Mostra il bottone di eliminazione solo se è un report dell'utente */}
            {isUserReport && userReport && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                    <span className="sr-only">Delete report</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete your report about this
                      LinkedIn profile. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteReport}
                      disabled={isDeleting}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      {isDeleting ? "Deleting..." : "Confirm Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
        <CardDescription>{primaryReport.company}</CardDescription>
      </CardHeader>

      <CardContent className="flex-grow">
        {/* Only show primary report details at top level when single report */}
        {!hasMultipleReports ? (
          <>
            <p className="text-sm mb-2">{primaryReport.notes}</p>
            <p className="text-sm text-muted-foreground mb-3">
              Type: {primaryReport.scamType}
            </p>
          </>
        ) : (
          // For multiple reports, just show a brief summary
          <p className="text-sm mb-3">
            Multiple reports from different users. Check details below.
          </p>
        )}

        {/* Show all reports if there are multiple */}
        {hasMultipleReports && scammer.reports && (
          <Accordion type="single" collapsible className="mt-2">
            <AccordionItem value="reports">
              <AccordionTrigger>View all reports</AccordionTrigger>
              <AccordionContent>
                {scammer.reports.map((report, index) => (
                  <div
                    key={report._id}
                    className={`py-2 ${index > 0 ? "border-t mt-2" : ""}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <UserIcon size={14} />
                      <span className="text-sm font-medium">
                        {report.reportedBy?.username || "Unknown User"}
                      </span>
                    </div>

                    <p className="text-sm mb-1">
                      <strong>Type:</strong> {report.scamType}
                    </p>

                    <p className="text-sm mb-1">"{report.notes}"</p>

                    <div className="flex items-center gap-2">
                      <CalendarIcon size={14} />
                      <span className="text-xs text-muted-foreground">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </CardContent>

      <CardFooter>
        <Button variant="outline" asChild className="w-full">
          <a
            href={
              scammer.profileLink.startsWith("http")
                ? scammer.profileLink
                : `https://${scammer.profileLink}`
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            View LinkedIn Profile
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};
