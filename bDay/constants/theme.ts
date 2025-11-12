/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const primary = '#ff9cb5'
const onPrimary = '#fff'


const tintColorLight = primary;
const tintColorDark = primary;
const primaryLight = "#000";
const primaryDark = "#fff"
const onPrimaryLight = "#fff";
const onPrimaryDark = "#000";
const iconLight = '#687076';
const iconDark = "#9BA1A6"

const accentLight = '#f7f7f7';
const accentDark = '#212121';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: iconLight,

    tabIconDefault: iconLight,
    tabIconSelected: tintColorLight,

    buttonColor: primaryLight,
    buttonTextColor: onPrimaryLight,

    specialButtonColor: primary,
    specialButtonTextColor: onPrimaryLight,

    card: accentLight,
    cardBday: tintColorLight,
    calendarToday:  tintColorLight

  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: iconDark,

    tabIconDefault: iconDark,
    tabIconSelected: tintColorDark,

    buttonColor: primary,
    buttonTextColor: onPrimary,

    specialButtonColor: primaryDark,
    specialButtonTextColor: onPrimaryDark,

    card: accentDark,
    cardBday: primaryDark,
    calendarToday: primaryDark
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
