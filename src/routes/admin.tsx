import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { adminCreateUser, adminGrantRole, adminRevokeRole, ROLE_VALUES, type RoleValue } from "@/lib/admin.functions";
import { Sheet, SheetContent, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import Layout from "@/components/lbh/Layout";

export const Route = createFileRoute("/admin")({ component: AdminPage });

type Tab = "dashboard" | "news" | "podcast" | "video" | "ads" | "trending" | "rates" | "users" | "manage";

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) nav({ to: "/auth" });
  }, [loading, user, nav]);

  function showToast(m: string) {
    setToast(m);
    setTimeout(() => setToast(null), 2500);
  }

  if (loading) return <Layout hideFooter><div style={{ padding: "4rem", textAlign: "center" }}>Loading…</div></Layout>;
  if (!user) return null;

  if (!isAdmin) {
    return (
      <Layout hideFooter>
        <div className="admin-login">
          <div className="admin-login-box">
            <div className="admin-logo"><div className="big">Access Restricted</div><span className="sub">Administrator Portal</span></div>
            <p style={{ fontSize: 13.5, color: "var(--text-mid)", marginBottom: "1rem" }}>
              Signed in as <strong>{user.email}</strong>, but this account does not have admin privileges.
            </p>
            <p style={{ fontSize: 12.5, color: "var(--text-light)", marginBottom: "1rem" }}>
              Ask an existing admin to grant you the role, or — if you are the first user — grant yourself admin access by inserting a row into the <code>user_roles</code> table with your user ID and role <code>admin</code>.
            </p>
            <p style={{ fontSize: 12, background: "var(--cream-light)", padding: "8px 12px", borderRadius: 4, color: "var(--text-mid)", wordBreak: "break-all" }}>
              Your User ID: <strong>{user.id}</strong>
            </p>
            <button className="btn-send" style={{ marginTop: "1rem" }} onClick={async () => { await supabase.auth.signOut(); nav({ to: "/auth" }); }}>Sign Out</button>
            <Link to="/" style={{ display: "block", textAlign: "center", marginTop: ".75rem", fontSize: 13, color: "var(--green-dark)" }}>← Back to site</Link>
          </div>
        </div>
      </Layout>
    );
  }

  const navItems = [
    ["dashboard", "Dashboard"],
    ["news", "Add News / Story"],
    ["podcast", "Add Podcast"],
    ["video", "Add Video"],
    ["ads", "Ads"],
    ["trending", "Trending"],
    ["rates", "CBL Rates"],
    ["users", "Users"],
    ["manage", "Manage Content"],
  ] as [Tab, string][];

  return (
    <div className="lbh-app">
      <div className="admin-panel">
        <div className="admin-nav">
          <div className="admin-nav-left">
            <Sheet>
              <SheetTrigger asChild>
                <button type="button" className="admin-menu-btn" aria-label="Open menu"><Menu size={20} /></button>
              </SheetTrigger>
              <SheetContent side="left" className="admin-mobile-sheet">
                <SheetTitle className="admin-mobile-title">Admin</SheetTitle>
                <div className="admin-mobile-links">
                  {navItems.map(([k, label]) => (
                    <SheetClose asChild key={k}>
                      <a className={tab === k ? "active" : ""} onClick={() => setTab(k)}>{label}</a>
                    </SheetClose>
                  ))}
                  <SheetClose asChild>
                    <Link to="/">↗ View Site</Link>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
            <div className="a-brand">LBH <span>Admin</span></div>
          </div>
          <div className="admin-nav-links">
            {navItems.map(([k, label]) => (
              <a key={k} className={tab === k ? "active" : ""} onClick={() => setTab(k)}>{label}</a>
            ))}
            <Link to="/" style={{ color: "rgba(255,255,255,.7)", fontSize: 13 }}>↗ View Site</Link>
          </div>
          <button className="admin-logout" onClick={async () => { await supabase.auth.signOut(); nav({ to: "/" }); }}>Sign Out</button>
        </div>
        <div className="admin-body">
          {tab === "dashboard" && <Dashboard />}
          {tab === "news" && <NewsForm onDone={() => showToast("Story published!")} />}
          {tab === "podcast" && <PodcastForm onDone={() => showToast("Episode published!")} />}
          {tab === "video" && <VideoForm onDone={() => showToast("Video published!")} />}
          {tab === "ads" && <AdsPanel onToast={showToast} />}
          {tab === "trending" && <TrendingPanel onToast={showToast} />}
          {tab === "rates" && <RatesPanel onToast={showToast} />}
          {tab === "users" && <UsersPanel />}
          {tab === "manage" && <ManagePanel />}
        </div>
        {toast && (
          <div style={{ position: "fixed", top: 80, right: "2rem", background: "var(--green-dark)", color: "#fff", padding: "12px 20px", borderRadius: 4, fontSize: 13.5, boxShadow: "0 4px 20px rgba(0,0,0,.2)", zIndex: 9999 }}>✓ {toast}</div>
        )}
      </div>
    </div>
  );
}

