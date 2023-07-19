// theme context with state to get and set primary color

import { useEffect, useState } from "react";
import { BLUE, YELLOW } from "../constants/colors";

export function useTheme() {
  const defaultTheme: ITheme = {
    // blue
    primaryColor: BLUE,
  };

  // init state
  const [primaryColor, setPrimaryColor] = useState<string>(BLUE);
  const [themeLoading, setThemeLoading] = useState<boolean>(false);

  interface ITheme {
    primaryColor?: string;
  }

  const generateThemeLocation = function () {
    let themeLocation = `appTheme`;
    return themeLocation;
  };

  const fetchTheme = function (uid?: string) {
    let theme: ITheme;
    let themeString: string | null = null;

    let themeLocation = generateThemeLocation();
    themeString = localStorage.getItem(themeLocation);

    // fetch stored theme
    if (!themeString) {
      theme = defaultTheme;
    } else {
      theme = { ...JSON.parse(themeString) };
      if (theme.primaryColor) {
        setPrimaryColor(theme.primaryColor);
      }
    }
  };

  // updates local storage theme value
  const updateTheme = function (newTheme: ITheme) {
    let themeLocation = generateThemeLocation();
    let themeString = JSON.stringify(newTheme);
    localStorage.setItem(themeLocation, themeString);
  };

  const updatePrimaryColor = function (newPrimaryColor: string) {
    let newTheme = { ...defaultTheme, primaryColor: newPrimaryColor };
    updateTheme(newTheme);
    setPrimaryColor(newPrimaryColor);
  };

  useEffect(() => {
    setThemeLoading(true);
    // fetch current theme
    fetchTheme();
  }, []);

  return {
    primaryColor,
    updatePrimaryColor,
  };
}
