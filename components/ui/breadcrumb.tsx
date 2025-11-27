import * as Slot from "@rn-primitives/slot";
import { ChevronRight, MoreHorizontal } from "lucide-react-native";
import * as React from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type TextProps,
  type TextStyle,
  type ViewProps,
  type ViewStyle,
} from "react-native";

// --- 1. Asumsi Theme ---
const theme = {
  colors: {
    mutedForeground: "#71717A", // text-muted-foreground
    foreground: "#09090B", // text-foreground
  },
  fontSizes: {
    sm: 14,
  },
  fontWeights: {
    normal: "400" as const,
  },
};

// --- 2. Context (Untuk pewarisan style) ---
type BreadcrumbContextProps = {
  textStyle: StyleProp<TextStyle>;
  iconStyle: { size: number; color: string };
};

const BreadcrumbContext = React.createContext<BreadcrumbContextProps | null>(
  null
);

const useBreadcrumb = () => {
  const context = React.useContext(BreadcrumbContext);
  if (!context) {
    throw new Error(
      "Breadcrumb components must be used within <BreadcrumbList>"
    );
  }
  return context;
};

// --- 3. Komponen <Breadcrumb> (Root Wrapper) ---
const Breadcrumb = React.forwardRef<View, ViewProps>(
  ({ style, ...props }, ref) => {
    return (
      <View
        ref={ref}
        accessibilityLabel="breadcrumb"
        style={style}
        {...props}
      />
    );
  }
);
Breadcrumb.displayName = "Breadcrumb";

// --- 4. Komponen <BreadcrumbList> (Provider) ---
type BreadcrumbListProps = ViewProps & {
  textStyle?: StyleProp<TextStyle>;
};

const BreadcrumbList = React.forwardRef<View, BreadcrumbListProps>(
  ({ style, textStyle: textStyleProp, ...props }, ref) => {
    // Tentukan style default yang akan di-pass ke context
    const defaultTextStyle = [styles.listText, textStyleProp];

    // Ekstrak warna dari style untuk ikon
    const flatStyle = StyleSheet.flatten(defaultTextStyle);
    const iconColor = (flatStyle.color ??
      theme.colors.mutedForeground) as string;

    const contextValue = {
      textStyle: defaultTextStyle,
      iconStyle: {
        size: 14, // 'size-3.5' dari Separator
        color: iconColor,
      },
    };

    return (
      <BreadcrumbContext.Provider value={contextValue}>
        <View ref={ref} style={[styles.list, style]} {...props} />
      </BreadcrumbContext.Provider>
    );
  }
);
BreadcrumbList.displayName = "BreadcrumbList";

// --- 5. Komponen <BreadcrumbItem> ---
const BreadcrumbItem = React.forwardRef<View, ViewProps>(
  ({ style, ...props }, ref) => {
    return <View ref={ref} style={[styles.item, style]} {...props} />;
  }
);
BreadcrumbItem.displayName = "BreadcrumbItem";

// --- 6. Komponen <BreadcrumbLink> ---
type BreadcrumbLinkProps = PressableProps & {
  asChild?: boolean;
  textStyle?: StyleProp<TextStyle>;
  children: React.ReactNode;
};

const BreadcrumbLink = React.forwardRef<View, BreadcrumbLinkProps>(
  ({ asChild = false, style, textStyle, children, ...props }, ref) => {
    const { textStyle: contextTextStyle } = useBreadcrumb();
    const Comp = asChild ? Slot.Pressable : Pressable;

    return (
      <Comp ref={ref as any} style={style} {...props}>
        {/* Kita harus men-style children secara eksplisit */}
        {typeof children === "string" ? (
          <Text style={[contextTextStyle, styles.link, textStyle]}>
            {children}
          </Text>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
BreadcrumbLink.displayName = "BreadcrumbLink";

// --- 7. Komponen <BreadcrumbPage> (Current Page) ---
const BreadcrumbPage = React.forwardRef<Text, TextProps>(
  ({ style, ...props }, ref) => {
    const { textStyle } = useBreadcrumb();
    return (
      <Text
        ref={ref}
        accessibilityRole="link"
        aria-disabled={true}
        style={[textStyle, styles.page, style]} // Style 'page' menimpa 'textStyle'
        {...props}
      />
    );
  }
);
BreadcrumbPage.displayName = "BreadcrumbPage";

// --- 8. Komponen <BreadcrumbSeparator> ---
const BreadcrumbSeparator = React.forwardRef<View, ViewProps>(
  ({ style, children, ...props }, ref) => {
    const { iconStyle } = useBreadcrumb();

    // Logika untuk men-style ikon
    const styledChildren = React.useMemo(() => {
      if (children) {
        return React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            const typedChild = child as React.ReactElement<{
              style?: StyleProp<ViewStyle>;
              size?: number;
              color?: string;
            }>;
            return React.cloneElement(typedChild, {
              style: [styles.separatorIcon, typedChild.props.style],
              size: typedChild.props.size ?? iconStyle.size,
              color: typedChild.props.color ?? iconStyle.color,
            });
          }
          return child;
        });
      }
      // Default child
      return (
        <ChevronRight
          size={iconStyle.size}
          color={iconStyle.color}
          style={styles.separatorIcon}
        />
      );
    }, [children, iconStyle]);

    return (
      <View
        ref={ref}
        accessibilityRole="none"
        aria-hidden={true}
        style={style}
        {...props}
      >
        {styledChildren}
      </View>
    );
  }
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

// --- 9. Komponen <BreadcrumbEllipsis> ---
const BreadcrumbEllipsis = React.forwardRef<View, ViewProps>(
  ({ style, ...props }, ref) => {
    const { iconStyle } = useBreadcrumb();
    return (
      <View
        ref={ref}
        accessibilityRole="none"
        aria-hidden={true}
        accessibilityLabel="More"
        style={[styles.ellipsisContainer, style]}
        {...props}
      >
        <MoreHorizontal
          size={16} // 'size-4'
          color={iconStyle.color}
          style={styles.ellipsisIcon}
        />
      </View>
    );
  }
);
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

// --- 10. Styles ---
const styles = StyleSheet.create({
  list: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 10, // 'sm:gap-2.5'
  },
  // Style default untuk semua teks, disediakan oleh context
  listText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.mutedForeground,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6, // 'gap-1.5'
  },
  // Style khusus untuk link (hover diabaikan)
  link: {
    // Di shadcn, style 'link' hanya 'hover:text-foreground'
    // Jadi di native, tidak ada style default
  },
  // Style khusus untuk page (menimpa context)
  page: {
    color: theme.colors.foreground,
    fontWeight: theme.fontWeights.normal,
  },
  separatorIcon: {
    width: 14,
    height: 14,
  },
  ellipsisContainer: {
    width: 36, // 'size-9'
    height: 36, // 'size-9'
    alignItems: "center",
    justifyContent: "center",
  },
  ellipsisIcon: {
    width: 16, // 'size-4'
    height: 16, // 'size-4'
  },
});

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
};
