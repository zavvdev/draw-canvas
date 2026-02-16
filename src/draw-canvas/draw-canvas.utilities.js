import Konva from "konva";
import {
  DRAW_AREA_MIN_POINT_DISTANCE_TO_RECORD,
  DRAW_AREA_PIN,
  DRAW_AREA_TEXT_COMMIT_Y_AXIS_OFFSET_COEFFICIENT,
  DRAW_AREA_TEXT_EDITOR_POS,
  DRAW_AREA_TEXT_FONT_FAMILY,
  DRAW_AREA_TOOLS,
  DRAW_AREA_SHAPE_METADATA_KEYS as SHAPE_META,
} from "./draw-canvas.config";
import { stringUtil } from "../utilities/string";

/**
 * @typedef {{
 *    x: number;
 *    y: number;
 * }} Point
 */

/**
 * @description
 * Determine if a new point should be added based on the minimum distance
 *
 * @param {Point} last
 * @param {Point} next
 */
export const shouldAddPoint = (last, next) => {
  if (!last) return true;
  const dx = next.x - last.x;
  const dy = next.y - last.y;
  return (
    dx * dx + dy * dy >= Math.pow(DRAW_AREA_MIN_POINT_DISTANCE_TO_RECORD, 2)
  );
};

// ======================
//
// #TextEditor
//
// ======================

export const getTextEditorPosition = ({ x, y, rectWidth, rectHeight }) => {
  const halfWidth = rectWidth / 2;
  const halfHeight = rectHeight / 2;
  if (y < halfHeight && x < halfWidth) return DRAW_AREA_TEXT_EDITOR_POS.topLeft;
  if (y < halfHeight && x >= halfWidth)
    return DRAW_AREA_TEXT_EDITOR_POS.topRight;
  if (y >= halfHeight && x < halfWidth)
    return DRAW_AREA_TEXT_EDITOR_POS.bottomLeft;
  return DRAW_AREA_TEXT_EDITOR_POS.bottomRight;
};

export const getTextEditorActionsStyles = (position) => {
  switch (position) {
    case DRAW_AREA_TEXT_EDITOR_POS.topLeft:
      return { bottom: -30, left: 0 };
    case DRAW_AREA_TEXT_EDITOR_POS.topRight:
      return { bottom: -30, left: 0 };
    case DRAW_AREA_TEXT_EDITOR_POS.bottomLeft:
      return { top: -30, left: 0 };
    case DRAW_AREA_TEXT_EDITOR_POS.bottomRight:
      return { top: -30, left: 0 };
    default:
      return {};
  }
};

export const getTextEditorTextareaWidth = (text, fontSize) => {
  const biggestRowLen = Math.max(
    ...text.split("\n").map((line) => [...line].length),
  );
  return (biggestRowLen + 3) * (fontSize / 2);
};

// ======================
//
// #ShapeFactories
//
// ======================

export const PenToolShape = {
  from: ({ x, y, color, strokeSize, customMetadata = null }) =>
    new Konva.Line({
      points: [x, y],
      stroke: color,
      strokeWidth: strokeSize,
      lineCap: "round",
      lineJoin: "round",

      // custom metadata
      [SHAPE_META.toolType]: DRAW_AREA_TOOLS.pen,
      [SHAPE_META.custom]: customMetadata,
    }),
  shouldCommit: (lineShape) => {
    const points = lineShape?.points() || [];
    return points.length > 2;
  },
};

export const LineToolShape = {
  from: ({ x, y, color, strokeSize, customMetadata = null }) =>
    new Konva.Line({
      points: [x, y, x, y],
      stroke: color,
      strokeWidth: strokeSize,
      lineCap: "round",

      // custom metadata
      [SHAPE_META.toolType]: DRAW_AREA_TOOLS.line,
      [SHAPE_META.custom]: customMetadata,
    }),

  shouldCommit: () => true,
};

export const ArrowToolShape = {
  from: ({ x, y, color, strokeSize, customMetadata = null }) =>
    new Konva.Arrow({
      points: [x, y, x, y],
      stroke: color,
      fill: color,
      strokeWidth: strokeSize,
      lineCap: "round",

      // custom metadata
      [SHAPE_META.toolType]: DRAW_AREA_TOOLS.arrow,
      [SHAPE_META.custom]: customMetadata,
    }),

  shouldCommit: () => true,
};

export const CircleToolShape = {
  from: ({ x, y, color, strokeSize, customMetadata = null }) =>
    new Konva.Ellipse({
      x,
      y,
      radiusX: 0,
      radiusY: 0,
      stroke: color,
      strokeWidth: strokeSize,
      fill: "transparent",

      // custom metadata
      [SHAPE_META.toolType]: DRAW_AREA_TOOLS.circle,
      [SHAPE_META.custom]: customMetadata,
    }),

  /**
   * @param {{
   *    startPoint: Point;
   *    currentPoint: Point;
   * }} param0
   */
  draw: ({ startPoint, currentPoint }) => {
    const cx = (startPoint.x + currentPoint.x) / 2;
    const cy = (startPoint.y + currentPoint.y) / 2;

    const rx = Math.abs(currentPoint.x - startPoint.x) / 2;
    const ry = Math.abs(currentPoint.y - startPoint.y) / 2;

    return {
      nextPoint: { x: cx, y: cy },
      radiusX: rx,
      radiusY: ry,
    };
  },

  shouldCommit: (ellipseShape) => {
    return ellipseShape.radiusX() > 0 && ellipseShape.radiusY() > 0;
  },
};

