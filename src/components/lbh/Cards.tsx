import { Link } from "@tanstack/react-router";
import type { Card, ListItem } from "./data";

export function StoryCard({ c }: { c: Card }) {
  return (
    <div className="card">
      <div className="card-img-wrap">
        <img src={c.img} className="card-img" alt={c.title} loading="lazy" />
        <div className="card-cat">{c.cat}</div>
      </div>
      <div className="card-body">
        <h3>{c.title}</h3>
        <p>{c.excerpt}</p>
        <div className="card-footer">
          <span className="card-meta">{c.meta}</span>
          {c.slug
            ? <Link to="/stories/$slug" params={{ slug: c.slug }} className="read-link">Read →</Link>
            : <Link to="/stories" className="read-link">Read →</Link>}
        </div>
      </div>
    </div>
  );
}

export function CardsGrid({ items }: { items: Card[] }) {
  return (
    <div className="cards-grid">{items.map((c, i) => <StoryCard key={i} c={c} />)}</div>
  );
}

export function ListCards({ items }: { items: ListItem[] }) {
  return (
    <div className="list-cards">
      {items.map((c, i) => (
        <div className="list-card" key={i}>
          <img src={c.img} className="list-card-img" alt="" loading="lazy" />
          <div className="list-card-body">
            <div className="list-card-cat">{c.cat}</div>
            <h4>{c.title}</h4>
            <span>{c.meta}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
