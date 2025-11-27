import { MinusIcon } from "lucide-react-native";
import * as React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type PressableProps,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

// --- 1. Asumsi Theme ---
const theme = {
  colors: {
    border: "#6F797A", // 'border-input'
    ring: "#000", // 'border-ring' (Asumsi)
    destructive: "#EF4444",
    foreground: "#09090B", // 'text-sm'
  },
  fontSizes: {
    sm: 14,
  },
};

// --- 2. Context (Inti Logika) ---
type InputOTPContextProps = {
  value: string;
  setValue: (value: string) => void;
  maxLength: number;
  isFocused: boolean;
  invalid?: boolean;
};

const InputOTPContext = React.createContext<InputOTPContextProps | null>(null);

const useInputOTP = () => {
  const context = React.useContext(InputOTPContext);
  if (!context) {
    throw new Error("InputOTP components must be used within <InputOTP>");
  }
  return context;
};

// --- 3. Komponen <InputOTP> (Root / Provider) ---

type InputOTPProps = PressableProps & {
  maxLength: number;
  value?: string;
  onValueChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  invalid?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

const InputOTP = React.forwardRef<View, InputOTPProps>(
  (
    {
      maxLength,
      value: controlledValue,
      onValueChange,
      onComplete,
      invalid = false,
      disabled,
      containerStyle,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const textInputRef = React.useRef<TextInput>(null);
    const [uncontrolledValue, setUncontrolledValue] = React.useState("");
    const [isFocused, setIsFocused] = React.useState(false);

    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : uncontrolledValue;

    const setValue = (newValue: string) => {
      if (newValue.length > maxLength) return;

      if (!isControlled) {
        setUncontrolledValue(newValue);
      }
      onValueChange?.(newValue);
      if (newValue.length === maxLength) {
        onComplete?.(newValue);
      }
    };

    const handlePress = () => {
      textInputRef.current?.focus();
    };

    return (
      <InputOTPContext.Provider
        value={{ value, setValue, maxLength, isFocused, invalid }}
      >
        <Pressable
          ref={ref as any}
          style={[
            styles.container,
            containerStyle,
            disabled && styles.disabled,
          ]}
          disabled={disabled}
          onPress={handlePress}
          {...props}
        >
          {children}
        </Pressable>
        <TextInput
          ref={textInputRef}
          value={value}
          onChangeText={setValue}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          style={styles.hiddenInput}
          editable={!disabled}
        />
      </InputOTPContext.Provider>
    );
  }
);
InputOTP.displayName = "InputOTP";

// --- 4. Komponen <InputOTPGroup> ---

const InputOTPGroup = React.forwardRef<View, ViewProps>(
  ({ style, ...props }, ref) => {
    // Menyuntikkan prop isFirst/isLast ke anak
    const childrenWithProps = React.Children.toArray(props.children).filter(
      React.isValidElement
    );
    const totalSlots = childrenWithProps.length;

    return (
      <View ref={ref} style={[styles.group, style]} {...props}>
        {React.Children.map(childrenWithProps, (child, index) => {
          if (
            child.type &&
            (child.type as any).displayName === "InputOTPSlot"
          ) {
            return React.cloneElement(child, {
              isFirst: index === 0,
              isLast: index === totalSlots - 1,
            } as any);
          }
          return child;
        })}
      </View>
    );
  }
);
InputOTPGroup.displayName = "InputOTPGroup";

// --- 5. Komponen <InputOTPSlot> ---

type InputOTPSlotProps = ViewProps & {
  index: number;
  isFirst?: boolean; // Disuntik oleh InputOTPGroup
  isLast?: boolean; // Disuntik oleh InputOTPGroup
};

const InputOTPSlot = React.forwardRef<View, InputOTPSlotProps>(
  ({ style, index, isFirst, isLast, ...props }, ref) => {
    const { value, isFocused, invalid, maxLength } = useInputOTP();
    const char = value[index];
    const isActive = isFocused && value.length === index && index < maxLength;

    return (
      <View
        ref={ref}
        style={[
          styles.slot,
          isFirst && styles.slotFirst,
          isLast && styles.slotLast,
          invalid && styles.slotInvalid,
          isActive && styles.slotActive,
          isActive && invalid && styles.slotActiveInvalid,
          style,
        ]}
        {...props}
      >
        <Text style={styles.slotText}>{char}</Text>
        {isActive && <BlinkingCaret />}
      </View>
    );
  }
);
InputOTPSlot.displayName = "InputOTPSlot";

// Helper Komponen Caret
const BlinkingCaret = () => {
  const opacity = useSharedValue(1);

  React.useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 500 }),
        withTiming(1, { duration: 500 })
      ),
      -1 // Ulangi selamanya
    );
    return () => {
      cancelAnimation(opacity);
    };
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return <Animated.View style={[styles.caret, animatedStyle]} />;
};

// --- 6. Komponen <InputOTPSeparator> ---

const InputOTPSeparator = React.forwardRef<View, ViewProps>(
  ({ style, ...props }, ref) => {
    return (
      <View ref={ref} style={[styles.separator, style]} {...props}>
        <MinusIcon size={16} color={theme.colors.border} />
      </View>
    );
  }
);
InputOTPSeparator.displayName = "InputOTPSeparator";

// --- 7. Styles ---
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  hiddenInput: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0,
    width: 0,
    height: 0,
  },
  group: {
    flexDirection: "row",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  slot: {
    width: 36, // 'w-9'
    height: 36, // 'h-9'
    borderWidth: 1, // 'border-y border-r'
    borderColor: theme.colors.border,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    // Shadow 'shadow-xs'
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  slotFirst: {
    borderLeftWidth: 1, // 'first:border-l'
    borderTopLeftRadius: 6, // 'first:rounded-l-md'
    borderBottomLeftRadius: 6,
  },
  slotLast: {
    borderTopRightRadius: 6, // 'last:rounded-r-md'
    borderBottomRightRadius: 6,
  },
  slotText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.foreground,
  },
  slotActive: {
    // 'data-[active=true]:border-ring ... data-[active=true]:ring-[3px]'
    borderColor: theme.colors.ring,
    borderWidth: 1.5,
  },
  slotInvalid: {
    // 'aria-invalid:border-destructive'
    borderColor: theme.colors.destructive,
  },
  slotActiveInvalid: {
    // 'data-[active=true]:aria-invalid:border-destructive'
    borderColor: theme.colors.destructive,
  },
  caret: {
    // 'animate-caret-blink bg-foreground h-4 w-px'
    position: "absolute",
    width: 1.5,
    height: 16,
    backgroundColor: theme.colors.foreground,
  },
  separator: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot };
