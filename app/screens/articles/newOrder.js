import React from 'react';

import {
  ScrollView,
  Image,
  View,
  TouchableOpacity,Alert
} from 'react-native';
import {
  RkCard,
  RkText,
  RkStyleSheet,
} from 'react-native-ui-kitten';
import { data } from '../../data';
import {
  Avatar,
  SocialBar
} from '../../components';
import NavigationType from '../../config/navigation/propTypes';
import MultiSelect from 'react-native-multiple-select';
const moment = require('moment');
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { Font, AppLoading } from 'expo'
import { UIConstants } from '../../config/appConstants';
import MaterialIcons from '@expo/vector-icons/fonts/MaterialIcons.ttf';
import { GradientButton } from '../../components/gradientButton';
import {Constants,MapView, Location, Permissions,AnimatedRegion, Animated,Marker} from 'expo';
export class newOrder extends React.Component {
  static propTypes = {
    navigation: NavigationType.isRequired,
  };
  static navigationOptions = {
    title: 'New order'.toUpperCase(),
  };
  state = {
       selectedItems: [],
       fontsAreLoaded: false,
        items:[],
        mapRegion: null,
        hasLocationPermissions: false,
        locationResult: null,
        latlng:{
          latitude:9.934739,
          longitude:-84.087502

        }
      }
  constructor(props) {
    super(props);

       }

  onSelectedItemsChange = (selectedItems) => {
    this.setState({ selectedItems });
  }
  getCategoriesAndBreakdownsFromApi() {
  fetch(`${UIConstants.URL}order/all/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log("data",responseJson)
        this.setState({
          items: responseJson
        });
      });
      console.log("---------->",this.state.data);
  }

async componentDidMount(){
await Font.loadAsync({
  MaterialIcons})
this.setState({ fontsAreLoaded: true })
this.getCategoriesAndBreakdownsFromApi();
}
gpsDialog=()=>{
  Alert.alert(
  'Location services',
  'Turn on GPS services manually ',
  [
    {text: 'OK',onPress:this.backToMenu},
  ],
  { cancelable: false }
)
}
backToMenu=()=>{
  this.props.navigation.navigate("GridV1");
}
componentDidMount() {
  Expo.Location.getProviderStatusAsync().then((permission)=>{
    console.log("Permissions:",permission);
    if(!permission.gpsAvailable){
      this.gpsDialog();
    }else{
      this._getLocationAsync();
      this._handleMapRegionChange();
    }
  });


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
  this.setState({mapRegion: { latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }});
  console.log(this.state);
  this.setState({latlng:{ latitude: location.coords.latitude, longitude: location.coords.longitude}});
};



  render=()=>(
    <ScrollView style={styles.root}>
    <View>
      <SectionedMultiSelect
        items={this.state.items}
        single={true}
        uniqueKey='category_id'
        subKey='breakdowns'
        selectText='Choose some breakdown...'
        showDropDowns={true}
        readOnlyHeadings={true}
        onSelectedItemsChange={this.onSelectedItemsChange}
        selectedItems={this.state.selectedItems}
      />

    </View>
    <View style={styles.container}>
     <MapView
       style={styles.map}
       region={
         this.state.mapRegion}
      zoomEnabled={true}
      pitchEnabled={true}
      showsCompass={true}
      liteMode={false}
      showsBuildings={true}
      showsTraffic={true}
      showsIndoors={true}>
         <MapView.Marker
           coordinate={this.state.latlng}
           title="You are Here"
           image={require('../../assets/images/ic_men.png')}
         ></MapView.Marker>
     </MapView>
   </View>
    <View style={styles.footer}>
    <GradientButton

      rkType='large'
      text='CREATE'
    />
    </View>
    </ScrollView>

  )

}

const styles = RkStyleSheet.create(theme => ({
  root: {
    backgroundColor: theme.colors.screen.base,
  },
  title: {
    marginBottom: 5,
  },
  footer: {
    justifyContent: 'flex-end',
    flex: 1,
    margin:2,
  },
  container: {
    borderRadius:40,
    height:200,
    width:'100%',
  justifyContent: 'flex-end',
  alignItems: 'center',
},
map: {
  borderRadius:40,
  margin:10,
  width:'100%',
  height:200,
},
}));
