import { ChevronDownIcon } from "lucide-react-native";
import * as React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

// --- 1. Asumsi Theme ---
const theme = {
  colors: {
    border: "#E5E7EB", // border-b
    mutedForeground: "#6B7280", // text-muted-foreground
  },
  fontSizes: {
    sm: 14,
  },
  fontWeights: {
    medium: "500" as const,
  },
};

// --- 2. Context untuk Accordion (Root) ---
// Mengelola item mana yang aktif
type AccordionContextProps = {
  value: string | string[] | undefined;
  onValueChange: (value: string) => void;
  type: "single" | "multiple";
  collapsible: boolean;
};

const AccordionContext = React.createContext<AccordionContextProps | null>(
  null
);

const useAccordion = () => {
  const context = React.useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion component must be used within <Accordion>");
  }
  return context;
};

// --- 3. Context untuk AccordionItem ---
// Memberi tahu Trigger/Content tentang state item spesifik ini
type AccordionItemContextProps = {
  value: string;
  isOpen: boolean;
};

const AccordionItemContext =
  React.createContext<AccordionItemContextProps | null>(null);

const useAccordionItem = () => {
  const context = React.useContext(AccordionItemContext);
  if (!context) {
    throw new Error(
      "AccordionItem compound component must be used within <AccordionItem>"
    );
  }
  return context;
};

// --- 4. Komponen <Accordion> (Root) ---

type AccordionProps = ViewProps &
  (
    | {
        type: "single";
        value?: string;
        defaultValue?: string;
        onValueChange?: (value: string | undefined) => void;
        collapsible?: boolean;
      }
    | {
        type: "multiple";
        value?: string[];
        defaultValue?: string[];
        onValueChange?: (value: string[]) => void;
        collapsible?: boolean;
      }
  );

const Accordion = React.forwardRef<View, AccordionProps>(
  (
    {
      type = "single",
      collapsible = false,
      defaultValue,
      value: controlledValue,
      onValueChange: setControlledValue,
      style,
      children,
      ...props
    },
    ref
  ) => {
    // Logika state (controlled vs uncontrolled)
    const [uncontrolledValue, setUncontrolledValue] =
      React.useState(defaultValue);
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : uncontrolledValue;
    const onValueChange = isControlled
      ? setControlledValue
      : setUncontrolledValue;

    // Handler untuk mengubah state
    const handleValueChange = React.useCallback(
      (itemValue: string) => {
        if (type === "multiple") {
          const S = new Set(value as string[] | undefined);
          if (S.has(itemValue)) {
            S.delete(itemValue);
          } else {
            S.add(itemValue);
          }
          (onValueChange as (val: string[]) => void)?.(Array.from(S));
        } else {
          const newValue =
            value === itemValue && collapsible ? undefined : itemValue;
          (onValueChange as (val: string | undefined) => void)?.(newValue);
        }
      },
      [type, value, collapsible, onValueChange]
    );

    // Ini trik untuk style: 'last:border-b-0'
    // Kita inject prop '__isLast' ke child terakhir
    const childCount = React.Children.count(children);
    const childrenWithProps = React.Children.map(children, (child, index) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          __isLast: index === childCount - 1,
        } as any);
      }
      return child;
    });

    return (
      <AccordionContext.Provider
        value={{
          value: value,
          onValueChange: handleValueChange,
          type: type,
          collapsible: collapsible,
        }}
      >
        <View ref={ref} style={style} {...props}>
          {childrenWithProps}
        </View>
      </AccordionContext.Provider>
    );
  }
);
Accordion.displayName = "Accordion";

// --- 5. Komponen <AccordionItem> ---

const itemStyles = StyleSheet.create({
  item: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  itemLast: {
    borderBottomWidth: 0,
  },
});

type AccordionItemProps = ViewProps & {
  value: string;
  __isLast?: boolean; // Prop internal dari <Accordion>
};

