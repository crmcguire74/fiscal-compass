import Layout from "@/components/layout/Layout";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TermsOfService() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="bg-gradient-to-r from-finance-primary to-finance-primary/90 text-white py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-white/90">
              Rules and guidelines for using our services
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
                Agreement to Terms
              </h2>
              <p className="text-muted-foreground">
                By accessing and using Fiscal Compass, you agree to be bound by
                these Terms of Service and all applicable laws and regulations.
                If you do not agree with any of these terms, you are prohibited
                from using this site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-finance-primary">
                Use License
              </h2>
              <p className="text-muted-foreground mb-3">
                Permission is granted to temporarily access the materials
                (information and calculators) on Fiscal Compass's website for
                personal, non-commercial use only. This is the grant of a
                license, not a transfer of title, and under this license you may
                not:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>
                  Attempt to decompile or reverse engineer any software
                  contained on the site
                </li>
                <li>
                  Remove any copyright or other proprietary notations from the
                  materials
                </li>
                <li>
                  Transfer the materials to another person or "mirror" the
                  materials on any other server
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-finance-primary">
                Disclaimer
              </h2>
              <p className="text-muted-foreground">
                The materials on Fiscal Compass's website are provided on an 'as
                is' basis. Fiscal Compass makes no warranties, expressed or
                implied, and hereby disclaims and negates all other warranties
                including, without limitation, implied warranties or conditions
                of merchantability, fitness for a particular purpose, or
                non-infringement of intellectual property or other violation of
                rights.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-finance-primary">
                Financial Information Disclaimer
              </h2>
              <p className="text-muted-foreground">
                The calculators and information provided on this website are for
                educational purposes only. They should not be considered as
                financial advice. Always consult with a qualified financial
                professional before making any financial decisions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-finance-primary">
                Limitations
              </h2>
              <p className="text-muted-foreground">
                In no event shall Fiscal Compass or its suppliers be liable for
                any damages (including, without limitation, damages for loss of
                data or profit, or due to business interruption) arising out of
                the use or inability to use the materials on our website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-finance-primary">
                Accuracy of Materials
              </h2>
              <p className="text-muted-foreground">
                The materials appearing on Fiscal Compass's website could
                include technical, typographical, or photographic errors. We do
                not warrant that any of the materials on our website are
                accurate, complete, or current.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-finance-primary">
                Links
              </h2>
              <p className="text-muted-foreground">
                Fiscal Compass has not reviewed all of the sites linked to its
                website and is not responsible for the contents of any such
                linked site. The inclusion of any link does not imply
                endorsement by Fiscal Compass of the site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-finance-primary">
                Modifications
              </h2>
              <p className="text-muted-foreground">
                Fiscal Compass may revise these terms of service at any time
                without notice. By using this website, you are agreeing to be
                bound by the then current version of these terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-finance-primary">
                Governing Law
              </h2>
              <p className="text-muted-foreground">
                These terms and conditions are governed by and construed in
                accordance with the laws of the United States and you
                irrevocably submit to the exclusive jurisdiction of the courts
                in that location.
              </p>
            </section>
          </div>
        </ScrollArea>
      </div>
    </Layout>
  );
}
