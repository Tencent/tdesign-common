import type {
  CrossOrigin,
  ERROR_LEVEL_MAPPED_TYPE,
  ErrorCorrectionLevel,
  Excavation,
  ImageSettings,
  Modules,
  QrCodeModuleShape,
  QrCodeStyleOptions,
} from './types';
import { Ecc } from './qrcodegen';

// =================== ERROR_LEVEL ==========================
export const ERROR_LEVEL_MAP: ERROR_LEVEL_MAPPED_TYPE = {
  L: Ecc.LOW,
  M: Ecc.MEDIUM,
  Q: Ecc.QUARTILE,
  H: Ecc.HIGH,
} as const;

// =================== DEFAULT_VALUE ==========================
export const DEFAULT_SIZE = 160;
export const DEFAULT_LEVEL: ErrorCorrectionLevel = 'M';
export const DEFAULT_BACKGROUND_COLOR = '#FFFFFF';
export const DEFAULT_FRONT_COLOR = '#000000';
export const DEFAULT_NEED_MARGIN = false;
export const DEFAULT_MINVERSION = 1;
export const SPEC_MARGIN_SIZE = 4;
export const DEFAULT_MARGIN_SIZE = 0;
export const DEFAULT_IMG_SCALE = 0.1;

// =================== UTILS ==========================
/**
 * Generate a merged-solid-block path string from modules.
 * Optionally restricted by `predicate` so only matching modules are merged
 * (used to isolate function modules). The legacy `generatePath` behavior is
 * `generatePathRaw(modules, margin)`.
 * @param modules
 * @param margin
 * @param predicate When provided, only modules for which it returns true are included.
 * @returns
 */
export const generatePathRaw = (
  modules: Modules,
  margin: number = 0,
  predicate?: (cell: boolean, x: number, y: number) => boolean
) => {
  const ops: string[] = [];
  modules.forEach((row, y) => {
    let start: number | null = null;
    row.forEach((cell, x) => {
      const included = predicate ? predicate(cell, x, y) : cell;
      if (!included && start !== null) {
        ops.push(`M${start + margin} ${y + margin}h${x - start}v1H${start + margin}z`);
        start = null;
        return;
      }

      if (x === row.length - 1) {
        if (!included) {
          return;
        }
        if (start === null) {
          ops.push(`M${x + margin},${y + margin} h1v1H${x + margin}z`);
        } else {
          ops.push(`M${start + margin},${y + margin} h${x + 1 - start}v1H${start + margin}z`);
        }
        return;
      }

      if (included && start === null) {
        start = x;
      }
    });
  });
  return ops.join('');
};

// =================== STYLE ==========================
/** Default data-module side length as a percentage of one cell (0–100). `square`=100 keeps the original merged-block look. */
const DEFAULT_SHAPE_SCALE: Record<QrCodeModuleShape, number> = {
  square: 100,
  'mini-square': 75,
  rounded: 100,
  dot: 100,
};

/**
 * Extra padding added to the rounded bridge arc radius (arcR = 0.5 + ext), in cell units.
 * 0 is correct: at arcR = 0.5 the arc centre sits on the cell centre and its radius equals
 * the data circle's — the pie slice's arc coincides with the circle's circumference, so the
 * two tile seamlessly. Any ext > 0 moves the arc centre outward and cuts INTO the circle,
 * deforming the dots. Keep at 0.
 */
const ROUNDED_BRIDGE_EXTENSION = 0;

/**
 * Alignment-pattern centre coordinates for a QR code of the given size.
 * Mirrors the geometry in qrcodegen.ts (version = (size - 17) / 4).
 * Version 1 has no alignment patterns.
 */
const getAlignmentPatternPositions = (size: number): number[] => {
  const version = (size - 17) / 4;
  if (version === 1) {
    return [];
  }
  const numAlign = Math.floor(version / 7) + 2;
  const step = version === 32 ? 26 : Math.ceil((version * 4 + 4) / (numAlign * 2 - 2)) * 2;
  const result: number[] = [6];
  for (let pos = size - 7; result.length < numAlign; pos -= step) {
    result.splice(1, 0, pos);
  }
  return result;
};

/**
 * Reconstructs the function-module mask purely from QR geometry.
 * Always contains the three 7×7 finder patterns (rendered as solid blocks).
 * When `includeAlignment` is true the 5×5 alignment patterns are also masked as
 * solid blocks — needed for `mini-square`, where isolated little squares would
 * no longer read as one marker. Other shapes leave alignment styled as data.
 * Timing / format / version modules are always treated as data.
 */
