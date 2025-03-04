import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../components/ui/use-toast";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "../components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { getScammers } from "../api/scammerApi";
import { ScammerResponse } from "../api/types";
import { CalendarIcon, UserIcon } from "lucide-react";

const DashBoardPage: React.FC = () => {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [scammers, setScammers] = useState<ScammerResponse[]>([]);

  useEffect(() => {
    const fetchScammers = async () => {
      try {
        if (!token) return;
        const data = await getScammers(token);
        setScammers(data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load scammer reports",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchScammers();
  }, [token, toast]);

  const userReports = scammers.filter((scammer) =>
    scammer.reports.some((report) => report.reportedBy._id === user?.id)
  );

  const communityReports = scammers.filter((scammer) =>
    scammer.reports.every((report) => report.reportedBy._id !== user?.id)
  );

  // Helper function to render a scammer card
  const renderScammerCard = (
    scammer: ScammerResponse,
    isUserReport: boolean
  ) => {
    // Find user's report if this is in user reports section
    const userReport = isUserReport
      ? scammer.reports.find((report) => report.reportedBy._id === user?.id)
      : null;

    // Use first report for community reports
    const primaryReport = userReport || scammer.reports[0];
    const hasMultipleReports = scammer.reports.length > 1;

    return (
      <Card key={scammer._id} className="h-full flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{scammer.name}</CardTitle>
            {hasMultipleReports && (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                {scammer.reports.length} reports
              </span>
            )}
          </div>
          <CardDescription>{scammer.company}</CardDescription>
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
          {hasMultipleReports && (
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
                          {report.reportedBy.username}
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
              href={scammer.profileLink}
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

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome, {user?.username}!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Thank you for helping keep the LinkedIn community safe from
              scammers.
            </p>
            <Button asChild>
              <a href="/report">Report a New Scammer</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Reports ({userReports.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Loading your reports...</p>
            ) : userReports.length === 0 ? (
              <p className="text-muted-foreground">
                You haven't reported any scammers yet. Start contributing by
                reporting suspicious LinkedIn profiles.
              </p>
            ) : (
              <div className="space-y-4">
                {userReports.map((scammer) => renderScammerCard(scammer, true))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold mt-12 mb-6">
        Recent Reports from Community
      </h2>
      {loading ? (
        <div className="border rounded-lg p-8 text-center">
          <p className="text-muted-foreground">Loading recent reports...</p>
        </div>
      ) : communityReports.length === 0 ? (
        <div className="border rounded-lg p-8 text-center">
          <p className="text-muted-foreground">No community reports yet.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {communityReports.map((scammer) => renderScammerCard(scammer, false))}
        </div>
      )}
    </div>
  );
};

export default DashBoardPage;
