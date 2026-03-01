import cx from "clsx";
import styles from "./button.module.css";

export var Button = ({
  onClick,
  children,
  variant = "contained",
  size = "default",
  color = "primary",
  className,
  isDisabled,
  ...rest
}) => {
  var rootClasses = cx(
    styles.root,
    {
      [styles.vOutlined]: variant === "outlined",
      [styles.vContained]: variant === "contained",
      [styles.sTiny]: size === "tiny",
      [styles.sDefault]: size === "default",
      [styles.cPrimary]: color === "primary",
      [styles.cError]: color === "error",
      [styles.cSuccess]: color === "success",
      [styles.disabled]: isDisabled,
    },
    className,
  );

  return (
    <button {...rest} ref={ref} onClick={onClick} className={rootClasses}>
      <div className={styles.content}>{children}</div>
    </button>
  );
};
