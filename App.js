import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, Button, Alert, TouchableOpacity, Platform } from 'react-native';
import image from './assets/diamon.jpg'
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import uploadToAnonynousFilesAsync from 'anonymous-files';
export default function App() {

  const [selectedImage, setselectedImage] = useState(null);
  let openImagePicker = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to acces camera is requiered');
    }
    const pickResult = await ImagePicker.launchImageLibraryAsync();
    if (pickResult.cancelled === true) {
      return;
    }

    if(Platform.OS === 'web'){
      const remoteUri = await uploadToAnonynousFilesAsync(pickResult.localUri)
  
      setselectedImage({localUri: pickResult.uri})
    }else{
      setselectedImage({ localUri: pickResult.uri })
    }
  };

  const openShareDialog = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      alert('Sharing, is not available on your platform');
    }
    await Sharing.shareAsync(selectedImage.localUri);
  }
  //view es como div
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hola Mundo!</Text>
      <Image
        style={styles.image}
        source={{ uri: 'https://picsum.photos/200/200' }}
      // source={image}
      />
      <TouchableOpacity onPress={openImagePicker}>
        <Image
          style={styles.image}
          source={{
            uri: selectedImage !== null
              ? selectedImage.localUri
              : 'https://picsum.photos/200/200'
          }}
        // source={image}
        />
      </TouchableOpacity>

      {/* <Button
     
      title="Pick an image"
      color="#841584"
      accessibilityLabel="Pick an image"
    /> */}
      {selectedImage ?
        (<TouchableOpacity
          style={styles.button}
          onPress={openShareDialog}>
          <Text style={styles.buttontext}>Share this image</Text>
        </TouchableOpacity>)
        : (<View />)}
      <StatusBar style="auto" />
    </View>

  );
}



//el stylesheet crea un estilo general como una clase en el scss.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#292929',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
  },
  image: { height: 200, width: 200, borderRadius: 100, resizeMode: 'contain' },
  button: {
    backgroundColor: 'blue',
    padding: 7,
    marginTop: 10,
  },
  buttontext: {
    color: '#ffff',
    fontSize: 12
  }
});
