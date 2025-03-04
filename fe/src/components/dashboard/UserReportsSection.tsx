import React from "react";
import { ScammerResponse } from "../../api/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { ScammerCard } from "./ScammerCard";

interface UserReportsSectionProps {
  reports: ScammerResponse[];
  loading: boolean;
  userId?: string;
  onReportDeleted?: () => void;
}

export const UserReportsSection: React.FC<UserReportsSectionProps> = ({
  reports,
  loading,
  userId,
  onReportDeleted,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Reports ({reports.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground">Loading your reports...</p>
        ) : reports.length === 0 ? (
          <p className="text-muted-foreground">
            You haven't reported any scammers yet. Start contributing by
            reporting suspicious LinkedIn profiles.
          </p>
        ) : (
          <div className="space-y-4">
            {reports.map((scammer) => (
              <ScammerCard
                key={scammer._id}
                scammer={scammer}
                isUserReport={true}
                userId={userId}
                onReportDeleted={onReportDeleted}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
