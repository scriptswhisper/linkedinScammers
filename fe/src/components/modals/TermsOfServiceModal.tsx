import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

interface TermsOfServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsOfServiceModal: React.FC<TermsOfServiceModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[800px] max-h-[80vh] bg-white">
        <DialogHeader>
          <DialogTitle>Terms of Service</DialogTitle>
          <DialogDescription>
            Please read these terms carefully before using our service.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            <section>
              <h3 className="font-semibold mb-2">1. Service Overview</h3>
              <p>
                LinkedIn Scammer Blacklist is an open-source project designed to
                help users identify and report potential scammers on LinkedIn.
                The service is currently provided free of charge and allows
                users to submit and view reports about suspicious LinkedIn
                profiles.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">2. User Responsibilities</h3>
              <p>
                Users must provide accurate information when submitting reports
                and should not abuse the system by submitting false reports. We
                reserve the right to suspend or terminate accounts that violate
                these terms.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">
                3. Limitations of Liability
              </h3>
              <p>
                This is an open-source project provided "as is" without any
                warranties. We are not responsible for any damages or losses
                resulting from your use of the service.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">4. Future Changes</h3>
              <p>
                The service may evolve in the future to include premium features
                or advertising. Any significant changes to the service will be
                communicated to users in advance.
              </p>
            </section>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
