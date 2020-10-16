import React, { useEffect, useState } from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { RectButton } from 'react-native-gesture-handler'
import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

import api from '../services/api'
import { IOrphanage } from '../interfaces/orphanage'

import mapMarker from '../../assets/images/map-marker.png'

export default function OrphanagesMap() {
  const navigation = useNavigation()

  const [orphanages, setOrphanages] = useState<IOrphanage[]>([])

  useEffect(() => {
    api.get<IOrphanage[]>('/orphanages')
      .then(({ data }) => {
        setOrphanages(data)
      })
  }, [])

  function handleNavigateToOrphanageDetails(id: number) {
    navigation.navigate('OrphanageDetails', { id })
  }

  function handleNavigateToCreateOrphanage() {
    navigation.navigate('SelectMapPosition')
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: -10.8638136,
          longitude: -61.9696815,
          latitudeDelta: 0.030,
          longitudeDelta: 0.030,
        }}
      >
        {orphanages.map((orphanage) => (
          <Marker
            key={orphanage.id}
            icon={mapMarker}
            coordinate={{ latitude: orphanage.latitude, longitude: orphanage.longitude }}
            calloutAnchor={{ x: 0.5, y: 1.9 }}
          >
            <Callout tooltip onPress={() => handleNavigateToOrphanageDetails(orphanage.id)}>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutText}>
                  {orphanage.name}
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {orphanages.length} orfanatos encontrados
        </Text>

        <RectButton
          style={styles.footerBtnCreateOrphanage}
          onPress={handleNavigateToCreateOrphanage}
        >
          <Feather name="plus" size={20} color="#FFF" />
        </RectButton>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },

  calloutContainer: {
    width: 160,
    height: 46,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
    borderRadius: 16,
    justifyContent: 'center',
  },

  calloutText: {
    color: '#0089A5',
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },

  footer: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 32,

    backgroundColor: '#FFF',
    borderRadius: 20,
    height: 56,
    paddingLeft: 24,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    elevation: 3,
  },

  footerText: {
    color: '#8FA7B3',
    fontFamily: 'Nunito_700Bold',
  },

  footerBtnCreateOrphanage: {
    width: 56,
    height: 56,
    backgroundColor: '#15C3D6',
    borderRadius: 20,

    justifyContent: 'center',
    alignItems: 'center',
  },
})
