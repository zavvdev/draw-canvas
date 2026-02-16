import { ColorSelect } from "../../../shared/ColorSelect/ColorSelect";
import { useDrawAreaContext } from "../context";
import styles from "./styles.module.scss";

export const ColorPicker = ({ dropdownPosition }) => {
  const { get, set } = useDrawAreaContext();

  return (
    <ColorSelect
      size="small"
      options={get.colors}
      value={get.color}
      onChange={set.color}
      openerClassName={styles.opener}
      position={dropdownPosition}
    />
  );
};
