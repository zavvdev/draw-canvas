import { Layer, Image as KonvaImage } from "react-konva";

export const Image = ({ image, imageScale }) => {
  return (
    <Layer listening={false}>
      <KonvaImage
        image={image}
        x={imageScale.x}
        y={imageScale.y}
        width={imageScale.width}
        height={imageScale.height}
        listening={false}
      />
    </Layer>
  );
};
