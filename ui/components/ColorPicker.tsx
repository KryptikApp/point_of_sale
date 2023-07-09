import toast from "react-hot-toast";
import { YELLOW, BLUE, PURPLE } from "../constants/colors";
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
    <div className="space-y-4 flex-col z-10">
      <ColorSwatch color={YELLOW} clickHandler={handleColorChange} />
      <ColorSwatch color={BLUE} clickHandler={handleColorChange} />
      <ColorSwatch color={PURPLE} clickHandler={handleColorChange} />
    </div>
  );
}
