import React from 'react';
import {
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  RkText,
  RkStyleSheet,
  RkChoice,
} from 'react-native-ui-kitten';
import { GradientButton } from '../../components/gradientButton';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { AsyncStorage } from "react-native"
import { UIConstants } from '../../config/appConstants';
import Toast from 'react-native-whc-toast'
import NavigationType from '../../config/navigation/propTypes';


export class TechnicianCategories extends React.Component {

  static propTypes = {
    navigation: NavigationType.isRequired,
  };
  static navigationOptions = {
    title: 'What you fix?'.toUpperCase(),
  };

  constructor(props){
    super(props)
    this.getCategories();    
  }

  componentDidMount(){
    const from = this.props.navigation.getParam('from', 'no');
    this.setState({from});
  }

  state = {
    user:'',
    categories:[],
    categoriesSelected:[],
  };

  onButtonClick = () =>{
    const { categoriesSelected } = this.state;
    if(categoriesSelected.length == 0){
      this.refs.toast.show("please select at least 1 category");
    }
    else{
      this.registerCategories();
    }
  }

  getCategories = async()=> {
    let user = await AsyncStorage.getItem('currentUser');
    this.setState({user:JSON.parse(user).data});
    const { userable:{id} } = this.state.user;
    let result = await fetch(`${UIConstants.URL}category/${id}/technician`);
    let categories = await result.json(); 
    let selected = [];
    await categories.forEach(category => {
       if(category.state){
         selected.push(category.id);
       }
    });
    this.setState({categories});  
    this.setState({categoriesSelected:selected});
    console.log("SELECTED",this.state.categoriesSelected);
  }

  onSelectCategory = category => () => {
    const aux = [...this.state.categoriesSelected];
    const index = aux.findIndex(function (id) { return id == category.id;});
    index == -1 ?  aux.push(category.id) : aux.splice(index,1);
    this.changeCategoryState(category);
    this.setState({ categoriesSelected:  aux});
  }
  
  changeCategoryState = (category) => {
    const aux = [...this.state.categories];
    const index = aux.findIndex(function (element) { return element.id == category.id;});
    aux[index].state = !aux[index].state;
    this.setState({ categories:  aux});
  }

  registerCategories = async() => {
    const {user:{userable:{id}}, categoriesSelected,from} = this.state;
    const json = {categories:categoriesSelected};
    let result = await fetch(`${UIConstants.URL}technician/${id}/categories`,{
      method:'POST',
      headers: {'Content-Type': 'application/json'},
      body:JSON.stringify(json),
    });

    if(result.status == 200){
      if(from==='login'){
        this.props.navigation.navigate('GridV1');
      }
      else this.refs.toast.show("Updated");

      return await result.json();
    }
    throw new Error(result.status);
  }

  renderItems = () =>{
    const { categories } = this.state;
    return categories.map(category =>(
      <TouchableOpacity choiceTrigger key={category.id} 
      onPress={this.onSelectCategory(category)}>
        <View style={styles.row}>
          <RkText rkType='header6'>{category.description}</RkText>
          <RkChoice rkType='clear' selected ={category.state}  style={styles.check} />
        </View>
      </TouchableOpacity>
    ));
  } 

  render = () => (
    <View style={styles.container}>
      <Toast ref="toast"/>
      <ScrollView style={styles.scroll}>
        <View style={styles.section}>
          <View style={[styles.row, styles.heading]}>
            <RkText rkType='primary header6'>Choose the options that you know how to repair</RkText>
          </View>
            {this.renderItems()}
        </View>
      </ScrollView>
      <GradientButton
        style={styles.save}
        rkType='large'
        onPress={this.onButtonClick}
        text='Save'
      />
    </View>
  )
}

const styles = RkStyleSheet.create(theme => ({
  container: {
    backgroundColor: theme.colors.screen.base,
    flex: 1,
    flexDirection: 'column',
  },
  header: {
    paddingVertical: 25,
  },
  section: {
    marginVertical: 25,
  },
  heading: {
    paddingBottom: 12.5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border.base,
    alignItems: 'center',
  },
  rowButton: {
    flex: 1,
    paddingVertical: 24,
  },
  check: {
    marginVertical: 14,
  },
  scroll:{
    height:hp('80%'), 
    width:wp('100%'), 
  },
  save: {
    marginVertical: 9,
    marginHorizontal: 9,
  },
}));
