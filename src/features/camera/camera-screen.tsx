import { ScreenLayout } from '@/components/ui/screen-layout/screen-layout';
import { Text } from '@/components/ui/text';
import React from 'react';
import { Alert } from 'react-native';

export function CameraScreen() {

  const handleStartRecording = () => {
    Alert.alert('Recording Started', 'Video recording has begun');
  };

  const handleStopRecording = () => {
    Alert.alert('Recording Stopped', 'Video has been saved');
  };

  const handleTakePhoto = () => {
    Alert.alert('Photo Taken', 'Photo has been saved to gallery');
  };

  return (
    <ScreenLayout>
      <Text className="text-2xl font-bold">Camera</Text>
    </ScreenLayout>
  );
}
