import cx from "clsx";
import styles from "./menu-button.module.css";
import { MENU_BUTTON_COLORS } from "./menu-button.config";

export var MenuButton = ({
  title,
  onClick,
  isDisabled,
  isActive,
  children,
  color,
}) => {
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={isDisabled}
      className={cx(styles.root, {
        [styles.disabled]: isDisabled,
        [styles.active]: isActive,
        [styles.danger]: color === MENU_BUTTON_COLORS.danger,
      })}
    >
      {children}
    </button>
  );
};
