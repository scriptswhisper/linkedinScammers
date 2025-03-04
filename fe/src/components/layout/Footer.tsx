// filepath: /home/clod/Desktop/blacklist-linkedin-scammers/fe/src/components/layout/Footer.tsx
import { useState } from "react";
import { Github } from "lucide-react";
import { PrivacyPolicyModal } from "../modals/PrivacyPolicyModal";
import { TermsOfServiceModal } from "../modals/TermsOfServiceModal";

const Footer = () => {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} LinkedIn Scammer Blacklist. All
            rights reserved.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowPrivacy(true)}
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setShowTerms(true)}
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Terms of Service
          </button>
          <a
            href="https://github.com/boobaGreen/linkedinScammers"
            target="_blank"
            rel="noreferrer"
            className="rounded-md p-2 hover:bg-accent hover:text-accent-foreground"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </a>
        </div>
      </div>

      <PrivacyPolicyModal
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
      />
      <TermsOfServiceModal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
      />
    </footer>
  );
};

export default Footer;
