import { useRef, useState } from "react";
import cx from "clsx";
import { useClickOutside } from "../../utilities/hooks/useClickOutside";
import { not } from "../../utilities/fp";
import styles from "./styles.module.scss";

export const CONTEXT_DROPDOWN_POS = {
  topRight: "top-right",
  topLeft: "top-left",
  bottomRight: "bottom-right",
  bottomLeft: "bottom-left",
};

export const ContextDropdown = ({
  children,
  opener,
  dropdownClassName,
  openerClassName,
  className,
  position = CONTEXT_DROPDOWN_POS.bottomLeft,
  dropdownY,
  dropdownMaxWidth,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);

  useClickOutside(rootRef, () => setIsOpen(false));

  return (
    <div ref={rootRef} className={cx(styles.root, className)}>
      <button
        className={cx(styles.opener, openerClassName)}
        onClick={() => setIsOpen(not)}
      >
        {opener}
      </button>
      {isOpen && (
        <div
          style={{ top: dropdownY, maxWidth: dropdownMaxWidth }}
          className={cx(
            styles.dropdown,
            {
              [styles.topRight]: position === CONTEXT_DROPDOWN_POS.topRight,
              [styles.topLeft]: position === CONTEXT_DROPDOWN_POS.topLeft,
              [styles.bottomRight]:
                position === CONTEXT_DROPDOWN_POS.bottomRight,
              [styles.bottomLeft]: position === CONTEXT_DROPDOWN_POS.bottomLeft,
            },
            dropdownClassName,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
