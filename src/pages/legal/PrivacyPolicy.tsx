import Layout from "@/components/layout/Layout";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="bg-gradient-to-r from-finance-primary to-finance-primary/90 text-white py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-white/90">
              How we protect and handle your information
            </p>
          </div>
        </div>
      </div>

      <div className="container py-8 md:py-12">
        <Button
          variant="ghost"
          className="mb-6 text-finance-primary hover:text-finance-primary/90"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <ScrollArea className="h-[60vh] pr-6">
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-finance-primary">
                Introduction
              </h2>
              <p className="text-muted-foreground">
                At Fiscal Compass, we take your privacy seriously. This Privacy
                Policy explains how we collect, use, disclose, and safeguard
                your information when you visit our website. Please read this
                privacy policy carefully. If you do not agree with the terms of
                this privacy policy, please do not access the site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-finance-primary">
                Information We Collect
              </h2>
              <p className="text-muted-foreground mb-3">
                We collect information that you voluntarily provide to us when
                you:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Use our financial calculators</li>
                <li>Subscribe to our newsletter</li>
                <li>Contact us through our website</li>
                <li>Participate in user surveys</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-finance-primary">
                How We Use Your Information
              </h2>
              <p className="text-muted-foreground mb-3">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Provide and maintain our services</li>
                <li>Improve user experience</li>
                <li>Send periodic emails (if you've opted in)</li>
                <li>Analyze usage patterns to enhance our website</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-finance-primary">
                Data Security
              </h2>
              <p className="text-muted-foreground">
                We implement appropriate technical and organizational security
                measures to protect your personal information. However, no
                security system is impenetrable and we cannot guarantee the
                security of our systems 100%.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-finance-primary">
                Cookies
              </h2>
              <p className="text-muted-foreground">
                We use cookies to enhance your experience on our site. You can
                set your browser to refuse all or some browser cookies, but this
                may prevent some parts of our website from functioning properly.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-finance-primary">
                Third-Party Links
              </h2>
              <p className="text-muted-foreground">
                Our website may contain links to third-party websites. We are
                not responsible for the privacy practices or content of these
                websites.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-finance-primary">
                Your Rights
              </h2>
              <p className="text-muted-foreground mb-3">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Withdraw consent for data processing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-finance-primary">
                Contact Us
              </h2>
              <p className="text-muted-foreground">
                If you have questions about this Privacy Policy, please contact
                us through our website's contact form.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-finance-primary">
                Updates to This Policy
              </h2>
              <p className="text-muted-foreground">
                We may update this privacy policy from time to time. We will
                notify you of any changes by posting the new privacy policy on
                this page.
              </p>
            </section>
          </div>
        </ScrollArea>
      </div>
    </Layout>
  );
}
