import { createFileRoute } from "@tanstack/react-router";
import Layout, { ShowSidebar } from "@/components/lbh/Layout";
import { CardsGrid, ListCards } from "@/components/lbh/Cards";
import { FINANCE_CARDS, FINANCE_LIST } from "@/components/lbh/data";

export const Route = createFileRoute("/finance")({ component: FinancePage });

function FinancePage() {
  return (
    <Layout>
      <div className="section-banner">
        <div className="section-label">Section</div>
        <h2>Finance</h2>
        <p>Banking, monetary policy, investment and financial services news from across Liberia.</p>
      </div>
      <div className="section-tabs">
        {["All Finance", "Banking", "Microfinance", "Insurance", "Taxation", "Digital Finance"].map((t, i) => (
          <button key={t} className={`tab-btn ${i === 0 ? "active" : ""}`}>{t}</button>
        ))}
      </div>
      <div className="main-layout">
        <div>
          <div className="section-label-sm">Finance Headlines</div>
          <CardsGrid items={FINANCE_CARDS} />
          <div className="section-label-sm">More Finance Stories</div>
          <ListCards items={FINANCE_LIST} />
        </div>
        <ShowSidebar title="Finance Tools" items={[
          "Liberia Business Loan Calculator",
          "USD/LRD Exchange Rate Tracker",
          "CBL Interest Rate History",
          "Liberia Tax Filing Guide 2026",
        ]} />
      </div>
    </Layout>
  );
}
