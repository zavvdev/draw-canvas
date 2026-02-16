import { InputLabel } from "../../../shared/InputLabel/InputLabel";
import { useAppTranslation } from "../../../i18n/useAppTranslation";
import { useDrawAreaContext } from "../context";
import { DRAW_AREA_STROKE_SIZE } from "../config";

export const StrokeSize = () => {
  const { tCommon: t } = useAppTranslation.Common({
    keyPrefix: "drawArea.settings",
  });

  const { get, set } = useDrawAreaContext();

  const onChange = (e) => {
    const value = parseInt(e.target.value);
    set.strokeSize(value);
  };

  return (
    <div>
      <InputLabel>{t("strokeSize", { value: get.strokeSize })}</InputLabel>
      <input
        type="range"
        value={get.strokeSize}
        onChange={onChange}
        min={DRAW_AREA_STROKE_SIZE.min}
        max={DRAW_AREA_STROKE_SIZE.max}
      />
    </div>
  );
};
