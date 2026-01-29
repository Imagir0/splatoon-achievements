import { Platform } from 'react-native';

export const lightTheme = {
  colors: {
    background: '#f2f2f2',
    surface: '#ffffff',
    text: '#111827',
    textMuted: '#6b7280',
    border: '#e5e7eb',
    primary: '#e92626ff',
    icon: '#374151',
    header: '#ffffff',
    progressBar: '#1ea851',
    rowChecked: '#2dbd62',
    white: '#fff',
  },
};

export const darkTheme = {
  colors: {
    background: '#000000',
    surface: '#363232ff',
    text: '#f9fafb',
    textMuted: '#9ca3af',
    border: '#575a5f',
    primary: '#e92626ff',
    icon: '#e5e7eb',
    header: '#000000',
    progressBar: '#1ea851',
    rowChecked: '#2dbd62',
    white: '#fff',
  },
};

export type AppTheme = typeof lightTheme;


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
