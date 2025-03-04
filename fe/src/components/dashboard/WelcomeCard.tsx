import React from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Link } from "react-router-dom";

interface WelcomeCardProps {
  username: string;
}

export const WelcomeCard: React.FC<WelcomeCardProps> = ({ username }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome, {username}!</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          Thank you for helping keep the LinkedIn community safe from scammers.
        </p>
        <Button asChild>
          <Link to="/report">Report a New Scammer</Link>
        </Button>
      </CardContent>
    </Card>
  );
};
