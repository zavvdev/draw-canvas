import { useEffect, useRef, useState } from "react";

/**
 * @description
 * Custom hook to get the width of the root element
 */
export const useRootWidth = () => {
  const rootRef = useRef(null);
  const [rootWidth, setRootWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (rootRef.current) {
        setRootWidth(rootRef.current.offsetWidth);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return [rootRef, rootWidth];
};
