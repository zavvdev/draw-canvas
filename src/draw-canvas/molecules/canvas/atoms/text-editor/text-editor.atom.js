import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";
import { Textarea } from "../../../../shared/Textarea/Textarea";
import { Button } from "../../../../shared/Button/Button";
import { CrossIcon } from "../../../../assets/Icons/CrossIcon";
import { CheckIcon } from "../../../../assets/Icons/CheckIcon";
import { DRAW_AREA_TEXT_EDITOR_DEFAULT_TEXT } from "../../config";
import {
  getTextEditorActionsStyles,
  getTextEditorPosition,
  getTextEditorTextareaWidth,
} from "../../utilities";

/**
 * @param {{
 *    top: number;
 *    left: number;
 *    color: string;
 *    fontSize: number;
 *    onCancel: () => void;
 *    onConfirm: (text: string) => void;
 * }} param0
 */
export const TextEditor = ({
  top,
  left,
  color,
  fontSize,
  onCancel,
  onConfirm,
}) => {
  const rootRef = useRef(null);

  const [value, setValue] = useState(DRAW_AREA_TEXT_EDITOR_DEFAULT_TEXT);
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const rect = rootRef.current.getBoundingClientRect();
    setPosition(
      getTextEditorPosition({
        x: left,
        y: top,
        rectWidth: rect.width,
        rectHeight: rect.height,
      }),
    );
  }, []);

  return (
    <div ref={rootRef} className={styles.root}>
      <div
        className={styles.editor}
        style={{
          top: top - fontSize / 2,
          left,
        }}
      >
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={styles.textarea}
          style={{
            color,
            fontSize,
            borderColor: color,
            minHeight: fontSize * 2,
            width: getTextEditorTextareaWidth(value, fontSize),
            lineHeight: `${fontSize * 1.1}px`,
          }}
        />
        <div
          className={styles.actions}
          style={getTextEditorActionsStyles(position)}
        >
          <Button size="tiny" color="error" onClick={onCancel}>
            <CrossIcon />
          </Button>
          <Button size="tiny" color="success" onClick={() => onConfirm(value)}>
            <CheckIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};
