import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function QuestionPanel() {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handlePickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Permission needed',
          'Please allow access to your photos to add a question image.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.8,
      });

      if (result.canceled) {
        return;
      }

      const asset = result.assets && result.assets[0];
      if (asset?.uri) {
        setImageUri(asset.uri);
      }
    } catch (error) {
      Alert.alert('Something went wrong', 'Could not open the image picker. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Question</Text>
        <TouchableOpacity style={styles.addButton} onPress={handlePickImage} activeOpacity={0.7}>
          <Text style={styles.addButtonText}>+ Image</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.imageArea}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
        ) : (
          <Text style={styles.placeholder}>No question image</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FAFAFA',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  addButton: {
    backgroundColor: '#1E88E5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  imageArea: {
    marginTop: 8,
    minHeight: 50,
    maxHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 150,
  },
  placeholder: {
    color: '#999999',
    fontSize: 13,
    paddingVertical: 12,
  },
});
