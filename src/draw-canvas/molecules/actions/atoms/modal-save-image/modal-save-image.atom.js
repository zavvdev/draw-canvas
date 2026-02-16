import { Modal } from "../../../../../shared/Modal/Modal";
import { InputLabel } from "../../../../../shared/InputLabel/InputLabel";
import { useAppTranslation } from "../../../../../i18n/useAppTranslation";
import { Input } from "../../../../../shared/Input/Input";
import { Button } from "../../../../../shared/Button/Button";
import styles from "./styles.module.scss";
import { DRAW_AREA_DEFAULT_EXPORT_FILE } from "../../../config";

const INPUT_ID = "draw-area-save-image-filename-input";

export const SaveImageModal = ({ onClose, fileName, setFileName, onSave }) => {
  const { tCommon: t } = useAppTranslation.Common({
    keyPrefix: "drawArea.saveImageModal",
  });

  return (
    <Modal
      isOpen
      onClose={onClose}
      size="small"
      header={<Modal.Title>{t("title")}</Modal.Title>}
      footer={
        <div className={styles.footer}>
          <Button variant="outlined" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button onClick={onSave}>{t("save")}</Button>
        </div>
      }
    >
      <InputLabel htmlFor={INPUT_ID}>{t("fileNameLabel")}</InputLabel>
      <Input
        autoFocus
        id={INPUT_ID}
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
        rightAdornment={
          <span className={styles.ext}>
            {DRAW_AREA_DEFAULT_EXPORT_FILE.extension}
          </span>
        }
      />
    </Modal>
  );
}
