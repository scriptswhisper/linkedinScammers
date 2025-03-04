import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/button";
import { ScammerSearch } from "../components/scammers/ScammerSearch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Shield, AlertTriangle, CheckCircle } from "lucide-react";

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="container px-4 py-12 md:py-24">
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center space-x-2">
          <Shield className="h-12 w-12 text-primary" />
          <h1 className="text-4xl font-bold">LinkedIn Scammer Blacklist</h1>
        </div>

        <p className="mt-6 max-w-[42rem] text-xl text-muted-foreground">
          Protect yourself from LinkedIn scammers. Report suspicious profiles
          and verify recruiters before responding.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {isAuthenticated ? (
            <Link to="/report">
              <Button size="lg" className="h-12">
                Report a Scammer
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/register">
                <Button size="lg" className="h-12">
                  Register Now
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="h-12">
                  Login
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Search Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center mb-6">
          Check if a Profile Has Been Reported
        </h2>
        <ScammerSearch />
      </div>

      {/* Features Section */}
      <div className="mt-24 grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Report Scammers
            </CardTitle>
            <CardDescription>
              Help protect others in the community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Document and report fake recruiters, fraudulent job offers, and
              other scams you encounter on LinkedIn.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Verify Recruiters
            </CardTitle>
            <CardDescription>
              Check before responding to messages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Search our database to check if a recruiter or company has been
              reported before engaging with them.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Stay Protected
            </CardTitle>
            <CardDescription>
              Learn to identify common scam patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Access resources and tips on how to identify and avoid common
              LinkedIn scams targeting job seekers.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
