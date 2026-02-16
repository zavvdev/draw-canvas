import { Stage, Layer } from "react-konva";
import styles from "./styles.module.scss";
import { useScale } from "./hooks/useScale";
import { useRootWidth } from "./hooks/useRootWidth";
import { Image } from "./Image";
import { BackgroundColor } from "./BackgroundColor";
import { useDrawAreaContext } from "../context";
import { TextEditor } from "./TextEditor";

/**
 * @description
 * Canvas component to draw on.
 * Width and height are optional, if not provided, the canvas will take the size of the parent container
 * or the size of the background image if provided. If backgroundImageSrc is not provided as well as width
 * and height, the canvas will have a default size of 800x600.
 *
 * @param {{
 *  width?: number;
 *  height?: number;
 *  backgroundImageSrc?: string;
 *  backgroundColor?: string;
 * }} param0
 */
export const Canvas = ({
  width,
  height,
  backgroundImageSrc,
  backgroundColor,
}) => {
  const [rootRef, rootWidth] = useRootWidth();

  const { scale, image, imageScale } = useScale({
    width,
    height,
    backgroundImageSrc,
    rootWidth,
  });

  const { canvas, handlers, textEditor, get } = useDrawAreaContext();

  return (
    <div ref={rootRef} className={styles.root}>
      <Stage
        ref={canvas.stageRef}
        width={scale.width}
        height={scale.height}
        onMouseDown={handlers.handleMouseDown}
        onMouseMove={handlers.handleMouseMove}
        onMouseUp={handlers.handleMouseUp}
        onMouseLeave={handlers.handleMouseLeave}
        onTouchStart={handlers.handleMouseDown}
        onTouchMove={handlers.handleMouseMove}
        onTouchEnd={handlers.handleMouseUp}
      >
        {image ? (
          <Image image={image} imageScale={imageScale} />
        ) : (
          <BackgroundColor
            width={scale.width}
            height={scale.height}
            color={backgroundColor}
          />
        )}
        <Layer ref={canvas.drawLayerRef} />
      </Stage>
      {textEditor.coords && (
        <TextEditor
          top={textEditor.coords.y}
          left={textEditor.coords.x}
          color={get.color}
          fontSize={get.fontSize}
          onCancel={textEditor.discard}
          onConfirm={textEditor.commit}
        />
      )}
    </div>
  );
};
