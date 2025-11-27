import * as React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ModalProps,
  type PressableProps,
  type TextProps,
  type ViewProps,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

// --- 1. Asumsi Button Variants (dari button.tsx) ---
// Kode asli Anda mengimpor 'buttonVariants', jadi kita asumsikan
// Anda memiliki file 'button.tsx' yang sudah dikonversi
// yang mengekspor 'buttonVariants' versi StyleSheet.
//
// const buttonVariants = ({ variant = 'default' }) => ({
//   pressable: variant === 'outline' ? styles.btnOutline : styles.btnDefault,
//   text: variant === 'outline' ? styles.btnTextOutline : styles.btnTextDefault,
// });
//
// Karena kita tidak memiliki file itu, kita akan MOCK gayanya di sini:
const mockButtonStyles = StyleSheet.create({
  btn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  btnDefault: {
    backgroundColor: "#18181B", // 'bg-primary'
  },
  btnOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#E4E4E7", // 'border'
  },
  textDefault: {
    color: "#FAFAFA", // 'text-primary-foreground'
  },
  textOutline: {
    color: "#18181B", // 'text-accent-foreground'
  },
});

const buttonVariants = ({ variant = "default" }: { variant?: string }) => ({
  pressable: [
    mockButtonStyles.btn,
    variant === "outline"
      ? mockButtonStyles.btnOutline
      : mockButtonStyles.btnDefault,
  ],
  text: [
    variant === "outline"
      ? mockButtonStyles.textOutline
      : mockButtonStyles.textDefault,
  ],
});

// --- 2. Asumsi Theme ---
const theme = {
  colors: {
    background: "#FFFFFF", // 'bg-background'
    border: "#E4E4E7", // 'border'
    mutedForeground: "#71717A", // 'text-muted-foreground'
  },
  fontSizes: {
    lg: 18,
    sm: 14,
  },
  fontWeights: {
    semibold: "600" as const,
  },
};

// --- 3. Context (Inti dari Radix) ---
type AlertDialogContextProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const AlertDialogContext = React.createContext<AlertDialogContextProps | null>(
  null
);

const useAlertDialog = () => {
  const context = React.useContext(AlertDialogContext);
  if (!context) {
    throw new Error("AlertDialog components must be used within <AlertDialog>");
  }
  return context;
};

// --- 4. Komponen <AlertDialog> (Root / Provider) ---

