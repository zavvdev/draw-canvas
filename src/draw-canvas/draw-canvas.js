import { forwardRef, useImperativeHandle } from "react";
import cx from "clsx";
import { DrawAreaContext, useDrawAreaContextValue } from "./context";
import { Canvas } from "./Canvas";
import styles from "./draw-canvas.module.css";
import { Box } from "./Box";
import { ColorPicker } from "./ColorPicker";
import { Tools } from "./Tools";
import { Actions } from "./Actions";
import { Settings } from "./Settings";
import { FontSize } from "./FontSize";
import { StrokeSize } from "./StrokeSize";
import { PinText } from "./PinText";

const DrawArea = forwardRef(
  (
    {
      children,
      className,
      fontSize,
      strokeSize,
      color,
      colors,
      contrastColorMap,
      currentShapeCustomMetadata,
      onHistoryCommit,
    },
    ref,
  ) => {
    const ctx = useDrawAreaContextValue({
      fontSize,
      colors,
      strokeSize,
      color,
      contrastColorMap,
      currentShapeCustomMetadata,
      onHistoryCommit,
    });

    /**
     * @description
     *
     * Expose imperative methods to parent components
     * for direct manipulation of the draw area if needed.
     *
     * Things you should never expose:
     *
     * 1. ctx.canvas - it contains references to Konva
     * objects that would allow to directly manipulate
     * the canvas, which can lead to corruption of the state.
     *
     * 2. ctx.handlers - event handlers that are supposed
     * to be used by Konva stage only.
     */
    useImperativeHandle(
      ref,
      () => ({
        get: ctx.get,
        set: ctx.set,
        act: ctx.act,
        textEditor: ctx.textEditor,
      }),
      [ctx],
    );

    return (
      <DrawAreaContext.Provider value={ctx}>
        <div className={cx(styles.root, className)}>{children}</div>
      </DrawAreaContext.Provider>
    );
  },
);

DrawArea.Box = Box;
DrawArea.Canvas = Canvas;
DrawArea.ColorPicker = ColorPicker;
DrawArea.Tools = Tools;
DrawArea.Actions = Actions;
DrawArea.Settings = Settings;
DrawArea.FontSize = FontSize;
DrawArea.StrokeSize = StrokeSize;
DrawArea.PinText = PinText;

export { DrawArea };
