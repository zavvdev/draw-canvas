import styles from "./tools.module.css";
import { DRAW_AREA_TOOLS } from "../config";
import { useAppTranslation } from "../../../i18n/useAppTranslation";
import { useDrawAreaContext } from "../context";
import { PenLineIcon } from "../../../assets/Icons/PenLineIcon";
import { DiagonalLineIcon } from "../../../assets/Icons/DiagonalLineIcon";
import { ArrowDiagonalDownLeftIcon } from "../../../assets/Icons/ArrowDiagonalDownLeftIcon";
import { CircleIcon } from "../../../assets/Icons/CircleIcon";
import { SquareIcon } from "../../../assets/Icons/SquareIcon";
import { CaseSensitiveIcon } from "../../../assets/Icons/CaseSensitiveIcon";
import { MoveIcon } from "../../../assets/Icons/MoveIcon";
import { MenuButton } from "../shared/MenuButton";
import { PinIcon } from "../../../assets/Icons/PinIcon";

export const Tools = ({ use = [] } = {}) => {
  const { tCommon: t } = useAppTranslation.Common({
    keyPrefix: "drawArea",
  });

  const { get, set, textEditor } = useDrawAreaContext();

  const toolsList = [
    {
      id: DRAW_AREA_TOOLS.pen,
      label: t("tools.pen"),
      icon: <PenLineIcon />,
      onClick: () => set.tool(DRAW_AREA_TOOLS.pen),
      isActive: get.tool === DRAW_AREA_TOOLS.pen,
      isDisabled: !!textEditor.coords,
      isVisible: use.includes(DRAW_AREA_TOOLS.pen),
    },
    {
      id: DRAW_AREA_TOOLS.line,
      label: t("tools.line"),
      icon: <DiagonalLineIcon />,
      onClick: () => set.tool(DRAW_AREA_TOOLS.line),
      isActive: get.tool === DRAW_AREA_TOOLS.line,
      isDisabled: !!textEditor.coords,
      isVisible: use.includes(DRAW_AREA_TOOLS.line),
    },
    {
      id: DRAW_AREA_TOOLS.arrow,
      label: t("tools.arrow"),
      icon: <ArrowDiagonalDownLeftIcon />,
      onClick: () => set.tool(DRAW_AREA_TOOLS.arrow),
      isActive: get.tool === DRAW_AREA_TOOLS.arrow,
      isDisabled: !!textEditor.coords,
      isVisible: use.includes(DRAW_AREA_TOOLS.arrow),
    },
    {
      id: DRAW_AREA_TOOLS.circle,
      label: t("tools.circle"),
      icon: <CircleIcon />,
      onClick: () => set.tool(DRAW_AREA_TOOLS.circle),
      isActive: get.tool === DRAW_AREA_TOOLS.circle,
      isDisabled: !!textEditor.coords,
      isVisible: use.includes(DRAW_AREA_TOOLS.circle),
    },
    {
      id: DRAW_AREA_TOOLS.rectangle,
      label: t("tools.rectangle"),
      icon: <SquareIcon />,
      onClick: () => set.tool(DRAW_AREA_TOOLS.rectangle),
      isActive: get.tool === DRAW_AREA_TOOLS.rectangle,
      isDisabled: !!textEditor.coords,
      isVisible: use.includes(DRAW_AREA_TOOLS.rectangle),
    },
    {
      id: DRAW_AREA_TOOLS.text,
      label: t("tools.text"),
      icon: <CaseSensitiveIcon />,
      onClick: () => set.tool(DRAW_AREA_TOOLS.text),
      isActive: get.tool === DRAW_AREA_TOOLS.text,
      isDisabled: false,
      isVisible: use.includes(DRAW_AREA_TOOLS.text),
    },
    {
      id: DRAW_AREA_TOOLS.pin,
      label: t("tools.pin"),
      icon: <PinIcon />,
      onClick: () => set.tool(DRAW_AREA_TOOLS.pin),
      isActive: get.tool === DRAW_AREA_TOOLS.pin,
      isDisabled: false,
      isVisible: use.includes(DRAW_AREA_TOOLS.pin),
    },
    {
      id: DRAW_AREA_TOOLS.drag,
      label: t("tools.drag"),
      icon: <MoveIcon />,
      onClick: () => set.tool(DRAW_AREA_TOOLS.drag),
      isActive: get.tool === DRAW_AREA_TOOLS.drag,
      isDisabled: !!textEditor.coords,
      isVisible: use.includes(DRAW_AREA_TOOLS.drag),
    },
  ].filter((tool) => tool.isVisible);

  return (
    <div className={styles.root}>
      {toolsList.map((tool) => (
        <MenuButton
          key={tool.id}
          title={tool.label}
          onClick={tool.onClick}
          isDisabled={tool.isDisabled}
          isActive={tool.isActive}
        >
          {tool.icon}
        </MenuButton>
      ))}
    </div>
  );
};
