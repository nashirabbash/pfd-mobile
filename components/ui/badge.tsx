import * as Slot from "@rn-primitives/slot";
import * as React from "react";
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewProps,
  type ViewStyle,
} from "react-native";

// --- 1. Asumsi Theme ---
const theme = {
  colors: {
    primary: "#18181B",
    primaryForeground: "#FAFAFA",
    secondary: "#F4F4F5",
    secondaryForeground: "#18181B",
    destructive: "#EF4444",
    destructiveForeground: "#FAFAFA",
    border: "#E4E4E7",
    foreground: "#18181B",
  },
  fontSizes: {
    xs: 12,
  },
  fontWeights: {
    medium: "500" as const,
  },
};

// --- 2. Styles (CVA -> StyleSheet) ---
// Kita pisahkan antara style Container (View) dan style Text/Icon

const badgeContainerStyles = StyleSheet.create({
  // Base style dari cva
  base: {
    flexDirection: "row", // 'inline-flex'
    alignItems: "center", // 'items-center'
    justifyContent: "center", // 'justify-center'
    borderRadius: 9999, // 'rounded-full'
    borderWidth: 1, // 'border'
    paddingHorizontal: 8, // 'px-2'
    paddingVertical: 2, // 'py-0.5'
    alignSelf: "flex-start", // 'w-fit'
    flexShrink: 0, // 'shrink-0'
    gap: 4, // 'gap-1'
    overflow: "hidden", // 'overflow-hidden'
  },
  // --- Variants ---
  default: {
    borderColor: "transparent",
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    borderColor: "transparent",
    backgroundColor: theme.colors.secondary,
  },
  destructive: {
    borderColor: "transparent",
    backgroundColor: theme.colors.destructive,
  },
  outline: {
    borderColor: theme.colors.border,
    backgroundColor: "transparent",
  },
  // --- State Styles ---
  invalid: {
    borderColor: theme.colors.destructive, // 'aria-invalid:border-destructive'
    // 'ring' tidak didukung, jadi kita pakai border
  },
});

const badgeTextStyles = StyleSheet.create({
  // Base text style
  base: {
    fontSize: theme.fontSizes.xs,
    fontWeight: theme.fontWeights.medium,
    textTransform: "none", // 'whitespace-nowrap' tidak sepenuhnya didukung
    lineHeight: 16, // Menyesuaikan
  },
  // --- Variants ---
  default: {
    color: theme.colors.primaryForeground,
  },
  secondary: {
    color: theme.colors.secondaryForeground,
  },
  destructive: {
    color: theme.colors.destructiveForeground,
  },
  outline: {
    color: theme.colors.foreground,
  },
});

// Use a plain object for icon styles so color values are directly accessible
const badgeIconStyles = {
  // Base icon style ([&>svg]:size-3)
  base: {
    width: 12,
    height: 12,
  },
  // --- Variants (untuk warna) ---
  default: {
    color: theme.colors.primaryForeground,
  },
  secondary: {
    color: theme.colors.secondaryForeground,
  },
  destructive: {
    color: theme.colors.destructiveForeground,
  },
  outline: {
    color: theme.colors.foreground,
  },
} as const;

// Ekspor gabungan agar sesuai dengan 'badgeVariants'
const badgeVariants = {
  container: badgeContainerStyles,
  text: badgeTextStyles,
  icon: badgeIconStyles,
};

// --- 3. Tipe Props ---
type BadgeVariant = keyof typeof badgeContainerStyles;
type BadgeProps = ViewProps & {
  variant?: BadgeVariant;
  asChild?: boolean;
  invalid?: boolean;
  /** Style untuk Text di dalam badge */
  textStyle?: StyleProp<TextStyle>;
};

// --- 4. Komponen <Badge> ---

const Badge = React.forwardRef<View, BadgeProps>(
  (
    {
      variant = "default",
      asChild = false,
      invalid = false,
      style,
      textStyle,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot.View : View;

    // Logika untuk men-style anak-anak (children) secara otomatis
    const styledChildren = React.useMemo(() => {
      // Some container variants (e.g. 'invalid') don't have matching text/icon variants.
      // Resolve a safe key for text/icon lookups and fall back to 'default'.
      const textKey = (
        variant in badgeVariants.text ? variant : "default"
      ) as keyof typeof badgeTextStyles;
      const iconKey = (
        variant in badgeVariants.icon ? variant : "default"
      ) as keyof typeof badgeIconStyles;
      // Ensure we don't pick the 'base' key for icon color lookup (base has width/height only).
      const resolvedIconKey =
        iconKey === "base"
          ? ("default" as keyof typeof badgeIconStyles)
          : iconKey;

      const textStyles = [
        badgeVariants.text.base,
        badgeVariants.text[textKey],
        textStyle, // Style text dari parent
      ];
      const iconColor = (
        badgeVariants.icon[resolvedIconKey] as { color: string }
      ).color;

      return React.Children.map(children, (child) => {
        // 1. Jika anak adalah string, bungkus dengan <Text>
        if (typeof child === "string") {
          return <Text style={textStyles}>{child}</Text>;
        }

        // 2. Jika anak adalah <Text>, clone dan suntik style
        if (React.isValidElement(child) && child.type === Text) {
          const typedChild = child as React.ReactElement<{
            style?: StyleProp<TextStyle>;
          }>;
          return React.cloneElement(typedChild, {
            style: [textStyles, typedChild.props.style],
          });
        }

        // 3. Jika anak adalah elemen (asumsi ikon), clone dan suntik style
        if (React.isValidElement(child)) {
          const typedChild = child as React.ReactElement<{
            style?: StyleProp<ViewStyle>;
            size?: number;
            color?: string;
          }>;
          return React.cloneElement(typedChild, {
            style: [badgeVariants.icon.base, typedChild.props.style],
            size: 12, // 'size-3'
            color: typedChild.props.color ?? iconColor, // 'text-current'
          });
        }

        // 4. Fallback
        return child;
      });
    }, [children, variant, textStyle]);

    return (
      <Comp
        ref={ref}
        style={[
          badgeVariants.container.base,
          badgeVariants.container[variant],
          invalid && badgeVariants.container.invalid,
          style, // Style dari parent
        ]}
        {...props}
      >
        {styledChildren}
      </Comp>
    );
  }
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
