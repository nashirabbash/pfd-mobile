import * as Slot from "@rn-primitives/slot";
import * as React from "react";
import {
  Platform,
  StyleSheet,
  Text as RNText,
  type Role,
  type StyleProp,
  type TextStyle,
} from "react-native";

// --- 1. Asumsi Theme ---
// Di proyek Anda, ini harus diimpor dari file constants/theme Anda
// Saya hanya menebak nilainya berdasarkan nama Tailwind.
const theme = {
  colors: {
    foreground: "#111827", // text-foreground
    mutedForeground: "#6B7280", // text-muted-foreground
    border: "#E5E7EB", // border-border
    muted: "#F3F4F6", // bg-muted
  },
  fontSizes: {
    base: 16,
    sm: 14,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
  },
  fontWeights: {
    medium: "500" as const,
    semibold: "600" as const,
    extrabold: "800" as const,
  },
  letterSpacings: {
    tight: -0.5,
  },
  lineHeights: {
    none: 16 * 1, // 'leading-none' (assuming 1 * font-size)
    normal: 16 * 1.5, // default
    relaxed: 16 * 1.625, // 'leading-7' (approx 28px / 16px base)
  },
};

// --- 2. Konversi CVA ke StyleSheet ---
// 'cva' digantikan oleh StyleSheet.create()
const textVariants = StyleSheet.create({
  // Ini adalah style dasar dari 'cva'
  base: {
    color: theme.colors.foreground,
    fontSize: theme.fontSizes.base,
    ...Platform.select({
      web: {
        userSelect: "text", // 'select-text'
      } as any, // userSelect bukan properti standar RN
    }),
  },

  // --- Variants ---
  default: {
    // Tidak ada style tambahan
  },
  h1: {
    textAlign: "center",
    fontSize: theme.fontSizes["4xl"],
    fontWeight: theme.fontWeights.extrabold,
    letterSpacing: theme.letterSpacings.tight,
    ...Platform.select({
      web: {
        scrollMarginTop: 80, // 'scroll-m-20'
        textWrap: "balance", // 'text-balance' (properti CSS baru)
      } as any,
    }),
  },
  h2: {
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
    paddingBottom: 8, // 'pb-2'
    fontSize: theme.fontSizes["3xl"],
    fontWeight: theme.fontWeights.semibold,
    letterSpacing: theme.letterSpacings.tight,
    ...Platform.select({
      web: {
        scrollMarginTop: 80, // 'scroll-m-20'
      } as any,
    }),
  },
  h3: {
    fontSize: theme.fontSizes["2xl"],
    fontWeight: theme.fontWeights.semibold,
    letterSpacing: theme.letterSpacings.tight,
    ...Platform.select({
      web: {
        scrollMarginTop: 80, // 'scroll-m-20'
      } as any,
    }),
  },
  h4: {
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.fontWeights.semibold,
    letterSpacing: theme.letterSpacings.tight,
    ...Platform.select({
      web: {
        scrollMarginTop: 80, // 'scroll-m-20'
      } as any,
    }),
  },
  p: {
    marginTop: 12, // 'mt-3'
    lineHeight: theme.lineHeights.relaxed, // 'leading-7'
    // CATATAN: 'sm:mt-6' (responsive) tidak bisa dilakukan di StyleSheet
    // Anda perlu logic terpisah (mis: useWindowDimensions)
  },
  blockquote: {
    marginTop: 16, // 'mt-4'
    borderLeftWidth: 2,
    paddingLeft: 12, // 'pl-3'
    fontStyle: "italic",
  },
  code: {
    backgroundColor: theme.colors.muted,
    borderRadius: 6, // 'rounded'
    paddingHorizontal: 6, // 'px-[0.3rem]'
    paddingVertical: 4, // 'py-[0.2rem]'
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace", // 'font-mono'
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.semibold,
  },
  lead: {
    color: theme.colors.mutedForeground,
    fontSize: theme.fontSizes.xl,
  },
  large: {
    fontSize: theme.fontSizes.lg,
    fontWeight: theme.fontWeights.semibold,
  },
  small: {
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.medium,
    lineHeight: theme.lineHeights.none, // 'leading-none'
  },
  muted: {
    color: theme.colors.mutedForeground,
    fontSize: theme.fontSizes.sm,
  },
});

// --- 3. Tipe Props ---
// 'VariantProps' diganti dengan tipe manual dari key StyleSheet kita
type TextVariant = keyof typeof textVariants;

// Ambil props standar RNText, lalu tambahkan 'variant' dan 'asChild'
type TextProps = React.ComponentProps<typeof RNText> & {
  variant?: TextVariant;
  asChild?: boolean;
};

// --- 4. Accessibility (Sama seperti aslinya) ---
const ROLE: Partial<Record<TextVariant, Role>> = {
  h1: "heading",
  h2: "heading",
  h3: "heading",
  h4: "heading",
  blockquote: Platform.select({ web: "blockquote" as Role }),
  code: Platform.select({ web: "code" as Role }),
};

const ARIA_LEVEL: Partial<Record<TextVariant, string>> = {
  h1: "1",
  h2: "2",
  h3: "3",
  h4: "4",
};

// --- 5. Context (Diubah untuk menerima StyleProp) ---
// 'TextClassContext' menjadi 'TextStyleContext'
const TextStyleContext = React.createContext<StyleProp<TextStyle> | undefined>(
  undefined
);

// --- 6. Komponen Utama ---
const Text = React.forwardRef<RNText, TextProps>(
  ({ style, asChild = false, variant = "default", ...props }, ref) => {
    const textStyleFromContext = React.useContext(TextStyleContext);
    const Component = asChild ? Slot.Text : RNText;

    // INI BAGIAN KUNCINYA:
    // Kita membangun array style.
    // 'style' dari props (parent) diletakkan TERAKHIR.
    // Ini memastikan parent bisa menimpa style apa pun dari 'base' atau 'variant'.
    const finalStyle = [
      textVariants.base, // 1. Style dasar
      textVariants[variant], // 2. Style variant
      textStyleFromContext, // 3. Style dari context (jika ada)
      style, // 4. Style dari parent (OVERRIDES)
    ];

    return (
      <Component
        ref={ref}
        style={finalStyle} // 'className' diganti 'style'
        role={variant ? ROLE[variant] : undefined}
        aria-level={variant ? ARIA_LEVEL[variant] : undefined}
        {...props}
      />
    );
  }
);
Text.displayName = "Text";

export { Text, TextStyleContext, textVariants };
