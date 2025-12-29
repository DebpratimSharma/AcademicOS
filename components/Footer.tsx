import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/50 backdrop-blur-md py-8">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-muted-foreground">
          © 2025 <span className="font-bold italic text-foreground">AcademicOS</span>. Built for students.
        </div>
        <nav className="flex gap-6 text-sm font-medium text-muted-foreground">
          <Link href="/privacy" className="hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-primary transition-colors">
            Terms & Conditions
          </Link>
          <a href="mailto:support@yourdomain.com" className="hover:text-primary transition-colors">
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}