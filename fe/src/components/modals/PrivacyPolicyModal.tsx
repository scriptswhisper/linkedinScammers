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

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[800px] max-h-[80vh] bg-white">
        <DialogHeader>
          <DialogTitle>Privacy Policy</DialogTitle>
          <DialogDescription>
            How we handle your data and protect your privacy.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            <section>
              <h3 className="font-semibold mb-2">1. Data Collection</h3>
              <p>
                We collect minimal user data, limited to: - LinkedIn ID for
                authentication - Username - Reports submitted by users
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">2. Data Usage</h3>
              <p>
                Your data is used solely for: - User authentication - Managing
                report submissions - Displaying report history We do not collect
                email addresses or share any personal data with third parties.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">3. Data Protection</h3>
              <p>
                All data is stored securely and we implement appropriate
                measures to protect against unauthorized access, alteration, or
                destruction of the data we hold.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">4. User Rights</h3>
              <p>
                Users have the right to: - Access their data - Request data
                deletion - Modify their reports Contact us to exercise these
                rights.
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
