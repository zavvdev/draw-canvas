import { useRef, useState } from "react";
import cx from "clsx";
import classes from "./color-select.module.css";
import { useClickOutside } from "../../../utilities/hooks/use-click-outside";
import { DEFAULT_COLORS } from "./color-select.config";
import { Palette } from "lucide-react";
import { Cross } from "lucide-react";

export var COLOR_SELECT_POS = {
  topLeft: "top-left",
  topRight: "top-right",
  bottomLeft: "bottom-left",
  bottomRight: "bottom-right",
};

/**
 * @param {Object} param0
 *
 * @param {string?} param0.value
 * @param {string[]?} param0.options
 * @param {string[]?} param0.additionOptions
 * @param {(nextOption: string) => void} param0.onChange
 * @param {"small"} param0.size
 * @param {boolean?} param0.closeOnSelect
 * @param {boolean?} param0.clearable
 * @param {string?} param0.testId
 * @param {string?} param0.className
 * @param {string?} param0.openerClassName
 * @param {string?} param0.position
 */
export const ColorSelect = ({
  value,
  options = DEFAULT_COLORS,
  additionOptions = [],
  onChange,
  size,
  closeOnSelect = true,
  isError,
  clearable = false,
  testId,
  className,
  openerClassName,
  position = COLOR_SELECT_POS.bottomLeft,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);

  const handleChange = (nextValue) => {
    onChange(nextValue);

    if (closeOnSelect) {
      setIsOpen(false);
    }
  };

  const colorOptions = [...options, ...additionOptions];

  useClickOutside(rootRef, () => setIsOpen(false));

  return (
    <div ref={rootRef} className={cx(classes.root, className)}>
      <button
        data-testid={testId}
        className={cx(
          classes.pickerBtn,
          {
            [classes.small]: size === "small",
            [classes.error]: isError,
          },
          openerClassName,
        )}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {value ? (
          <span style={{ backgroundColor: value }} className={classes.value} />
        ) : (
          <Palette width={size === "small" ? "19px" : "21px"} />
        )}
      </button>
      {isOpen && (
        <ul
          className={cx(classes.list, {
            [classes.small]: size === "small",
            [classes.topLeft]: position === COLOR_SELECT_POS.topLeft,
            [classes.topRight]: position === COLOR_SELECT_POS.topRight,
            [classes.bottomLeft]: position === COLOR_SELECT_POS.bottomLeft,
            [classes.bottomRight]: position === COLOR_SELECT_POS.bottomRight,
          })}
        >
          {clearable && (
            <li>
              <button
                className={classes.clearBtn}
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
