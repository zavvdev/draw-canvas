import { Layer, Rect } from "react-konva";
import { DRAW_AREA_CANVAS_DEFAULT_BACKGROUND_COLOR } from "../../config";

export const BackgroundColor = ({ width, height, color }) => {
  return (
    <Layer listening={false}>
      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={color || DRAW_AREA_CANVAS_DEFAULT_BACKGROUND_COLOR}
      />
    </Layer>
  );
};
