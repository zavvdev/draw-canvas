import cx from "clsx";
import styles from "./input.module.css";

export var Input = ({
  id,
  type,
  value,
  onChange,
  rightAdornment,
  isDisabled,
  autoFocus,
}) => {
  var rootClasses = cx(
    styles.root,
    {
      [styles.disabled]: isDisabled,
    },
    className,
  );

  return (
    <div className={rootClasses}>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className={styles.input}
        disabled={isDisabled}
        autoFocus={autoFocus}
      />
      {!!rightAdornment && (
        <div className={styles.rightAdornment}>{rightAdornment}</div>
      )}
    </div>
  );
};
