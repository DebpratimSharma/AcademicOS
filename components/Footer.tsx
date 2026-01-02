import Link from "next/link";
import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/50 backdrop-blur-md py-8">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-muted-foreground">
          © 2025{" "}
          <span className="font-bold italic text-foreground">AcademicOS</span>
          <Link
            href="https://github.com/DebpratimSharma"
            className=" hover:text-primary transition-colors"
          >
            {" "}
            By <span className="underline">Debpratim Sharma</span>
          </Link>
        </div>
        <nav className="flex gap-6 text-sm font-medium text-muted-foreground">
          <Link
            href="/privacy"
            className="hover:text-primary transition-colors"
          >
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-primary transition-colors">
            Terms & Conditions
          </Link>
          <Link
            href="mailto:debpratimsharma33@gmail.com"
            className="hover:text-primary transition-colors"
          >
            Contact
          </Link>
          <Link
            href="https://github.com/DebpratimSharma/AcademicOS"
            className="hover:text-primary transition-colors"
          >
            <div className="flex gap-1">
              <Github />
              <span>Go to repository</span>
            </div>
          </Link>
        </nav>
      </div>
    </footer>
  );
}
