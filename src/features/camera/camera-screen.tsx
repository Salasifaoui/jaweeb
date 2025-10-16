import { AppHeader } from '@/components/app-header';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Icon } from '@/components/ui/icon';
import { THEME } from '@/src/theme/theme';
import { Barcode, Camera, FileText, Image, PlayCircle, QrCode, StopCircle, Video } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';

export function CameraScreen() {
  const colorScheme = useColorScheme();
  const theme = THEME[colorScheme ?? 'light'];
  const styles = createStyles(theme);
  const [isRecording, setIsRecording] = useState(false);

  const handleStartRecording = () => {
    setIsRecording(true);
    Alert.alert('Recording Started', 'Video recording has begun');
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    Alert.alert('Recording Stopped', 'Video has been saved');
  };

  const handleTakePhoto = () => {
    Alert.alert('Photo Taken', 'Photo has been saved to gallery');
  };

  return (
    <ThemedView style={styles.container} authProtected={true}>
      <AppHeader
        title="Camera"
        showBackButton={false}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.cameraSection}>
          <View style={styles.cameraPreview}>
            <Icon as={Camera} size={60} color="#8E8E93" />
            <ThemedText style={styles.previewText}>
              Camera Preview
            </ThemedText>
          </View>
        </View>
        
        <View style={styles.controlsSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Camera Controls
          </ThemedText>
          
          <View style={styles.controlButtons}>
            <TouchableOpacity 
              style={[styles.controlButton, styles.photoButton]}
              onPress={handleTakePhoto}
            >
              <Icon as={Camera} size={24} color="#fff" />
              <ThemedText style={styles.controlButtonText}>Take Photo</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.controlButton, 
                isRecording ? styles.stopButton : styles.recordButton
              ]}
              onPress={isRecording ? handleStopRecording : handleStartRecording}
            >
              <Icon as={isRecording ? StopCircle : PlayCircle} 
                size={24} 
                color="#fff" 
              />
              <ThemedText style={styles.controlButtonText}>
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Recent Media
          </ThemedText>
          
          <View style={styles.mediaGrid}>
            <View style={styles.mediaItem}>
              <Icon as={Image} size={30} color="#007AFF" />
              <ThemedText style={styles.mediaText}>Photo 1</ThemedText>
            </View>
            
            <View style={styles.mediaItem}>
              <Icon as={Video} size={30} color="#34C759" />
              <ThemedText style={styles.mediaText}>Video 1</ThemedText>
            </View>
            
            <View style={styles.mediaItem}>
              <Icon as={Image} size={30} color="#FF9500" />
              <ThemedText style={styles.mediaText}>Photo 2</ThemedText>
            </View>
            
            <View style={styles.mediaItem}>
              <Icon as={Video} size={30} color="#FF3B30" />
              <ThemedText style={styles.mediaText}>Video 2</ThemedText>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Quick Actions
          </ThemedText>
          
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Icon as={QrCode} size={24} color="#007AFF" />
              <ThemedText style={styles.actionText}>Scan QR</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Icon as={FileText} size={24} color="#34C759" />
              <ThemedText style={styles.actionText}>Scan Document</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Icon as={Barcode} size={24} color="#FF9500" />
              <ThemedText style={styles.actionText}>Scan Barcode</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const createStyles = (theme: typeof THEME.light) => StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  cameraSection: {
    marginBottom: 30,
  },
  cameraPreview: {
    height: 200,
    backgroundColor: theme.background,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  previewText: {
    color: theme.mutedForeground,
    marginTop: 10,
    fontSize: 16,
  },
  controlsSection: {
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 140,
    justifyContent: 'center',
  },
  photoButton: {
    backgroundColor: theme.primary,
  },
  recordButton: {
    backgroundColor: theme.secondary,
  },
  stopButton: {
    backgroundColor: theme.destructive,
  },
  controlButtonText: {
    color: theme.primaryForeground,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  mediaItem: {
    width: '48%',
    backgroundColor: theme.border,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  mediaText: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: theme.border,
    borderRadius: 12,
    minWidth: 80,
  },
  actionText: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
});
