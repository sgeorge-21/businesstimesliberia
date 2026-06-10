import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Ad = { id: string; title: string; image_url: string; link_url: string | null; placement: string };

export function AdSlot({ placement }: { placement: "top" | "sidebar" }) {
  const [ad, setAd] = useState<Ad | null>(null);
  useEffect(() => {
    const now = new Date().toISOString();
    supabase
      .from("ads")
      .select("id,title,image_url,link_url,placement")
      .eq("placement", placement)
      .eq("active", true)
      .or(`start_at.is.null,start_at.lte.${now}`)
      .or(`end_at.is.null,end_at.gte.${now}`)
      .order("sort_order")
      .limit(1)
      .then(({ data }) => setAd((data?.[0] as Ad) || null));
  }, [placement]);

  if (!ad) return null;
  const inner = (
    <img src={ad.image_url} alt={ad.title} className={`ad-img ad-${placement}`} loading="lazy" />
  );
  return (
    <div className={`ad-slot ad-slot-${placement}`}>
      <div className="ad-label">Advertisement</div>
      {ad.link_url ? (
        <a href={ad.link_url} target="_blank" rel="noopener sponsored noreferrer">{inner}</a>
      ) : inner}
    </div>
  );
}
