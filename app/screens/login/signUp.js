import React from 'react';
import {
  View,
  Image,
  Keyboard,
  ScrollView
} from 'react-native';
import {
  RkButton,
  RkText,
  RkTextInput,
  RkStyleSheet,
  RkTheme,
  RkAvoidKeyboard,
} from 'react-native-ui-kitten';
import { GradientButton } from '../../components/';
import { scaleVertical } from '../../utils/scale';
import NavigationType from '../../config/navigation/propTypes';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import moment from 'moment';
import RadioForm from 'react-native-simple-radio-button';
import Toast from 'react-native-whc-toast'
import { UIConstants } from '../../config/appConstants';


var gender_props = [
  {label: 'Female', value: 0 },
  {label: 'Male', value: 1 }
];
var type_props = [
  {label: 'Customer', value: 0 },
  {label: 'Technician', value: 1 }
];

export class SignUp extends React.Component {
  constructor(){
    super()
    this.state = {
      isVisible:false,
      name:"",
      password:"",
      lastname:"",
      birthdate:"",
      email:"",
      type:0,
      gender:0,
      confirm:""
    }
  }
  static navigationOptions = {
    header: null,
  };
  static propTypes = {
    navigation: NavigationType.isRequired,
  };
  
  register=()=>{

    let user = this.validateFields();
    Keyboard.dismiss();
    if(user!=null){
      user.gender = user.gender == 0 ? "female" : "male";
      user.type = user.type == 0 ? "App\\Customer" : "App\\Technician";

      fetch(`${UIConstants.URL}users`,{
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
        statusCode!=201 ? this.refs.toast.showTop(data[0]) : this.props.navigation.navigate('Login1');
      })
      .catch((error) =>{
        console.error(error);
      });
    }
  }

  getThemeImageSource = (theme) => (
    theme.name === 'light' ?
      require('../../assets/images/logo.png') : require('../../assets/images/logoDark.png')
  );

  renderImage = () => (
    <Image style={styles.image} source={this.getThemeImageSource(RkTheme.current)} />
  );

  onSignUpButtonPressed = () => {
    this.register();
  };

  onSignInButtonPressed = () => {
    this.props.navigation.navigate('Login1');
  };

  handlePicker = (date) =>{
    this.setState({
      isVisible:false,
      birthdate: moment(date).format('YYYY-MM-DD')
    })
  };
  
  showPicker = () =>{
    this.setState({
      isVisible:true
    })
  };
  hidePicker = () =>{
    this.setState({
      isVisible:false
    })
  };

  validateFields=()=>{
    const  {name,lastname,gender,password,birthdate,email,type,confirm}= this.state;
    if(password != confirm){
      this.refs.toast.show("Confirm password doesnt match");
      return null;
    }
    else if(name == ""){
      this.refs.toast.show("Name is required");
      return null;
    }
    else if(lastname == ""){
      this.refs.toast.show("Lastname is required");
      return null;
    }
    else if(birthdate == ""){
      this.refs.toast.show("Birthdate is required");
      return null;
    }
    else{
      return {
        name:name,
        lastname:lastname,
        gender:gender,
        password:password,
        birthdate:birthdate,
        email:email,
        type:type,
      } 
    }
  }

  render = () => (
    <ScrollView>
      <RkAvoidKeyboard
        style={styles.screen}
        onStartShouldSetResponder={() => true}
        onResponderRelease={() => Keyboard.dismiss()}>
        <View style={{ alignItems: 'center' }}>
          {this.renderImage()}
          <RkText rkType='h1'>Register</RkText>
        </View>
        <View style={styles.content}>
        <Toast ref="toast"/>
          <View>
            <RkTextInput rkType='rounded' placeholder='Name' onChangeText={name=>this.setState({name})}/>
            <RkTextInput rkType='rounded' placeholder='Lastname' onChangeText={lastname=>this.setState({lastname})}/>
            <RkTextInput rkType='rounded' placeholder='Email' onChangeText={email=>this.setState({email})} />
            <RkTextInput rkType='rounded' placeholder='Password' secureTextEntry onChangeText={password=>this.setState({password})} />
            <RkTextInput rkType='rounded' placeholder='Confirm Password' secureTextEntry onChangeText={confirm=>this.setState({confirm})}/>


            <View style={{ flexDirection: 'row' }}>

              <View style={styles.checkContainer}>
                <RkText>Gender</RkText>
                <RadioForm
                  radio_props={gender_props}
                  initial={0}
                  onPress={(value) => {this.setState({gender:value})}}
                 />
              </View>

              <View style={styles.checkContainer}>
                <RkText>Register as</RkText>
                <RadioForm
                  radio_props={type_props}
                  initial={0}
                  onPress={(value) => {this.setState({type:value})}}
                 />
              </View>

            </View>

            <View style={{ flex: 1, flexDirection: 'row', marginTop: 15, }}>
              <View>
                <RkButton style={styles.birthdateContainer} rkType='primary outline' onPress={this.showPicker}>
                  Birthdate: {this.state.birthdate}
                </RkButton>
              </View>

              <DateTimePicker
                isVisible={this.state.isVisible}
                onConfirm={this.handlePicker}
                onCancel={this.hidePicker}
              />
            </View>

            <GradientButton
              style={styles.save}
              rkType='large'
              text='SIGN UP'
              onPress={this.onSignUpButtonPressed}
            />
          </View>
          <View style={styles.footer}>
            <View style={styles.textRow}>
              <RkText rkType='primary3'>Already have an account?</RkText>
              <RkButton rkType='clear' onPress={this.onSignInButtonPressed}>
                <RkText rkType='header6'>Sign in now</RkText>
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
    padding: 16,
    flex: 1,
    justifyContent: 'space-around',
    backgroundColor: theme.colors.screen.base,
  },
  image: {
    marginBottom: 10,
    height: scaleVertical(77),
    resizeMode: 'contain',
  },
  content: {
    justifyContent: 'space-between',
  },
  save: {
    marginVertical: 20,
  },
  buttons: {
    flexDirection: 'row',
    marginBottom: 24,
    marginHorizontal: 24,
    justifyContent: 'space-around',
  },
  footer: {
    justifyContent: 'flex-end',
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  checkContainer:{
    width:wp('50%'), 
    flexDirection: 'column',
  },
  birthdateContainer:{
    width:wp('90%'), 
  },
}));
