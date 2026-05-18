// Static seed content from the original design.
export type Card = {
  title: string;
  cat: string;
  img: string;
  excerpt: string;
  meta: string;
};
export type ListItem = { title: string; cat: string; img: string; meta: string };

export const HOME_CARDS: Card[] = [
  { title: "CBL Announces Digital Currency Pilot Program for 2026", cat: "Finance", img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80", excerpt: "The Central Bank of Liberia will launch a pilot digital currency initiative targeting urban and rural financial inclusion across all counties.", meta: "Staff Reporter · April 22" },
  { title: "Record Rice Harvest Predicted as Government Doubles Subsidies", cat: "Agriculture", img: "https://images.unsplash.com/photo-1602525962574-3e24f2af1a1b?w=600&q=80", excerpt: "Liberia's Ministry of Agriculture projects the largest domestic rice yield in a decade.", meta: "K. Kollie · April 21" },
  { title: "Free Trade Zone at Freeport to Generate 5,000 Jobs by Year-End", cat: "Trade", img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80", excerpt: "The Economic Zone at the Port of Monrovia expects to onboard anchor tenants by June.", meta: "Staff Reporter · April 19" },
  { title: "Inflation Drops to 7.3% — Lowest Rate in Three Years", cat: "Economy", img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80", excerpt: "Stable fuel prices and improved supply chain management drove the downward trend.", meta: "P. Myers · April 17" },
];

export const BUSINESS_CARDS: Card[] = [
  { title: "ECOWAS Trade Agreement Opens New Markets for Liberian Exporters", cat: "Trade", img: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80", excerpt: "A new multilateral deal gives Liberian goods preferential access to 15 West African nations.", meta: "K. Kollie · Apr 21" },
  { title: "Monrovia Entrepreneur Fair 2026 Draws Over 400 Small Business Owners", cat: "SME", img: "https://images.unsplash.com/photo-1556742031-c6961e8560b0?w=600&q=80", excerpt: "The annual fair returns bigger than ever, connecting SMEs with investors and mentors.", meta: "Staff Reporter · April 20" },
  { title: "Foreign Direct Investment in Liberia Rises 18% in Q1 2026", cat: "Investment", img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80", excerpt: "Mining, agribusiness and infrastructure continue to attract the majority of FDI inflows.", meta: "J. Sumo · Apr 19" },
  { title: "ArcelorMittal Announces $300M Expansion of Liberia Iron Ore Operations", cat: "Corporate", img: "https://images.unsplash.com/photo-1531975474574-e9d2732e8b74?w=600&q=80", excerpt: "The mining giant's investment is set to create 2,000 direct jobs in Nimba County.", meta: "A. Nyanfor · Apr 18" },
];

export const BUSINESS_LIST: ListItem[] = [
  { cat: "Markets", title: "Liberian Dollar Stabilises as CBL Intervenes in Forex Market", img: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=200&q=80", meta: "Staff Reporter · Apr 17, 2026" },
  { cat: "Entrepreneurship", title: "Meet the 25-Year-Old Behind Liberia's Fastest-Growing Delivery App", img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&q=80", meta: "Staff Reporter · Apr 17, 2026" },
  { cat: "Trade", title: "Freeport of Monrovia Reports 22% Increase in Container Traffic", img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200&q=80", meta: "Staff Reporter · Apr 17, 2026" },
  { cat: "SME", title: "Liberia Business Registry Goes Digital — Registration Now Takes 24 Hours", img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=200&q=80", meta: "Staff Reporter · Apr 17, 2026" },
];

export const ECONOMY_CARDS: Card[] = [
  { title: "Liberia Projects 4.8% GDP Growth in 2026 — Fastest in Five Years", cat: "GDP", img: "https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?w=600&q=80", excerpt: "The World Bank and IMF both revised their Liberia forecasts upward, citing improved mining output, agricultural productivity, and a stabilizing currency.", meta: "K. Kollie · Apr 21" },
  { title: "Finance Ministry Tables Mid-Year Budget Revision Before Legislature", cat: "Policy", img: "https://images.unsplash.com/photo-1560472355-536de3962603?w=600&q=80", excerpt: "Lawmakers debate new allocations focused on infrastructure and social services.", meta: "Staff Reporter · April 20" },
];

export const ECONOMY_LIST: ListItem[] = [
  { cat: "Inflation", title: "Liberia's Trade Deficit Narrows as Rubber and Iron Ore Exports Surge", img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200&q=80", meta: "Staff Reporter · Apr 17, 2026" },
  { cat: "Agriculture", title: "Rice Imports Drop 15% as Domestic Production Scales Up", img: "https://images.unsplash.com/photo-1602525962574-3e24f2af1a1b?w=200&q=80", meta: "Staff Reporter · Apr 17, 2026" },
  { cat: "Government Policy", title: "IMF Completes Fourth Review of Liberia's ECF Programme, Approves $42M", img: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=200&q=80", meta: "Staff Reporter · Apr 17, 2026" },
  { cat: "Employment", title: "Youth Unemployment Remains High in Rural Counties Despite National Job Growth", img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=200&q=80", meta: "Staff Reporter · Apr 17, 2026" },
];

export const FINANCE_CARDS: Card[] = [
  { title: "CBL Raises Minimum Capital Requirement for Commercial Banks to $20M", cat: "Banking", img: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=600&q=80", excerpt: "The directive aims to strengthen the banking sector and protect depositors from systemic risks.", meta: "Staff Reporter · Apr 22" },
  { title: "Mobile Money Users in Liberia Hit 2.4 Million — Up 30% in 12 Months", cat: "Digital Finance", img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80", excerpt: "Orange Money and Lonestar MTN Money lead growth as rural adoption accelerates.", meta: "K. Kollie · Apr 21" },
  { title: "LIBA Launches $10M Credit Facility for Small Business Owners Nationwide", cat: "Microfinance", img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80", excerpt: "Loans of $500–$5,000 are available with flexible repayment terms and low interest rates.", meta: "J. Sumo · Apr 20" },
  { title: "LRA Exceeds Q1 Revenue Target by 12%, Collects $186M in Taxes", cat: "Taxation", img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80", excerpt: "The Liberia Revenue Authority credits improved compliance and a broadened taxpayer base.", meta: "A. Nyanfor · Apr 19" },
];

export const FINANCE_LIST: ListItem[] = [
  { cat: "Monetary Policy", title: "CBL Holds Policy Rate at 20% Amid Cautious Optimism on Inflation", img: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=200&q=80", meta: "Staff Reporter · Apr 18" },
  { cat: "Insurance", title: "National Insurance Corporation Reports 40% Growth in Policy Uptake", img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=200&q=80", meta: "K. Kollie · Apr 17" },
  { cat: "Banking", title: "International Bank Liberia Opens Three New County Branches", img: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=200&q=80", meta: "Staff Reporter · Apr 16" },
];

export const FEATURED_STORIES = [
  { tags: ["Feature", "Long Read"], pillClass: "tag-feature", title: "From Market Table to Million-Dollar Brand: How One Liberian Woman Built a Business Empire", body: "Martha Gbessay started selling rice by the cup in Waterside Market. Fifteen years later, she runs a food distribution company supplying 200 supermarkets across West Africa.", byline: "By James T. Worquea III · April 22, 2026 · 8 min read", img: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=600&q=80" },
  { tags: ["Profile", "Interview"], pillClass: "tag-profile", title: "The Minister Who Wants to Make Liberia the Trading Hub of West Africa", body: "Finance Minister sits down with LBH to discuss the vision behind the Investment Incentive Act and the path to $1B in FDI by 2028.", byline: "By K. Kollie · April 20, 2026 · 10 min read", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80" },
  { tags: ["Opinion", "Column"], pillClass: "tag-opinion", title: "Why Liberia Must Invest in Its Youth Entrepreneurs Now — Not Tomorrow", body: "With over 60% of the population under 25, Liberia sits on a demographic dividend that could power a generation of economic growth — if we act today.", byline: "By James T. Worquea III · April 18, 2026 · 6 min read", img: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=600&q=80" },
  { tags: ["Investigative", "Report"], pillClass: "tag-investigative", title: "The Hidden Cost of Doing Business in Liberia: Corruption, Red Tape, and the SME Crisis", body: "LBH investigates the bureaucratic hurdles forcing Liberia's most promising small businesses to close — and what must change.", byline: "By A. Nyanfor · April 15, 2026 · 15 min read", img: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&q=80" },
];

export const EPISODES = [
  { num: 47, title: "Women in Liberian Business: Breaking Barriers and Building Empires", date: "April 12, 2026" },
  { num: 46, title: "Port of Monrovia Expansion: Economic Impact on Liberia's Trade Sector", date: "April 5, 2026" },
  { num: 45, title: "The Digital Economy: How Liberia Can Catch Up with the Rest of Africa", date: "March 29, 2026" },
  { num: 44, title: "IMF Review Outcome: What It Means for Liberia's Economy in 2026", date: "March 22, 2026" },
  { num: 43, title: "Agriculture in Liberia: The Untapped $2 Billion Opportunity", date: "March 15, 2026" },
  { num: 42, title: "Liberia's Youth Entrepreneurs: Challenges and Opportunities in 2026", date: "March 8, 2026" },
  { num: 41, title: "CBL's New Digital Currency: Revolution or Risk for Liberian Business?", date: "March 1, 2026" },
];

export const POPULAR = [
  "CBL Digital Currency Pilot Sparks Public Debate Across Liberia",
  "Top 10 Liberian Businesses to Watch in 2026",
  "How the New Investment Incentive Act Affects Your Business",
  "SME Financing Options in Liberia: A Complete Guide for 2026",
];
