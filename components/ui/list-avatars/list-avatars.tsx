import { AVATAR_LIST } from "@/constants/variables";
// import { useUserProfileUpdate } from "@/lib/hooks/useUserProfileUpdate";
import { Media } from "@/src/models/Media";
// import { User } from "@/lib/models/User";
// import { MediaService } from "@/lib/services/mediaService";


import { ZixAlertActions } from "@/components/ui/zix-alert-actions/zix-alert-actions";
import { Button } from '@/src/components/Button';
import { Check } from "lucide-react-native";
import { useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AvatarItem } from "../avatar-item/avatar-item";
import { ZixCart } from "../zix-cart/zix-cart";


export const ListAvatars = ({ userProfile }: { userProfile: any }) => {
  const [selectedMedia, setSelectedMedia] = useState<any | any[] | null>(
    null
  );
  const [avatarSelected, setAvatarSelected] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  // const { updateUserProfile, isLoading, error, clearError } =
  //   useUserProfileUpdate();

  const handleMediaChange = async (media: Media | Media[]) => {
    setSelectedMedia(media);
    setIsOpen(true);
  };

  const handleSaveMedia = async () => {
    // if (!selectedMedia) return;
    // setIsOpen(false);

    // const imageUrl = await MediaService.saveImageToStorage(
    //   selectedMedia.url || (selectedMedia.uri as string)
    // );
    // await updateUserProfile(userProfile.$id, {
    //   avatar: "",
    //   imageUrl: imageUrl,
    // });
    // setSelectedMedia(null);
  };

  const handleSave = async () => {
    // if (!avatarSelected) return;

    // setIsOpen(false);

    // try {
    //   await updateUserProfile(userProfile.$id, {
    //     avatar: avatarSelected,
    //   });
    //   setAvatarSelected(null);
    //   console.log("Profile updated with new avatar");
    // } catch (error) {
    //   console.error("Failed to update profile with avatar:", error);
    // }
  };
  return (
    <>
      <ZixCart>
        <FlatList
          horizontal
          keyExtractor={(item) => item.name}
          showsHorizontalScrollIndicator={false}
          data={AVATAR_LIST}
          contentContainerStyle={{
            alignItems: "center",
            padding: 4,
          }}
          // ListHeaderComponent={() => (
          //       <TouchableOpacity
          //         style={{ backgroundColor: '#f0f0f0', padding: 8, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}
          //         onPress={() => {
          //           setIsOpen(true);
          //         }}
          //         disabled={isLoading}
                  
          //       >
          //         <Plus
          //             size={20}
          //             color={'black'}
          //           />
          //       </TouchableOpacity>
              
          // )}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                marginRight: 12,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                // clearError(); // Clear any previous errors
                setAvatarSelected(item.name);
                setIsOpen(true);
              }}
            >
              <AvatarItem
                nameIcon={item.name as keyof typeof AVATAR_LIST}
                color={'#FF6B6B'}
                size={48}
              />
              {userProfile.avatar && userProfile.avatar === item.name && (
                <View
                  style={{
                    backgroundColor: '#FF6B6B',
                    borderRadius: 8,
                    padding: 4,
                    position: 'absolute',
                    right: 1,
                    bottom: 0,
                  }}
                >
                  <Check size={16} color={'#fff'} />
                </View>
              )}
            </TouchableOpacity>
          )}
        />
      </ZixCart>
      {avatarSelected && isOpen && (
        <ZixAlertActions
          closeButton={isOpen}
          visible={avatarSelected !== null}
          onClose={() => {
            setIsOpen(false);
            setAvatarSelected(null);
          }}
          childrenContent={
            <ZixCart>
              <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
              }}>
                <AvatarItem
                  nameIcon={avatarSelected as keyof typeof AVATAR_LIST}
                  color={'#FF6B6B'}
                  size={220}
                />
                <View style={{
                  width: '80%',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                }}>
                  <Button
                    title="Cancel"
                    onPress={() => {
                      setIsOpen(false);
                      setAvatarSelected(null);
                    }}
                    variant="primary"
                    size="large"
                    style={styles.styldButton}
                  />
                  <Button
                    title="Save"
                    onPress={handleSave}
                    variant="primary"
                    size="large"
                    style={styles.styldButton}
                  />
                </View>
                {error && (
                  <Text style={{
                    color: 'red',
                    fontSize: 16,
                    textAlign: 'center',
                  }}>
                    {error}
                  </Text>
                )}
              </View>
            </ZixCart>
          }
        />
      )}
      {selectedMedia && isOpen && (
        <ZixAlertActions
          closeButton={isOpen}
          childrenContent={
            <ZixCart>
              <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
              }}>
                <Image
                  source={{ uri: selectedMedia.uri }}
                  style={{
                    width: 220,
                    height: 220,
                  }}
                />
                <View style={{
                  width: '80%',
                  justifyContent: 'space-between',
                }}>
                  <Button
                    title="Cancel"
                    onPress={() => {
                      setIsOpen(false);
                      setSelectedMedia(null);
                    }}
                    variant="primary"
                    size="large"
                    style={styles.styldButton}
                  />
                  <Button
                    title="Save"
                    onPress={handleSaveMedia}
                    variant="primary"
                    size="large"
                    style={styles.styldButton}
                  />
                </View>
                {error && (
                  <Text style={{
                    color: 'red',
                    fontSize: 16,
                    textAlign: 'center',
                  }}>
                    {error}
                  </Text>
                )}
              </View>
            </ZixCart>
          }
        />
      )}
    </>
  );
};


const styles = StyleSheet.create({
  styldButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
    backgroundColor: '#FF6B6B',
  },
});