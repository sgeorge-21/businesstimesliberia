import { createFileRoute, Link } from "@tanstack/react-router";
import Layout from "@/components/lbh/Layout";

export const Route = createFileRoute("/story/sample-investment-act")({ component: StoryPage });

function StoryPage() {
  return (
    <Layout>
      <div className="full-width">
        <div className="section-label-sm">Business · Top Story</div>
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "2rem", marginTop: "0.5rem" }}>New Investment Incentive Act Opens Doors for Liberian Business Owners</h1>
        <p className="hero-desc">By James T. Worquea III · April 22, 2026 · 6 min read</p>
        <img src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80" alt="Investment" style={{ width: "100%", maxHeight: 520, objectFit: "cover", marginTop: "1rem", borderRadius: 6 }} />

        <article className="card" style={{ padding: "1.5rem", marginTop: "1.25rem" }}>
          <p>
            Liberia's parliament has approved the new Investment Incentive Act, a package of measures designed to spur private-sector growth, attract foreign investment, and support small and medium enterprises across the country.
          </p>
          <p>
            Key provisions include a five-year tax holiday for qualifying manufacturing and agribusiness projects, streamlined registration and licensing procedures, and targeted grants for technology incubators. The act also creates a one-stop investment facilitation center to reduce bureaucratic friction for new businesses.
          </p>
          <p>
            Business owners welcomed the move, saying it will lower the cost of doing business and encourage reinvestment. "This law changes the calculus for local entrepreneurs and international firms considering Liberia," said A. K. Kollie, CEO of Monrovia Exporters. "It gives us certainty and a clearer path to scaling operations."
          </p>
          <p>
            Critics caution that implementation will be key — including transparent criteria for incentives and safeguards to ensure benefits reach Liberian-owned SMEs. The government said it will publish implementing regulations in the coming weeks and work with stakeholders to monitor the law's rollout.
          </p>
        </article>

        <div style={{ marginTop: "1rem" }}>
          <Link to="/business" className="read-link">← Back to Business</Link>
        </div>
      </div>
    </Layout>
  );
}
