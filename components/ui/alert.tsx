import * as React from "react";
import {
  StyleSheet,
  Text,
  View,
  type StyleProp, // Sekarang terpakai
  type TextStyle, // Sekarang terpakai
  type ViewProps,
} from "react-native";

// --- 1. Theme ---
const theme = {
  colors: {
    card: "#FFFFFF",
    cardForeground: "#09090B",
    border: "#E5E7EB",
    destructive: "#EF4444",
    destructiveOpacity90: "rgba(239, 68, 68, 0.9)",
    mutedForeground: "#6B7280",
  },
  fontSizes: {
    sm: 14,
  },
  fontWeights: {
    medium: "500" as const,
  },
  letterSpacings: {
    tight: -0.5,
  },
  lineHeights: {
    relaxed: 24,
  },
};

// --- 2. Context ---
type AlertContextProps = {
  variant: "default" | "destructive";
};

const AlertContext = React.createContext<AlertContextProps | null>(null);

const useAlertContext = () => {
  const context = React.useContext(AlertContext);
  if (!context) {
    throw new Error(
      "Alert compound components must be rendered within an Alert provider"
    );
  }
  return context;
};

// --- 3. Styles ---

const alertStyles = StyleSheet.create({
  root: {
    position: "relative",
    width: "100%",
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  rootDefault: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
  },
  rootDestructive: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.destructive,
  },
  iconContainer: {
    width: 16,
    marginRight: 12,
    transform: [{ translateY: 2 }],
  },
  contentContainer: {
    flex: 1,
    gap: 2,
    minHeight: 16,
  },
});

const titleStyles = StyleSheet.create({
  title: {
    fontWeight: theme.fontWeights.medium,
    letterSpacing: theme.letterSpacings.tight,
    color: theme.colors.cardForeground,
  },
  titleDestructive: {
    color: theme.colors.destructive,
  },
});

const descriptionStyles = StyleSheet.create({
  text: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.mutedForeground,
    lineHeight: theme.lineHeights.relaxed,
  },
  textDestructive: {
    color: theme.colors.destructiveOpacity90,
  },
});

// --- 4. Alert (Root) ---

type AlertProps = ViewProps & {
  variant?: "default" | "destructive";
};

const Alert = React.forwardRef<View, AlertProps>(
  ({ style, variant = "default", children, ...props }, ref) => {
    const iconChildren: React.ReactNode[] = [];
    const contentChildren: React.ReactNode[] = [];

    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        if (
          child.type &&
          ((child.type as any).displayName === "AlertTitle" ||
            (child.type as any).displayName === "AlertDescription")
        ) {
          contentChildren.push(child);
        } else {
          iconChildren.push(child);
        }
      }
    });

    const hasIcon = iconChildren.length > 0;

    return (
      <AlertContext.Provider value={{ variant }}>
        <View
          ref={ref}
          accessibilityRole="alert"
          style={[
            alertStyles.root,
            variant === "default"
              ? alertStyles.rootDefault
              : alertStyles.rootDestructive,
            style,
          ]}
          {...props}
        >
          {hasIcon && (
            <View style={alertStyles.iconContainer}>{iconChildren}</View>
          )}

          <View
            style={[
              alertStyles.contentContainer,
              !hasIcon && { marginLeft: 0 },
            ]}
          >
            {contentChildren}
          </View>
        </View>
      </AlertContext.Provider>
    );
  }
);
Alert.displayName = "Alert";

// --- 5. AlertTitle ---

type AlertTitleProps = React.ComponentProps<typeof Text>;

const AlertTitle = React.forwardRef<Text, AlertTitleProps>(
  ({ style, ...props }, ref) => {
    const { variant } = useAlertContext();
    return (
      <Text
        ref={ref}
        numberOfLines={1}
        style={[
          titleStyles.title,
          variant === "destructive" && titleStyles.titleDestructive,
          style,
        ]}
        {...props}
      />
    );
  }
);
AlertTitle.displayName = "AlertTitle";

// --- 6. AlertDescription ---

type AlertDescriptionProps = ViewProps;

const AlertDescription = React.forwardRef<View, AlertDescriptionProps>(
  ({ style, children, ...props }, ref) => {
    const { variant } = useAlertContext();

    const styledChildren = React.Children.map(children, (child) => {
      if (typeof child === "string") {
        return (
          <Text
            style={[
              descriptionStyles.text,
              variant === "destructive" && descriptionStyles.textDestructive,
            ]}
          >
            {child}
          </Text>
        );
      }

      // --- PERBAIKAN DI SINI ---
      if (React.isValidElement(child) && child.type === Text) {
        // Kita berikan type assertion pada child untuk mengakses props
        const el = child as React.ReactElement<{
          style?: StyleProp<TextStyle>;
        }>;
        return React.cloneElement(el, {
          style: [
            descriptionStyles.text,
            variant === "destructive" && descriptionStyles.textDestructive,
            el.props.style,
          ],
        });
      }
      return child;
    });

    return (
      <View ref={ref} style={style} {...props}>
        {styledChildren}
      </View>
    );
  }
);
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertDescription, AlertTitle };
