import { InputLabel } from "../../../shared/InputLabel/InputLabel";
import { useAppTranslation } from "../../../i18n/useAppTranslation";
import { useDrawAreaContext } from "../context";
import { Input } from "../../../shared/Input/Input";
import { DRAW_AREA_PIN_TEXT_MAX_LENGTH } from "../config";
import { stringUtil } from "../../../utilities/string";

export const PinText = () => {
  const { tCommon: t } = useAppTranslation.Common({
    keyPrefix: "drawArea.settings",
  });

  const { get, set } = useDrawAreaContext();

  const onChange = (e) => {
    const value = e.target.value;
    if (stringUtil.len(value) <= DRAW_AREA_PIN_TEXT_MAX_LENGTH) {
      set.pinText(e.target.value);
    }
  };

  return (
    <div>
      <InputLabel>{t("pinText")}</InputLabel>
      <Input size="small" value={get.pinText} onChange={onChange} />
    </div>
  );
};
