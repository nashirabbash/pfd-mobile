import * as React from "react";
import {
  StyleSheet,
  TextInput,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from "react-native";

// --- 1. Asumsi Theme ---
const theme = {
  colors: {
    border: "#E4E4E7", // 'border-input'
    ring: "#6366F1", // 'border-ring' (Asumsi)
    destructive: "#EF4444",
    mutedForeground: "#71717A", // 'placeholder:text-muted-foreground'
    primary: "#18181B", // 'selection:bg-primary'
    foreground: "#09090B", // 'text-base'
  },
  fontSizes: {
    sm: 14, // 'md:text-sm' (Kita default ke 'sm' untuk mobile)
  },
};

// --- 2. Styles (CVA -> StyleSheet) ---

const styles = StyleSheet.create({
  // Base style dari cva
  input: {
    height: 36, // 'h-9'
    width: "100%", // 'w-full'
    borderRadius: 6, // 'rounded-md'
    borderWidth: 1, // 'border'
    borderColor: theme.colors.border, // 'border-input'
    backgroundColor: "transparent", // 'bg-transparent'
    paddingHorizontal: 12, // 'px-3'
    paddingVertical: 8, // 'py-1' (disesuaikan untuk h-9)
    fontSize: theme.fontSizes.sm, // 'md:text-sm'
    color: theme.colors.foreground, // 'text-base'
    // Shadow 'shadow-xs'
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  // State: focused
  focused: {
    // 'focus-visible:border-ring focus-visible:ring-[3px]'
    // Kita replikasi 'ring' dengan border yang lebih tebal dan warna ring
    borderColor: theme.colors.ring,
  },
  // State: invalid
  invalid: {
    // 'aria-invalid:border-destructive'
    borderColor: theme.colors.destructive,
  },
  // State: disabled
  disabled: {
    opacity: 0.5,
  },
});

// --- 3. Tipe Props ---

type InputProps = Omit<TextInputProps, "style"> & {
  /**
   * Menggantikan 'className' dari web
   */
  style?: StyleProp<TextStyle | ViewStyle>;
  /**
   * Menentukan keyboard type dan secure text entry
   */
  type?: "text" | "password" | "email" | "number" | "tel" | "url";
  /**
   * Menerapkan style 'invalid' (menggantikan 'aria-invalid')
   */
  invalid?: boolean;
  /**
   * Convenience prop to mark input as disabled (maps to editable)
   */
  disabled?: boolean;
};

// --- 4. Komponen <Input> ---

const Input = React.forwardRef<TextInput, InputProps>(
  (
    {
      style: styleProp,
      type = "text",
      invalid = false,
      disabled,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);

    // Menerjemahkan 'type' web ke props native
    const secureTextEntry = type === "password";
    const keyboardType =
      type === "email"
        ? "email-address"
        : type === "number"
        ? "numeric"
        : type === "tel"
        ? "phone-pad"
        : type === "url"
        ? "url"
        : "default";

    // Handler untuk state focus
    const handleFocus = (e: any) => {
      setIsFocused(true);
      onFocus?.(e); // Meneruskan onFocus asli
    };
    const handleBlur = (e: any) => {
      setIsFocused(false);
      onBlur?.(e); // Meneruskan onBlur asli
    };

    return (
      <TextInput
        ref={ref}
        // Cast to TextStyle for TextInput's style prop; consumers may pass layout styles
        style={
          [
            styles.input,
            invalid && styles.invalid,
            isFocused && styles.focused,
            disabled && styles.disabled,
            styleProp, // Style dari parent (OVERRIDES)
          ] as unknown as StyleProp<TextStyle>
        }
        placeholderTextColor={theme.colors.mutedForeground}
        selectionColor={theme.colors.primary}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        editable={!disabled}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
