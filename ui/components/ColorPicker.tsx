import toast from "react-hot-toast";
import {
  YELLOW,
  BLUE,
  PURPLE,
  ORANGE,
  LIGHT_PURPLE,
} from "../constants/colors";
import ColorSwatch from "./ColorSwatch";
import { useThemeContext } from "./ThemeProvider";

export default function ColorPicker() {
  const { updatePrimaryColor } = useThemeContext();
  const handleColorChange = (color: string) => {
    updatePrimaryColor(color);
    toast.success("Changed primary color.", {
      iconTheme: {
        primary: color,
        secondary: "white",
      },
    });
  };

  return (
    <div className="space-x-4 flex flex-row z-10">
      <ColorSwatch color={ORANGE} clickHandler={handleColorChange} />
      <ColorSwatch color={BLUE} clickHandler={handleColorChange} />
      <ColorSwatch color={LIGHT_PURPLE} clickHandler={handleColorChange} />
      <ColorSwatch color={PURPLE} clickHandler={handleColorChange} />
    </div>
  );
}