const AccordionItem = React.forwardRef<View, AccordionItemProps>(
  ({ style, value: itemValue, __isLast, children, ...props }, ref) => {
    const { value, type } = useAccordion();

    // Cek apakah item ini sedang terbuka
    const isOpen =
      type === "multiple"
        ? (value as string[])?.includes(itemValue)
        : value === itemValue;

    // Menggabungkan style (termasuk override untuk 'last')
    const finalStyle = [
      itemStyles.item,
      __isLast && itemStyles.itemLast,
      style, // Style dari parent diletakkan terakhir
    ];

    return (
      <AccordionItemContext.Provider value={{ value: itemValue, isOpen }}>
        <View ref={ref} style={finalStyle} {...props}>
          {children}
        </View>
      </AccordionItemContext.Provider>
    );
  }
);
AccordionItem.displayName = "AccordionItem";

// --- 6. Komponen <AccordionTrigger> ---

const triggerStyles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    flex: 1,
    alignItems: "flex-start", // 'items-start'
    justifyContent: "space-between",
    paddingVertical: 16, // 'py-4'
  },
  childrenContainer: {
    flex: 1,
    marginRight: 16, // 'gap-4'
  },
  text: {
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.medium,
    textAlign: "left",
  },
  icon: {
    width: 16, // 'size-4'
    height: 16, // 'size-4'
    flexShrink: 0, // 'shrink-0'
    color: theme.colors.mutedForeground,
    transform: [{ translateY: 2 }], // 'translate-y-0.5'
  },
});

type AccordionTriggerProps = PressableProps & {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

const AccordionTrigger = React.forwardRef<View, AccordionTriggerProps>(
  ({ style, children, ...props }, ref) => {
    const { onValueChange } = useAccordion();
    const { value: itemValue, isOpen } = useAccordionItem();

    // Setup animasi untuk ikon
    const rotation = useSharedValue(0);
    React.useEffect(() => {
      rotation.value = withTiming(isOpen ? 180 : 0, { duration: 200 });
    }, [isOpen, rotation]);

    const animatedIconStyle = useAnimatedStyle(() => {
      return {
        transform: [{ rotate: `${rotation.value}deg` }],
      };
    });

    return (
      // <AccordionPrimitive.Header> di-flat menjadi <Pressable>
      <Pressable
        onPress={() => onValueChange(itemValue)}
        style={[triggerStyles.trigger, style]}
        {...props}
        ref={ref}
      >
        {/* Child harus dibungkus agar 'flex: 1' berfungsi */}
        <View style={triggerStyles.childrenContainer}>
          {/* Jika child adalah string, bungkus dengan <Text> */}
          {typeof children === "string" ? (
            <Text style={triggerStyles.text}>{children}</Text>
          ) : (
            children
          )}
        </View>
        <Animated.View style={animatedIconStyle}>
          <ChevronDownIcon style={triggerStyles.icon} />
        </Animated.View>
      </Pressable>
    );
  }
);
AccordionTrigger.displayName = "AccordionTrigger";

// --- 7. Komponen <AccordionContent> ---

const contentStyles = StyleSheet.create({
  // Wrapper luar untuk 'overflow: hidden' dan animasi tinggi
  animatedWrapper: {
    overflow: "hidden",
  },
  // Wrapper dalam untuk padding dan pengukuran
  contentContainer: {
    paddingBottom: 16, // 'pb-4'
    paddingTop: 0, // 'pt-0'
  },
  text: {
    fontSize: theme.fontSizes.sm,
  },
});

type AccordionContentProps = ViewProps;

const AccordionContent = React.forwardRef<View, AccordionContentProps>(
  ({ style, children, ...props }, ref) => {
    const { isOpen } = useAccordionItem();

    // State untuk menyimpan tinggi konten asli
    const [contentHeight, setContentHeight] = React.useState(0);

    // Animasi 'height' dari 0 ke 'auto' (contentHeight)
    const animatedStyle = useAnimatedStyle(() => {
      return {
        height: withTiming(isOpen ? contentHeight : 0, { duration: 200 }),
        opacity: withTiming(isOpen ? 1 : 0, { duration: 200 }),
      };
    });

    return (
      <Animated.View style={[contentStyles.animatedWrapper, animatedStyle]}>
        <View
          ref={ref}
          style={[contentStyles.contentContainer, style]}
          // Mengukur tinggi konten saat di-layout
          onLayout={(e) => setContentHeight(e.nativeEvent.layout.height)}
          {...props}
        >
          {typeof children === "string" ? (
            <Text style={contentStyles.text}>{children}</Text>
          ) : (
            children
          )}
        </View>
      </Animated.View>
    );
  }
);
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
