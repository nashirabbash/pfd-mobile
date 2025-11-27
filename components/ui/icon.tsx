import type { LucideIcon, LucideProps } from "lucide-react-native";
import * as React from "react";
import {
  StyleSheet,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";

// --- 1. Asumsi Theme ---
const theme = {
  colors: {
    foreground: "#09090B", // 'text-foreground'
  },
};

// --- 2. Tipe Props ---
// Kita hilangkan 'style', 'color', dan 'size' dari props Lucide asli
// karena kita akan mengelolanya secara manual.
type IconProps = Omit<LucideProps, "style" | "color" | "size"> & {
  /** Ikon Lucide yang akan di-render, misal: ArrowRight */
  as: LucideIcon;
  /** Style kustom. 'color' akan diekstrak, sisanya (layout) akan diteruskan. */
  style?: StyleProp<TextStyle | ViewStyle>;
  /** Ukuran ikon. Ini akan menimpa 'height'/'width' dari 'style'. */
  size?: number;
};

// --- 3. Komponen <Icon> ---

/**
 * Komponen wrapper untuk ikon Lucide dengan 'style' ala StyleSheet.
 *
 * Komponen ini memungkinkan Anda me-render ikon Lucide apa pun dan memberinya
 * 'style'. Ia secara cerdas akan mengekstrak 'color' dari style dan
 * menggunakan 'height'/'width' dari style sebagai 'size'.
 *
 * @example
 * ```tsx
 * import { ArrowRight } from 'lucide-react-native';
 * import { Icon } from '@/components/ui/icon';
 *
 * <Icon as={ArrowRight} style={{ color: 'red' }} size={16} />
 * ```
 */
function Icon({
  as: IconComponent,
  style,
  size: sizeProp, // Prop 'size' dari pengguna
  ...props
}: IconProps) {
  // 1. Terapkan style default (dari 'text-foreground')
  const defaultStyle = { color: theme.colors.foreground };

  // 2. Gabungkan style default dengan style dari props
  // flatten may return a RegisteredStyle or undefined — cast to `any` for safe property access
  const flatStyle = (StyleSheet.flatten([defaultStyle, style]) || {}) as any;

  // 3. Ekstrak properti, meniru 'cssInterop'
  const {
    color, // Akan diteruskan ke prop 'color' Lucide
    height, // Akan digunakan untuk 'size'
    width, // Akan digunakan untuk 'size'
    ...restStyle // Sisanya (margin, transform) diteruskan ke 'style' Lucide
  } = flatStyle;

  // 4. Tentukan ukuran akhir. Urutan prioritas:
  //    1. Prop `size` (jika diberikan)
  //    2. Properti `height` dari `style`
  //    3. Properti `width` dari `style`
  //    4. Default (14, dari kode asli)
  const finalSize = sizeProp ?? height ?? width ?? 14;

  return (
    <IconComponent
      color={color}
      size={finalSize}
      style={restStyle}
      {...props}
    />
  );
}

export { Icon };
