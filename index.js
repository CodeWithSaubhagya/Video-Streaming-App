import express from "express";
import cors from "cors";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const app = express();
const PORT = 8000;
const VIDEOS_DB = "./videos.json";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + uuidv4() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// ─── metadata store ────────────────────────────────────────────────────
function readVideos() {
  if (!fs.existsSync(VIDEOS_DB)) return [];
  try {
    return JSON.parse(fs.readFileSync(VIDEOS_DB, "utf-8"));
  } catch {
    return [];
  }
}

function writeVideos(videos) {
  fs.writeFileSync(VIDEOS_DB, JSON.stringify(videos, null, 2));
}

// ─── routes ────────────────────────────────────────────────────────────
app.get("/", (req, res) => res.json({ message: "Video Streaming API" }));

app.get("/videos", (req, res) => {
  const videos = readVideos().sort((a, b) => b.createdAt - a.createdAt);
  res.json(videos);
});

app.get("/videos/:id", (req, res) => {
  const video = readVideos().find((v) => v.id === req.params.id);
  if (!video) return res.status(404).json({ error: "Video not found" });
  res.json(video);
});

app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const id = uuidv4();
  const title = req.body.title?.trim() || "Untitled";
  const description = req.body.description?.trim() || "";
  const videoPath = req.file.path;

  const hlsDir = `./uploads/courses/${id}`;
  const hlsPath = `${hlsDir}/index.m3u8`;
  const thumbDir = `./uploads/thumbnails`;
  const thumbPath = `${thumbDir}/${id}.jpg`;

  fs.mkdirSync(hlsDir, { recursive: true });
  fs.mkdirSync(thumbDir, { recursive: true });

  const hlsCmd = `ffmpeg -i "${videoPath}" -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${hlsDir}/segment%03d.ts" -start_number 0 "${hlsPath}"`;
  const thumbCmd = `ffmpeg -ss 00:00:01 -i "${videoPath}" -vframes 1 -vf "scale=640:-1" "${thumbPath}"`;

  try {
    await Promise.all([execAsync(hlsCmd), execAsync(thumbCmd)]);
  } catch (error) {
    console.error("ffmpeg failed:", error);
    return res.status(500).json({ error: "Video processing failed" });
  }

  const base = `http://localhost:${PORT}`;
  const video = {
    id,
    title,
    description,
    sourcePath: videoPath,
    hlsUrl: `${base}/uploads/courses/${id}/index.m3u8`,
    thumbnailUrl: `${base}/uploads/thumbnails/${id}.jpg`,
    createdAt: Date.now(),
  };

  const videos = readVideos();
  videos.push(video);
  writeVideos(videos);

  res.json(video);
});

app.delete("/videos/:id", (req, res) => {
  const videos = readVideos();
  const idx = videos.findIndex((v) => v.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Video not found" });

  const video = videos[idx];
  const hlsDir = `./uploads/courses/${video.id}`;
  const thumbPath = `./uploads/thumbnails/${video.id}.jpg`;

  fs.rmSync(hlsDir, { recursive: true, force: true });
  if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath);
  if (video.sourcePath && fs.existsSync(video.sourcePath)) {
    fs.unlinkSync(video.sourcePath);
  }

  videos.splice(idx, 1);
  writeVideos(videos);

  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`API listening on :${PORT}`));
