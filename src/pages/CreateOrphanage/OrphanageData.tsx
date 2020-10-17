import React, { useState } from 'react'
import { ScrollView, View, StyleSheet, Switch, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { RectButton } from 'react-native-gesture-handler'
import { useRoute, useNavigation } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker'

import api from '../../services/api'

interface IRouteParams {
  position: {
    latitude: number
    longitude: number
  }
}

export default function OrphanageData() {
  const route = useRoute()
  const navigation = useNavigation()
  const params = route.params as IRouteParams

  const [name, setName] = useState('')
  const [about, setAbout] = useState('')
  const [instructions, setInstructions] = useState('')
  const [openingHours, setOpeningHours] = useState('')
  const [openOnWeekends, setOpenOnWeekends] = useState(false)
  const [images, setImages] = useState<string[]>([])

  async function handleCreateOrphanage() {
    const formData = new FormData()

    formData.append('latitude', String(params.position.latitude))
    formData.append('longitude', String(params.position.longitude))
    formData.append('name', name)
    formData.append('about', about)
    formData.append('instructions', instructions)
    formData.append('opening_hours', openingHours)
    formData.append('open_on_weekends', String(openOnWeekends))
    images.forEach((image, index) => formData.append('images', {
      name: `image_${index}.png`,
      type: 'image/png',
      uri: image,
    } as any))

    await api.post('/orphanages', formData)
    alert('Orfanato cadastrado')
    navigation.navigate('OrphanagesMap')
  }

  async function handleSelectedImages() {
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync()

    if (status !== 'granted') {
      alert('Para adicionar fotos é necessário conceder acesso à câmera')
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      quality: 1,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    })

    if (result.cancelled) {
      return
    }

    setImages([...images, result.uri])
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 24 }}>
      <Text style={styles.title}>Dados</Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Sobre</Text>
      <TextInput
        style={[styles.input, { height: 110 }]}
        value={about}
        onChangeText={setAbout}
        multiline
      />

      <Text style={styles.label}>Whatsapp</Text>
      <TextInput
        style={styles.input}
      />

      <Text style={styles.label}>Fotos</Text>

      <View style={styles.uploadedImagesContainer}>
        {images.map((image) => (
          <Image
            key={image}
            source={{ uri: image }}
            style={styles.uploadedImage}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.imagesInput} onPress={handleSelectedImages}>
        <Feather name="plus" size={24} color="#15B6D6" />
      </TouchableOpacity>

      <Text style={styles.title}>Visitação</Text>

      <Text style={styles.label}>Instruções</Text>
      <TextInput
        style={[styles.input, { height: 110 }]}
        value={instructions}
        onChangeText={setInstructions}
        multiline
      />

      <Text style={styles.label}>Horário de visitas</Text>
      <TextInput
        style={styles.input}
        value={openingHours}
        onChangeText={setOpeningHours}
      />

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Atende final de semana?</Text>
        <Switch
          thumbColor="#fff"
          trackColor={{ false: '#CCC', true: '#39CC83' }}
          value={openOnWeekends}
          onValueChange={setOpenOnWeekends}
        />
      </View>

      <RectButton style={styles.nextButton} onPress={handleCreateOrphanage}>
        <Text style={styles.nextButtonText}>Cadastrar</Text>
      </RectButton>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  title: {
    color: '#5C8599',
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 32,
    paddingBottom: 24,
    borderBottomWidth: 0.8,
    borderBottomColor: '#D3E2E6',
  },

  label: {
    color: '#8FA7B3',
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 8,
  },

  comment: {
    fontSize: 11,
    color: '#8FA7B3',
  },

  input: {
    backgroundColor: '#FFF',
    borderWidth: 1.4,
    borderColor: '#D3E2E6',
    borderRadius: 20,
    height: 56,
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginBottom: 16,
    textAlignVertical: 'top',
  },

  uploadedImagesContainer: {
    flexDirection: 'row',
  },

  uploadedImage: {
    width: 64,
    height: 64,
    borderRadius: 20,
    marginBottom: 32,
    marginRight: 8,
  },

  imagesInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderStyle: 'dashed',
    borderColor: '#96D2F0',
    borderWidth: 1.4,
    borderRadius: 20,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },

  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },

  nextButton: {
    backgroundColor: '#15C3D6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
    marginTop: 32,
  },

  nextButtonText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 16,
    color: '#FFF',
  },
})
