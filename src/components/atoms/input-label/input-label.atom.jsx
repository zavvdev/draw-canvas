import styles from "./input-label.module.css";

export var InputLabel = ({ children, htmlFor }) => {
  return (
    <label className={styles.root} htmlFor={htmlFor}>
      {children}
    </label>
  );
};
