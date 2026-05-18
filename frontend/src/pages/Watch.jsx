import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchVideo, fetchVideos, deleteVideo, formatRelativeTime } from "../lib/api";
import VideoPlayer from "../VideoPlayer";
import VideoCard from "../components/VideoCard";

export default function Watch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [others, setOthers] = useState([]);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete "${video.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await deleteVideo(video.id);
      navigate("/");
    } catch (e) {
      alert(`Delete failed: ${e.message}`);
      setDeleting(false);
    }
  };

  useEffect(() => {
    setVideo(null);
    setError(null);
    Promise.all([fetchVideo(id), fetchVideos()])
      .then(([v, list]) => {
        setVideo(v);
        setOthers(list.filter((x) => x.id !== id));
      })
      .catch((e) => setError(e.message));
  }, [id]);

  if (error) return <div className="page-state page-state--error">{error}</div>;
  if (!video) return <div className="page-state">Loading video…</div>;

  const options = {
    controls: true,
    responsive: true,
    fluid: true,
    sources: [{ src: video.hlsUrl, type: "application/x-mpegURL" }],
  };

  return (
    <div className="watch">
      <div className="watch__main">
        <div className="watch__player">
          <VideoPlayer key={video.id} options={options} />
        </div>
        <div className="watch__title-row">
          <h1 className="watch__title">{video.title}</h1>
          <button
            type="button"
            className="watch__delete"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
        <p className="watch__meta">
          StreamLab · uploaded {formatRelativeTime(video.createdAt)}
        </p>
        {video.description && (
          <div className="watch__description">{video.description}</div>
        )}
      </div>

      <aside className="watch__sidebar">
        <h2 className="watch__sidebar-title">Up next</h2>
        {others.length === 0 ? (
          <p className="watch__sidebar-empty">Nothing else here yet.</p>
        ) : (
          others.map((v) => <VideoCard key={v.id} video={v} compact />)
        )}
      </aside>
    </div>
  );
}