type AlertDialogProps = ViewProps & {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const AlertDialog: React.FC<AlertDialogProps> = ({
  open,
  onOpenChange,
  children,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const isControlled = open !== undefined;

  const isOpen = isControlled ? open : uncontrolledOpen;
  const setIsOpen = isControlled ? onOpenChange! : setUncontrolledOpen;

  // Provider only accepts `value` and `children`. Do not spread view props onto the Provider.
  return (
    <AlertDialogContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </AlertDialogContext.Provider>
  );
};

// --- 5. Komponen <AlertDialogTrigger> ---

type AlertDialogTriggerProps = PressableProps;

const AlertDialogTrigger = React.forwardRef<View, AlertDialogTriggerProps>(
  ({ onPress, ...props }, ref) => {
    const { setIsOpen } = useAlertDialog();
    return (
      <Pressable
        ref={ref as any}
        onPress={(e) => {
          setIsOpen(true);
          onPress?.(e);
        }}
        {...props}
      />
    );
  }
);
AlertDialogTrigger.displayName = "AlertDialogTrigger";

// --- 6. Komponen <AlertDialogPortal> (Modal) ---

const AlertDialogPortal: React.FC<ModalProps> = ({ children, ...props }) => {
  const { isOpen, setIsOpen } = useAlertDialog();
  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="none"
      onRequestClose={() => setIsOpen(false)} // Android back button
      {...props}
    >
      {/* Wrapper untuk memusatkan konten */}
      <View style={styles.portalWrapper}>{children}</View>
    </Modal>
  );
};

// --- 7. Komponen <AlertDialogOverlay> (Backdrop) ---

const AlertDialogOverlay = React.forwardRef<View, ViewProps>(
  ({ style, ...props }, ref) => {
    const { setIsOpen } = useAlertDialog();
    return (
      <Pressable
        onPress={() => setIsOpen(false)}
        style={StyleSheet.absoluteFill}
      >
        <Animated.View
          ref={ref as any}
          style={[styles.overlay, style]}
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          {...props}
        />
      </Pressable>
    );
  }
);
AlertDialogOverlay.displayName = "AlertDialogOverlay";

// --- 8. Komponen <AlertDialogContent> (Content Box) ---

const AlertDialogContent = React.forwardRef<View, ViewProps>(
  ({ style, ...props }, ref) => {
    return (
      <Animated.View
        ref={ref as any}
        style={[styles.content, style]}
        // Simplified animations: combine methods may not exist on some Reanimated versions.
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        {...props}
      />
    );
  }
);
AlertDialogContent.displayName = "AlertDialogContent";

// --- 9. Komponen <AlertDialogHeader> ---

const AlertDialogHeader = React.forwardRef<View, ViewProps>(
  ({ style, ...props }, ref) => {
    return <View ref={ref} style={[styles.header, style]} {...props} />;
  }
);
AlertDialogHeader.displayName = "AlertDialogHeader";

// --- 10. Komponen <AlertDialogFooter> ---

const AlertDialogFooter = React.forwardRef<View, ViewProps>(
  ({ style, ...props }, ref) => {
    return <View ref={ref} style={[styles.footer, style]} {...props} />;
  }
);
AlertDialogFooter.displayName = "AlertDialogFooter";

// --- 11. Komponen <AlertDialogTitle> ---

const AlertDialogTitle = React.forwardRef<Text, TextProps>(
  ({ style, ...props }, ref) => {
    return <Text ref={ref} style={[styles.title, style]} {...props} />;
  }
);
AlertDialogTitle.displayName = "AlertDialogTitle";

// --- 12. Komponen <AlertDialogDescription> ---

const AlertDialogDescription = React.forwardRef<Text, TextProps>(
  ({ style, ...props }, ref) => {
    return <Text ref={ref} style={[styles.description, style]} {...props} />;
  }
);
AlertDialogDescription.displayName = "AlertDialogDescription";

// --- 13. Komponen <AlertDialogAction> ---

const AlertDialogAction = React.forwardRef<View, PressableProps>(
  ({ style, children, ...props }, ref) => {
    const variantStyle = buttonVariants({ variant: "default" });
    return (
      <Pressable
        ref={ref as any}
        // Cast to any to satisfy Pressable's style overloads (array | function)
        style={[variantStyle.pressable, style] as unknown as any}
        {...props}
      >
        {typeof children === "string" ? (
          <Text style={variantStyle.text}>{children}</Text>
        ) : (
          children
        )}
      </Pressable>
    );
  }
);
AlertDialogAction.displayName = "AlertDialogAction";

// --- 14. Komponen <AlertDialogCancel> ---

const AlertDialogCancel = React.forwardRef<View, PressableProps>(
  ({ style, children, onPress, ...props }, ref) => {
    const { setIsOpen } = useAlertDialog();
    const variantStyle = buttonVariants({ variant: "outline" });
    return (
      <Pressable
        ref={ref as any}
        onPress={(e) => {
          setIsOpen(false);
          onPress?.(e);
        }}
        // Cast to any to satisfy Pressable's style overloads (array | function)
        style={[variantStyle.pressable, style] as unknown as any}
        {...props}
      >
        {typeof children === "string" ? (
          <Text style={variantStyle.text}>{children}</Text>
        ) : (
          children
        )}
      </Pressable>
    );
  }
);
AlertDialogCancel.displayName = "AlertDialogCancel";

// --- 15. Styles ---
const styles = StyleSheet.create({
  portalWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // 'bg-black/50'
  },
  content: {
    backgroundColor: theme.colors.background, // 'bg-background'
    borderRadius: 8, // 'rounded-lg'
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 24, // 'p-6'
    gap: 16, // 'gap-4'
    width: "90%", // 'w-full max-w-[calc(100%-2rem)]'
    maxWidth: 512, // 'sm:max-w-lg'
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: 8, // 'gap-2'
    // 'text-center sm:text-left' -> Native default adalah 'left'
    // Untuk 'center', parent harus menambahkan 'alignItems: 'center''
  },
  footer: {
    display: "flex",
    gap: 8, // 'gap-2'
    // 'flex-col-reverse sm:flex-row sm:justify-end'
    // Kita default ke 'sm:' (mobile-first)
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  title: {
    fontSize: theme.fontSizes.lg,
    fontWeight: theme.fontWeights.semibold,
  },
  description: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.mutedForeground,
  },
});

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
};
