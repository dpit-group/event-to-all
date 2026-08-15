import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

export function Logo() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../Images/Logo.png')}
        style={{ width: 100, height: 100 }}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    

    alignItems: 'center',
   
  },
});

