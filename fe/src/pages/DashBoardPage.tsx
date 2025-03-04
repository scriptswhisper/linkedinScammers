import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../components/ui/use-toast";
import { getScammers } from "../api/scammerApi";
import { ScammerResponse } from "../api/types";
import { WelcomeCard } from "../components/dashboard/WelcomeCard";
import { UserReportsSection } from "../components/dashboard/UserReportsSection";
import { CommunityReportsSection } from "../components/dashboard/CommunityReportSection";

// Definizione dell'interfaccia per la risposta API
interface ScammersApiResponse {
  scammers?: ScammerResponse[];
  success?: boolean;
  count?: number;
}

const DashBoardPage: React.FC = () => {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [scammers, setScammers] = useState<ScammerResponse[]>([]);

  const fetchScammers = async () => {
    try {
      setLoading(true);
      if (!token) return;

      const response = (await getScammers(token)) as
        | ScammerResponse[]
        | ScammersApiResponse;

      const scammersData = Array.isArray(response)
        ? response
        : (response as ScammersApiResponse).scammers || [];

      setScammers(scammersData);
    } catch (error) {
      console.error("Error fetching scammers:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load scammer reports",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScammers();
  }, [token, toast]);

  // Safe access to make sure we're working with arrays
  const userReports = Array.isArray(scammers)
    ? scammers.filter((scammer) =>
        scammer?.reports?.some((report) => report?.reportedBy?._id === user?.id)
      )
    : [];

  const communityReports = Array.isArray(scammers)
    ? scammers.filter((scammer) =>
        scammer?.reports?.every(
          (report) => report?.reportedBy?._id !== user?.id
        )
      )
    : [];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <WelcomeCard username={user?.username || "User"} />
        <UserReportsSection
          reports={userReports}
          loading={loading}
          userId={user?.id}
          onReportDeleted={fetchScammers}
        />
      </div>

      <CommunityReportsSection
        reports={communityReports}
        loading={loading}
        userId={user?.id}
      />
    </div>
  );
};

export default DashBoardPage;
