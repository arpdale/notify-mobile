#!/usr/bin/env python3
"""Build a frame catalogue from a recorded product walkthrough.

Pipeline:
  1. Run ffmpeg with scene detection to extract one frame per visual cut.
  2. Optionally apply a refined crop so the output is just the mobile preview
     (the recording usually has Zoom chrome / webcam tiles / emulator bezel
     around the actual app).
  3. Parse the WebVTT transcript and attach the surrounding cue text to each
     frame's timestamp.
  4. Emit a manifest.md (per-frame catalogue) and crop_suggestion.json.

Requires: ffmpeg on PATH; Python packages pillow + webvtt-py.
Install with: uv pip install pillow webvtt-py

Usage:
  python tools/build_walkthrough_manifest.py \\
    --video    ~/path/to/walkthrough.mp4 \\
    --vtt      ~/path/to/transcript.vtt \\
    --out      reference/walkthrough \\
    [--target  ~/path/to/marker.png]      # optional magenta-marker hint image
    [--scene   0.15]                      # scene-detect threshold, lower = more frames
    [--crop    264,173,325,615]           # explicit x,y,w,h crop (skip auto-detect)
    [--pre     4]                         # seconds of transcript before each frame
    [--post    6]                         # seconds of transcript after each frame
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

from PIL import Image
import webvtt


def is_magenta(rgb: tuple[int, int, int]) -> bool:
    r, g, b = rgb
    return r > 230 and g < 40 and 130 < b < 180


def detect_magenta_bounds(path: Path) -> tuple[int, int, int, int, int, int] | None:
    img = Image.open(path).convert("RGB")
    W, H = img.size
    px = img.load()
    xs: list[int] = []
    ys: list[int] = []
    for y in range(H):
        for x in range(W):
            if is_magenta(px[x, y]):
                xs.append(x)
                ys.append(y)
    if not xs:
        return None
    return min(xs), min(ys), max(xs), max(ys), W, H


def parse_scene_log(path: Path) -> list[float]:
    rx = re.compile(r"pts_time:([0-9.]+)")
    return [float(m.group(1)) for line in path.read_text().splitlines() if (m := rx.search(line))]


def parse_vtt(path: Path) -> list[tuple[float, float, str, str | None]]:
    """Return list of (start_s, end_s, text, speaker)."""

    def to_seconds(stamp: str) -> float:
        h, m, s = stamp.split(":")
        return int(h) * 3600 + int(m) * 60 + float(s)

    cues: list[tuple[float, float, str, str | None]] = []
    for cue in webvtt.read(str(path)):
        start = to_seconds(cue.start)
        end = to_seconds(cue.end)
        raw = cue.text.strip().replace("\n", " ")
        speaker: str | None = None
        if ":" in raw:
            possible, rest = raw.split(":", 1)
            if 1 <= len(possible.split()) <= 4 and len(possible) < 40:
                speaker = possible
                raw = rest.strip()
        cues.append((start, end, raw, speaker))
    return cues


def fmt_mmss(secs: float) -> str:
    m = int(secs) // 60
    s = secs - m * 60
    return f"{m:02d}:{s:05.2f}"


def neighbors_for(t: float, cues, pre_s: float, post_s: float):
    lo, hi = t - pre_s, t + post_s
    return [c for c in cues if c[1] >= lo and c[0] <= hi]


def extract_frames(video: Path, scene: float, frames_dir: Path) -> Path:
    """Run ffmpeg scene-detect; return path to scene_log.txt."""
    frames_dir.mkdir(parents=True, exist_ok=True)
    for existing in frames_dir.glob("*.png"):
        existing.unlink()
    scene_log = frames_dir.parent / "scene_log.txt"
    with open(scene_log, "w") as log:
        proc = subprocess.run(
            [
                "ffmpeg", "-hide_banner", "-nostats",
                "-i", str(video),
                "-vf", f"select='gt(scene,{scene})',showinfo",
                "-fps_mode", "vfr",
                "-q:v", "2",
                str(frames_dir / "%04d.png"),
            ],
            stderr=log, stdout=subprocess.DEVNULL,
        )
    if proc.returncode != 0:
        print(f"ffmpeg exited {proc.returncode}; see {scene_log}", file=sys.stderr)
        sys.exit(proc.returncode)
    return scene_log


def bulk_crop(frames_dir: Path, cropped_dir: Path, crop: tuple[int, int, int, int]) -> None:
    cropped_dir.mkdir(parents=True, exist_ok=True)
    for existing in cropped_dir.glob("*.png"):
        existing.unlink()
    x, y, w, h = crop
    flt = f"crop={w}:{h}:{x}:{y}"
    for src in sorted(frames_dir.glob("*.png")):
        subprocess.run(
            ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
             "-i", str(src), "-vf", flt, str(cropped_dir / src.name)],
            check=True,
        )


def parse_crop(value: str) -> tuple[int, int, int, int]:
    parts = [int(p) for p in value.split(",")]
    if len(parts) != 4:
        raise argparse.ArgumentTypeError("--crop must be x,y,w,h")
    return tuple(parts)  # type: ignore[return-value]


def parse_frames(value: str) -> set[int]:
    """Parse e.g. "7-22" or "1,3,7-22" into a set of 1-indexed frame numbers."""
    selected: set[int] = set()
    for token in value.split(","):
        token = token.strip()
        if "-" in token:
            lo, hi = token.split("-", 1)
            selected.update(range(int(lo), int(hi) + 1))
        elif token:
            selected.add(int(token))
    return selected


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--video", type=Path, required=True)
    ap.add_argument("--vtt", type=Path, required=True)
    ap.add_argument("--out", type=Path, required=True)
    ap.add_argument("--target", type=Path)
    ap.add_argument("--scene", type=float, default=0.15)
    ap.add_argument("--crop", type=parse_crop, default=None,
                    help="Explicit x,y,w,h crop in video pixel coords")
    ap.add_argument("--pre", type=float, default=4.0)
    ap.add_argument("--post", type=float, default=6.0)
    ap.add_argument(
        "--frames",
        type=parse_frames,
        default=None,
        help="Restrict manifest to e.g. '7-22' or '1,3,7-22' (1-indexed)",
    )
    ap.add_argument(
        "--skip-extract",
        action="store_true",
        help="Skip ffmpeg extraction (use existing frames/ and scene_log.txt)",
    )
    args = ap.parse_args()

    out = args.out.expanduser().resolve()
    out.mkdir(parents=True, exist_ok=True)
    frames_dir = out / "frames"
    cropped_dir = out / "frames-cropped"

    if args.skip_extract:
        scene_log = out / "scene_log.txt"
        if not scene_log.exists():
            print(f"missing {scene_log}; cannot skip extraction", file=sys.stderr)
            return 1
    else:
        scene_log = extract_frames(args.video.expanduser(), args.scene, frames_dir)
    times = parse_scene_log(scene_log)
    cues = parse_vtt(args.vtt.expanduser())

    # Probe video size from the first extracted frame.
    sample = next(frames_dir.glob("*.png"), None)
    if sample is None:
        print("no frames extracted", file=sys.stderr)
        return 1
    with Image.open(sample) as im:
        video_w, video_h = im.size

    crop_info: dict = {"video_frame_size": [video_w, video_h]}

    if args.crop:
        crop = args.crop
    elif args.target:
        bounds = detect_magenta_bounds(args.target.expanduser())
        if bounds:
            x0, y0, x1, y1, tw, th = bounds
            sx, sy = video_w / tw, video_h / th
            vx0, vy0 = round(x0 * sx), round(y0 * sy)
            vx1, vy1 = round(x1 * sx), round(y1 * sy)
            pad = 12
            cx0 = max(0, vx0 - pad)
            cy0 = max(0, vy0 - pad)
            cx1 = min(video_w, vx1 + pad)
            cy1 = min(video_h, vy1 + pad)
            crop = (cx0, cy0, cx1 - cx0, cy1 - cy0)
            crop_info.update({
                "target_image_size": [tw, th],
                "magenta_bounds_target_space": [x0, y0, x1, y1],
                "magenta_bounds_video_space": [vx0, vy0, vx1, vy1],
            })
        else:
            print(f"no magenta found in {args.target}", file=sys.stderr)
            crop = None
    else:
        crop = None

    if crop:
        bulk_crop(frames_dir, cropped_dir, crop)
        x, y, w, h = crop
        crop_info["applied_crop"] = [x, y, w, h]
        crop_info["ffmpeg_filter"] = f"crop={w}:{h}:{x}:{y}"

    (out / "crop_suggestion.json").write_text(json.dumps(crop_info, indent=2))

    frame_paths = sorted(frames_dir.glob("*.png"))
    if len(times) != len(frame_paths):
        print(
            f"warning: {len(times)} scene_log entries vs {len(frame_paths)} frame files",
            file=sys.stderr,
        )

    lines: list[str] = []
    lines.append("# Walkthrough frame catalogue\n")
    lines.append(f"Source video: `{args.video}`  \nTranscript: `{args.vtt}`\n")
    if crop:
        x, y, w, h = crop
        lines.append(
            f"**Video frame size:** {video_w}×{video_h}  \n"
            f"**Applied crop:** offset ({x}, {y}), size {w}×{h}  \n"
            f"**ffmpeg filter:** `{crop_info['ffmpeg_filter']}`\n"
        )
    lines.append(
        f"Scene-detect threshold: `{args.scene}`. "
        "Each entry shows the cropped phone view; the matching full frame is linked below it.\n"
    )
    if args.frames:
        sorted_sel = sorted(args.frames)
        ranges: list[str] = []
        run_lo = run_hi = sorted_sel[0]
        for n in sorted_sel[1:]:
            if n == run_hi + 1:
                run_hi = n
            else:
                ranges.append(f"{run_lo}-{run_hi}" if run_lo != run_hi else f"{run_lo}")
                run_lo = run_hi = n
        ranges.append(f"{run_lo}-{run_hi}" if run_lo != run_hi else f"{run_lo}")
        lines.append(
            f"**Curated subset:** {', '.join(ranges)} "
            f"({len(args.frames)} of {len(frame_paths)} frames)\n"
        )
    lines.append("---\n")

    for idx, (frame_path, t) in enumerate(zip(frame_paths, times), start=1):
        if args.frames is not None and idx not in args.frames:
            continue
        neighbors = neighbors_for(t, cues, args.pre, args.post)
        speakers = sorted({c[3] for c in neighbors if c[3]})
        speaker_str = ", ".join(speakers) if speakers else "—"
        snippet_parts: list[str] = []
        for c in neighbors:
            stamp = fmt_mmss(c[0])
            body = c[2]
            if c[3]:
                snippet_parts.append(f"- `{stamp}` **{c[3]}:** {body}")
            else:
                snippet_parts.append(f"- `{stamp}` {body}")
        snippet = "\n".join(snippet_parts) if snippet_parts else "_(no transcript in window)_"

        cropped_path = cropped_dir / frame_path.name
        lines.append(f"## {frame_path.name} · `{fmt_mmss(t)}`\n")
        if cropped_path.exists():
            lines.append(f"![{frame_path.name}](frames-cropped/{frame_path.name})\n")
            lines.append(
                f"_Full frame: [`frames/{frame_path.name}`](frames/{frame_path.name})_\n"
            )
        else:
            lines.append(f"![{frame_path.name}](frames/{frame_path.name})\n")
        lines.append(f"**Speakers in window:** {speaker_str}\n")
        lines.append(snippet)
        lines.append("\n---\n")

    manifest = out / "manifest.md"
    manifest.write_text("\n".join(lines))
    print(f"wrote {manifest}")
    print(f"frames: {len(frame_paths)}  scene_log: {len(times)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
