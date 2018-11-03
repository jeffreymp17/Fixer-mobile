import React from 'react';
import {
  View,
  Image,
  Dimensions,
  Keyboard,
  ScrollView,AsyncStorage
} from 'react-native';
import {
  RkButton,
  RkText,
  RkTextInput,
  RkAvoidKeyboard,
  RkStyleSheet,
  RkTheme,
} from 'react-native-ui-kitten';
import { FontAwesome } from '../../assets/icons';
import { GradientButton } from '../../components/gradientButton';
import { scaleModerate, scaleVertical } from '../../utils/scale';
import NavigationType from '../../config/navigation/propTypes';
import {getUserLogged} from '../../api/ProfileService';
import { UIConstants } from '../../config/appConstants';
import { Permissions, Notifications } from 'expo';

export class LoginV1 extends React.Component {
  componentDidMount(){
    //getUserLogged();
  }
  constructor(props){
    super(props)
    this.state={
      userEmail:'',
      userPassword:''
    }

  }
  static propTypes = {
    navigation: NavigationType.isRequired,
  };
  static navigationOptions = {
    header: null,
  };
  sendTokenToServer(userId,token){
    console.log("sender",token);
    console.log("userId",userId);

    let data={notification_token:token};
    fetch(`${UIConstants.URL}users/${userId}/fcm`,{
      method:'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
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
      console.log("save my token");
      }
    })
    .catch((error) =>{
      console.error(error);
    });
  }
  login=()=>{
    const {userEmail,userPassword}=this.state;
    const user={
      email:userEmail,
      password:userPassword,
      app:"mobile"
    };
    Keyboard.dismiss();
    fetch(`${UIConstants.URL}login`,{
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
        this.registerForPushNotificationsAsync(data.data.id);
        AsyncStorage.setItem('currentUser', JSON.stringify(data));
        this.props.navigation.navigate('GridV1');
      //  this._getToken();

      }
    })
    .catch((error) =>{
      console.error(error);
    });
  }


  getThemeImageSource = (theme) => (
    theme.name === 'light' ?
      require('../../assets/images/splash1.png') : require('../../assets/images/backgroundLoginV1DarkTheme.png')
  );

  renderImage = () => {
    const screenSize = Dimensions.get('window');
    const imageSize = {
      width: screenSize.width,
      height: screenSize.height - scaleModerate(375, 1),
    };
    return (
      <Image
        style={[styles.image, imageSize]}
        source={this.getThemeImageSource(RkTheme.current)}
      />
    );
  };

  onLoginButtonPressed = () => {
    this.props.navigation.goBack();
  };

  onSignUpButtonPressed = () => {
    this.props.navigation.navigate('SignUp');
  };

   async registerForPushNotificationsAsync(userId) {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {

      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      return;
    }
    let token = await Notifications.getExpoPushTokenAsync();
    this.sendTokenToServer(userId,token);
    console.log("token",token);
    console.log("id",userId);

  }
  render = () => (
    <ScrollView>

    <RkAvoidKeyboard
      onStartShouldSetResponder={() => true}
      onResponderRelease={() => Keyboard.dismiss()}
      style={styles.screen}>
      {this.renderImage()}
      <View style={styles.container}>
        <View style={styles.buttons}>
          <RkButton style={styles.button} rkType='social'>
            <RkText rkType='awesome hero accentColor'>{FontAwesome.twitter}</RkText>
          </RkButton>
          <RkButton style={styles.button} rkType='social'>
            <RkText rkType='awesome hero accentColor'>{FontAwesome.google}</RkText>
          </RkButton>
          <RkButton style={styles.button} rkType='social'>
            <RkText rkType='awesome hero accentColor'>{FontAwesome.facebook}</RkText>
          </RkButton>
        </View>
        <RkTextInput rkType='rounded' placeholder='Username' onChangeText={userEmail=>this.setState({userEmail})} />
        <RkTextInput rkType='rounded' placeholder='Password' secureTextEntry onChangeText={userPassword=>this.setState({userPassword})} />
        <GradientButton
          style={styles.save}
          rkType='large'
          onPress={this.login}
          text='LOGIN'
        />
        <View style={styles.footer}>
          <View style={styles.textRow}>
            <RkText rkType='primary3'>Don’t have an account?</RkText>
            <RkButton rkType='clear'>
              <RkText rkType='header6' onPress={this.onSignUpButtonPressed}>Sign up now</RkText>
            </RkButton>
          </View>
        </View>
      </View>
    </RkAvoidKeyboard>
    </ScrollView>
  )
}

const styles = RkStyleSheet.create(theme => ({
  screen: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: theme.colors.screen.base,
  },
  image: {
    resizeMode: 'cover',
    marginBottom: scaleVertical(10),
  },
  container: {
    paddingHorizontal: 17,
    paddingBottom: scaleVertical(22),
    alignItems: 'center',
    flex: -1,
  },
  footer: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  buttons: {
    flexDirection: 'row',
    marginBottom: scaleVertical(24),
  },
  button: {
    marginHorizontal: 14,
  },
  save: {
    marginVertical: 9,
  },
  textRow: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
}));
