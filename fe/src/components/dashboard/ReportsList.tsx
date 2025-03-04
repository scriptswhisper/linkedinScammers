import React from "react";
import { CalendarIcon, UserIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";

interface Report {
  _id: string;
  reportedBy: {
    _id: string;
    username: string;
  };
  name: string;
  company: string;
  scamType: string;
  notes: string;
  createdAt: string;
}

interface ReportsListProps {
  reports: Report[];
}

export const ReportsList: React.FC<ReportsListProps> = ({ reports }) => {
  return (
    <Accordion type="single" collapsible className="mt-2">
      <AccordionItem value="reports">
        <AccordionTrigger>View all reports</AccordionTrigger>
        <AccordionContent>
          {reports.map((report, index) => (
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
  );
};
