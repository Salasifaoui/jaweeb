import { AVATAR_LIST } from "@/constants/variables";
import { Media } from "@/src/models/Media";


import { ZixAlertActions } from "@/components/ui/zix-alert-actions/zix-alert-actions";
import { Button } from '@/src/components/Button';
import { useUpdateProfile } from "@/src/features/profile/hooks/userUpdateProfile";
import { Check, Plus } from "lucide-react-native";
import { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AvatarItem } from "../avatar-item/avatar-item";
import { Gallery } from "../gallery";
import { ZixCart } from "../zix-cart/zix-cart";

interface ListAvatarsProps {
  userProfile: any;
  setShowGallery: (show: boolean) => void;
}

export const ListAvatars = ({ userProfile, setShowGallery }: ListAvatarsProps) => {
  const [selectedMedia, setSelectedMedia] = useState<Media | Media[] | null>(
    null
  );
  const [avatarSelected, setAvatarSelected] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updateProfile } = useUpdateProfile();


  // const { updateUserProfile, isLoading, error, clearError } =
  //   useUserProfileUpdate();

  const handleImageUpload = async (type: string, selectedMedia: Media | Media[] | string) => {
    if (type === 'image') {
     await updateProfile(userProfile.userId, { imageUrl: selectedMedia.url, avatar: "" });
      setShowGallery(false);
    } else if (type === 'avatar') {
     await updateProfile(userProfile.userId, { avatar: selectedMedia as string });
      setShowGallery(false);
    }
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
          ListHeaderComponent={() => (
                <TouchableOpacity
                  style={{ backgroundColor: '#f0f0f0', padding: 8, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}
                  onPress={() => {
                    setIsOpen(true);
                  }}
                  disabled={isLoading}
                  
                >
                  <Plus
                      size={20}
                      color={'black'}
                    />
                </TouchableOpacity>
              
          )}
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
                    onPress={() => handleImageUpload('avatar', avatarSelected)}
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
      {!selectedMedia && isOpen && (
        <Gallery
          visible={isOpen}
          onClose={() => {
            setIsOpen(false);
            setSelectedMedia(null);
          }}
          onImageUpload={(media: Media | Media[]) => handleImageUpload('image', media)}
          maxImages={1}
          allowMultiple={false}
          showUploadButton={true}
          showGalleryButton={true}
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