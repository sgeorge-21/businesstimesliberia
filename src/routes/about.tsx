import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import Layout, { ShowSidebar } from "@/components/lbh/Layout";

export const Route = createFileRoute("/about")({ component: AboutPage });

function AboutPage() {
  const [sent, setSent] = useState(false);
  return (
    <Layout>
      <div className="about-hero">
        <div className="label">Who We Are</div>
        <h1>Informing Liberia's Business Community</h1>
        <p>The Liberian Business Hour is Liberia's most trusted weekly business radio program — bringing in-depth analysis, expert interviews, and the stories that matter most to Liberian entrepreneurs, investors, and professionals.</p>
      </div>
      <div className="stats-banner">
        <div className="stat-item"><div className="stat-label2">Broadcast</div><div className="stat-val">Weekly</div></div>
        <div className="stat-item"><div className="stat-label2">Episodes Produced</div><div className="stat-val">50+ Episodes</div></div>
        <div className="stat-item"><div className="stat-label2">Weekly Audience</div><div className="stat-val">Thousands of Listeners</div></div>
      </div>
      <div className="about-section">
        <div className="about-content">
          <div className="about-label">About The Show</div>
          <h2>Liberia's Premier Business Radio Program</h2>
          <p>The Liberian Business Hour is a weekly radio program that airs every Saturday from 7:00 to 7:45 AM in Monrovia, Liberia. For those who miss the live broadcast, the show repeats every Sunday.</p>
          <p>Founded with the mission to inform, educate, and empower Liberia's business community, the show covers everything from macroeconomic policy and banking reform to entrepreneurship, agriculture, and trade.</p>
          <div className="about-label">Mission &amp; Vision</div>
          <h2>What Drives Us</h2>
          <div className="mv-grid">
            <div className="mv-card">
              <h3>Our Mission</h3>
              <p>To inform, educate, and empower Liberia's business community with accurate, timely and independent reporting on business, the economy and finance — giving entrepreneurs, investors and workers the knowledge they need to make better decisions.</p>
            </div>
            <div className="mv-card">
              <h3>Our Vision</h3>
              <p>To be Liberia's most trusted business media platform — a voice that champions transparency, celebrates Liberian enterprise, and helps build a stronger, more prosperous national economy.</p>
            </div>
          </div>
          <div className="about-label">Meet The Host</div>
          <h2>James T. Worquea III</h2>
          <div className="host-card">
            <img src="/jworquea.jpg" alt="James T. Worquea III" />
            <div>
              <h3>James T. Worquea III</h3>
              <div className="host-role">Host & Executive Producer — The Liberian Business Hour</div>
              <p>James T. Worquea III is a Liberian business journalist, radio host, and economic commentator. As the host and executive producer of The Liberian Business Hour, he has established himself as a leading voice in Liberia's business media landscape.</p>
              <p>His weekly program reaches thousands of business owners, entrepreneurs, investors, and professionals across Liberia and the diaspora.</p>
              <div className="social-pills">
                <span className="social-pill">Facebook</span>
                <span className="social-pill">Twitter / X</span>
                <span className="social-pill">LinkedIn</span>
              </div>
            </div>
          </div>
          <div className="about-label" style={{ marginTop: "2rem" }}>Our Values</div>
          <h2>What We Stand For</h2>
          <div className="values-grid">
            {[
              ["Accuracy", "We verify every story and source every claim. Liberia deserves journalism that is factual, fair, and trustworthy."],
              ["Liberia First", "Every story we tell is rooted in the Liberian context — local voices, local data, and local impact."],
              ["Empowerment", "We believe informed business people make better decisions. Our mission is to give you the knowledge to succeed."],
              ["Community", "We amplify the stories of entrepreneurs, farmers, bankers, and workers who are building Liberia's economy every day."],
            ].map(([h, p]) => (
              <div className="value-card" key={h}><h4>{h}</h4><p>{p}</p></div>
            ))}
          </div>
          <div className="about-label" style={{ marginTop: "2rem" }}>Get In Touch</div>
          <h2>Contact Us</h2>
          <div className="contact-form">
            <div className="form-group"><label>Your Name</label><input type="text" placeholder="e.g. Stevina Wesseh" /></div>
            <div className="form-group"><label>Email Address</label><input type="email" placeholder="your@email.com" /></div>
            <div className="form-group"><label>Subject</label><input type="text" placeholder="e.g. Story Tip, Advertising Inquiry" /></div>
            <div className="form-group"><label>Message</label><textarea placeholder="Write your message here..." /></div>
            <button className="btn-send" onClick={() => setSent(true)}>{sent ? "✓ Message sent" : "Send Message →"}</button>
          </div>
        </div>
        <ShowSidebar title="Trending" items={[]} />
      </div>
    </Layout>
  );
}
