import { Modal } from "../../../../atoms/modal/modal.atom";
import { InputLabel } from "../../../../atoms/input-label/input-label.atom";
import { Button } from "../../../../atoms/button/button.atom";
import { Input } from "../../../../atoms/input/input.atom";
import styles from "./styles.module.scss";

var INPUT_ID = "draw-area-save-image-filename-input";

export var SaveImageModal = ({
  onClose,
  fileName,
  setFileName,
  onSave,
  extension,
}) => {
  return (
    <Modal
      isOpen
      onClose={onClose}
      header={<Modal.Title>Save Image</Modal.Title>}
      footer={
        <div className={styles.footer}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save</Button>
        </div>
      }
    >
      <InputLabel htmlFor={INPUT_ID}>File Name</InputLabel>
      <Input
        autoFocus
        id={INPUT_ID}
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
        rightAdornment={<span className={styles.ext}>{extension}</span>}
      />
    </Modal>
  );
};
