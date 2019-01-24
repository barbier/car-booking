import React from 'react'
import { View, Animated, StyleSheet } from 'react-native'
import Geocoder from 'react-native-geocoder'
import MapView from 'react-native-maps'
import LocationPin from './components/LocationPin'
import LocationSearch from './components/LocationSearch'
import ClassSelection from './components/ClassSelection'
import ConfirmationModal from './components/ConfirmationModal'

const styles = StyleSheet.create({
    fullScreenMap: {
        bottom: 0,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
    }
})

export default class Map extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            position: null,
            confirmationModalVisible: false,
            carLocations: [
                {
                    rotation: 78,
                    latitude: 37.78725,
                    longitude: -122.4318,
                },
                {
                    rotation: -10,
                    latitude: 37.79015,
                    longitude: -122.4318,
                },
                {
                    rotation: 262,
                    latitude: 37.78525,
                    longitude: -122.4318,
                },
            ]
        }

        this.initialRegion = {
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.00922,
            longitudeDelta: 0.00421,
        }
    }

    _onRegionChange(region) {
        this.setState({ position: null })
        const self = this

        if (this.timeoutId) {
            clearTimeout(this.timeoutId)
        }

        this.timeoutId = setTimeout(async () => {
            try {
                const res = await Geocoder.geocodePosition({
                    lat: region.latitude,
                    lng: region.longitude,
                })
                self.setState({ position: res[0] })
            } catch(err) {
                console.log(err)
            }
        }, 2000)
    }

    _onBookingRequest() {
        this.setState({ confirmationModalVisible: true })
    }

    componentDidMount() {
        this._onRegionChange.call(this, this.initialRegion)
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <MapView
                    style={styles.fullScreenMap}
                    initialRegion={this.initialRegion}
                    onRegionChange={this._onRegionChange.bind(this)}
                >
                    {this.state.carLocations.map((carLocation, i) => (
                        <MapView.Marker key={i} coordinate={carLocation}>
                            <Animated.Image
                                style={{
                                    transform: [{rotate: `${carLocation.rotation}deg`}]
                                }}
                                source={require('../assets/img/car.png')}
                            />
                        </MapView.Marker>
                    ))}
                </MapView>
                <LocationSearch value={
                    this.state.position &&
                    (this.state.position.feature ||
                        this.state.position.formattedAddress)
                } />
                <LocationPin onPress={this._onBookingRequest.bind(this)} />
                <ClassSelection />
                <ConfirmationModal
                    visible={this.state.confirmationModalVisible}
                    onClose={() => {
                        this.setState({ confirmationModalVisible: false })
                    }}
                />
            </View>
        )
    }
}