export const getFunctionModuleMask = (size: number, includeAlignment = false): boolean[][] => {
  const mask: boolean[][] = Array.from({ length: size }, () => Array.from({ length: size }, () => false));
  const set = (x: number, y: number) => {
    if (x >= 0 && x < size && y >= 0 && y < size) {
      mask[y][x] = true;
    }
  };

  // Three 7x7 finder patterns only (no separator, no timing, no alignment,
  // no format, no version — those are all styled as data).
  const finder = (cx: number, cy: number) => {
    for (let dy = -3; dy <= 3; dy++) {
      for (let dx = -3; dx <= 3; dx++) {
        set(cx + dx, cy + dy);
      }
    }
  };
  finder(3, 3);
  finder(size - 4, 3);
  finder(3, size - 4);

  // Optional: keep alignment patterns solid too (see `includeAlignment`).
  if (includeAlignment) {
    const alignPos = getAlignmentPatternPositions(size);
    alignPos.forEach((ay) => {
      alignPos.forEach((ax) => {
        // Skip the three positions that would collide with a finder.
        if ((ax === 6 && ay === 6) || (ax === 6 && ay === size - 7) || (ax === size - 7 && ay === 6)) {
          return;
        }
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            set(ax + dx, ay + dy);
          }
        }
      });
    });
  }

  return mask;
};

/**
 * Draws a single styled data module as an SVG path fragment (1 cell = 1 unit).
 */
const drawStyledModule = (x: number, y: number, margin: number, shape: QrCodeModuleShape, scale: number): string => {
  const x0 = x + margin + (1 - scale) / 2;
  const y0 = y + margin + (1 - scale) / 2;
  const s = scale;

  switch (shape) {
    case 'mini-square':
    case 'square':
      return `M${x0},${y0} h${s} v${s} H${x0} Z`;
    case 'rounded':
      // `rounded` is drawn separately in drawRoundedPath, not here.
      return '';
    case 'dot': {
      const r = s / 2;
      const cx = x + margin + 0.5;
      const cy = y + margin + 0.5;
      return `M${cx - r},${cy} a${r},${r} 0 1,0 ${2 * r},0 a${r},${r} 0 1,0 ${-2 * r},0 Z`;
    }
    default:
      return '';
  }
};

/**
 * Builds the data-cell path for the `rounded` style, using neighbour-aware
 * rendering in three passes:
 *  1. Concave corners: a LIGHT cell whose two orthogonal sides AND diagonal are
 *     all dark gets a dark pie slice — rounds the inner corner of an L-junction.
 *  2. Convex bridges: a DARK cell draws a pie-slice bridge at any corner that
 *     has a non-light neighbour (arc radius 0.5+ext, so it fuses with the
 *     neighbour's bridge).
 *  3. Full circles (r=0.5) at every dark data cell.
 * Result: isolated cells are plain circles, orthogonal neighbours form pills,
 * and both convex and concave corners are rounded.
 */
