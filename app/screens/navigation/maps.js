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
import {Constants,MapView, Location, Permissions,AnimatedRegion, Animated,Marker} from 'expo';
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
    latlng:{}
  };

  componentDidMount() {
    this._getLocationAsync();
    this._handleMapRegionChange();

}
componentWillMount(){
  this.state.latlng={
    latitude:this.state.mapRegion.latitude,
  longitude:this.state.mapRegion.longitude}
  console.log("will",this.state.latlng);
}
  _handleMapRegionChange = mapRegion => {
    console.log(mapRegion);
    this.setState({ mapRegion });jf2028mp
    
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
    this.setState({mapRegion: { latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }});
    console.log(this.state);
    this.setState({latlng:{ latitude: location.coords.latitude, longitude: location.coords.longitude}});
    console.log("location:",latlng);
  };



  render = () => {
    return (
      <View style={styles.container}>
       <MapView
         style={styles.map}
         region={
           this.state.mapRegion}>
           <MapView.Marker
             coordinate={this.state.latlng}
             title="Here"
          ></MapView.Marker>
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
