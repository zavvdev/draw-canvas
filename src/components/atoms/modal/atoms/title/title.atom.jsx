import cx from "clsx";
import styles from "./title.module.css";

export var Title = ({ children, className, leftAdornment }) => {
  return (
    <h3 className={cx(styles.root, className)}>
      {leftAdornment}
      {children}
    </h3>
  );
};
