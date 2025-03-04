import React from "react";
import { ScammerResponse } from "../../api/types";
import { ScammerCard } from "./ScammerCard";

interface CommunityReportsSectionProps {
  reports: ScammerResponse[];
  loading: boolean;
  userId?: string;
}

export const CommunityReportsSection: React.FC<
  CommunityReportsSectionProps
> = ({ reports, loading, userId }) => {
  return (
    <>
      <h2 className="text-2xl font-bold mt-12 mb-6">
        Recent Reports from Community
      </h2>
      {loading ? (
        <div className="border rounded-lg p-8 text-center">
          <p className="text-muted-foreground">Loading recent reports...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="border rounded-lg p-8 text-center">
          <p className="text-muted-foreground">No community reports yet.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((scammer) => (
            <ScammerCard
              key={scammer._id}
              scammer={scammer}
              isUserReport={false}
              userId={userId}
            />
          ))}
        </div>
      )}
    </>
  );
};
