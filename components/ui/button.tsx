import * as Slot from "@rn-primitives/slot";
import * as React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";

// --- 1. Asumsi Theme ---
const theme = {
  colors: {
    primary: "#18181B",
    primaryForeground: "#FAFAFA",
    destructive: "#EF4444",
    destructiveForeground: "#FAFAFA",
    background: "#FFFFFF",
    border: "#E4E4E7",
    accent: "#F4F4F5",
    accentForeground: "#18181B",
    secondary: "#F4F4F5",
    secondaryForeground: "#18181B",
  },
  fontSizes: {
    sm: 14,
  },
  fontWeights: {
    medium: "500" as const,
  },
};

// --- 2. Styles (CVA -> StyleSheet) ---
// Kita pisahkan style untuk Pressable (container), Text (anak), dan Icon (anak)

const pressableStyles = StyleSheet.create({
  // Base style dari cva
  base: {
    flexDirection: "row", // 'inline-flex'
    alignItems: "center", // 'items-center'
    justifyContent: "center", // 'justify-center'
    gap: 8, // 'gap-2'
    borderRadius: 6, // 'rounded-md'
    flexShrink: 0, // 'shrink-0'
  },
  // Variant: default
  default: {
    backgroundColor: theme.colors.primary,
  },
  // Variant: destructive
  destructive: {
    backgroundColor: theme.colors.destructive,
  },
  // Variant: outline
  outline: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  // Variant: secondary
  secondary: {
    backgroundColor: theme.colors.secondary,
  },
  // Variant: ghost
  ghost: {
    backgroundColor: "transparent",
  },
  // Variant: link
  link: {
    backgroundColor: "transparent",
  },
  // Size: default
  defaultSize: {
    height: 36, // 'h-9'
    paddingHorizontal: 16, // 'px-4'
    paddingVertical: 8, // 'py-2'
  },
  // Size: sm
  smSize: {
    height: 32, // 'h-8'
    paddingHorizontal: 12, // 'px-3'
    gap: 6, // 'gap-1.5'
  },
  // Size: lg
  lgSize: {
    height: 40, // 'h-10'
    paddingHorizontal: 24, // 'px-6'
  },
  // Size: icon
  iconSize: {
    width: 36, // 'size-9'
    height: 36,
  },
  // Size: icon-sm
  iconSmSize: {
    width: 32, // 'size-8'
    height: 32,
  },
  // Size: icon-lg
  iconLgSize: {
    width: 40, // 'size-10'
    height: 40,
  },
  // State: disabled
  disabled: {
    opacity: 0.5,
  },
  // State: invalid
  invalid: {
    borderColor: theme.colors.destructive,
    borderWidth: 1,
  },
});

// Style untuk padding 'has:[>svg]'
const paddingWithIcon = {
  default: { paddingHorizontal: 12 }, // 'px-3'
  sm: { paddingHorizontal: 10 }, // 'px-2.5'
  lg: { paddingHorizontal: 16 }, // 'px-4'
};

const textStyles = StyleSheet.create({
  // Base text style
  base: {
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.medium,
  },
  // Variant: default
  default: {
    color: theme.colors.primaryForeground,
  },
  // Variant: destructive
  destructive: {
    color: theme.colors.destructiveForeground,
  },
  // Variant: outline
  outline: {
    color: theme.colors.primary, // fallback to primary color for outline
  },
  // Variant: secondary
  secondary: {
    color: theme.colors.secondaryForeground,
  },
  // Variant: ghost
  ghost: {
    color: theme.colors.primary, // fallback to primary color for ghost
  },
  // Variant: link
  link: {
    color: theme.colors.primary,
    textDecorationLine: "underline",
  },
});

const iconStyles = {
  // Base icon style
  base: {
    width: 16, // 'size-4'
    height: 16,
    color: theme.colors.primaryForeground,
  },
  // Warna ikon berdasarkan variant (sama seperti teks)
  default: { color: theme.colors.primaryForeground },
  destructive: { color: theme.colors.destructiveForeground },
  outline: { color: theme.colors.primary },
  secondary: { color: theme.colors.secondaryForeground },
  ghost: { color: theme.colors.primary },
  link: { color: theme.colors.primary },
};

// --- 3. Tipe Props ---

type ButtonVariant = keyof typeof textStyles;
type ButtonSize = "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg";

// Ganti nama prop agar tidak bentrok dengan RN `StyleSheet`
type ButtonProps = PressableProps & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  invalid?: boolean;
  style?: StyleProp<ViewStyle>;
  /** Style untuk Text di dalam button */
  textStyle?: StyleProp<TextStyle>;
};

// --- 4. Komponen <Button> ---

const Button = React.forwardRef<View, ButtonProps>(
  (
    {
      variant = "default",
      size = "default",
      asChild = false,
      invalid = false,
      disabled,
      style,
      textStyle: textStyleProp,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot.Pressable : Pressable;
    let hasIcon = false;
    const isIconOnly = size.startsWith("icon");

    // Tentukan style Text dan Icon untuk disuntikkan
    const textVariantStyle = [
      textStyles.base,
      textStyles[variant],
      textStyleProp,
    ];
    const iconVariantProps = {
      ...iconStyles.base,
      color: iconStyles[variant].color,
    };

    // Proses children untuk menyuntikkan style
    // Guard: Pressable children can be a render function (state) => ReactNode.
    // If children is a function, pass it through untouched.
    const styledChildren =
      typeof children === "function"
        ? (children as any)
        : React.Children.map(children, (child) => {
            // 1. Jika anak adalah string, bungkus dengan <Text>
            if (typeof child === "string") {
              return <Text style={textVariantStyle}>{child}</Text>;
            }

            // 2. Jika anak adalah <Text>, clone dan suntik style
            if (React.isValidElement(child) && child.type === Text) {
              const typedChild = child as React.ReactElement<{
                style?: StyleProp<TextStyle>;
              }>;
              return React.cloneElement(typedChild, {
                style: [textVariantStyle, typedChild.props.style],
              });
            }

            // 3. Jika anak adalah elemen lain (asumsi ikon)
            if (React.isValidElement(child)) {
              hasIcon = true; // Tandai bahwa kita menemukan ikon
              const typedChild = child as React.ReactElement<{
                style?: StyleProp<ViewStyle>;
                size?: number;
                color?: string;
              }>;
              return React.cloneElement(typedChild, {
                style: [iconVariantProps, typedChild.props.style],
                size: typedChild.props.size ?? iconVariantProps.width,
                color: typedChild.props.color ?? iconVariantProps.color,
              });
            }
            return child;
          });

    // Map nama size ke style
    const sizeStyleKey = `${size}Size` as keyof typeof pressableStyles;

    return (
      <Comp
        ref={ref as any}
        accessibilityRole="button"
        disabled={disabled}
        style={[
          pressableStyles.base,
          pressableStyles[variant],
          pressableStyles[sizeStyleKey] ?? pressableStyles.defaultSize,
          // Ini adalah replikasi 'has:[>svg]'
          hasIcon &&
            !isIconOnly &&
            paddingWithIcon[size as "default" | "sm" | "lg"],
          invalid && pressableStyles.invalid,
          disabled && pressableStyles.disabled,
          style, // Style dari parent (OVERRIDES)
        ]}
        {...props}
      >
        {styledChildren as React.ReactNode}
      </Comp>
    );
  }
);
Button.displayName = "Button";

// --- 5. Ekspor Varian ---
const buttonVariants = {
  pressable: pressableStyles,
  text: textStyles,
  icon: iconStyles,
  paddingWithIcon: paddingWithIcon,
};

export { Button, buttonVariants };
