import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import {
  RkText,
  RkStyleSheet,
} from 'react-native-ui-kitten';
import { GradientButton } from '../../components/gradientButton';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { UIConstants } from '../../config/appConstants';
import { Font } from 'expo'
import FontAwesome from '@expo/vector-icons/fonts/FontAwesome.ttf';
import NavigationType from '../../config/navigation/propTypes';
import StarRating from 'react-native-star-rating';

export class Score extends React.Component {

    static propTypes = {
        navigation: NavigationType.isRequired,
    };
    static navigationOptions = {
        header: null,
    };

  constructor(props) {
    super(props);
    this.order_id = this.props.navigation.getParam('order_id', 0);
    this.technician_id = this.props.navigation.getParam('technician_id', 0);
    this.state = {
      starCount: 3.5,
      fontsAreLoaded:false,
    };
  }

  async componentDidMount() {
    await Font.loadAsync({FontAwesome})
    this.setState({ fontsAreLoaded: true })
  }

  onStarRatingPress(rating) {
    this.setState({
      starCount: rating
    });
  }

  onButtonClick = async() => {
    let json = {technician_id:this.technician_id,
                service_score:this.state.starCount};
    let result = await fetch(`${UIConstants.URL}order/${this.order_id}/score`,{
      method:'POST',
      headers: {'Content-Type': 'application/json'},
      body:JSON.stringify(json),
    });

    if(result.status == 200){
      this.props.navigation.navigate('GridV1');
      return await result.json();
    }
    throw new Error(result.status);
  }

  render = () => (
    <View style={styles.container}>
        <View  style={styles.scroll}>  
            <RkText rkType='primary header4'>How well has the repair been?</RkText>
            <View  style={styles.stars}>  
            {this.state.fontsAreLoaded ? (
            <StarRating
                disabled={false}
                maxStars={5}
                rating={this.state.starCount}
                selectedStar={(rating) => this.onStarRatingPress(rating)}
                />):null}
             </View>       

        </View>       
    <GradientButton
      style={styles.save}
      rkType='large'
      onPress={this.onButtonClick}
      text='Done'
    />
  </View>
    );
}
const styles = RkStyleSheet.create(theme => ({
    container: {
      backgroundColor: theme.colors.screen.base,
      flex: 1,
      flexDirection: 'column',
    },
    scroll:{
        alignItems: 'center',
        height:hp('80%'), 
        width:wp('90%'), 
    },
    stars:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    save: {
      marginVertical: 9,
      marginHorizontal: 9,
    },
  }));