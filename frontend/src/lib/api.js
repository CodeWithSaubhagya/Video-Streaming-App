export const API_BASE = "http://localhost:8000";

export async function fetchVideos() {
  const res = await fetch(`${API_BASE}/videos`);
  if (!res.ok) throw new Error("Failed to fetch videos");
  return res.json();
}

export async function fetchVideo(id) {
  const res = await fetch(`${API_BASE}/videos/${id}`);
  if (!res.ok) throw new Error("Failed to fetch video");
  return res.json();
}

export async function deleteVideo(id) {
  const res = await fetch(`${API_BASE}/videos/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete video");
  return res.json();
}

export async function uploadVideo({ file, title, description, onProgress }) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch {
          reject(new Error("Invalid server response"));
        }
      } else {
        reject(new Error(`Upload failed (${xhr.status})`));
      }
    });

    xhr.addEventListener("error", () => reject(new Error("Network error")));

    xhr.open("POST", `${API_BASE}/upload`);
    xhr.send(formData);
  });
}

export function formatRelativeTime(timestamp) {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}
