import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { THEME } from "@/src/theme/theme";
import { Bell, BookOpen, Filter, HelpCircle, LogOut, MessageCircle, Phone, Search, Settings, UserCircle } from "lucide-react-native";
import { Platform, StyleSheet, TouchableOpacity, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "../icon";

interface NavBarProps {
  children?: React.ReactNode;
  showSearchButton?: boolean;
  showNotificationButton?: boolean;
  showProfileButton?: boolean;
  showSettingsButton?: boolean;
  showLogoutButton?: boolean;
  showHelpButton?: boolean;
  showFeedbackButton?: boolean;
  showAboutButton?: boolean;
  showContactButton?: boolean;
  showFilterButton?: boolean;
  showComponent?: React.ReactNode;
}
export function NavBar({
children,
showLogoutButton =  false,
showSearchButton = false,
showNotificationButton = false,
showProfileButton = false,
showSettingsButton = false,
showHelpButton = false,
showFeedbackButton = false,
showAboutButton = false,
showContactButton = false,
showFilterButton = false,
showComponent = null,
}: NavBarProps) {
const colorScheme = useColorScheme();
const theme = THEME[colorScheme ?? 'light'];
const styles = createStyles(theme);
const insets = useSafeAreaInsets();
const themeBackgroundColor = useThemeColor({}, 'background');

  const elevation = 0;
  return (

      <ThemedView
        style={styles.container}
      >
        <View style={styles.leftSection}>
          {children}
        </View>

        <View style={styles.rightSection}>
          {showSearchButton && (
            <TouchableOpacity style={styles.iconItem} onPress={() => {}}>
              <Icon as={Search} size={24} color={theme.mutedForeground} />
            </TouchableOpacity>
          )}
          {showNotificationButton && (
            <TouchableOpacity style={styles.iconItem} onPress={() => {}}>
              <Icon as={Bell} size={24} color={theme.mutedForeground} />
            </TouchableOpacity>
          )}
          {showProfileButton && (
            <TouchableOpacity style={styles.iconItem} onPress={() => {}}>
              <Icon as={UserCircle} size={24} color={theme.mutedForeground} />
            </TouchableOpacity>
          )}
          {showSettingsButton && (
            <TouchableOpacity style={styles.iconItem} onPress={() => {}}>
              <Icon as={Settings} size={24} color={theme.mutedForeground} />
            </TouchableOpacity>
          )}
          {showLogoutButton && (
            <TouchableOpacity style={styles.iconItem} onPress={() => {}}>
              <Icon as={LogOut} size={24} color={theme.mutedForeground} />
            </TouchableOpacity>
          )}
          {showHelpButton && (
            <TouchableOpacity style={styles.iconItem} onPress={() => {}}>
              <Icon as={HelpCircle} size={24} color={theme.mutedForeground} />
            </TouchableOpacity>
          )}
          {showFeedbackButton && (
            <TouchableOpacity style={styles.iconItem} onPress={() => {}}>
              <Icon as={MessageCircle} size={24} color={theme.mutedForeground} />
            </TouchableOpacity>
          )}
          {showAboutButton && (
            <TouchableOpacity style={styles.iconItem} onPress={() => {}}>
              <Icon as={BookOpen} size={24} color={theme.mutedForeground} />
            </TouchableOpacity>
          )}
          {showContactButton && (
            <TouchableOpacity style={styles.iconItem} onPress={() => {}}>
              <Icon as={Phone} size={24} color={theme.mutedForeground} />
            </TouchableOpacity>
          )}
          {showFilterButton && (
            <TouchableOpacity style={styles.iconItem} onPress={() => {}}>
              <Icon as={Filter} size={24} color={theme.mutedForeground} />
            </TouchableOpacity>
          )}
          {showComponent && (
            <View style={styles.iconItem}>
              {showComponent}
            </View>
          )}
          </View>



        </ThemedView>

  );
}

const createStyles = (theme: typeof THEME.light) => StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

      },
      content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        minHeight: 44,
      },
      rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 10,
      },
      leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: 16,
        paddingVertical: 12,
      },
      title: {
        fontSize: 18,
        fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
        textAlign: 'center',
      },
      iconItem: {
        alignItems: 'center',
        justifyContent: 'center',
      },
      
});