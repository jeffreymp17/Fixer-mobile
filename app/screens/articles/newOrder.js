import React from 'react';

import {
  ScrollView,
  Image,
  View,
  TouchableOpacity,Alert,AsyncStorage
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
    selectedItemsChange:[],
    fontsAreLoaded: false,
    items:[],
    mapRegion: null,
    hasLocationPermissions: false,
    locationResult: null,
    latlng:{
      latitude:9.934739,
      longitude:-84.087502

    },
    user:{}
  }
  constructor(props) {
    super(props);
  }

  onSelectedItemsChange = (selectedItems) => {
    this.setState({ selectedItems:selectedItems });
    console.log("selected:",this.state.selectedItems);


  }
  getUser=()=>{
    AsyncStorage.getItem('currentUser', (err, result) => {
      let user=JSON.parse(result);
      this.setState({user:user.data});
    })
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
      console.log("data:",responseJson.data)
      this.setState({
        items: responseJson.data
      });
    });
    console.log("---------->",this.state);
  }
  createOrder=()=>{
    const order={breakdown_id:this.state.selectedItems[0],customer_id:this.state.user.userable.id,
      latitude:this.state.latlng.latitude,
      longitude:this.state.latlng.longitude,
      latitude_delta:this.state.mapRegion.latitudeDelta,longitude_delta:this.state.mapRegion.longitudeDelta};
      console.log("ORDER:",order);
      fetch(`${UIConstants.URL}order`,{
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      })
      .then(response => {
        const statusCode = response.status;
        const data = response.json();
        return Promise.all([statusCode, data]);
      })
      .then(([statusCode,data]) => {
        console.log("status",statusCode);
        console.log("data",data);
        this.dialog('New order',
        'Successful created');
      })
      .catch((error) =>{
        console.error(error);
      });
    }


    dialog=(title,description)=>{
      Alert.alert(
        title,description,
        [
          {text: 'OK',onPress:this.backToMenu},
        ],
        { cancelable: false }
      )
    }
    backToMenu=()=>{
      this.props.navigation.navigate("GridV1");
    }
    async componentDidMount() {
      await Font.loadAsync({MaterialIcons})
      this.setState({ fontsAreLoaded: true })
      Expo.Location.getProviderStatusAsync().then((permission)=>{
        console.log("Permissions:",permission);
        if(!permission.gpsAvailable){
          this.Dialog('Location services',
          'Turn on GPS services manually ');
        }else{
          this._getLocationAsync();
          this._handleMapRegionChange();
          this.getCategoriesAndBreakdownsFromApi();
          this.getUser();
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
      this.setState({latlng:{ latitude: location.coords.latitude, longitude: location.coords.longitude}});
    };
    onClickButtonSave=()=>{
      this.createOrder();
    }
    onDragPosition=(position)=>{
      console.log("IN STATE:",position.nativeEvent);
      this.state.latlng=position.nativeEvent.coordinate;
      console.log("---------------------__>:",this.state.latlng)
    }



    render=()=>(
      <ScrollView style={styles.root}>
      <View style={styles.multiSelect}>
      { this.state.fontsAreLoaded ? (
        <SectionedMultiSelect
        items={this.state.items}
        single={true}
        uniqueKey='id'
        subKey='children'
        selectText='Choose some breakdown...'
        showDropDowns={true}
        readOnlyHeadings={true}
        animateDropDowns={true}
        modalAnimationType={'slide'}
        onSelectedItemsChange={this.onSelectedItemsChange}
        selectedItems={this.state.selectedItems}/>
      ) : null
    }

    </View>
    <View style={styles.container}>
    <MapView
    style={styles.map}
    region={
      this.state.mapRegion}
      zoomEnabled={true}
      provider={"google"}
      pitchEnabled={true}
      showsCompass={true}
      liteMode={false}
      showsBuildings={true}
      showsTraffic={true}
      showsIndoors={true}>
      <MapView.Marker
      coordinate={this.state.latlng}
      title={'Hi '+this.state.user.name+""}
      onSelect={(e) =>this.onDragPosition(e)}
      onDrag={(e) =>this.onDragPosition(e)}
      onDragStart={(e) => this.onDragPosition(e)}
      onDragEnd={(e) => this.onDragPosition(e)}
      onPress={(e) =>this.onDragPosition(e)}
      draggable
      image={require('../../assets/images/ic_order.png')}
      ></MapView.Marker>
      </MapView>
      </View>
      <View style={styles.footer}>
      <GradientButton
      onPress={this.onClickButtonSave}
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
    multiSelect:{
      borderRadius: 8,
      shadowOpacity: 0.4,
      elevation: 1.5,
      marginTop: 2,
      marginBottom: 2,
      shadowRadius: 1,
    },
    footer: {
      justifyContent: 'flex-end',
      flex: 1,
      margin:2,
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      alignSelf: 'center',
      borderRadius: 8,
      shadowOpacity: 0.4,
      elevation: 1.5,
      marginTop: 5,
      marginBottom: 5,
      shadowRadius: 1,
      height:400,
      borderColor: '#76c2af',
      padding:6,
      width:'100%',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      marginTop:4,
      borderRadius: 8,
      height: 390,
      width: '100%',
      shadowOffset: {width: 16.4, height: 1.6},
      height:'99%',
    },
  }));
