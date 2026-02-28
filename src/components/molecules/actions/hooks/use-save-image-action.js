import { useState } from "react";
import { DRAW_AREA_DEFAULT_EXPORT_FILE } from "../../config";
import { useDrawAreaContext } from "../../context";

const DEFAULT_FILE_NAME = DRAW_AREA_DEFAULT_EXPORT_FILE.name;

export const useSaveImageAction = () => {
  const [fileName, setFileName] = useState(DEFAULT_FILE_NAME);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { act } = useDrawAreaContext();

  const reset = () => {
    setFileName(DEFAULT_FILE_NAME);
    setIsDialogOpen(false);
  };

  const onSave = () => {
    setIsDialogOpen(true);
  };

  const onConfirmSave = () => {
    act.saveImage(fileName);
    reset();
  };

  const onCancelSave = () => {
    reset();
  };

  return {
    fileName,
    setFileName,
    isDialogOpen,
    setIsDialogOpen,
    onSave,
    onConfirmSave,
    onCancelSave,
  };
};
