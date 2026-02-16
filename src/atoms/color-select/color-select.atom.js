import { useRef, useState } from "react";
import cx from "clsx";
import classes from "./ColorSelect.module.scss";
import { PaletteIcon } from "../../assets/Icons/PaletteIcon";
import { useAppTranslation } from "../../i18n/useAppTranslation";
import { useClickOutside } from "../../utilities/hooks/useClickOutside";
import { DEFAULT_COLORS } from "./ColorSelect.config";
import { CrossIcon } from "../../assets/Icons/CrossIcon";

export const COLOR_SELECT_POS = {
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
  const { tCommon } = useAppTranslation.Common();
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
          <PaletteIcon width={size === "small" ? "19px" : "21px"} />
        )}
      </button>
      {isOpen && (
        <ul
          data-testid="list"
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
                data-testid="clear"
                className={classes.clearBtn}
                onClick={() => handleChange(undefined)}
              >
                <CrossIcon width="14px" />
              </button>
            </li>
          )}
          {colorOptions.length > 0
            ? colorOptions.map((color) => (
                <li key={color}>
                  <button
                    data-testid={color}
                    style={{ backgroundColor: color }}
                    onClick={() => handleChange(color)}
                  />
                </li>
              ))
            : tCommon("label.empty")}
        </ul>
      )}
    </div>
  );
};
