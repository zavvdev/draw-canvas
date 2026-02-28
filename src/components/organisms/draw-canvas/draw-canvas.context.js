import { useState, useContext, createContext, useRef, useEffect } from "react";
import { CircularHistory } from "circular-history";
import Konva from "konva";
import {
  DEFAULT_CONTRAST_COLOR_MAP,
  DRAW_AREA_COLORS,
  DRAW_AREA_DEFAULT_COLOR,
  DRAW_AREA_DEFAULT_CURRENT_DRAWING_SHAPE,
  DRAW_AREA_DEFAULT_EXPORT_FILE,
  DRAW_AREA_DEFAULT_IS_DRAWING,
  DRAW_AREA_DEFAULT_LAST_POINTER_POS,
  DRAW_AREA_DEFAULT_LAYER,
  DRAW_AREA_DEFAULT_SELECTED_SHAPE,
  DRAW_AREA_DEFAULT_STAGE,
  DRAW_AREA_DEFAULT_START_POINTER_POS,
  DRAW_AREA_DEFAULT_TEXT_EDITOR_COORDS,
  DRAW_AREA_DEFAULT_TOOL,
  DRAW_AREA_FONT_SIZE,
  DRAW_AREA_HISTORY_CAPACITY,
  DRAW_AREA_IGNORE_DRAWING_FOR_TOOLS,
  DRAW_AREA_PIN_DEFAULT_TEXT,
  DRAW_AREA_PREVENT_DRAW_FOR_SELECTED_TOOLS,
  DRAW_AREA_SAVE_IMAGE_SETTINGS,
  DRAW_AREA_SELECTED_SHAPE_OPACITY,
  DRAW_AREA_STROKE_SIZE,
  DRAW_AREA_TOOLS,
  DRAW_AREA_UNSELECTED_SHAPE_OPACITY,
} from "./draw-canvas.config";
import {
  ArrowToolShape,
  CircleToolShape,
  LineToolShape,
  PenToolShape,
  PinToolShape,
  RectangleToolShape,
  shouldAddPoint,
  shouldCommitHistorySnapshot,
  TextToolShape,
} from "./draw-canvas.utilities";
import { fileUtil } from "../utilities/file";

/**
 * @glossary
 *
 * Shape - The actual Konva shape instance that is drawn on the canvas.
 *
 * Tool - Drawing tool selected by the user. Like pen, line, circle etc.
 *
 * Stage - The Konva Stage instance that handles user events.
 *
 * Layer - The Konva Layer instance where shapes are drawn.
 */

/**
 * @description
 *
 * Context to manage the state of the Draw Area component.
 *
 * Things you should not do:
 *
 * - Storing shapes in React state. It will cause performance issues.
 * - Updating React state (or anything else that causes re-render) during drawing
 *   mousemove or other frequent UI updates.
 */
export const DrawAreaContext = createContext({
  get: {
    tool: DRAW_AREA_DEFAULT_TOOL,
    color: DRAW_AREA_DEFAULT_COLOR,
    colors: Object.values(DRAW_AREA_COLORS),
    contrastColorMap: DEFAULT_CONTRAST_COLOR_MAP,
    fontSize: DRAW_AREA_FONT_SIZE.default,
    strokeSize: DRAW_AREA_STROKE_SIZE.default,
    pinText: DRAW_AREA_PIN_DEFAULT_TEXT,
  },
  set: {
    tool: () => { },
    color: () => { },
    colors: () => { },
    contrastColor: () => { },
    fontSize: () => { },
    strokeSize: () => { },
    pinText: () => { },
  },
  act: {
    undo: () => { },
    redo: () => { },
    delActive: () => { },
    deleteAll: () => { },
    saveImage: () => { },
    getCurrentHistorySnapshot: () => { },
  },
  canvas: {
    stageRef: DRAW_AREA_DEFAULT_STAGE,
    drawLayerRef: DRAW_AREA_DEFAULT_LAYER,
  },
  handlers: {
    handleMouseDown: () => { },
    handleMouseMove: () => { },
    handleMouseUp: () => { },
    handleMouseLeave: () => { },
  },
  textEditor: {
    coords: DRAW_AREA_DEFAULT_TEXT_EDITOR_COORDS,
    discard: () => { },
    commit: () => { },
  },
});

export const useDrawAreaContext = () => {
  return useContext(DrawAreaContext);
};

