import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Comment = {
  id: string;
  author_name: string;
  body: string;
  created_at: string;
};

export default function Comments({ storyId }: { storyId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<null | string>(null);
  const [sending, setSending] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("story_comments")
      .select("id,author_name,body,created_at")
      .eq("story_id", storyId)
      .eq("visible", true)
      .order("created_at", { ascending: false });
    setComments((data ?? []) as Comment[]);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim().slice(0, 60);
    const cleanBody = body.trim().slice(0, 2000);
    if (!cleanName || !cleanBody) {
      setStatus("Please add your name and a comment.");
      return;
    }
    setSending(true);
    setStatus(null);
    const { error } = await supabase
      .from("story_comments")
      .insert({ story_id: storyId, author_name: cleanName, body: cleanBody });
    setSending(false);
    if (error) {
      setStatus("Sorry, your comment could not be posted. Please try again.");
      return;
    }
    setBody("");
    setStatus("Thank you — your comment has been posted.");
    void load();
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: ".7rem .8rem",
    border: "1px solid #d8ddd8",
    borderRadius: 4,
    fontSize: ".95rem",
    fontFamily: "inherit",
    background: "#fff",
  };

  return (
    <section style={{ marginTop: "3rem", borderTop: "1px solid #e2e6e2", paddingTop: "2rem" }}>
      <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.5rem", marginBottom: "1rem" }}>
        Comments {comments.length > 0 && <span style={{ color: "var(--text-light)", fontSize: "1rem" }}>({comments.length})</span>}
      </h2>

      <form onSubmit={submit} style={{ display: "grid", gap: ".75rem", marginBottom: "2rem" }}>
        <input
          style={inputStyle}
          placeholder="Your name"
          maxLength={60}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          style={{ ...inputStyle, minHeight: 110, resize: "vertical" }}
          placeholder="Share your thoughts on this story…"
          maxLength={2000}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <button
            type="submit"
            disabled={sending}
            style={{
              background: "var(--green-mid)",
              color: "#fff",
              border: "none",
              padding: ".65rem 1.4rem",
              borderRadius: 4,
              fontWeight: 600,
              cursor: sending ? "default" : "pointer",
              opacity: sending ? 0.7 : 1,
            }}
          >
            {sending ? "Posting…" : "Post comment"}
          </button>
          {status && <span style={{ fontSize: 13, color: "var(--text-mid)" }}>{status}</span>}
        </div>
      </form>

      {comments.length === 0 ? (
        <p style={{ color: "var(--text-light)", fontSize: ".95rem" }}>No comments yet. Be the first to share your view.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "1rem" }}>
          {comments.map((c) => (
            <li key={c.id} style={{ background: "#f6f8f6", borderRadius: 6, padding: "1rem 1.1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                <strong style={{ fontSize: ".95rem" }}>{c.author_name}</strong>
                <span style={{ fontSize: 12, color: "var(--text-light)" }}>
                  {new Date(c.created_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                </span>
              </div>
              <p style={{ margin: ".4rem 0 0", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{c.body}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
