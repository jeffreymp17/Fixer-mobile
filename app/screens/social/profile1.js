import React from 'react';
import {
  View,
  ScrollView,AsyncStorage
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

  render = () => (
    <ScrollView style={styles.root}>
      <View style={[styles.header, styles.bordered]}>
        <Avatar img={'https://www.w3schools.com/w3css/img_lights.jpg'} rkType='big' />
        <RkText rkType='header2'>{`${this.state.data.name} ${this.state.data.lastname}`}</RkText>
      </View>
      <View style={[styles.userInfo, styles.bordered]}>
        <View style={styles.section}>
          <RkText rkType='header3' style={styles.space}></RkText>
          <RkText rkType='secondary1 hintColor'>Posts</RkText>
        </View>
        <View style={styles.section}>
          <RkText rkType='header3' style={styles.space}></RkText>
          <RkText rkType='secondary1 hintColor'>Followers</RkText>
        </View>
        <View style={styles.section}>
          <RkText rkType='header3' style={styles.space}>{this.state.data.followingCount}</RkText>
          <RkText rkType='secondary1 hintColor'>Following</RkText>
        </View>
      </View>
      <View style={[styles.margin, styles.bordered]}>
      <RkText rkType='header3' style={styles.space}>Email</RkText>
      <RkText rkType='secondary1 hintColor'>{this.state.data.email}</RkText>
      <RkText rkType='header3' style={styles.space}>Type</RkText>
      <RkText rkType='secondary1 hintColor'>{this.state.data.type}</RkText>
      <RkText rkType='header3' style={styles.space}>Telephone</RkText>
      <RkText rkType='secondary1 hintColor'>{this.state.data.phone}</RkText>
      </View>

      <View style={styles.buttons}>
        <RkButton style={styles.button} rkType='clear link'>FOLLOW</RkButton>
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
  },
  button: {
    flex: 1,
    alignSelf: 'center',
  },
  margin:{
    margin:4,
  },
}));
