import { useRef, useState } from "react";
import cx from "clsx";
import { Palette, Cross } from "lucide-react";
import { useClickOutside } from "../../../utilities/hooks/use-click-outside";
import styles from "./color-select.module.css";
import { DEFAULT_COLORS, COLOR_SELECT_POS } from "./color-select.config";

/**
 * @param {Object} param0
 *
 * @param {string?} param0.value
 * @param {string[]?} param0.options
 * @param {string[]?} param0.additionOptions
 * @param {(nextOption: string) => void} param0.onChange
 * @param {boolean?} param0.closeOnSelect
 * @param {boolean?} param0.clearable
 * @param {string?} param0.testId
 * @param {string?} param0.className
 * @param {string?} param0.openerClassName
 * @param {string?} param0.position
 */
export var ColorSelect = ({
  value,
  options = DEFAULT_COLORS,
  additionOptions = [],
  onChange,
  closeOnSelect = true,
  isError,
  clearable = false,
  testId,
  className,
  openerClassName,
  position = COLOR_SELECT_POS.bottomLeft,
}) => {
  var { 0: isOpen, 1: setIsOpen } = useState(false);
  var rootRef = useRef(null);

  var handleChange = (nextValue) => {
    onChange(nextValue);
    if (closeOnSelect) setIsOpen(false);
  };

  var colorOptions = [...options, ...additionOptions];
  useClickOutside(rootRef, () => setIsOpen(false));

  return (
    <div ref={rootRef} className={cx(styles.root, className)}>
      <button
        data-testid={testId}
        className={cx(
          styles.pickerBtn,
          {
            [styles.error]: isError,
          },
          openerClassName,
        )}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {value ? (
          <span style={{ backgroundColor: value }} className={styles.value} />
        ) : (
          <Palette width="19px" />
        )}
      </button>
      {isOpen && (
        <ul
          className={cx(styles.list, {
            [styles.topLeft]: position === COLOR_SELECT_POS.topLeft,
            [styles.topRight]: position === COLOR_SELECT_POS.topRight,
            [styles.bottomLeft]: position === COLOR_SELECT_POS.bottomLeft,
            [styles.bottomRight]: position === COLOR_SELECT_POS.bottomRight,
          })}
        >
          {clearable && (
            <li>
              <button
                className={styles.clearBtn}
                onClick={() => handleChange(undefined)}
              >
                <Cross width="14px" />
              </button>
            </li>
          )}
          {colorOptions.length > 0
            ? colorOptions.map((color) => (
              <li key={color}>
                <button
                  style={{ backgroundColor: color }}
                  onClick={() => handleChange(color)}
                />
              </li>
            ))
            : "Empty"}
        </ul>
      )}
    </div>
  );
};
