import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { searchScammer, ScammerSearchResponse } from "../../api/scammerApi";
import { useAuth } from "../../hooks/useAuth";
import { CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { useToast } from "../ui/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

interface SearchFormData {
  profileLink: string;
}

interface ReportItem {
  _id: string;
  reportedBy: {
    _id: string;
    username: string;
    email?: string;
  };
  scamType: string;
  notes: string;
  createdAt: string;
}

export const ScammerSearch: React.FC = () => {
  const [searchResult, setSearchResult] =
    useState<ScammerSearchResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const { token } = useAuth();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormData>();

  const onSubmit = async (data: SearchFormData) => {
    setLoading(true);
    try {
      const result = await searchScammer(data.profileLink, token || "");
      setSearchResult(result as ScammerSearchResponse);
    } catch (error) {
      console.error("Error searching for scammer:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to search for profile",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderSearchResult = () => {
    if (!searchResult) return null;

    if (searchResult.found && searchResult.report) {
      const { report } = searchResult;
      const hasMultipleReports = report.reports.length > 1;

      return (
        <Card className="mt-4 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-red-100 p-2">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-red-700">
                    Caution: This profile has been reported
                  </h3>
                  {hasMultipleReports && (
                    <span className="bg-red-200 text-red-800 text-xs font-medium px-2 py-1 rounded">
                      {report.totalReports} reports
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-700 mt-1">
                  <strong>Name:</strong> {report.name}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Company:</strong> {report.company}
                </p>

                {/* Report summary */}
                <div className="mt-4 border-t border-red-200 pt-3">
                  <h4 className="font-medium text-red-800 mb-2">
                    {hasMultipleReports ? "Report Summary" : "Report Details"}
                  </h4>

                  {hasMultipleReports ? (
                    <Accordion type="single" collapsible className="w-full">
                      {report.reports.map(
                        (reportItem: ReportItem, index: number) => (
                          <AccordionItem
                            key={reportItem._id}
                            value={`item-${index}`}
                          >
                            <AccordionTrigger className="py-2 text-sm hover:no-underline">
                              <div className="flex justify-between items-center w-full">
                                <span className="font-medium">
                                  Reported by{" "}
                                  {reportItem.reportedBy?.username ||
                                    "Anonymous"}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(
                                    reportItem.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="pl-4 py-2 space-y-1">
                                <p className="text-sm">
                                  <strong>Type:</strong> {reportItem.scamType}
                                </p>
                                <p className="text-sm">
                                  <strong>Details:</strong>{" "}
                                  {reportItem.notes || "No details provided"}
                                </p>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        )
                      )}
                    </Accordion>
                  ) : (
                    // Single report view
                    <div className="space-y-1">
                      <p className="text-sm">
                        <strong>Reported by:</strong>{" "}
                        {report.reports[0]?.reportedBy?.username || "Anonymous"}
                      </p>
                      <p className="text-sm">
                        <strong>Type of scam:</strong>{" "}
                        {report.reports[0]?.scamType || "Unknown"}
                      </p>
                      <p className="text-sm">
                        <strong>Details:</strong>{" "}
                        {report.reports[0]?.notes || "No details provided"}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Reported on{" "}
                        {new Date(
                          report.reports[0]?.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-red-100/50 text-xs text-gray-500">
            First reported on{" "}
            {new Date(report.firstReportedAt).toLocaleDateString()}
            {report.firstReportedAt !== report.lastReportedAt &&
              `, last reported on ${new Date(
                report.lastReportedAt
              ).toLocaleDateString()}`}
          </CardFooter>
        </Card>
      );
    }

    return (
      <Card className="mt-4 border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-green-100 p-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-700">
                Good news! This profile hasn't been reported
              </h3>
              <p className="text-sm text-gray-700 mt-2">
                No reports found for this LinkedIn profile. Still, always be
                cautious when interacting with people online.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label htmlFor="profileLink">LinkedIn Profile URL</Label>
          <div className="flex gap-2">
            <Input
              id="profileLink"
              placeholder="https://www.linkedin.com/in/username"
              {...register("profileLink", {
                required: "LinkedIn URL is required",
                pattern: {
                  value: /linkedin\.com\/in\//,
                  message: "Please enter a valid LinkedIn profile URL",
                },
              })}
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Searching..." : "Check"}
            </Button>
          </div>
          {errors.profileLink && (
            <p className="text-sm text-red-500">{errors.profileLink.message}</p>
          )}
        </div>
      </form>

      {renderSearchResult()}
    </div>
  );
};
