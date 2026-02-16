import { COLOR_SELECT_POS } from "../../shared/ColorSelect/ColorSelect";
import { CONTEXT_DROPDOWN_POS } from "../../shared/ContextDropdown";

export const DRAW_AREA_TOOLS = {
  pen: "pen",
  line: "line",
  arrow: "arrow",
  circle: "circle",
  rectangle: "rectangle",
  text: "text",
  drag: "drag",
  pin: "pin",
};

export const DRAW_AREA_ACTIONS = {
  undo: "undo",
  redo: "redo",
  delActive: "delActive",
  saveImage: "saveImage",
  deleteAll: "deleteAll",
};

export const DRAW_AREA_COLORS = {
  white: "#FFFFFF",
  black: "#000000",
  red: "#FF0000",
  orange: "#FFA500",
  yellow: "#FFFF00",
  green: "#00FF00",
  blue: "#0000FF",
  purple: "#F100F1",
};

export const DEFAULT_CONTRAST_COLOR_MAP = {
  [DRAW_AREA_COLORS.white]: DRAW_AREA_COLORS.black,
  [DRAW_AREA_COLORS.black]: DRAW_AREA_COLORS.white,
  [DRAW_AREA_COLORS.purple]: DRAW_AREA_COLORS.white,
  [DRAW_AREA_COLORS.red]: DRAW_AREA_COLORS.white,
  [DRAW_AREA_COLORS.orange]: DRAW_AREA_COLORS.black,
  [DRAW_AREA_COLORS.yellow]: DRAW_AREA_COLORS.black,
  [DRAW_AREA_COLORS.green]: DRAW_AREA_COLORS.black,
  [DRAW_AREA_COLORS.blue]: DRAW_AREA_COLORS.white,
};

export const DRAW_AREA_DEFAULT_TOOL = undefined;

export const DRAW_AREA_DEFAULT_COLOR = DRAW_AREA_COLORS.purple;

export const DRAW_AREA_CANVAS_DEFAULT_WIDTH = 800;

export const DRAW_AREA_CANVAS_DEFAULT_HEIGHT = 600;

export const DRAW_AREA_CANVAS_DEFAULT_BACKGROUND_COLOR = "white";

export const DRAW_AREA_FONT_SIZE = {
  min: 8,
  max: 48,
  default: 16,
};

export const DRAW_AREA_STROKE_SIZE = {
  min: 1,
  max: 16,
  default: 10,
};

export const DRAW_AREA_DEFAULT_EXPORT_FILE = {
  name: "drawing",
  extension: ".jpg",
};

/**
 * @description
 * Minimum distance in pixels between points
 * to be recorded while drawing. Lower value
 * will result in more points and smoother lines,
 * but also higher memory usage.
 */
export const DRAW_AREA_MIN_POINT_DISTANCE_TO_RECORD = 10;

/**
 * @description
 * Default text in the text editor after being placed
 */
export const DRAW_AREA_TEXT_EDITOR_DEFAULT_TEXT = "Text";

/**
 * @description
 * Possible positions for the text editor after being placed
 */
export const DRAW_AREA_TEXT_EDITOR_POS = {
  topLeft: "top-left",
  topRight: "top-right",
  bottomLeft: "bottom-left",
  bottomRight: "bottom-right",
};

/**
 * @description
 * Coefficient to calculate Y axis offset
 * for text commit button position in order to compensate
 * textarea veritical padding.
 */
export const DRAW_AREA_TEXT_COMMIT_Y_AXIS_OFFSET_COEFFICIENT = 2.5;

export const DRAW_AREA_TEXT_FONT_FAMILY = "Arial";

export const DRAW_AREA_PREVENT_DRAW_FOR_SELECTED_TOOLS = [
  DRAW_AREA_TOOLS.drag,
  DRAW_AREA_TOOLS.text,
];

export const DRAW_AREA_IGNORE_DRAWING_FOR_TOOLS = [
  DRAW_AREA_TOOLS.drag,
  DRAW_AREA_TOOLS.text,
];

export const DRAW_AREA_DEFAULT_STAGE = null;

export const DRAW_AREA_DEFAULT_LAYER = null;

export const DRAW_AREA_DEFAULT_CURRENT_DRAWING_SHAPE = null;

/**
 * { x: number; y: number; } | null
 */
export const DRAW_AREA_DEFAULT_LAST_POINTER_POS = null;

/**
 * { x: number; y: number; } | null
 */
export const DRAW_AREA_DEFAULT_START_POINTER_POS = null;

export const DRAW_AREA_DEFAULT_SELECTED_SHAPE = null;

/**
 * { x: number; y: number; } | null
 */
export const DRAW_AREA_DEFAULT_TEXT_EDITOR_COORDS = null;

export const DRAW_AREA_DEFAULT_IS_DRAWING = false;

export const DRAW_AREA_SELECTED_SHAPE_OPACITY = 0.8;

export const DRAW_AREA_UNSELECTED_SHAPE_OPACITY = 1.0;

export const DRAW_AREA_SAVE_IMAGE_SETTINGS = {
  mimeType: "image/jpeg",
  quality: 0.9,
  pixelRatio: 2,
};

export const DRAW_AREA_HISTORY_CAPACITY = 50;

export const DRAW_AREA_PIN = {
  pinShape: {
    fillColor: "white",
    path: `M8.26172 13.0381C11.5252 13.6323 13.9998 16.4879 14 19.9229C14 23.7889 10.866 26.9238 7 26.9238C3.13401 26.9238 0 23.7889 0 19.9229C0.000219093 16.4667 2.50542 13.597 5.79883 13.0273L7.03027 0L8.26172 13.0381Z`,
    strokeColor: "#CDCDCE",
    strokeWidth: 1.5,
    baseWidth: 14,
    baseHeight: 26.92,
  },
  text: {
    yOffset: 0.58,
    scaleFactor: 1.6,
    fontSize: 16,
    scaleCoefPerChar: 0.5,
    yOffsetCoefPerChar: 2.1,
  },
  topCircle: {
    radius: 3,
    fillColor: "#007AFF",
    yOffset: 2,
  },
  centerCircle: {
    yOffsetCoef: 0.74,
    radiusCoef: 0.5,
  },
};

export const DRAW_AREA_PIN_DEFAULT_TEXT = "";

export const DRAW_AREA_PIN_TEXT_MAX_LENGTH = 4;

export const DRAW_AREA_SHAPE_METADATA_KEYS = {
  toolType: "_toolType",
  custom: "_custom",
};

export const DRAW_AREA_SETTINGS_DROPDOWN_POS = CONTEXT_DROPDOWN_POS;

export const DRAW_AREA_COLOR_PICKER_DROPDOWN_POS = COLOR_SELECT_POS;
