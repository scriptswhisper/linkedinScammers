import React from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useToast } from "../components/ui/use-toast";
import { useAuth } from "../hooks/useAuth";
import { reportScammer } from "../api/scammerApi";

const formSchema = z.object({
  profileLink: z.string().url("Please enter a valid LinkedIn URL"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  company: z.string().min(2, "Company name must be at least 2 characters"),
  scamType: z.enum(
    [
      "job_offer",
      "recruitment",
      "investment",
      "phishing",
      "malicious_video_call",
      "malicious_repo",
      "other",
    ],
    {
      required_error: "Please select a scam type",
    }
  ),
  notes: z
    .string()
    .min(10, "Please provide more details (at least 10 characters)"),
});

const ReportScammerPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { token } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profileLink: "",
      name: "",
      company: "",
      scamType: undefined,
      notes: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!token) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please login to report a scammer",
        });
        navigate("/login");
        return;
      }

      console.log("Submitting report with values:", values);
      const response = await reportScammer(values, token);
      console.log("Server response:", response);

      toast({
        title: "Scammer reported successfully",
        description: "Thank you for helping keep LinkedIn safe.",
      });

      navigate("/dashboard");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error submitting report:", error);

      // Extract the specific error message if available from the server response
      const errorMessage =
        error.response?.data?.message ||
        (error instanceof Error ? error.message : "Please try again later.");

      toast({
        variant: "destructive",
        title: "Error reporting scammer",
        description: errorMessage,
      });
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Report a LinkedIn Scammer</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="profileLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn Profile URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://linkedin.com/in/username"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Copy the full URL of the scammer's LinkedIn profile
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scammer's Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Name shown on their profile"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Company they claim to represent"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="scamType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type of Scam</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type of scam" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="job_offer">Fake Job Offer</SelectItem>
                      <SelectItem value="recruitment">
                        Fraudulent Recruitment
                      </SelectItem>
                      <SelectItem value="investment">
                        Investment Scam
                      </SelectItem>
                      <SelectItem value="phishing">Phishing Attempt</SelectItem>
                      <SelectItem value="malicious_video_call">
                        Malicious Video Call Software
                      </SelectItem>
                      <SelectItem value="malicious_repo">
                        Malicious Repository
                      </SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Details</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please describe how you identified this as a scam..."
                      className="h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Include any red flags, suspicious language, or other details
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Submit Report
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ReportScammerPage;