const drawRoundedPath = (modules: Modules, mask: boolean[][], margin: number): string => {
  const size = modules.length;
  const halfcell = 0.5;
  const arcR = halfcell + ROUNDED_BRIDGE_EXTENSION;
  const ops: string[] = [];

  // Neighbour status: true = dark or out of bounds (treat as connected),
  // null = function cell, false = light data cell.
  const shouldConnect = (cx: number, cy: number, dx: number, dy: number): boolean | null => {
    const nx = cx + dx;
    const ny = cy + dy;
    if (nx < 0 || nx >= size || ny < 0 || ny >= size) return true;
    if (mask[ny][nx]) return null;
    return modules[ny][nx];
  };

  // `shouldConnect` treats out-of-bounds as connected (true). That is the
  // right semantic for the convex bridge pass, but WRONG for the concave
  // fill: a light cell sitting on the QR border has no real neighbour
  // outward, yet shouldConnect returns true there and we would emit a
  // spurious rounded arc hanging off the edge. This helper only reports a
  // neighbour that genuinely exists, is a DATA cell, and is dark.
  const isRealDark = (cx: number, cy: number, dx: number, dy: number): boolean => {
    const nx = cx + dx;
    const ny = cy + dy;
    if (nx < 0 || nx >= size || ny < 0 || ny >= size) return false;
    if (mask[ny][nx]) return false;
    return modules[ny][nx];
  };

  // Per-corner geometry: vertex offset, the two edge directions, and the arc
  // sweep flag. Index 0 = top-left, 1 = bottom-left, 2 = top-right,
  // 3 = bottom-right. The arc centre sits inside the cell at distance arcR
  // from BOTH cell edges, and the arc takes the 90 deg small arc bulging
  // toward the vertex, so sweep depends on the vertical side (top = 1,
  // bottom = 0) — NOT on the horizontal side.
  const corners = [
    { vdx: 0, vdy: 0, e1dx: 0, e1dy: 1, e2dx: 1, e2dy: 0, sweep: 1 as const },
    { vdx: 0, vdy: 1, e1dx: 0, e1dy: -1, e2dx: 1, e2dy: 0, sweep: 0 as const },
    { vdx: 1, vdy: 0, e1dx: 0, e1dy: 1, e2dx: -1, e2dy: 0, sweep: 0 as const },
    { vdx: 1, vdy: 1, e1dx: 0, e1dy: -1, e2dx: -1, e2dy: 0, sweep: 1 as const },
  ];

  // Emit one pie slice at corner `c` of cell (x, y).
  const drawCorner = (x: number, y: number, c: number) => {
    const { vdx, vdy, e1dx, e1dy, e2dx, e2dy, sweep } = corners[c];
    const vx = x + vdx + margin;
    const vy = y + vdy + margin;
    const p1x = vx + e1dx * halfcell;
    const p1y = vy + e1dy * halfcell;
    const p2x = vx + e2dx * halfcell;
    const p2y = vy + e2dy * halfcell;
    const t1x = vx + e1dx * arcR;
    const t1y = vy + e1dy * arcR;
    const t2x = vx + e2dx * arcR;
    const t2y = vy + e2dy * arcR;
    ops.push(
      `M${vx},${vy} L${p1x},${p1y} L${t1x},${t1y} ` +
        `A${arcR},${arcR} 0 0,${sweep} ${t2x},${t2y} L${p2x},${p2y} L${vx},${vy} Z`
    );
  };

  // Pass 1 (concave corners): LIGHT data cells. Fill a dark pie slice when the
  // two orthogonal directions AND the diagonal are all dark — this is the
  // rounded inner corner of an L-junction.
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (modules[y][x] || mask[y][x]) continue;
      // Use isRealDark (NOT shouldConnect) so the QR border never counts as
      // "dark" and no arc is emitted at the edge.
      const top = isRealDark(x, y, 0, -1);
      const bottom = isRealDark(x, y, 0, 1);
      const left = isRealDark(x, y, -1, 0);
      const right = isRealDark(x, y, 1, 0);
      if (top && left && isRealDark(x, y, -1, -1)) drawCorner(x, y, 0);
      if (top && right && isRealDark(x, y, 1, -1)) drawCorner(x, y, 2);
      if (bottom && left && isRealDark(x, y, -1, 1)) drawCorner(x, y, 1);
      if (bottom && right && isRealDark(x, y, 1, 1)) drawCorner(x, y, 3);
    }
  }

  // Pass 2 (阳角 / convex): DARK data cells get bridge pie slices.
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!modules[y][x] || mask[y][x]) continue;
      const top = shouldConnect(x, y, 0, -1);
      const bottom = shouldConnect(x, y, 0, 1);
      const left = shouldConnect(x, y, -1, 0);
      const right = shouldConnect(x, y, 1, 0);
      const want = [
        top !== false || left !== false,
        bottom !== false || left !== false,
        top !== false || right !== false,
        bottom !== false || right !== false,
      ];
      for (let c = 0; c < 4; c++) if (want[c]) drawCorner(x, y, c);
    }
  }

  // Pass 3: full circles (r = halfcell) at every dark data cell
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (modules[y][x] && !mask[y][x]) {
        const cx = x + 0.5 + margin;
        const cy = y + 0.5 + margin;
        ops.push(
          `M${cx - halfcell},${cy} a${halfcell},${halfcell} 0 1,0 ${2 * halfcell},0 a${halfcell},${halfcell} 0 1,0 ${-2 * halfcell},0 Z`
        );
      }
    }
  }

  return ops.join('');
};

