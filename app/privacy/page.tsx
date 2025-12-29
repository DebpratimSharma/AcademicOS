export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto py-20 px-6 prose prose-zinc dark:prose-invert">
      <h1 className="text-3xl font-bold italic mb-6">Privacy Policy</h1>
      <p className="text-muted-foreground">Effective Date: December 2025</p>
      
      <section className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">1. Information We Collect</h2>
        <p>AcademicOS only accesses your Google profile information (email and name) via Supabase Auth to create your account and save your personal schedule.</p>
        
        <h2 className="text-xl font-semibold">2. How We Use Data</h2>
        <p>Your data is used strictly for display within the app. We do not sell, trade, or share your information with third parties.</p>
        
        <h2 className="text-xl font-semibold">3. Data Retention</h2>
        <p>Your routine data is stored securely in Supabase. You can delete your account and all associated data at any time through the dashboard.</p>
      </section>
    </div>
  );
}