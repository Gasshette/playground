export interface FileBarThemeColors {
  /**
   * Text color. Its color map is used to style other elements like hover over a button.
   */
  color: string;
  /**
   * The files bar background. its color map is used to style others elements like the file creation form background.
   */
  background: string;
  /**
   * Basically a red color for remove buttons
   */
  danger: string;
  /**
   * The indicator under the active file
   */
  indicator: string;
  /**
   * The icon buttons hover color
   */
  hover: string;
}

export interface FileBarThemes {
  light: {
    colors: FileBarThemeColors;
  };
  dark: {
    colors: FileBarThemeColors;
  };
}
