import useImage from "use-image";
import {
  DRAW_AREA_CANVAS_DEFAULT_HEIGHT,
  DRAW_AREA_CANVAS_DEFAULT_WIDTH,
} from "../../config";

const getImageScale = (imgW, imgH, stageW, stageH, mode = "contain") => {
  const scaleX = stageW / imgW;
  const scaleY = stageH / imgH;

  const scale =
    mode === "cover" ? Math.max(scaleX, scaleY) : Math.min(scaleX, scaleY);

  const width = imgW * scale;
  const height = imgH * scale;

  return {
    width,
    height,
    x: (stageW - width) / 2,
    y: (stageH - height) / 2,
  };
};

/**
 * @description
 * Calculate the scale for the drawing area based on the background image
 * if provided, otherwise use the provided width and height or default values.
 */
export const useScale = ({ width, height, backgroundImageSrc, rootWidth }) => {
  const [image] = useImage(backgroundImageSrc || "", "anonymous");

  const ratio = image ? image.width / image.height : 1;
  const rootWidth_ = rootWidth ? rootWidth : DRAW_AREA_CANVAS_DEFAULT_WIDTH;
  const width_ = width || rootWidth_ || DRAW_AREA_CANVAS_DEFAULT_WIDTH;

  const height_ = image
    ? width_ / ratio
    : height || DRAW_AREA_CANVAS_DEFAULT_HEIGHT;

  const imageScale = image
    ? getImageScale(image.width, image.height, width_, height_)
    : null;

  return {
    scale: {
      width: width_,
      height: height_,
    },
    imageScale,
    image,
  };
};
