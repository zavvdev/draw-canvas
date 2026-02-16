import cx from "clsx";
import { Box as SharedBox } from "../../../shared/Box/Box";
import styles from "./styles.module.scss";

export const Box = ({
  children,
  className,
  justifyBetween,
  alignCenter,
  simple,
}) => {
  const className_ = cx(
    styles.root,
    {
      [styles.justifyBetween]: justifyBetween,
      [styles.alignCenter]: alignCenter,
    },
    className,
  );

  if (simple) {
    return <div className={className_}>{children}</div>;
  }

  return <SharedBox className={className_}>{children}</SharedBox>;
};