export const RectangleToolShape = {
  from: ({ x, y, color, strokeSize, customMetadata = null }) =>
    new Konva.Rect({
      x,
      y,
      width: 0,
      height: 0,
      stroke: color,
      strokeWidth: strokeSize,
      fill: "transparent",

      // custom metadata
      [SHAPE_META.toolType]: DRAW_AREA_TOOLS.rectangle,
      [SHAPE_META.custom]: customMetadata,
    }),

  /**
   * @param {{
   *    startPoint: Point;
   *    currentPoint: Point;
   * }} param0
   */
  draw: ({ startPoint, currentPoint }) => {
    const x0 = startPoint.x;
    const y0 = startPoint.y;

    const newX = Math.min(x0, currentPoint.x);
    const newY = Math.min(y0, currentPoint.y);

    const width = Math.abs(currentPoint.x - x0);
    const height = Math.abs(currentPoint.y - y0);

    return {
      nextPoint: {
        x: newX,
        y: newY,
      },
      width,
      height,
    };
  },

  shouldCommit: (rectShape) => {
    return rectShape.width() > 0 && rectShape.height() > 0;
  },
};

export const TextToolShape = {
  from: ({ x, y, fontSize, text, color, customMetadata = null }) =>
    new Konva.Text({
      x,
      y: y - fontSize / DRAW_AREA_TEXT_COMMIT_Y_AXIS_OFFSET_COEFFICIENT,
      text: text || "",
      fontSize,
      fontFamily: DRAW_AREA_TEXT_FONT_FAMILY,
      fill: color,

      // custom metadata
      [SHAPE_META.toolType]: DRAW_AREA_TOOLS.text,
      [SHAPE_META.custom]: customMetadata,
    }),

  shouldCommit: () => true,
};

export const PinToolShape = {
  from: ({ x, y, text, color, contrastColor, customMetadata = null }) => {
    const textLen = stringUtil.len(text);
    const textLenCoef = textLen > 1 ? textLen : 0;

    const scaleFactor =
      DRAW_AREA_PIN.text.scaleFactor +
      textLenCoef * DRAW_AREA_PIN.text.scaleCoefPerChar;

    const pinWidth = DRAW_AREA_PIN.pinShape.baseWidth * scaleFactor;
    const pinHeight = DRAW_AREA_PIN.pinShape.baseHeight * scaleFactor;

    const pinShape = new Konva.Path({
      strokeScaleEnabled: false,
      fill: DRAW_AREA_PIN.pinShape.fillColor,
      data: DRAW_AREA_PIN.pinShape.path,
      stroke: DRAW_AREA_PIN.pinShape.strokeColor,
      strokeWidth: DRAW_AREA_PIN.pinShape.strokeWidth,
    });

    pinShape.scale({ x: scaleFactor, y: scaleFactor });

    const textShape = new Konva.Text({
      align: "center",
      text,
      fontSize: DRAW_AREA_PIN.text.fontSize,
      fill: contrastColor,
      width: pinWidth,
      y:
        pinHeight * DRAW_AREA_PIN.text.yOffset +
        textLenCoef * DRAW_AREA_PIN.text.yOffsetCoefPerChar,
    });

    const topCircleShape = new Konva.Circle({
      x: pinWidth / 2,
      y: DRAW_AREA_PIN.topCircle.yOffset,
      radius: DRAW_AREA_PIN.topCircle.radius,
      fill: DRAW_AREA_PIN.topCircle.fillColor,
    });

    const centerCircleShape = new Konva.Circle({
      fill: color,
      x: pinWidth / 2,
      y: pinHeight * DRAW_AREA_PIN.centerCircle.yOffsetCoef,
      radius:
        pinWidth / 2 -
        DRAW_AREA_PIN.pinShape.strokeWidth +
        DRAW_AREA_PIN.centerCircle.radiusCoef,
    });

    const pinGroup = new Konva.Group({
      // custom metadata
      [SHAPE_META.toolType]: DRAW_AREA_TOOLS.pin,
      [SHAPE_META.custom]: customMetadata,
    });

    pinGroup.add(pinShape);
    pinGroup.add(topCircleShape);
    pinGroup.add(centerCircleShape);
    pinGroup.add(textShape);
    pinGroup.offset({
      x: pinWidth / 2,
      y: 0 + scaleFactor,
    });
    pinGroup.position({ x, y });

    return pinGroup;
  },

  shouldCommit: () => true,
};

export const shouldCommitHistorySnapshot = (shape, tool) => {
  return {
    [DRAW_AREA_TOOLS.pen]: PenToolShape.shouldCommit,
    [DRAW_AREA_TOOLS.line]: LineToolShape.shouldCommit,
    [DRAW_AREA_TOOLS.arrow]: ArrowToolShape.shouldCommit,
    [DRAW_AREA_TOOLS.circle]: CircleToolShape.shouldCommit,
    [DRAW_AREA_TOOLS.rectangle]: RectangleToolShape.shouldCommit,
    [DRAW_AREA_TOOLS.text]: TextToolShape.shouldCommit,
    [DRAW_AREA_TOOLS.pin]: PinToolShape.shouldCommit,
  }[tool](shape);
};
