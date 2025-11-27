import * as LabelPrimitive from "@rn-primitives/label";
import * as React from "react";
import {
  Platform,
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
  fontSizes: {
    sm: 14,
  },
  fontWeights: {
    medium: "500" as const,
  },
};

// --- 2. Styles (CVA -> StyleSheet) ---

const styles = StyleSheet.create({
  // Style untuk <LabelPrimitive.Root>
  root: {
    display: "flex", // 'flex'
    flexDirection: "row", // 'flex-row'
    alignItems: "center", // 'items-center'
    gap: 8, // 'gap-2'
    ...Platform.select({
      web: {
        userSelect: "none", // 'select-none'
      } as any,
    }),
  },
  // Style untuk <LabelPrimitive.Text>
  text: {
    color: theme.colors.foreground, // 'text-foreground'
    fontSize: theme.fontSizes.sm, // 'text-sm'
    fontWeight: theme.fontWeights.medium, // 'font-medium'
    ...Platform.select({
      web: {
        lineHeight: theme.fontSizes.sm, // 'leading-none'
      } as any,
    }),
  },
  // Style untuk state 'disabled'
  disabled: {
    opacity: 0.5,
  },
});

// --- 3. Tipe Props ---
// Use ComponentPropsWithoutRef/ElementRef to avoid depending on primitive-specific
// type aliases which may not exist or vary between implementations.
type RootProps = React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>;
type TextProps = React.ComponentPropsWithoutRef<typeof LabelPrimitive.Text>;

type LabelProps = Omit<RootProps, "style" | "children"> &
  Omit<TextProps, "style" | "children"> & {
    /** Style untuk container <View> (Root) */
    rootStyle?: StyleProp<ViewStyle>;
    /** Style untuk komponen <Text> (menggantikan 'className') */
    style?: StyleProp<TextStyle>;
  };

// --- 4. Komponen <Label> ---

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Text>,
  LabelProps
>(
  (
    {
      style, // Ini untuk Text
      rootStyle, // Ini untuk Root
      onPress,
      onLongPress,
      onPressIn,
      onPressOut,
      disabled,
      ...textProps // Sisa props (termasuk 'children') adalah untuk Text
    },
    ref
  ) => {
    // Combine styles and cast to StyleProp to satisfy primitive typings
    const rootCombined = [
      styles.root,
      disabled && styles.disabled,
      rootStyle,
    ] as unknown as StyleProp<ViewStyle>;

    const textCombined = [
      styles.text,
      style,
    ] as unknown as StyleProp<TextStyle>;

    return (
      <LabelPrimitive.Root
        style={rootCombined as any}
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled}
      >
        <LabelPrimitive.Text
          ref={ref}
          style={textCombined as any}
          {...textProps}
        />
      </LabelPrimitive.Root>
    );
  }
);
Label.displayName = "Label";

export { Label };