function Dashboard() {
  const [counts, setCounts] = useState({ stories: 0, podcasts: 0, videos: 0, users: 0 });
  const [recent, setRecent] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      const [s, p, v, u] = await Promise.all([
        supabase.from("stories").select("*", { count: "exact", head: true }),
        supabase.from("podcasts").select("*", { count: "exact", head: true }),
        supabase.from("videos").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
      ]);
      setCounts({ stories: s.count || 0, podcasts: p.count || 0, videos: v.count || 0, users: u.count || 0 });
      const { data } = await supabase.from("stories").select("title,category,status,created_at").order("created_at", { ascending: false }).limit(5);
      setRecent(data || []);
    })();
  }, []);
  return (
    <>
      <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.6rem", marginBottom: "1.5rem" }}>Welcome back, Admin</h2>
      <div className="stats-grid">
        <div className="stat-box"><div className="s-label">Published Articles</div><div className="s-val">{counts.stories}</div><div className="s-sub">Live count</div></div>
        <div className="stat-box"><div className="s-label">Podcast Episodes</div><div className="s-val">{counts.podcasts}</div><div className="s-sub">All time</div></div>
        <div className="stat-box"><div className="s-label">Videos Published</div><div className="s-val">{counts.videos}</div><div className="s-sub">All time</div></div>
        <div className="stat-box"><div className="s-label">Registered Users</div><div className="s-val">{counts.users}</div><div className="s-sub">Total accounts</div></div>
      </div>
      <div className="admin-card">
        <div className="admin-card-header">Recent Activity <span className="badge">Live</span></div>
        <div className="admin-card-body" style={{ padding: 0 }}>
          <table className="content-table">
            <thead><tr><th>Title</th><th>Category</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {recent.length === 0 && <tr><td colSpan={4} style={{ textAlign: "center", color: "var(--text-light)", padding: "1.5rem" }}>No content yet — start by adding a news story.</td></tr>}
              {recent.map((r, i) => (
                <tr key={i}><td>{r.title}</td><td>{r.category}</td><td>{new Date(r.created_at).toLocaleDateString()}</td><td><span className={`status-badge status-${r.status}`}>{r.status}</span></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

async function uploadFile(file: File, folder: string): Promise<string | null> {
  if (!file) return null;
  const ext = file.name.split(".").pop();
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file);
  if (error) { alert("Upload failed: " + error.message); return null; }
  return supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
}

function NewsForm({ onDone }: { onDone: () => void }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Business");
  const [author, setAuthor] = useState("");
  const [readMin, setReadMin] = useState<number | "">("");
  const [summary, setSummary] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [featured, setFeatured] = useState("no");
  const [cover, setCover] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  async function publish(status: "published" | "draft") {
    if (!title || !summary) { alert("Title and summary required"); return; }
    setBusy(true);
    const cover_url = cover ? await uploadFile(cover, "stories") : null;
    const { error } = await supabase.from("stories").insert({
      title, category, author, read_minutes: readMin || null, summary, body,
      tags: tags ? tags.split(",").map((s) => s.trim()) : null,
      featured, cover_url,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60),
      status, published_at: status === "published" ? new Date().toISOString() : null,
    });
    setBusy(false);
    if (error) return alert(error.message);
    setTitle(""); setSummary(""); setBody(""); setAuthor(""); setReadMin(""); setTags(""); setCover(null);
    onDone();
  }

  return (
    <div className="admin-card">
      <div className="admin-card-header">Publish News Article or Story</div>
      <div className="admin-card-body">
        <div className="admin-form-row">
          <div className="admin-form-group"><label>Article Title *</label><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter headline..." /></div>
          <div className="admin-form-group"><label>Category *</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {["Business", "Economy", "Finance", "Trade", "Agriculture", "Entrepreneurship", "Feature", "Opinion", "Investigative"].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="admin-form-row">
          <div className="admin-form-group"><label>Author Name</label><input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="e.g. James T. Worquea III" /></div>
          <div className="admin-form-group"><label>Read Time (minutes)</label><input type="number" min={1} value={readMin} onChange={(e) => setReadMin(e.target.value ? +e.target.value : "")} placeholder="5" /></div>
        </div>
        <div className="admin-form-group"><label>Summary / Excerpt *</label><textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Short summary..." /></div>
        <div className="admin-form-group"><label>Full Article Body</label><textarea style={{ height: 200 }} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write the full article..." /></div>
        <div className="admin-form-group"><label>Cover Image</label>
          <label className="file-upload-area" style={{ display: "block" }}>
            <div style={{ fontSize: "2rem", marginBottom: ".5rem" }}>📷</div>
            <p>{cover ? cover.name : "Click to upload cover image"}</p>
            <small>JPG, PNG up to 5MB · Recommended: 1200×800px</small>
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => setCover(e.target.files?.[0] || null)} />
          </label>
        </div>
        <div className="admin-form-row">
          <div className="admin-form-group"><label>Tags (comma-separated)</label><input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g. CBL, banking" /></div>
          <div className="admin-form-group"><label>Featured?</label>
            <select value={featured} onChange={(e) => setFeatured(e.target.value)}>
              <option value="no">No</option>
              <option value="Yes – Homepage Hero">Yes – Homepage Hero</option>
              <option value="Yes – Section Feature">Yes – Section Feature</option>
            </select>
          </div>
        </div>
        <div className="admin-btn-row">
          <button className="btn-save-draft" disabled={busy} onClick={() => publish("draft")}>Save as Draft</button>
          <button className="btn-publish" disabled={busy} onClick={() => publish("published")}>{busy ? "..." : "Publish Now →"}</button>
        </div>
      </div>
    </div>
  );
}

function PodcastForm({ onDone }: { onDone: () => void }) {
  const [title, setTitle] = useState("");
  const [episodeNumber, setEp] = useState<number | "">("");
  const [airDate, setAirDate] = useState("");
  const [duration, setDuration] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [showNotes, setShowNotes] = useState("");
  const [audio, setAudio] = useState<File | null>(null);
  const [thumb, setThumb] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  async function publish(status: "published" | "draft") {
    if (!title || !description) { alert("Title and description required"); return; }
    setBusy(true);
    const audio_url = audio ? await uploadFile(audio, "podcasts/audio") : null;
    const thumbnail_url = thumb ? await uploadFile(thumb, "podcasts/thumb") : null;
    const { error } = await supabase.from("podcasts").insert({
      title, episode_number: episodeNumber || null, air_date: airDate || null,
      duration_minutes: duration || null, description, show_notes: showNotes,
      audio_url, thumbnail_url, status, published_at: status === "published" ? new Date().toISOString() : null,
    });
    setBusy(false);
    if (error) return alert(error.message);
    setTitle(""); setEp(""); setAirDate(""); setDuration(""); setDescription(""); setShowNotes(""); setAudio(null); setThumb(null);
    onDone();
  }

  return (
    <div className="admin-card">
      <div className="admin-card-header">Upload Podcast Episode</div>
      <div className="admin-card-body">
        <div className="admin-form-row">
          <div className="admin-form-group"><label>Episode Title *</label><input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
          <div className="admin-form-group"><label>Episode Number</label><input type="number" min={1} value={episodeNumber} onChange={(e) => setEp(e.target.value ? +e.target.value : "")} /></div>
        </div>
        <div className="admin-form-row">
          <div className="admin-form-group"><label>Air Date</label><input type="date" value={airDate} onChange={(e) => setAirDate(e.target.value)} /></div>
          <div className="admin-form-group"><label>Duration (minutes)</label><input type="number" min={1} value={duration} onChange={(e) => setDuration(e.target.value ? +e.target.value : "")} placeholder="45" /></div>
        </div>
        <div className="admin-form-group"><label>Episode Description *</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} /></div>
        <div className="admin-form-group"><label>Show Notes / Transcript</label><textarea style={{ height: 160 }} value={showNotes} onChange={(e) => setShowNotes(e.target.value)} /></div>
        <div className="admin-form-row">
          <div className="admin-form-group"><label>Audio File (MP3/WAV)</label>
            <label className="file-upload-area" style={{ display: "block" }}>
              <div style={{ fontSize: "2rem" }}>🎙️</div>
              <p>{audio ? audio.name : "Click to upload audio recording"}</p>
              <small>MP3 or WAV · Max 200MB</small>
              <input type="file" accept="audio/*" style={{ display: "none" }} onChange={(e) => setAudio(e.target.files?.[0] || null)} />
            </label>
          </div>
          <div className="admin-form-group"><label>Episode Thumbnail</label>
            <label className="file-upload-area" style={{ display: "block" }}>
              <div style={{ fontSize: "2rem" }}>🖼️</div>
              <p>{thumb ? thumb.name : "Click to upload thumbnail"}</p>
              <small>JPG/PNG · 600×600 recommended</small>
              <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => setThumb(e.target.files?.[0] || null)} />
            </label>
          </div>
        </div>
        <div className="admin-btn-row">
          <button className="btn-save-draft" disabled={busy} onClick={() => publish("draft")}>Save as Draft</button>
          <button className="btn-publish" disabled={busy} onClick={() => publish("published")}>{busy ? "..." : "Publish Episode →"}</button>
        </div>
      </div>
    </div>
  );
}

