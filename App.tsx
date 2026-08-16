import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import WhiteboardScreen from './src/screens/WhiteboardScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <WhiteboardScreen />
    </SafeAreaProvider>
  );
}
