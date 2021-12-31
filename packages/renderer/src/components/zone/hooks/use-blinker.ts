import { useCallback, useEffect, useMemo, useState } from "react";
import type { RGBColor } from "react-color";

type ReturnProps = {
  isBlinking: boolean;
  blinkerColorOverride: RGBColor | undefined;
  start: () => void;
};

const useBlinker = (
  numberOfBlinks: number,
  duration: number,
  pollRate: number
): ReturnProps => {
  const [blinkTimeout, setBlinkTimeout] = useState<number>();
  const [blinkerTimer, setBlinkerTimer] = useState<number>();

  useEffect(() => {
    return () => {
      clearInterval(blinkerTimer);
      clearTimeout(blinkTimeout);
    };
  }, [blinkerTimer]);

  const start = useCallback(() => {
    setBlinkTimeout(
      setTimeout(() => {
        clearInterval(blinkerTimer);
        setBlinkerTimer(undefined);
        setBlinkTimeout(undefined);
      }, duration)
    );
    setBlinkerTimer(
      setInterval(() => {
        console.log("blinker update frame");
      }, pollRate)
    );
  }, []);

  const isBlinking = useMemo<boolean>(() => !!blinkerTimer, [blinkerTimer]);

  const blinkerColorOverride = useMemo(
    () => (isBlinking ? { r: 255, g: 255, b: 255 } : undefined),
    [isBlinking]
  );
  return {
    isBlinking,
    blinkerColorOverride: blinkerColorOverride,
    start,
  };
};

export default useBlinker;
