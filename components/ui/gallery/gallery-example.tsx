import { Media } from '@/src/models/Media';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Gallery } from './gallery';

export const GalleryExample: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<Media | null>(null);
  const [uploadedImages, setUploadedImages] = useState<Media[]>([]);

  const handleImageSelect = (image: Media) => {
    setSelectedImage(image);
    Alert.alert('Image Selected', `Selected: ${image.file_name || 'Unknown'}`);
  };

  const handleImageUpload = (image: Media) => {
    setUploadedImages(prev => [...prev, image]);
    Alert.alert('Image Uploaded', `Uploaded: ${image.file_name || 'Unknown'}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gallery Component Example</Text>
      
      <Gallery
        onImageSelect={handleImageSelect}
        onImageUpload={handleImageUpload}
        maxImages={5}
        allowMultiple={true}
        showUploadButton={true}
        showGalleryButton={true}
        bucketId="avatars"
        collectionId="user_images"
        databaseId="jaweeb"
      />

      {selectedImage && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Selected Image:</Text>
          <Text style={styles.infoText}>File: {selectedImage.file_name}</Text>
          <Text style={styles.infoText}>Type: {selectedImage.mime_type}</Text>
        </View>
      )}

      {uploadedImages.length > 0 && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Uploaded Images ({uploadedImages.length}):</Text>
          {uploadedImages.map((image, index) => (
            <Text key={image.$id} style={styles.infoText}>
              {index + 1}. {image.file_name} - {image.$id}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  infoContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});

export default GalleryExample;
