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
import MapView from 'react-native-maps';
import { FontAwesome } from '../../assets/icons';


export class LocationMap extends React.Component {
  static navigationOptions = {
    title: 'Location'.toUpperCase(),
  };

  state = {

  };



  render = () => {
    const chartBackgroundStyle = { backgroundColor: RkTheme.current.colors.control.background };
    return (
      <View style={styles.container}>
       <MapView
         style={styles.map}
         region={{
           latitude: 37.78825,
           longitude: -122.4324,
           latitudeDelta: 0.015,
           longitudeDelta: 0.0121,
         }}
       >
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
