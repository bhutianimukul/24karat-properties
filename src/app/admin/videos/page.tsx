"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { CityVideo } from "@/lib/sample-videos";

function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

const availableCities = [
  { id: "noida", name: "Noida" },
  { id: "dholera", name: "Dholera" },
];

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<CityVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formCityId, setFormCityId] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");

  useEffect(() => {
    fetchVideos();
  }, []);

  function fetchVideos() {
    setLoading(true);
    fetch("/api/admin/videos")
      .then((r) => r.json())
      .then((data) => setVideos(Array.isArray(data) ? data : []))
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));
  }

  function resetForm() {
    setFormCityId("");
    setFormUrl("");
    setFormTitle("");
    setFormDesc("");
    setEditId(null);
    setShowForm(false);
  }

  function handleEdit(video: CityVideo) {
    setEditId(video.id);
    setFormCityId(video.city_id);
    setFormUrl(video.video_url);
    setFormTitle(video.title);
    setFormDesc(video.description);
    setShowForm(true);
  }

  async function handleSave() {
    if (!formCityId || !formUrl || !formTitle) return;
    setSaving(true);

    const cityName = availableCities.find((c) => c.id === formCityId)?.name || formCityId;

    try {
      if (editId) {
        await fetch(`/api/admin/videos/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            city_id: formCityId,
            city_name: cityName,
            video_url: formUrl,
            title: formTitle,
            description: formDesc,
          }),
        });
      } else {
        await fetch("/api/admin/videos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            city_id: formCityId,
            city_name: cityName,
            video_url: formUrl,
            title: formTitle,
            description: formDesc,
            is_active: true,
            sort_order: videos.length,
          }),
        });
      }
      resetForm();
      fetchVideos();
    } catch {
      alert("Failed to save video");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(id: string) {
    const video = videos.find((v) => v.id === id);
    if (!video) return;
    // Optimistic update
    setVideos((prev) => prev.map((v) => (v.id === id ? { ...v, is_active: !v.is_active } : v)));
    try {
      await fetch(`/api/admin/videos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !video.is_active }),
      });
    } catch {
      // revert
      setVideos((prev) => prev.map((v) => (v.id === id ? { ...v, is_active: video.is_active } : v)));
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this video?")) return;
    setVideos((prev) => prev.filter((v) => v.id !== id));
    try {
      await fetch(`/api/admin/videos/${id}`, { method: "DELETE" });
    } catch {
      fetchVideos(); // revert by refetching
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">City Videos</h1>
          <p className="text-sm text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">City Videos</h1>
          <p className="text-sm text-muted">Manage featured YouTube videos for each city page</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }}>
          + Add Video
        </Button>
      </div>

      <p className="text-xs text-muted bg-surface-light border border-surface-border rounded-lg p-3">
        Each city page can display one highlighted YouTube video. Toggle the active status to control which video appears. Only one video per city will be shown.
      </p>

      {/* Form */}
      {showForm && (
        <Card className="p-5 space-y-4">
          <h3 className="font-semibold text-sm">{editId ? "Edit Video" : "Add New Video"}</h3>

          {/* City selection — prominent so admin picks the right page */}
          <div>
            <label className="block text-xs font-medium text-gold mb-1">Show on City Page <span className="text-danger">*</span></label>
            <div className="flex gap-3">
              {availableCities.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setFormCityId(c.id)}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                    formCityId === c.id
                      ? "bg-gold/20 border-gold text-gold"
                      : "bg-surface-light border-surface-border text-muted hover:border-gold/30"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-muted mb-1">YouTube URL</label>
            <input
              type="url"
              value={formUrl}
              onChange={(e) => setFormUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full bg-surface-light border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold/50"
            />
          </div>

          <div>
            <label className="block text-xs text-muted mb-1">Title</label>
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="Video title"
              className="w-full bg-surface-light border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold/50"
            />
          </div>

          <div>
            <label className="block text-xs text-muted mb-1">Description</label>
            <textarea
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              rows={2}
              placeholder="Brief description for the video"
              className="w-full bg-surface-light border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold/50 resize-none"
            />
          </div>

          {/* Preview */}
          {formUrl && extractYouTubeId(formUrl) && (
            <div className="rounded-lg overflow-hidden border border-surface-border">
              <div className="relative w-full" style={{ paddingBottom: "56.25%", maxWidth: 400 }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${extractYouTubeId(formUrl)}?rel=0`}
                  title="Preview"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : editId ? "Update" : "Add"} {saving ? "" : "Video"}
            </Button>
            <Button variant="ghost" onClick={resetForm}>Cancel</Button>
          </div>
        </Card>
      )}

      {/* Video list */}
      <div className="space-y-3">
        {videos.map((video) => {
          const videoId = extractYouTubeId(video.video_url);
          return (
            <Card key={video.id} className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                {videoId && (
                  <div className="sm:w-48 shrink-0 rounded-lg overflow-hidden">
                    <img
                      src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                      alt={video.title}
                      className="w-full aspect-video object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-medium text-sm truncate">{video.title}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${
                      video.is_active ? "bg-success/10 text-success" : "bg-muted/10 text-muted"
                    }`}>
                      {video.is_active ? "Active" : "Hidden"}
                    </span>
                  </div>
                  <p className="text-xs text-muted mb-1">{video.city_name}</p>
                  <p className="text-xs text-muted line-clamp-2">{video.description}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <Button size="sm" variant="ghost" onClick={() => toggleActive(video.id)}>
                      {video.is_active ? "Hide" : "Show"}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(video)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => handleDelete(video.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}

        {videos.length === 0 && (
          <div className="text-center py-12 text-muted text-sm">
            No videos added yet. Click &quot;Add Video&quot; to feature a YouTube video on a city page.
          </div>
        )}
      </div>
    </div>
  );
}
