import { InputLabel } from "../../../shared/InputLabel/InputLabel";
import { useAppTranslation } from "../../../i18n/useAppTranslation";
import { useDrawAreaContext } from "../context";
import { DRAW_AREA_FONT_SIZE } from "../config";

export const FontSize = () => {
  const { tCommon: t } = useAppTranslation.Common({
    keyPrefix: "drawArea.settings",
  });

  const { get, set } = useDrawAreaContext();

  const onChange = (e) => {
    const value = parseInt(e.target.value);
    set.fontSize(value);
  };

  return (
    <div>
      <InputLabel>{t("fontSize", { value: get.fontSize })}</InputLabel>
      <input
        type="range"
        value={get.fontSize}
        onChange={onChange}
        min={DRAW_AREA_FONT_SIZE.min}
        max={DRAW_AREA_FONT_SIZE.max}
      />
    </div>
  );
};