export const useDrawAreaContextValue = ({
  fontSize: customFontSize,
  strokeSize: customStrokeSize,
  color: customColor,
  colors: customColors,
  contrastColorMap: customContrastColorMap,
  currentShapeCustomMetadata: customCurrentShapeMetadata,
  onHistoryCommit: customOnHistoryCommit,
} = {}) => {
  /**
   * @description
   * Reference to the Konva Stage which handles user events.
   * If you capture user event it's better to not use this ref directly
   * but use the event object to get the stage.
   */
  const stageRef = useRef(DRAW_AREA_DEFAULT_STAGE);

  /**
   * @description
   * Reference to the Konva Layer where Shapes are drawn.
   * For better peformance, Shapes are added/removed directly to/from this layer
   * instead of using React state to re-render the layer.
   */
  const drawLayerRef = useRef(DRAW_AREA_DEFAULT_LAYER);

  /**
   * @description
   * Reference to the currently active Shape during drawing.
   * Used for capturing shape at the very start of drawing and
   * updating it on every draw call.
   */
  const currentDrawingShapeRef = useRef(
    DRAW_AREA_DEFAULT_CURRENT_DRAWING_SHAPE,
  );

  /**
   * @description
   * Reference to the last pointer position during drawing.
   * Used to determine if a new point should be added.
   * Should be assigned with value at draw start and
   * updated on every draw call.
   */
  const lastPointerPositionRef = useRef(DRAW_AREA_DEFAULT_LAST_POINTER_POS);

  /**
   * @description
   * Reference to the pointer position at the start of the drawing.
   * Should be assigned with value only once at draw start.
   * It's useful for shapes like rectangle and circle that
   * need to know their origin point in order to calculate size.
   */
  const startPointerPositionRef = useRef(DRAW_AREA_DEFAULT_START_POINTER_POS);

  /**
   * @description
   * Reference to the currently selected Shape on the canvas that
   * has been selected with the drag tool.
   */
  const selectedShapeRef = useRef(DRAW_AREA_DEFAULT_SELECTED_SHAPE);

  /**
   * @description
   * Coordinates of the text editor when text tool is used and
   * the user clicks on the canvas to place the text.
   */
  const [textEditorCoords, setTextEditorCoords] = useState(
    DRAW_AREA_DEFAULT_TEXT_EDITOR_COORDS,
  );

  /**
   * @description
   * Flag to indicate if the user is currently drawing.
   */
  const isDrawing = useRef(DRAW_AREA_DEFAULT_IS_DRAWING);

  /**
   * @description
   * History of the canvas states. Represented as a circular history
   * with fixed capacity to prevent memory overuse. Each value is a
   * snapshot of the Konva Layer in JSON format.
   */
  const historyRef = useRef(
    new CircularHistory(DRAW_AREA_HISTORY_CAPACITY, "string"),
  );

  // ======================
  //
  // #Settings
  //
  // ======================

  /**
   * @description
   * Currently selected tool.
   */
  const [tool, setTool] = useState(DRAW_AREA_DEFAULT_TOOL);

  /**
   * @description
   * Available colors for drawing Shapes and text. Stored in ref since it's static
   */
  const colorsRef = useRef(customColors || Object.values(DRAW_AREA_COLORS));

  /**
   * @description
   * Color used for drawing Shapes and text.
   */
  const [color, setColor] = useState(customColor || DRAW_AREA_DEFAULT_COLOR);

  /**
   * @description
   * Map of contrast colors for each color in the palette.
   * Used for text color on pins and text shapes to ensure readability.
   */
  const contrastColorMapRef = useRef(
    customContrastColorMap || DEFAULT_CONTRAST_COLOR_MAP,
  );

  /**
   * @description
   * Font size used for text tool.
   */
  const [fontSize, setFontSize] = useState(
    customFontSize,
    DRAW_AREA_FONT_SIZE.default,
  );

  /**
   * @description
   * Stroke size used for drawing Shapes.
   */
  const [strokeSize, setStrokeSize] = useState(
    customStrokeSize || DRAW_AREA_STROKE_SIZE.default,
  );

  /**
   * @description
   * Default text for the pin tool that will be placed on the canvas.
   */
  const [pinText, setPinText] = useState(DRAW_AREA_PIN_DEFAULT_TEXT);

  // ======================
  //
  // #Selection
  //
  // ======================

  const deselectShape = ({ redraw } = { redraw: true }) => {
    if (!selectedShapeRef.current) return;
    selectedShapeRef.current.opacity(DRAW_AREA_UNSELECTED_SHAPE_OPACITY);
    selectedShapeRef.current = DRAW_AREA_DEFAULT_SELECTED_SHAPE;
    if (redraw) {
      drawLayerRef.current.batchDraw();
    }
  };

  const selectShape = (shape) => {
    if (selectedShapeRef.current === shape) return;
    deselectShape();
    selectedShapeRef.current = shape;
    shape.opacity(DRAW_AREA_SELECTED_SHAPE_OPACITY);
    drawLayerRef.current.batchDraw();
  };

  // ======================
  //
  // #History
  //
  // ======================

  /**
   * @description
   * Save the current state of the canvas to historyRef.
   * Should be called after every completed action:
   * - drawing end
   * - shape drag end
   * - shape deletion
   * - text shape commit
   * - add pin
   */
  const commitHistorySnapshot = (checkShouldCommit = false) => {
    if (
      checkShouldCommit &&
      !shouldCommitHistorySnapshot(currentDrawingShapeRef.current, tool)
    )
      return;

    const layer = drawLayerRef.current;
    if (!layer) return;

    const snapshot = layer.toJSON();
    if (!snapshot) return;

    historyRef.current.commit(snapshot);
    customOnHistoryCommit?.(snapshot);
  };

  const bindShapeAndReturnBack = (shape) => {
    shape.on("mousedown", (e) => {
      e.cancelBubble = true;
      selectShape(shape);
    });

    shape.on("dragend", () => {
      requestAnimationFrame(() => {
        commitHistorySnapshot();
        deselectShape();
      });
    });

    return shape;
  };

  /**
   * @description
   * Restore the canvas state from a given snapshot.
   * Keep in mind that this will remove all current shapes
   * on the canvas and replace them with the ones from the snapshot.
   * JSON representation does not keep event bindings, so we need to
   * rebind them after restoring.
   */
  const restoreHistorySnapshot = (snapshot) => {
    if (!snapshot) return;
    deselectShape({ redraw: false });

    if (snapshot === CircularHistory.FLAGS.empty) {
      drawLayerRef.current.destroyChildren();
      drawLayerRef.current.batchDraw();
      return;
    }

    const stage = stageRef.current;
    drawLayerRef.current.destroy();

    const restoredLayer = Konva.Node.create(snapshot, stage);
    restoredLayer.getChildren().forEach((shape) => {
      bindShapeAndReturnBack(shape);
      shape.draggable(tool === DRAW_AREA_TOOLS.drag);
    });

    stage.add(restoredLayer);
    drawLayerRef.current = restoredLayer;

    restoredLayer.batchDraw();
  };

  const undo = () => {
    historyRef.current.moveBackward();
    restoreHistorySnapshot(historyRef.current.current());
  };

  const redo = () => {
    historyRef.current.moveForward();
    restoreHistorySnapshot(historyRef.current.current());
  };

  const getCurrentHistorySnapshot = () => {
    return historyRef.current.current();
  };

  const dumpHistory = () => {
    return historyRef.current.dump(true);
  };

  // ======================
  //
  // #ShapeUtils
  //
  // ======================

  /**
   * @description
   * Instantiate a Shape based on the current tool and pointer position.
   * Throw an error if the tool is not implemented.
   *
   * @param {string} currentTool
   * @param {{
   *    x: number;
   *    y: number;
   * }} pointerPosition
   */
  const instantiateShape = (currentTool, pointerPosition, metadata = {}) => {
    const x = pointerPosition.x;
    const y = pointerPosition.y;

    let shape = null;

    switch (currentTool) {
      case DRAW_AREA_TOOLS.pen:
        shape = PenToolShape.from({
          x,
          y,
          color,
          strokeSize,
          customMetadata: customCurrentShapeMetadata,
        });
        break;
      case DRAW_AREA_TOOLS.line:
        shape = LineToolShape.from({
          x,
          y,
          color,
          strokeSize,
          customMetadata: customCurrentShapeMetadata,
        });
        break;
      case DRAW_AREA_TOOLS.arrow:
        shape = ArrowToolShape.from({
          x,
          y,
          color,
          strokeSize,
          customMetadata: customCurrentShapeMetadata,
        });
        break;
      case DRAW_AREA_TOOLS.circle:
        shape = CircleToolShape.from({
          x,
          y,
          color,
          strokeSize,
          customMetadata: customCurrentShapeMetadata,
        });
        break;
      case DRAW_AREA_TOOLS.rectangle:
        shape = RectangleToolShape.from({
          x,
          y,
          color,
          strokeSize,
          customMetadata: customCurrentShapeMetadata,
        });
        break;
      case DRAW_AREA_TOOLS.text:
        shape = TextToolShape.from({
          x,
          y,
          fontSize,
          text: metadata?.textTool?.textToCommit,
          color,
          customMetadata: customCurrentShapeMetadata,
        });
        break;
      case DRAW_AREA_TOOLS.pin:
        shape = PinToolShape.from({
          x,
          y,
          text: pinText,
          color,
          contrastColor: contrastColorMapRef.current[color],
          customMetadata: customCurrentShapeMetadata,
        });
        break;
      default:
        throw new Error(`Tool ${currentTool} is not implemented yet.`);
    }

    return bindShapeAndReturnBack(shape);
  };

  // ======================
  //
  // #Draw
  //
  // ======================

  /**
   * @description
   * Do not start drawing if no tool is selected.
   * Capture last pointer position.
   *
   * @param {{
   *    x: number;
   *    y: number;
   * }} pointerPosition
   */
  const drawStart = (pointerPosition) => {
    if (!tool || DRAW_AREA_PREVENT_DRAW_FOR_SELECTED_TOOLS.includes(tool))
      return;

    isDrawing.current = true;

    const shape = instantiateShape(tool, pointerPosition);

    currentDrawingShapeRef.current = shape;
    startPointerPositionRef.current = pointerPosition;
    lastPointerPositionRef.current = pointerPosition;

    drawLayerRef.current.add(shape);
    drawLayerRef.current.batchDraw();
  };

  /**
   * @description
   * Add points to the active Shape based on the current tool.
   * Do nothing if not drawing or if the pointer hasn't moved enough.
   * Capture last pointer position.
   *
   * @param {{
   *    x: number;
   *    y: number;
   * }} pointerPosition
   */
  const draw = (pointerPosition) => {
    if (
      !isDrawing.current ||
      !shouldAddPoint(lastPointerPositionRef.current, pointerPosition)
    )
      return;

    const x = pointerPosition.x;
    const y = pointerPosition.y;

    const activeShape = currentDrawingShapeRef.current;

    if (!activeShape)
      throw new Error("Active shape is not defined during drawing.");

    switch (tool) {
      case DRAW_AREA_TOOLS.pen: {
        activeShape.points(activeShape.points().concat([x, y]));
        break;
      }
      case DRAW_AREA_TOOLS.line: {
        const points = activeShape.points();
        activeShape.points([points[0], points[1], x, y]);
        break;
      }
      case DRAW_AREA_TOOLS.arrow: {
        const points = activeShape.points();
        activeShape.points([points[0], points[1], x, y]);
        break;
      }
      case DRAW_AREA_TOOLS.circle: {
        const { nextPoint, radiusX, radiusY } = CircleToolShape.draw({
          startPoint: startPointerPositionRef.current,
          currentPoint: pointerPosition,
        });
        activeShape.position(nextPoint);
        activeShape.radiusX(radiusX);
        activeShape.radiusY(radiusY);

        break;
      }
      case DRAW_AREA_TOOLS.rectangle: {
        const { nextPoint, width, height } = RectangleToolShape.draw({
          startPoint: startPointerPositionRef.current,
          currentPoint: pointerPosition,
        });

        activeShape.position(nextPoint);
        activeShape.size({ width, height });

        break;
      }
      default:
        break;
    }

    drawLayerRef.current.batchDraw();
    lastPointerPositionRef.current = pointerPosition;
  };

  const drawEnd = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    commitHistorySnapshot(true);
  };

  // ======================
  //
  // #Text
  //
  // ======================

  /**
   * @description
   * Capture the pointer position to show the text editor.
   */
  const instantiateTextEditor = (pointerPosition) => {
    setTextEditorCoords({
      x: pointerPosition.x,
      y: pointerPosition.y,
    });
  };

  const cancelText = () => {
    setTextEditorCoords(DRAW_AREA_DEFAULT_TEXT_EDITOR_COORDS);
  };

  /**
   * @description
   * Commit the text from the text editor to the canvas as a new Shape.
   */
  const commitText = (text) => {
    if (!text || text.trim() === "") {
      cancelText();
      return;
    }

    const shape = instantiateShape(tool, textEditorCoords, {
      textTool: { textToCommit: text },
    });

    drawLayerRef.current.add(shape);
    drawLayerRef.current.batchDraw();

    cancelText();
    commitHistorySnapshot();
  };

  // ======================
  //
  // #Pin
  //
  // ======================

  /**
   * @param {{
   *    x: number;
   *    y: number;
   * }} pointerPosition
   */
  const drawPin = (pointerPosition) => {
    const shape = instantiateShape(tool, pointerPosition);
    drawLayerRef.current.add(shape);
    drawLayerRef.current.batchDraw();
    commitHistorySnapshot();
  };

  // ======================
  //
  // #EventHandlers
  //
  // ======================

  const handleMouseDown = (event) => {
    const stage = event.target.getStage();

    // Click on empty canvas
    if (event.target === stage && tool === DRAW_AREA_TOOLS.drag) {
      deselectShape();
      return;
    }

    // Never draw on Shape click
    if (event.target !== stage) return;

    const pointerPosition = event.target.getStage().getPointerPosition();

    if (tool === DRAW_AREA_TOOLS.text) {
      instantiateTextEditor(pointerPosition);
      return;
    }

    if (tool === DRAW_AREA_TOOLS.pin) {
      drawPin(pointerPosition);
      return;
    }

    if (!DRAW_AREA_IGNORE_DRAWING_FOR_TOOLS.includes(tool)) {
      drawStart(pointerPosition);
    }
  };

  const handleMouseMove = (event) => {
    const stage = event.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    draw(pointerPosition);
  };

  const handleMouseUp = () => {
    drawEnd();
  };

  const handleMouseLeave = () => {
    drawEnd();
  };

  // ======================
  //
  // #Delete
  //
  // ======================

  const deleteAll = () => {
    deselectShape();
    drawLayerRef.current.destroyChildren();
    drawLayerRef.current.batchDraw();
    commitHistorySnapshot();
  };

  const delActive = () => {
    if (!selectedShapeRef.current) {
      alert("No shape selected to delete.");
      return;
    }
    selectedShapeRef.current.remove();
    drawLayerRef.current.batchDraw();
    selectedShapeRef.current = DRAW_AREA_DEFAULT_SELECTED_SHAPE;
    commitHistorySnapshot();
  };

  // ======================
  //
  // #SaveImage
  //
  // ======================

  const saveImage = (fileName = DRAW_AREA_DEFAULT_EXPORT_FILE.name) => {
    if (!stageRef) throw new Error("Stage reference is not available.");
    const uri = stageRef.current.toDataURL(DRAW_AREA_SAVE_IMAGE_SETTINGS);
    if (!uri) throw new Error("Failed to generate image data URL.");
    fileUtil.download(uri, fileName + DRAW_AREA_DEFAULT_EXPORT_FILE.extension);
  };

  // ======================
  //
  // #Setters
  //
  // ======================

  const toolSetter = (newTool) => {
    setTool(newTool);
    deselectShape();
  };

  const colorsSetter = (newColors) => {
    colorsRef.current = newColors;
  };

  const contrastColorMapSetter = (newContrastColorMap) => {
    contrastColorMapRef.current = newContrastColorMap;
  };

  // ======================
  //
  // #SideEffects
  //
  // ======================

  useEffect(() => {
    const layer = drawLayerRef.current;
    if (!layer) return;
    layer.children.forEach((node) => {
      if (!node.draggable) return;
      node.draggable(tool === DRAW_AREA_TOOLS.drag);
    });

    layer.batchDraw();
  }, [tool]);

  useEffect(() => {
    if (!stageRef.current) return;
    stageRef.current.container().style.cursor =
      tool === DRAW_AREA_TOOLS.drag ? "grab" : "crosshair";
  }, [tool]);

  // ======================
  //
  // #ReturnValues
  //
  // ======================

  return {
    get: {
      tool,
      color,
      colors: colorsRef.current,
      contrastColorMap: contrastColorMapRef.current,
      fontSize,
      strokeSize,
      pinText,
    },
    set: {
      tool: toolSetter,
      color: setColor,
      colors: colorsSetter,
      contrastColorMap: contrastColorMapSetter,
      fontSize: setFontSize,
      strokeSize: setStrokeSize,
      pinText: setPinText,
    },
    act: {
      undo,
      redo,
      delActive,
      deleteAll,
      saveImage,
      getCurrentHistorySnapshot,
      dumpHistory,
    },
    canvas: {
      stageRef,
      drawLayerRef,
    },
    handlers: {
      handleMouseDown,
      handleMouseMove,
      handleMouseUp,
      handleMouseLeave,
    },
    textEditor: {
      coords: textEditorCoords,
      discard: cancelText,
      commit: commitText,
    },
  };
};
