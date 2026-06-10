# Video Streaming App

A full-stack video streaming application that uploads videos, transcodes them to
HLS (HTTP Live Streaming) on the fly with FFmpeg, generates thumbnails, and plays
them back with adaptive streaming in the browser.

## Features

- Upload videos through a REST API
- Automatic transcoding to HLS (`.m3u8` + `.ts` segments) via FFmpeg
- Automatic thumbnail generation
- List, fetch, and delete videos
- React frontend with Video.js for HLS playback

## Tech Stack

**Backend**
- Node.js + Express 5
- Multer (file uploads)
- FFmpeg (HLS transcoding & thumbnails)
- JSON file (`videos.json`) as a lightweight metadata store

**Frontend**
- React 19 + Vite
- Video.js / `@videojs/react`
- React Router

## Prerequisites

- [Node.js](https://nodejs.org/) (18+ recommended)
- [pnpm](https://pnpm.io/)
- [FFmpeg](https://ffmpeg.org/) available on your `PATH`

## Getting Started

### Backend

```bash
pnpm install
pnpm start
```

The API runs on `http://localhost:8000`.

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

The dev server is served by Vite (default `http://localhost:5173`).

## API Reference

| Method | Endpoint        | Description                                  |
| ------ | --------------- | -------------------------------------------- |
| GET    | `/`             | Health check                                 |
| GET    | `/videos`       | List all videos (newest first)               |
| GET    | `/videos/:id`   | Get a single video by id                     |
| POST   | `/upload`       | Upload a video (`multipart/form-data`)       |
| DELETE | `/videos/:id`   | Delete a video and its generated assets      |

### Upload fields

- `file` — the video file (required)
- `title` — video title (optional, defaults to `Untitled`)
- `description` — video description (optional)

Uploaded files and generated HLS/thumbnail assets are served statically from
`/uploads`.

## License

This project is licensed under the [MIT License](LICENSE).
