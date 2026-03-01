import { useEffect } from "react";
import ReactModal from "react-modal";
import { Cross } from "lucide-react";
import cx from "clsx";
import styles from "./modal.module.css";
import { Title } from "./atoms/title/title.atom";

export var Modal = ({
  isOpen,
  onClose,
  className,
  children,
  header,
  footer,
}) => {
  var rootClasses = cx(
    styles.root,
    {
      [styles.rootSmall]: size === "small",
      [styles.rootDefault]: size === "default",
      [styles.rootLarge]: size === "large",
      [styles.rootWide]: size === "wide",
    },
    className,
  );

  useEffect(() => {
    var reset = () => (document.body.style.overflow = "unset");
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      reset();
    }
    return reset;
  }, [isOpen]);

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={rootClasses}
      overlayClassName={styles.overlay}
      ariaHideApp={false}
    >
      <button type="button" onClick={onClose} className={styles.closeBtn}>
        <Cross />
      </button>
      {header && <div className={styles.header}>{header}</div>}
      <div className={styles.content}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </ReactModal>
  );
};

Modal.Title = Title;
