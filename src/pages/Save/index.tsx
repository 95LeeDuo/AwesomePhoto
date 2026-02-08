import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { getSlotRects } from "@/pages/SelectLocation/slotPositions";

const OUT_WIDTH = 600;
const OUT_HEIGHT = 800;

const Save = () => {
  const navigate = useNavigate();
  const selectedFrame = useAppSelector((state) => state.frame.selectedFrame);
  const frameSlots = useAppSelector((state) => state.uploadImages.frameSlots);
  const [saving, setSaving] = useState(false);

  const canSave =
    selectedFrame &&
    frameSlots.length === 4 &&
    frameSlots.every((s) => s != null);

  useEffect(() => {
    if (!canSave) navigate("/select-location", { replace: true });
  }, [canSave, navigate]);

  const slotPositions = useMemo(() => {
    if (!selectedFrame) return [];
    return getSlotRects(selectedFrame, OUT_WIDTH, OUT_HEIGHT).map((r) => ({
      left: (r.x / OUT_WIDTH) * 100,
      top: (r.y / OUT_HEIGHT) * 100,
      width: (r.w / OUT_WIDTH) * 100,
      height: (r.h / OUT_HEIGHT) * 100,
    }));
  }, [selectedFrame]);

  const handleSave = async () => {
    if (!selectedFrame || !frameSlots.every((s) => s != null)) return;
    setSaving(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = OUT_WIDTH;
      canvas.height = OUT_HEIGHT;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setSaving(false);
        return;
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0);

      const rects = getSlotRects(selectedFrame, OUT_WIDTH, OUT_HEIGHT);
      for (let i = 0; i < 4; i++) {
        const slot = frameSlots[i];
        if (!slot?.previewURL) continue;
        const img = await loadImage(slot.previewURL);
        const r = rects[i]!;
        const x = Math.round(r.x);
        const y = Math.round(r.y);
        const w = Math.round(r.w);
        const h = Math.round(r.h);
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.clip();
        drawImageCover(ctx, img, x, y, w, h);
        ctx.restore();
      }

      const frameImg = await loadImage("/test_frame.png");
      const fw = frameImg.naturalWidth;
      const fh = frameImg.naturalHeight;
      const scale =
        fw && fh
          ? Math.min(OUT_WIDTH / fw, OUT_HEIGHT / fh)
          : 1;
      const fitW = fw ? fw * scale : OUT_WIDTH;
      const fitH = fh ? fh * scale : OUT_HEIGHT;
      const offsetX = (OUT_WIDTH - fitW) / 2;
      const offsetY = (OUT_HEIGHT - fitH) / 2;
      ctx.drawImage(frameImg, offsetX, offsetY, fitW, fitH);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setSaving(false);
            return;
          }
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `awesome-photo-${Date.now()}.png`;
          a.click();
          URL.revokeObjectURL(url);
          setSaving(false);
        },
        "image/png",
        0.95
      );
    } catch {
      setSaving(false);
    }
  };

  if (!canSave) return null;

  return (
    <div className="max-w-[1200px] w-full mx-2 flex flex-col items-center gap-6">
      <h1 className="text-2xl font-semibold">저장하기</h1>
      <div className="relative w-full max-w-[360px] aspect-3/4 bg-gray-100 rounded-lg overflow-hidden">
        {slotPositions.map((pos, index) => (
          <div
            key={index}
            className="absolute overflow-hidden"
            style={{
              left: `${pos.left}%`,
              top: `${pos.top}%`,
              width: `${pos.width}%`,
              height: `${pos.height}%`,
            }}
          >
            {frameSlots[index] && (
              <img
                src={frameSlots[index]!.previewURL}
                alt=""
                className="w-full h-full object-cover"
              />
            )}
          </div>
        ))}
        <img
          src="/test_frame.png"
          alt="frame"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none z-10"
        />
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => navigate("/select-location")}
          className="px-6 py-2.5 rounded-lg font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
        >
          수정하기
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-2.5 rounded-lg font-medium bg-[#3b82f6] text-white hover:bg-[#2563eb] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "저장 중…" : "저장"}
        </button>
      </div>
    </div>
  );
};

export default Save;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (!src.startsWith("blob:")) {
      img.crossOrigin = "anonymous";
    }
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  if (!iw || !ih) return;
  const scale = Math.max(w / iw, h / ih);
  const sw = w / scale;
  const sh = h / scale;
  const sx = (iw - sw) / 2;
  const sy = (ih - sh) / 2;
  const dx = Math.floor(x);
  const dy = Math.floor(y);
  const dw = Math.ceil(w);
  const dh = Math.ceil(h);
  ctx.drawImage(
    img,
    sx,
    sy,
    sw,
    sh,
    dx,
    dy,
    dw,
    dh
  );
}
