import { AvatarList } from "@/components/icons/icons";
import { View } from "react-native";

export const AvatarItem = ({
  nameIcon,
  color,
  size,
  ...props
}: {
  nameIcon: keyof typeof AvatarList;
  color: string;
  size: number;
}) => {
  const Avatar = AvatarList[nameIcon as keyof typeof AvatarList];

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        ...props,
      }}
    >
      <Avatar width={size} height={size} />
    </View>
  );
};
