import React, { useEffect, useState } from "react";
import type { RgbColor } from "./api/use-gamesense";
import useGameSense, { Status } from "./api/use-gamesense";
import type { RGBColor } from "react-color";
import { CirclePicker } from "react-color";

const reactColorToHookColor = (reactColor: RGBColor): RgbColor => ({
  red: reactColor.r,
  green: reactColor.g,
  blue: reactColor.b,
});

type ZoneColorPickerProps = {
  setColor: (color: RGBColor) => void;
  color: RGBColor;
  title: string;
};

function ZoneColorPicker({ setColor, color, title }: ZoneColorPickerProps) {
  return (
    <div>
      <h2>{title}</h2>
      <p>TODO: Add ability to send blink events to zone</p>
      <CirclePicker
        color={color}
        onChangeComplete={(colorResult) => setColor(colorResult.rgb)}
      />
    </div>
  );
}

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

  useEffect(() => {
    onBinderUpdateAsync([
      reactColorToHookColor(zoneOneColor),
      reactColorToHookColor(zoneTwoColor),
      reactColorToHookColor(zoneThreeColor),
    ]);
  }, [zoneOneColor, zoneTwoColor, zoneThreeColor, onBinderUpdateAsync]);

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
          <ZoneColorPicker
            title="Zone 1"
            setColor={setZoneOneColor}
            color={zoneOneColor}
          />
          <ZoneColorPicker
            title="Zone 2"
            setColor={setZoneTwoColor}
            color={zoneTwoColor}
          />
          <ZoneColorPicker
            title="Zone 3"
            setColor={setZoneThreeColor}
            color={zoneThreeColor}
          />
        </>
      ) : (
        <>Steelseries Game Engine not running</>
      )}
    </>
  );
};

export default App;
