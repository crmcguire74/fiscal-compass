import Layout from "@/components/layout/Layout";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Disclaimer() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="bg-gradient-to-r from-finance-primary to-finance-primary/90 text-white py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Disclaimer
            </h1>
            <p className="text-xl text-white/90">
              Important information about our services and content
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
                Financial Information Disclaimer
              </h2>
              <p className="text-muted-foreground">
                The content on Fiscal Compass is provided for general
                information purposes only. It should not be considered as
                financial advice, investment advice, or any other type of
                professional advice. We strongly recommend consulting with
                qualified financial professionals regarding your specific
                circumstances before making any financial decisions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-finance-primary">
                Calculator Accuracy
              </h2>
              <p className="text-muted-foreground">
                While we strive to ensure our calculators are accurate and
                up-to-date, they are intended as estimation tools only. The
                results provided should be used as general guidelines and not as
                definitive financial planning outputs. Many factors specific to
                your situation may not be accounted for in these calculations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-finance-primary">
                No Guarantees
              </h2>
              <p className="text-muted-foreground">
                We make no guarantees about the accuracy, reliability,
                completeness, or timeliness of the information provided on this
                website. Any reliance you place on such information is strictly
                at your own risk. Market conditions, tax laws, and other factors
                affecting financial decisions can change rapidly and vary by
                jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-finance-primary">
                Educational Purpose
              </h2>
              <p className="text-muted-foreground">
                The content, tools, and calculators on this website are designed
                for educational purposes only. They are meant to help you
                understand financial concepts and explore different scenarios,
                not to provide specific recommendations for your situation.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-finance-primary">
                Third-Party Content
              </h2>
              <p className="text-muted-foreground">
                Our website may include content from third parties, including
                links to other websites. We do not control, endorse, or assume
                responsibility for any third-party content. Use of any
                third-party content is at your own risk.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-finance-primary">
                Investment Risk Disclosure
              </h2>
              <p className="text-muted-foreground">
                All investments carry risk, including the potential loss of
                principal. Past performance is not indicative of future results.
                Different types of investments involve varying degrees of risk,
                and there can be no assurance that any specific investment will
                either be suitable or profitable for your investment portfolio.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-finance-primary">
                Tax and Legal Matters
              </h2>
              <p className="text-muted-foreground">
                Nothing on this website should be interpreted as tax or legal
                advice. Tax laws and regulations are complex and subject to
                change. Please consult with qualified tax and legal
                professionals regarding your specific circumstances.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-finance-primary">
                Affiliate Disclosure
              </h2>
              <p className="text-muted-foreground">
                Some links on our website may be affiliate links. This means we
                may earn a commission if you click on the link and make a
                purchase. This does not affect our editorial independence or our
                commitment to providing accurate, unbiased information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-finance-primary">
                Contact Information
              </h2>
              <p className="text-muted-foreground">
                If you have any questions about this disclaimer, please contact
                us through our website's contact form.
              </p>
            </section>
          </div>
        </ScrollArea>
      </div>
    </Layout>
  );
}