function VideoForm({ onDone }: { onDone: () => void }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Business");
  const [sourceType, setSourceType] = useState<"upload" | "youtube" | "vimeo">("upload");
  const [publishDate, setPublishDate] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumb, setThumb] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  async function publish(status: "published" | "draft") {
    if (!title || !description) { alert("Title and description required"); return; }
    setBusy(true);
    let url = videoUrl;
    if (sourceType === "upload" && videoFile) url = (await uploadFile(videoFile, "videos")) || "";
    const thumbnail_url = thumb ? await uploadFile(thumb, "videos/thumb") : null;
    const { error } = await supabase.from("videos").insert({
      title, category, source_type: sourceType, video_url: url, thumbnail_url,
      publish_date: publishDate || null, description,
      status, published_at: status === "published" ? new Date().toISOString() : null,
    });
    setBusy(false);
    if (error) return alert(error.message);
    setTitle(""); setVideoUrl(""); setDescription(""); setPublishDate(""); setVideoFile(null); setThumb(null);
    onDone();
  }

  return (
    <div className="admin-card">
      <div className="admin-card-header">Upload Video</div>
      <div className="admin-card-body">
        <div className="admin-form-row">
          <div className="admin-form-group"><label>Video Title *</label><input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
          <div className="admin-form-group"><label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {["Business", "Economy", "Finance", "Interview", "Event Coverage", "Documentary"].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="admin-form-row">
          <div className="admin-form-group"><label>Video Source</label>
            <select value={sourceType} onChange={(e) => setSourceType(e.target.value as any)}>
              <option value="upload">Upload File</option><option value="youtube">YouTube URL</option><option value="vimeo">Vimeo URL</option>
            </select>
          </div>
          <div className="admin-form-group"><label>Publish Date</label><input type="date" value={publishDate} onChange={(e) => setPublishDate(e.target.value)} /></div>
        </div>
        {sourceType === "upload" ? (
          <div className="admin-form-group"><label>Video File</label>
            <label className="file-upload-area" style={{ display: "block" }}>
              <div style={{ fontSize: "2rem" }}>🎬</div>
              <p>{videoFile ? videoFile.name : "Click to upload video"}</p>
              <small>MP4 · HD recommended</small>
              <input type="file" accept="video/*" style={{ display: "none" }} onChange={(e) => setVideoFile(e.target.files?.[0] || null)} />
            </label>
          </div>
        ) : (
          <div className="admin-form-group"><label>Video URL</label><input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." /></div>
        )}
        <div className="admin-form-group"><label>Description *</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} /></div>
        <div className="admin-form-group"><label>Thumbnail Image</label>
          <label className="file-upload-area" style={{ display: "block" }}>
            <div style={{ fontSize: "2rem" }}>🖼️</div>
            <p>{thumb ? thumb.name : "Upload video thumbnail"}</p>
            <small>JPG/PNG · 1280×720 recommended</small>
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => setThumb(e.target.files?.[0] || null)} />
          </label>
        </div>
        <div className="admin-btn-row">
          <button className="btn-save-draft" disabled={busy} onClick={() => publish("draft")}>Save as Draft</button>
          <button className="btn-publish" disabled={busy} onClick={() => publish("published")}>{busy ? "..." : "Publish Video →"}</button>
        </div>
      </div>
    </div>
  );
}

