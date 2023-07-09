import { createContext, useContext } from "react";
import { PURPLE } from "../constants/colors";
import { useTheme } from "../theme";

const ThemeContext = createContext({
  primaryColor: PURPLE,
  updatePrimaryColor: (color: string) => {},
});

export function ThemeProvider(props: any) {
  const { value, children } = props;
  const theme = useTheme();

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}
// custom hook to use the authUserContext and access authUser and loading
export const useThemeContext = () => useContext(ThemeContext);
