import { ThemedText } from "@/components/themed-text";
import { StyleProp, TextStyle, TouchableOpacity, View } from "react-native";

interface TabListProps {
    tabs: string[];
    textStyle: StyleProp<TextStyle>;
    color: string;
    colorSelected: string;
    activeTab: string;
    onTabChange: (tab: string) => void;
    showIndicator?: boolean;
    backgroundColor?: string;
    backgroundColorSelected?: string;
    
}
export function TabList({ 
    tabs, 
    textStyle, 
    color, 
    colorSelected, 
    activeTab, 
    onTabChange, 
    showIndicator = true, 
    backgroundColor = 'transparent', 
    backgroundColorSelected = 'transparent' }: TabListProps) {
  return (
    <View className="flex-row items-center gap-2">
        {tabs.map((tab, index) => (
            <TouchableOpacity 
            key={index} 
            onPress={() => onTabChange(tab)} 
            className={`p-2 rounded-lg ${tab === activeTab ? `bg-${backgroundColorSelected}` : `bg-${backgroundColor}`}`}>
                <ThemedText type="title" style={[textStyle, { color: tab === activeTab ? colorSelected : color }]}>{tab}</ThemedText>
               {showIndicator && <View className={`h-1 w-${tab === activeTab ? '30%' : '0'}`} />}
            </TouchableOpacity>
        ))}
    </View>

    );
}