/**
 * Generates an SVG/canvas path string from the modules.
 * Without `styleOptions.shape` (or `'square'`): legacy merged-solid-block
 * rendering (backward compatible). Otherwise function modules stay solid and
 * data modules are drawn in the requested shape. Returns a single path usable
 * for both `<path d>` and `Path2D`.
 */
export const generatePath = (modules: Modules, margin: number = 0, styleOptions?: QrCodeStyleOptions): string => {
  const style = styleOptions?.shape;
  if (!style || style === 'square') {
    // 'square' == the original look: function AND data modules fully merged.
    return generatePathRaw(modules, margin);
  }
  // `mini-square` also keeps the 5x5 alignment patterns solid — as little
  // separated squares they stop reading as a marker.
  const mask = getFunctionModuleMask(modules.length, style === 'mini-square');
  // Function modules: merged solid block, RESPECTING the original cell value
  // (so the white 1-cell separator around finders and the light cells inside
  // timing/alignment/format patterns are left transparent — only the actually
  // dark function modules are drawn).
  const funcPath = generatePathRaw(modules, margin, (cell, x, y) => cell && mask[y][x]);

  // `rounded` uses neighbour-aware rendering (circles + bridges); its bridge
  // extension is an internal constant (tuning it only deforms the dots), so it
  // is deliberately NOT exposed.
  if (style === 'rounded') {
    return funcPath + drawRoundedPath(modules, mask, margin);
  }

  // mini-square / dot: simple per-cell rendering, scale is the only tunable.
  const rawScale = styleOptions?.scale ?? DEFAULT_SHAPE_SCALE[style];
  const scale = Math.min(100, Math.max(0, rawScale)) / 100;
  const dataOps: string[] = [];
  modules.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell && !mask[y][x]) {
        dataOps.push(drawStyledModule(x, y, margin, style, scale));
      }
    });
  });

  return funcPath + dataOps.join('');
};

/**
 * Excavate modules
 * @param modules
 * @param excavation
 * @returns
 */
export const excavateModules = (modules: Modules, excavation: Excavation) =>
  modules.slice().map((row, y) => {
    if (y < excavation.y || y >= excavation.y + excavation.h) {
      return row;
    }
    return row.map((cell, x) => {
      if (x < excavation.x || x >= excavation.x + excavation.w) {
        return cell;
      }
      return false;
    });
  });

/**
 * Get image settings
 * @param cells The modules of the QR code
 * @param size The size of the QR code
 * @param margin
 * @param imageSettings
 * @returns
 */
export const getImageSettings = (
  cells: Modules,
  size: number,
  margin: number,
  imageSettings?: ImageSettings
): null | {
  x: number;
  y: number;
  h: number;
  w: number;
  excavation: Excavation | null;
  opacity: number;
  crossOrigin: CrossOrigin;
} => {
  if (imageSettings == null) {
    return null;
  }
  const numCells = cells.length + margin * 2;
  const defaultSize = Math.floor(size * DEFAULT_IMG_SCALE);
  const scale = numCells / size;
  const w = (imageSettings.width || defaultSize) * scale;
  const h = (imageSettings.height || defaultSize) * scale;
  const x = imageSettings.x == null ? cells.length / 2 - w / 2 : imageSettings.x * scale;
  const y = imageSettings.y == null ? cells.length / 2 - h / 2 : imageSettings.y * scale;
  const opacity = imageSettings.opacity == null ? 1 : imageSettings.opacity;

  let excavation = null;
  if (imageSettings.excavate) {
    const floorX = Math.floor(x);
    const floorY = Math.floor(y);
    const ceilW = Math.ceil(w + x - floorX);
    const ceilH = Math.ceil(h + y - floorY);
    excavation = { x: floorX, y: floorY, w: ceilW, h: ceilH };
  }

  const { crossOrigin } = imageSettings;

  return { x, y, h, w, excavation, opacity, crossOrigin };
};

/**
 * Get margin size
 * @param needMargin Whether need margin
 * @param marginSize Custom margin size
 * @returns
 */
export const getMarginSize = (needMargin: boolean, marginSize?: number) => {
  if (marginSize != null) {
    return Math.max(Math.floor(marginSize), 0);
  }
  return needMargin ? SPEC_MARGIN_SIZE : DEFAULT_MARGIN_SIZE;
};

/**
 * Check if Path2D is supported
 */
export const isSupportPath2d = (() => {
  try {
    new Path2D().addPath(new Path2D());
  } catch {
    return false;
  }
  return true;
})();
