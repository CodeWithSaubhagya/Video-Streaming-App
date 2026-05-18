import { Link } from "react-router-dom";
import { formatRelativeTime } from "../lib/api";

export default function VideoCard({ video, compact = false, onDelete }) {
  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`Delete "${video.title}"? This cannot be undone.`)) {
      onDelete?.(video);
    }
  };

  return (
    <Link
      to={`/watch/${video.id}`}
      className={compact ? "video-card video-card--compact" : "video-card"}
    >
      <div className="video-card__thumb">
        <img src={video.thumbnailUrl} alt={video.title} loading="lazy" />
        {onDelete && (
          <button
            type="button"
            className="video-card__delete"
            onClick={handleDelete}
            aria-label="Delete video"
            title="Delete video"
          >
            ×
          </button>
        )}
      </div>
      <div className="video-card__body">
        <h3 className="video-card__title">{video.title}</h3>
        <p className="video-card__meta">
          StreamLab · {formatRelativeTime(video.createdAt)}
        </p>
      </div>
    </Link>
  );
}
