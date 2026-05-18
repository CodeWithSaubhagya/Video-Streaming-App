import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadVideo } from "../lib/api";

export default function Upload() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [progress, setProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title.trim()) {
      setError("Please choose a file and enter a title.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const video = await uploadVideo({
        file,
        title: title.trim(),
        description: description.trim(),
        onProgress: setProgress,
      });
      navigate(`/watch/${video.id}`);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="upload">
      <div className="upload__card">
        <h1>Upload a video</h1>
        <p className="upload__hint">
          Drop in an MP4 — we'll convert it to HLS and generate a thumbnail.
        </p>

        <form onSubmit={onSubmit} className="upload__form">
          <label className="upload__field">
            <span>Title</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My new video"
              disabled={submitting}
              required
            />
          </label>

          <label className="upload__field">
            <span>Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this video about?"
              rows={3}
              disabled={submitting}
            />
          </label>

          <label className="upload__field upload__file">
            <span>Video file</span>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              disabled={submitting}
              required
            />
            {file && (
              <span className="upload__filename">
                {file.name} · {(file.size / 1024 / 1024).toFixed(1)} MB
              </span>
            )}
          </label>

          {error && <div className="upload__error">{error}</div>}

          {submitting && (
            <div className="upload__progress">
              <div
                className="upload__progress-bar"
                style={{ width: `${progress}%` }}
              />
              <span>
                {progress < 100 ? `Uploading… ${progress}%` : "Processing video…"}
              </span>
            </div>
          )}

          <button type="submit" className="upload__submit" disabled={submitting}>
            {submitting ? "Working…" : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
}
