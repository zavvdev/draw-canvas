import { useAppTranslation } from "../../../i18n/useAppTranslation";
import { useDrawAreaContext } from "../context";
import { DRAW_AREA_ACTIONS } from "../config";
import { MENU_BUTTON_COLORS, MenuButton } from "../shared/MenuButton";
import { ArrowLeftIcon } from "../../../assets/Icons/ArrowLeftIcon";
import { ArrowRightIcon } from "../../../assets/Icons/ArrowRightIcon";
import { DeleteIcon } from "../../../assets/Icons/DeleteIcon";
import styles from "./styles.module.scss";
import { SaveIcon } from "../../../assets/Icons/SaveIcon";
import { useSaveImageAction } from "./hooks/useSaveImageAction";
import { SaveImageModal } from "./shared/SaveImageModal";
import { BrushCleaningIcon } from "../../../assets/Icons/BrushCleaningIcon";
import { DRAW_AREA_DEFAULT_EXPORT_FILE } from "../../organisms/draw-canvas/draw-canvas.config";

export const Actions = ({ use = [] } = {}) => {
  const { tCommon: t } = useAppTranslation.Common({
    keyPrefix: "drawArea",
  });

  const { act, textEditor } = useDrawAreaContext();
  const saveImageAction = useSaveImageAction();

  const actionsList = [
    {
      id: DRAW_AREA_ACTIONS.undo,
      label: t("actions.undo"),
      icon: <ArrowLeftIcon />,
      onClick: () => act.undo(),
      isDisabled: !!textEditor.coords,
      isVisible: use.includes(DRAW_AREA_ACTIONS.undo),
    },
    {
      id: DRAW_AREA_ACTIONS.redo,
      label: t("actions.redo"),
      icon: <ArrowRightIcon />,
      onClick: () => act.redo(),
      isDisabled: !!textEditor.coords,
      isVisible: use.includes(DRAW_AREA_ACTIONS.redo),
    },
    {
      id: DRAW_AREA_ACTIONS.delActive,
      label: t("actions.deleteActive"),
      icon: <DeleteIcon />,
      onClick: () => act.delActive(),
      isDisabled: !!textEditor.coords,
      isVisible: use.includes(DRAW_AREA_ACTIONS.delActive),
      color: MENU_BUTTON_COLORS.danger,
    },
    {
      id: DRAW_AREA_ACTIONS.saveImage,
      label: t("actions.saveImage"),
      icon: <SaveIcon />,
      onClick: () => saveImageAction.onSave(),
      isDisabled: !!textEditor.coords,
      isVisible: use.includes(DRAW_AREA_ACTIONS.saveImage),
    },
    {
      id: DRAW_AREA_ACTIONS.deleteAll,
      label: t("actions.deleteAll"),
      icon: <BrushCleaningIcon />,
      onClick: () => act.deleteAll(),
      isDisabled: false,
      isVisible: use.includes(DRAW_AREA_ACTIONS.deleteAll),
    },
  ].filter((tool) => tool.isVisible);

  return (
    <div className={styles.root}>
      {actionsList.map((action) => (
        <MenuButton
          key={action.id}
          title={action.label}
          onClick={action.onClick}
          isDisabled={action.isDisabled}
          color={action.color}
        >
          {action.icon}
        </MenuButton>
      ))}
      {saveImageAction.isDialogOpen && (
        <SaveImageModal
          fileName={saveImageAction.fileName}
          setFileName={saveImageAction.setFileName}
          onClose={saveImageAction.onCancelSave}
          onSave={saveImageAction.onConfirmSave}
          extension={DRAW_AREA_DEFAULT_EXPORT_FILE.extension}
        />
      )}
    </div>
  );
};
