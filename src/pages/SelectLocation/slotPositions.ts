import type { FrameType } from "@/store/slices/frameSlice";

// 1x4 슬롯 비율 500x385 유지 (컨테이너 3:4 기준) — SelectedFrame와 동기화용 export
export const SLOT_1X4_HEIGHT_PCT = 22;
export const SLOT_1X4_WIDTH_PCT = Number((22 * (500 / 385) * (4 / 3)).toFixed(2));

// 프레임 타입별 슬롯 위치 (%)
const SLOT_POSITIONS_PERCENT: Record<
  Exclude<FrameType, null>,
  { top: number; left: number; width: number; height: number; translateX: boolean; translateY: boolean }[]
> = {
  "1x4": [
    { top: 1.5, left: 50, width: SLOT_1X4_WIDTH_PCT, height: SLOT_1X4_HEIGHT_PCT, translateX: true, translateY: false },
    { top: 25.5, left: 50, width: SLOT_1X4_WIDTH_PCT, height: SLOT_1X4_HEIGHT_PCT, translateX: true, translateY: false },
    { top: 50, left: 50, width: SLOT_1X4_WIDTH_PCT, height: SLOT_1X4_HEIGHT_PCT, translateX: true, translateY: false },
    { top: 74, left: 50, width: SLOT_1X4_WIDTH_PCT, height: SLOT_1X4_HEIGHT_PCT, translateX: true, translateY: false },
  ],
  v2x2: [
    { top: 12, left: 25, width: 35, height: 30, translateX: true, translateY: false },
    { top: 12, left: 75, width: 35, height: 30, translateX: true, translateY: false },
    { top: 58, left: 25, width: 35, height: 30, translateX: true, translateY: false },
    { top: 58, left: 75, width: 35, height: 30, translateX: true, translateY: false },
  ],
  h2x2: [
    { top: 20, left: 15, width: 30, height: 35, translateX: false, translateY: true },
    { top: 20, left: 50, width: 30, height: 35, translateX: false, translateY: true },
    { top: 80, left: 15, width: 30, height: 35, translateX: false, translateY: true },
    { top: 80, left: 50, width: 30, height: 35, translateX: false, translateY: true },
  ],
};

export type SlotRect = { x: number; y: number; w: number; h: number };

export function getSlotRects(
  frameType: Exclude<FrameType, null>,
  width: number,
  height: number
): SlotRect[] {
  const positions = SLOT_POSITIONS_PERCENT[frameType];
  if (!positions) return [];
  return positions.map((p) => {
    const w = (p.width / 100) * width;
    const h = (p.height / 100) * height;
    let x = (p.left / 100) * width;
    let y = (p.top / 100) * height;
    if (p.translateX) x -= w / 2;
    if (p.translateY) y -= h / 2;
    return { x, y, w, h };
  });
}
