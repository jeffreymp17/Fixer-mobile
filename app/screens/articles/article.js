import React from 'react';

import {
  ScrollView,
  Image,
  View,
  TouchableOpacity,
} from 'react-native';
import {
  RkCard,
  RkText,
  RkButton,
  RkStyleSheet,
} from 'react-native-ui-kitten';
import { data } from '../../data';
import {
  Avatar,
  SocialBar,
} from '../../components';
import NavigationType from '../../config/navigation/propTypes';
import {MapView,Permissions} from 'expo';
const moment = require('moment');

export class Article extends React.Component {
  static propTypes = {
    navigation: NavigationType.isRequired,
  };
  static navigationOptions = {
    title: 'Order'.toUpperCase(),
  };

  constructor(props) {
    super(props);
    this.order = this.props.navigation.getParam('order', {});
  }

  state ={
    mapRegion: null,
    hasLocationPermissions: false,
    latlng:{
      latitude:9.934739,
      longitude:-84.087502

    },
  }

  componentDidMount(){
    Expo.Location.getProviderStatusAsync().then((permission)=>{
      if(!permission.gpsAvailable){
        this.Dialog('Location services',
        'Turn on GPS services manually ');
      }else{
        this._getLocationAsync();
      }
    });
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    let { locations } = this.order;
    if (status !== 'granted') {
      this.setState({
        locationResult: 'Permission to access location was denied',
      });
    } else {
      this.setState({ hasLocationPermissions: true });
    }
    // Center the map on the location we just fetched.
     this.setState({mapRegion: {
        latitude: locations[0].latitude, 
        longitude: locations[0].longitude, 
        latitudeDelta: locations[0].latitude_delta, 
        longitudeDelta: locations[0].longitude_delta}});
     this.setState({latlng:{ latitude: locations[0].latitude, longitude: locations[0].longitude}});
   };
   onClickButtonSave=()=>{
     this.createOrder();
   }




  render = () => (
    <ScrollView style={styles.root}>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          region={ this.state.mapRegion}
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
      <RkCard rkType='article'>
      {/* <Image rkCardImg source={{uri:this.order.photo}} /> */}       
      <View rkCardHeader>
        <View>
          <RkText style={styles.title} rkType='header4'>{this.order.breakdown}</RkText>
          <RkText rkType='secondary2 hintColor'>
            {this.order.created_at}
          </RkText>
        </View>
        <TouchableOpacity>
          <Avatar rkType='circle' img={this.order.customer_photo} />
        </TouchableOpacity>
      </View>
      <View rkCardContent>
        <View>
          <RkText rkType='primary3 bigLine' numberOfLines={1} >{"Status: "+this.order.finish_at}</RkText>
          <RkText rkType='primary3 bigLine' numberOfLines={1} >{"Technician: "+this.order.technician}</RkText>
          <RkText rkType='primary3 bigLine' numberOfLines={1} >{"Score: "+this.order.service_score}</RkText>
        </View>
      </View>
      <View rkCardFooter>
        <RkButton rkType='success'>Accept</RkButton>
      </View> 
      </RkCard>
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
  map: {
    marginTop:4,
    borderRadius: 8,
    height: 250,
    width: '100%',
    shadowOffset: {width: 16.4, height: 1.6},
      height:'99%',
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
      height:250,
      borderColor: '#76c2af',
      padding:6,
      width:'100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
}));
