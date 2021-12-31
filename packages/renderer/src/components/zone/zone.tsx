import type { RGBColor } from "react-color";
import { CirclePicker } from "react-color";

type Props = {
  setColor: (color: RGBColor) => void;
  color: RGBColor;
  title: string;
  disabled: boolean;
};

const Zone = ({ setColor, color, title, disabled }: Props) => {
  return (
    <div style={{ padding: 5, flex: 1 }}>
      <h2>{title}</h2>
      <div
        className="light-zone"
        style={{
          height: 5,
          backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`,
        }}
      />
      <div>
        {!disabled && (
          <CirclePicker
            color={color}
            onChangeComplete={(colorResult) => setColor(colorResult.rgb)}
          />
        )}
      </div>
    </div>
  );
};

export default Zone;
