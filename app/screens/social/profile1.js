import React from 'react';
import {
  View,
  ScrollView,AsyncStorage,Alert
} from 'react-native';
import {
  RkText,
  RkButton, RkStyleSheet,
} from 'react-native-ui-kitten';
import { Avatar } from '../../components/avatar';
import { Gallery } from '../../components/gallery';
import { data } from '../../data/';
import formatNumber from '../../utils/textUtils';
import NavigationType from '../../config/navigation/propTypes';
import { UIConstants } from '../../config/appConstants';
import {StackActions, NavigationActions } from 'react-navigation';



export class ProfileV1 extends React.Component {
  static propTypes = {
    navigation: NavigationType.isRequired,
  };
  static navigationOptions = {
    title: 'User Profile'.toUpperCase(),
  };
  componentDidMount(){
    this.getUser();
  }
  getUser=()=>{
    AsyncStorage.getItem('currentUser', (err, result) => {
     console.log("CURRENT USER",JSON.parse(result));
     let user=JSON.parse(result);
     this.setState({'data':user.data});
     console.log("in state",this.state.data);
  })

  }

  constructor(props) {
    super(props);
    this.state={
      data:{

      }
    }
}
logOut=()=>{
  console.log("reduce");
  const user={email:this.state.data.email,api_token:this.state.data.token}
  fetch(`${UIConstants.URL}logout`,{
    method:'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })
  .then(response => {
    const statusCode = response.status;
    const data = response.json();
    return Promise.all([statusCode, data]);
  })
  .then(([statusCode,data]) => {
    console.log("status",statusCode);
    console.log("data",data);
    if(statusCode==200){
     this.clearProperties();
    }
  })
  .catch((error) =>{
    console.error(error);
  });

}
clearProperties=()=>{
  AsyncStorage.removeItem('currentUser').then(()=>{
    console.log("yes");
  });
  const toHome =StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Login1' })],
  });
  this.props.navigation.dispatch(toHome);
}
confirmLogout=()=>{
  Alert.alert(
  'Exit',
  'Are you sure to exit?',
  [
    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
    {text: 'OK', onPress:  this.logOut},
  ],
  { cancelable: false }
)
}

  render = () => (
    <ScrollView style={styles.root}>
      <View style={[styles.header, styles.bordered]}>
        <Avatar img={`${this.state.data.picture}`} rkType='big' />
        <RkText rkType='header2'>{`${this.state.data.name} ${this.state.data.lastname}`}</RkText>
      </View>
      <View style={[styles.userInfo, styles.bordered]}>
        <View style={styles.section}>
          <RkText rkType='header3' style={styles.space}>{0}</RkText>
          <RkText rkType='secondary1 hintColor'>Orders</RkText>
        </View>
        <View style={styles.section}>
          <RkText rkType='header3' style={styles.space}>{0}</RkText>
          <RkText rkType='secondary1 hintColor'>Followers</RkText>
        </View>
        <View style={styles.section}>
          <RkText rkType='header3' style={styles.space}>{0}</RkText>
          <RkText rkType='secondary1 hintColor'>Score</RkText>
        </View>
      </View>
      <View style={[styles.margin, styles.bordered]}>
      <RkText rkType='header3' style={styles.space}>Email</RkText>
      <RkText rkType='secondary1 hintColor'>{this.state.data.email}</RkText>
      <RkText rkType='header3' style={styles.space}>Type</RkText>
      <RkText rkType='secondary1 hintColor'>{this.state.data.type}</RkText>
      <RkText rkType='header3' style={styles.space}>Telephone</RkText>
      <RkText rkType='secondary1 hintColor'>{this.state.data.phone}</RkText>
      <RkText rkType='header3' style={styles.space}>Registar date</RkText>
      <RkText rkType='secondary1 hintColor'>{this.state.data.register_date}</RkText>
      </View>

      <View style={styles.buttons}>
        <RkButton style={styles.button} rkType='clear link' onPress={this.confirmLogout}>LOG OUT</RkButton>
        <View style={styles.separator} />
        <RkButton style={styles.button} rkType='clear link'>MESSAGE</RkButton>
      </View>
     <Gallery/>
    </ScrollView>
  );
}

const styles = RkStyleSheet.create(theme => ({
  root: {
    backgroundColor: theme.colors.screen.base,
  },
  header: {
    alignItems: 'center',
    paddingTop: 25,
    paddingBottom: 17,
  },
  userInfo: {
    flexDirection: 'row',
    paddingVertical: 18,
  },
  bordered: {
    borderBottomWidth: 1,
    borderColor: theme.colors.border.base,
  },
  section: {
    flex: 1,
    alignItems: 'center',
  },
  space: {
    marginBottom: 3,
  },
  separator: {
    backgroundColor: theme.colors.border.base,
    alignSelf: 'center',
    flexDirection: 'row',
    flex: 0,
    width: 1,
    height: 42,
  },
  buttons: {
    flexDirection: 'row',
    paddingVertical: 8,
    margin:5
  },
  button: {
    flex: 1,
    alignSelf: 'center',
  },
  margin:{
    margin:4,
  },
}));
