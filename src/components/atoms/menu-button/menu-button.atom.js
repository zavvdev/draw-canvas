import cx from "clsx";
import styles from "./menu-button.module.css";

export const MENU_BUTTON_COLORS = {
  danger: "danger",
};

export const MenuButton = ({
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
