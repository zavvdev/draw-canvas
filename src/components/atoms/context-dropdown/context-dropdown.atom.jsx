import { useRef, useState } from "react";
import cx from "clsx";
import { useClickOutside } from "../../../utilities/hooks/use-click-outside";
import styles from "./context-dropdown.module.css";
import { CONTEXT_DROPDOWN_POS } from "./context-dropdown.config";

export var ContextDropdown = ({
  children,
  opener,
  dropdownClassName,
  openerClassName,
  className,
  position = CONTEXT_DROPDOWN_POS.bottomLeft,
  dropdownY,
  dropdownMaxWidth,
}) => {
  var { 0: isOpen, 1: setIsOpen } = useState(false);
  var rootRef = useRef(null);
  useClickOutside(rootRef, () => setIsOpen(false));

  return (
    <div ref={rootRef} className={cx(styles.root, className)}>
      <button
        className={cx(styles.opener, openerClassName)}
        onClick={() => setIsOpen((x) => !x)}
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
};
