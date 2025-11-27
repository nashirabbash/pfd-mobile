import { CheckIcon } from "lucide-react-native";
import * as React from "react";
import {
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

// --- 1. Asumsi Theme ---
const theme = {
  colors: {
    primary: "#18181B",
    primaryForeground: "#FAFAFA",
    border: "#E4E4E7", // 'border-input'
    destructive: "#EF4444",
    // 'ring' tidak diterjemahkan langsung, kita akan fokus pada 'invalid' border
  },
};

// --- 2. Styles (CVA -> StyleSheet) ---

const styles = StyleSheet.create({
  // Style untuk <Pressable> (Root)
  root: {
    width: 16, // 'size-4'
    height: 16, // 'size-4'
    flexShrink: 0, // 'shrink-0'
    borderRadius: 4, // 'rounded-[4px]'
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
    // Shadow 'shadow-xs'
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  // Style untuk state 'checked'
  rootChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  // Style untuk state 'disabled'
  rootDisabled: {
    opacity: 0.5,
  },
  // Style untuk state 'invalid'
  rootInvalid: {
    borderColor: theme.colors.destructive,
  },

  // Style untuk <Animated.View> (Indicator)
  indicator: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  // Style untuk <CheckIcon>
  // icon style removed; CheckIcon uses size/color props directly
});

// --- 3. Tipe Props ---

type CheckboxProps = Omit<PressableProps, "style" | "onPress"> & {
  /**
   * Status 'checked' dari checkbox (controlled).
   */
  checked?: boolean;
  /**
   * Callback saat status 'checked' berubah.
   * Mengembalikan boolean 'checked' yang baru.
   */
  onCheckedChange?: (checked: boolean) => void;
  /**
   * Menampilkan style 'invalid'.
   */
  invalid?: boolean;
  /**
   * Style untuk container Pressable.
   */
  style?: StyleProp<ViewStyle>;
};

// --- 4. Komponen <Checkbox> ---

const Checkbox = React.forwardRef<View, CheckboxProps>(
  (
    {
      checked = false,
      onCheckedChange,
      invalid = false,
      disabled,
      style,
      ...props
    },
    ref
  ) => {
    // Handler untuk Pressable
    const handlePress = () => {
      if (onCheckedChange) {
        onCheckedChange(!checked);
      }
    };

    return (
      <Pressable
        ref={ref as any}
        onPress={handlePress}
        disabled={disabled}
        accessibilityRole="checkbox"
        accessibilityState={{ checked, disabled: disabled ?? undefined }}
        style={[
          styles.root,
          checked && styles.rootChecked,
          invalid && styles.rootInvalid,
          disabled && styles.rootDisabled,
          style, // Style dari parent (OVERRIDES)
        ]}
        {...props}
      >
        {/* Render Indicator (CheckIcon) secara kondisional.
          Ini mereplikasi <CheckboxPrimitive.Indicator> 
        */}
        {checked && (
          <Animated.View
            style={styles.indicator}
            entering={FadeIn.duration(100)} // Transisi
            exiting={FadeOut.duration(100)} // Transisi
          >
            <CheckIcon size={14} color={theme.colors.primaryForeground} />
          </Animated.View>
        )}
      </Pressable>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