const ROLE_LABELS: Record<RoleValue, string> = {
  admin: "Admin",
  editor: "Editor",
  reporter: "Reporter",
  contributor: "Contributor",
  author: "Author",
  subscriber: "Subscriber",
};

function UsersPanel() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const grantRole = useServerFn(adminGrantRole);
  const revokeRole = useServerFn(adminRevokeRole);

  async function load() {
    setLoading(true);
    const { data: profiles } = await supabase.from("profiles").select("id, display_name, email, created_at").order("created_at", { ascending: false });
    const { data: roles } = await supabase.from("user_roles").select("user_id, role");
    const byUser = new Map<string, string[]>();
    (roles || []).forEach((r: any) => {
      const arr = byUser.get(r.user_id) || [];
      arr.push(r.role); byUser.set(r.user_id, arr);
    });
    setRows((profiles || []).map((p: any) => ({ ...p, roles: byUser.get(p.id) || [] })));
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function handleGrant(userId: string, role: RoleValue) {
    try { await grantRole({ data: { userId, role } }); await load(); }
    catch (e: any) { alert(e.message || "Failed to grant"); }
  }
  async function handleRevoke(userId: string, role: RoleValue) {
    try { await revokeRole({ data: { userId, role } }); await load(); }
    catch (e: any) { alert(e.message || "Failed to revoke"); }
  }

  return (
    <>
      <CreateUserForm onCreated={load} />
      <div className="admin-card">
        <div className="admin-card-header">All Users <span className="badge">{rows.length}</span></div>
        <div className="admin-card-body" style={{ padding: 0 }}>
          <table className="content-table">
            <thead><tr><th>User</th><th>Joined</th><th>Roles</th><th>Grant Role</th></tr></thead>
            <tbody>
              {loading && <tr><td colSpan={4} style={{ textAlign: "center", padding: "1.5rem" }}>Loading…</td></tr>}
              {!loading && rows.length === 0 && <tr><td colSpan={4} style={{ textAlign: "center", padding: "1.5rem", color: "var(--text-light)" }}>No users yet.</td></tr>}
              {rows.map((r) => {
                const userRoles = r.roles as RoleValue[];
                const available = ROLE_VALUES.filter((rv) => !userRoles.includes(rv));
                return (
                  <tr key={r.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{r.display_name || "—"}</div>
                      <div style={{ fontSize: 12, color: "var(--text-light)" }}>{r.email || r.id.slice(0, 8) + "…"}</div>
                    </td>
                    <td>{new Date(r.created_at).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {userRoles.length === 0 && <span style={{ color: "var(--text-light)", fontSize: 12 }}>No roles</span>}
                        {userRoles.map((role) => (
                          <span key={role} style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "var(--cream-light)", border: "1px solid var(--lbh-border)", borderRadius: 12, padding: "2px 8px", fontSize: 12 }}>
                            {ROLE_LABELS[role] || role}
                            <button onClick={() => handleRevoke(r.id, role)} title="Revoke" style={{ background: "none", border: "none", cursor: "pointer", color: "#c0392b", fontWeight: 700, padding: 0, lineHeight: 1 }}>×</button>
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      {available.length === 0 ? (
                        <span style={{ fontSize: 12, color: "var(--text-light)" }}>All granted</span>
                      ) : (
                        <select defaultValue="" onChange={(e) => { const v = e.target.value as RoleValue; if (v) { handleGrant(r.id, v); e.target.value = ""; } }}>
                          <option value="">+ Grant role…</option>
                          {available.map((rv) => <option key={rv} value={rv}>{ROLE_LABELS[rv]}</option>)}
                        </select>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function CreateUserForm({ onCreated }: { onCreated: () => void }) {
  const createUser = useServerFn(adminCreateUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [roles, setRoles] = useState<RoleValue[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  function toggleRole(role: RoleValue) {
    setRoles((prev) => prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setMsg(null);
    try {
      await createUser({ data: { email, password, displayName: displayName || undefined, roles } });
      setMsg(`✓ Created ${email}${roles.length ? ` (${roles.join(", ")})` : ""}`);
      setEmail(""); setPassword(""); setDisplayName(""); setRoles([]);
      onCreated();
    } catch (err: any) {
      setMsg("✗ " + (err.message || "Failed"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-card" style={{ marginBottom: "1.5rem" }}>
      <div className="admin-card-header">Create New User Account</div>
      <div className="admin-card-body">
        <form onSubmit={submit}>
          <div className="admin-form-row">
            <div className="admin-form-group"><label>Email *</label><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div className="admin-form-group"><label>Temporary Password *</label><input type="text" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" /></div>
          </div>
          <div className="admin-form-group"><label>Display Name</label><input value={displayName} onChange={(e) => setDisplayName(e.target.value)} /></div>
          <div className="admin-form-group">
            <label>Assign Roles</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, padding: "8px 0" }}>
              {ROLE_VALUES.map((rv) => (
                <label key={rv} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
                  <input type="checkbox" checked={roles.includes(rv)} onChange={() => toggleRole(rv)} />
                  {ROLE_LABELS[rv]}
                </label>
              ))}
            </div>
          </div>
          {msg && <p style={{ fontSize: 13, marginBottom: ".75rem", color: msg.startsWith("✓") ? "var(--green-dark)" : "#c0392b" }}>{msg}</p>}
          <div className="admin-btn-row"><button className="btn-publish" disabled={busy} type="submit">{busy ? "Creating..." : "Create User →"}</button></div>
        </form>
      </div>
    </div>
  );
}

function ManagePanel() {
  const [items, setItems] = useState<any[]>([]);
  async function load() {
    const [s, p, v] = await Promise.all([
      supabase.from("stories").select("id,title,category,status,created_at").order("created_at", { ascending: false }),
      supabase.from("podcasts").select("id,title,status,created_at").order("created_at", { ascending: false }),
      supabase.from("videos").select("id,title,category,status,created_at").order("created_at", { ascending: false }),
    ]);
    const all = [
      ...(s.data || []).map((r: any) => ({ ...r, type: "Story", table: "stories" })),
      ...(p.data || []).map((r: any) => ({ ...r, type: "Podcast", table: "podcasts", category: "—" })),
      ...(v.data || []).map((r: any) => ({ ...r, type: "Video", table: "videos" })),
    ].sort((a, b) => b.created_at.localeCompare(a.created_at));
    setItems(all);
  }
  useEffect(() => { load(); }, []);

  async function del(table: string, id: string) {
    if (!confirm("Delete this item?")) return;
    await (supabase.from as any)(table).delete().eq("id", id);
    load();
  }
  async function toggleStatus(table: string, id: string, status: string) {
    const next = status === "published" ? "draft" : "published";
    await (supabase.from as any)(table).update({ status: next, published_at: next === "published" ? new Date().toISOString() : null }).eq("id", id);
    load();
  }

  return (
    <div className="admin-card">
      <div className="admin-card-header">All Content <span className="badge">{items.length}</span></div>
      <div className="admin-card-body" style={{ padding: 0 }}>
        <table className="content-table">
          <thead><tr><th>Title</th><th>Type</th><th>Category</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {items.length === 0 && <tr><td colSpan={6} style={{ textAlign: "center", padding: "1.5rem", color: "var(--text-light)" }}>No content yet.</td></tr>}
            {items.map((r) => (
              <tr key={r.table + r.id}>
                <td>{r.title}</td>
                <td>{r.type}</td>
                <td>{r.category || "—"}</td>
                <td>{new Date(r.created_at).toLocaleDateString()}</td>
                <td><span className={`status-badge status-${r.status}`}>{r.status}</span></td>
                <td>
                  <div className="action-btns">
                    <button className="btn-edit" onClick={() => toggleStatus(r.table, r.id, r.status)}>{r.status === "published" ? "Unpublish" : "Publish"}</button>
                    <button className="btn-delete" onClick={() => del(r.table, r.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
