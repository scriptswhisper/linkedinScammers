import { Link } from "react-router-dom";
import { Github } from "lucide-react";

const Footer = () => {
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
          <Link
            to="/privacy"
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms"
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Terms of Service
          </Link>
          <a
            href="https://github.com/yourusername/blacklist-linkedin-scammers"
            target="_blank"
            rel="noreferrer"
            className="rounded-md p-2 hover:bg-accent hover:text-accent-foreground"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
