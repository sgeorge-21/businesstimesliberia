import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Layout from "@/components/lbh/Layout";
import { EPISODES } from "@/components/lbh/data";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/podcast")({ component: PodcastPage });

function PodcastPage() {
  const [dbEps, setDbEps] = useState<any[]>([]);
  useEffect(() => {
    supabase.from("podcasts").select("*").eq("status", "published").order("episode_number", { ascending: false }).then(({ data }) => setDbEps(data || []));
  }, []);
  const latest = dbEps[0];
  return (
    <Layout>
      <div className="podcast-banner">
        <div className="podcast-cover">
          <div>
            <div className="kear">Liberian Business Hour</div>
            <div className="title">THE LIBERIAN<br />BUSINESS<br />HOUR</div>
            <div style={{ color: "var(--gold)", fontSize: 12, marginTop: ".5rem", textAlign: "center" }}>LIVE EVERY SATURDAY</div>
          </div>
        </div>
        <div className="podcast-banner-info">
          <div className="label">Podcast & Radio Archive</div>
          <h1>The Liberian Business Hour</h1>
          <p>Every Saturday from 7:00–7:45 AM. Hosted by James T. Worquea III, the show brings you Liberia's most important business, finance, and economic conversations.</p>
          <div className="podcast-meta-row">
            <span>Every Saturday 7–7:45 AM</span>
            <span>Repeat: Sundays 5–5:45 PM</span>
            <span>{dbEps.length + 50}+ Episodes</span>
          </div>
          <button className="btn-listen-big">▶ Listen Live</button>
        </div>
      </div>
      <div className="listen-platforms">
        <span>Listen on</span>
        <button className="platform-btn">🟢 Spotify</button>
        <button className="platform-btn">🍎 Apple Music</button>
        <button className="platform-btn">▶ YouTube</button>
        <button className="platform-btn">📻 Radio</button>
      </div>
      <div className="full-width">
        <div className="section-label-sm" style={{ marginBottom: "1.2rem" }}>Latest Episode</div>
        <div className="episode-featured">
          <img src={latest?.thumbnail_url || "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80"} alt="" />
          <div>
            <div className="ep-label">Episode {latest?.episode_number || 48} · Latest</div>
            <h3>{latest?.title || "2026 National Budget Analysis: Winners, Losers, and What It Means for Liberian Business"}</h3>
            <p>{latest?.description || "James T. Worquea III breaks down every major allocation in Liberia's 2026 national budget — from education and health to infrastructure, agriculture, and the private sector."}</p>
            <div className="ep-date">{latest?.air_date || "April 19, 2026"} · {latest?.duration_minutes || 45} minutes</div>
            <div className="play-row">
              {latest?.audio_url ? (
                <audio controls src={latest.audio_url} style={{ flex: 1 }} />
              ) : (
                <>
                  <button className="play-btn">▶</button>
                  <span className="ep-duration">45 min</span>
                  <a href="/stories" className="show-notes-link">Read Show Note →</a>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="section-label-sm" style={{ marginBottom: "1rem" }}>All Episodes</div>
        <div className="episodes-list">
          {dbEps.slice(1).map((e) => (
            <div className="episode-row" key={e.id}>
              <div className="ep-num">EP {e.episode_number}</div>
              <button className="play-btn">▶</button>
              <div className="ep-info"><h4>{e.title}</h4><span>{e.air_date}</span></div>
              <span className="ep-time">{e.duration_minutes} min</span>
            </div>
          ))}
          {EPISODES.map((e) => (
            <div className="episode-row" key={e.num}>
              <div className="ep-num">EP {e.num}</div>
              <button className="play-btn">▶</button>
              <div className="ep-info"><h4>{e.title}</h4><span>{e.date}</span></div>
              <span className="ep-time">45 min</span>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
