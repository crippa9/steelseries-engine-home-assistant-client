import React, { useEffect, useState } from "react";
import type { RgbColor } from "./api/use-gamesense";
import useGameSense, { Status } from "./api/use-gamesense";
import type { RGBColor } from "react-color";
import Zone from "./components/zone/zone";
import useBlinker from "./components/zone/hooks/use-blinker";

const ANIMATION_POLL_RATE_IN_MS = 500;
const ANIMATION_DURATION_IN_MS = 2000;

const reactColorToHookColor = (reactColor: RGBColor): RgbColor => ({
  red: reactColor.r,
  green: reactColor.g,
  blue: reactColor.b,
});

const App: React.FC = () => {
  const [zoneOneColor, setZoneOneColor] = useState<RGBColor>({
    r: 0,
    g: 0,
    b: 0,
  });
  const [zoneTwoColor, setZoneTwoColor] = useState<RGBColor>({
    r: 0,
    g: 0,
    b: 0,
  });
  const [zoneThreeColor, setZoneThreeColor] = useState<RGBColor>({
    r: 0,
    g: 0,
    b: 0,
  });
  const { onBinderUpdateAsync, onResetGameSetupAsync, status } = useGameSense();

  const { start, isBlinking, blinkerColorOverride } = useBlinker(
    1,
    ANIMATION_DURATION_IN_MS,
    ANIMATION_POLL_RATE_IN_MS
  );

  useEffect(() => {
    if (blinkerColorOverride) {
      onBinderUpdateAsync([
        reactColorToHookColor(blinkerColorOverride),
        reactColorToHookColor(blinkerColorOverride),
        reactColorToHookColor(blinkerColorOverride),
      ]);
      return;
    }
    onBinderUpdateAsync([
      reactColorToHookColor(zoneOneColor),
      reactColorToHookColor(zoneTwoColor),
      reactColorToHookColor(zoneThreeColor),
    ]);
  }, [
    blinkerColorOverride,
    zoneOneColor,
    zoneTwoColor,
    zoneThreeColor,
    onBinderUpdateAsync,
  ]);

  return (
    <>
      {status === Status.LoadingServerData ? (
        <p>Checking if Game Engine is running</p>
      ) : status === Status.SettingUpGame ? (
        <p>Setting up game</p>
      ) : status === Status.Ready ? (
        <>
          <p>Server running.</p>
          <div>
            <button onClick={() => onResetGameSetupAsync()}>
              Reset game setup
            </button>
          </div>
          <div>
            <button disabled={isBlinking} onClick={start}>
              {isBlinking ? "Blinking..." : "Start blinking"}
            </button>
          </div>
          <div className="zones-container" style={{ display: "flex" }}>
            <Zone
              title="Zone 1"
              setColor={setZoneOneColor}
              color={zoneOneColor}
              disabled={isBlinking}
            />
            <Zone
              title="Zone 2"
              setColor={setZoneTwoColor}
              color={zoneTwoColor}
              disabled={isBlinking}
            />
            <Zone
              title="Zone 3"
              setColor={setZoneThreeColor}
              color={zoneThreeColor}
              disabled={isBlinking}
            />
            <Zone
              title="Zone 2"
              setColor={setZoneTwoColor}
              color={zoneTwoColor}
              disabled={isBlinking}
            />
            <Zone
              title="Zone 1"
              setColor={setZoneOneColor}
              color={zoneOneColor}
              disabled={isBlinking}
            />
          </div>
        </>
      ) : (
        <p>Steelseries Game Engine not running</p>
      )}
    </>
  );
};

export default App;
