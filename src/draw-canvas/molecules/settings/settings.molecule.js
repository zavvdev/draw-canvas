import { ContextDropdown } from "../../../shared/ContextDropdown";
import { SettingsIcon } from "../../../assets/Icons/SettingsIcon";
import styles from "./styles.module.scss";
import { useAppTranslation } from "../../../i18n/useAppTranslation";

export const Settings = ({ children, dropdownPosition }) => {
  const { tCommon: t } = useAppTranslation.Common({
    keyPrefix: "drawArea.settings",
  });

  return (
    <ContextDropdown
      opener={<SettingsIcon width="18px" />}
      openerClassName={styles.opener}
      dropdownClassName={styles.dropdown}
      position={dropdownPosition}
    >
      <h3>{t("title")}</h3>
      <hr />
      {children}
    </ContextDropdown>
  );
};
