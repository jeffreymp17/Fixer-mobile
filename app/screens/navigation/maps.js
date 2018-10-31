import React from 'react';
import {
  View,
  ScrollView,StyleSheet
} from 'react-native';
import {
  RkText,
  RkStyleSheet,
  RkTheme,
} from 'react-native-ui-kitten';
import {Constants,MapView, Location, Permissions,AnimatedRegion, Animated,Marker,Expo } from 'expo';
import { FontAwesome } from '../../assets/icons';
import { PermissionsAndroid } from 'react-native';


export class LocationMap extends React.Component {
  static navigationOptions = {
    title: 'Location'.toUpperCase(),
  };

  state = {
    mapRegion: null,
    hasLocationPermissions: false,
    locationResult: null,
    coordinates:null
  };

  componentDidMount() {
    this._getLocationAsync();
    this._handleMapRegionChange();
  }

  _handleMapRegionChange = mapRegion => {
    console.log(mapRegion);
    this.setState({ mapRegion });
  };

  _getLocationAsync = async () => {
   let { status } = await Permissions.askAsync(Permissions.LOCATION);
   if (status !== 'granted') {
     this.setState({
       locationResult: 'Permission to access location was denied',
     });
   } else {
     this.setState({ hasLocationPermissions: true });
   }

   let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true });
   this.setState({ locationResult: JSON.stringify(location) });

   // Center the map on the location we just fetched.
    this.setState({mapRegion: { latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421,coordinates:{
      latitude: location.coords.latitude, longitude: location.coords.longitude
    } }});
    console.log(this.state);
  };



  render = () => {
    return (
      <View style={styles.container}>
       <MapView
         style={styles.map}
         region={
           this.state.mapRegion} >
       </MapView>
     </View>
    );
  };
}

const styles = RkStyleSheet.create(theme => ({
  screen: {
    backgroundColor: theme.colors.screen.scroll,
    paddingHorizontal: 15,
    ...StyleSheet.absoluteFillObject,

  },
  container: {
    ...StyleSheet.absoluteFillObject,

  justifyContent: 'flex-end',
  alignItems: 'center',
},
map: {
  ...StyleSheet.absoluteFillObject,
},
}));
