import { useEffect, useState } from "react";
import { fetchVideos, deleteVideo } from "../lib/api";
import VideoCard from "../components/VideoCard";

export default function Library() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVideos()
      .then(setVideos)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (video) => {
    const prev = videos;
    setVideos((vs) => vs.filter((v) => v.id !== video.id));
    try {
      await deleteVideo(video.id);
    } catch (e) {
      setVideos(prev);
      alert(`Delete failed: ${e.message}`);
    }
  };

  if (loading) return <div className="page-state">Loading library…</div>;
  if (error) return <div className="page-state page-state--error">{error}</div>;

  return (
    <div className="library">
      <div className="library__header">
        <h1>Your library</h1>
        <p>{videos.length} video{videos.length === 1 ? "" : "s"}</p>
      </div>

      {videos.length === 0 ? (
        <div className="empty">
          <p>No videos yet. Upload your first one to get started.</p>
        </div>
      ) : (
        <div className="video-grid">
          {videos.map((v) => (
            <VideoCard key={v.id} video={v} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
