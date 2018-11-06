import React from 'react';
import {
  TouchableHighlight,
  View,
  ScrollView,
  Image,
  Platform,
  StyleSheet,
} from 'react-native';
import {
  RkStyleSheet,
  RkText,
  RkTheme,
} from 'react-native-ui-kitten';
import { MainRoutes } from '../../config/navigation/routes';
import { FontAwesome } from '../../assets/icons';
import NavigationType from '../../config/navigation/propTypes';
auxRoutes=[];
export class SideMenu extends React.Component {
  static propTypes = {
    navigation: NavigationType.isRequired,
  };
constructor(props){
  super(props);
  this.filterRoutes();
}

  onMenuItemPressed = (item) => {
    switch(item.id){
      case "SocialMenu":
      this.props.navigation.navigate("ProfileV1");
       break;
       case "EcommerceMenu":
       this.props.navigation.navigate(item.id);
         break;
         case "ArticlesMenu":
         this.props.navigation.navigate("Articles4");
         break;
         case "OtherMenu":
         this.props.navigation.navigate(item.id);
         break;
         case "DashboardsMenu":
         this.props.navigation.navigate('Dashboard');
         break;
         case "NavigationMenu":
        this.props.navigation.navigate('Maps');
        break;

         default:
         break;
    }
  };

  getThemeImageSource = (theme) => (
    theme.name === 'light' ?
      require('../../assets/images/smallLogo.png') : require('../../assets/images/smallLogoDark.png')
  );

  renderIcon = () => (
    <Image style={styles.icon} source={this.getThemeImageSource(RkTheme.current)} />
  );
  filterRoutes=()=>{
    auxRoutes=[];
    for(i =0;i<MainRoutes.length;i++){
      switch(MainRoutes[i].id){
        case "EcommerceMenu":
        auxRoutes.push(MainRoutes[i]);
        break;
        case "ArticlesMenu":
        auxRoutes.push(MainRoutes[i]);
        break;
        case "SocialMenu":
        auxRoutes.push(MainRoutes[i]);
        break;
        case "OtherMenu":
        auxRoutes.push(MainRoutes[i]);
        break;
        case "DashboardsMenu":
        auxRoutes.push(MainRoutes[i]);
        break;
        case "NavigationMenu":
       auxRoutes.push(MainRoutes[i]);
       break;
        default:
        break;
      }
    }

  }
  renderMenu = () => auxRoutes.map(this.renderMenuItem);

  renderMenuItem = (item) => (
    <TouchableHighlight
      style={styles.container}
      key={item.id}
      underlayColor={RkTheme.current.colors.button.underlay}
      activeOpacity={1}
      onPress={() => this.onMenuItemPressed(item)}>
      <View style={styles.content}>
        <View style={styles.content}>
          <RkText
            style={styles.icon}
            rkType='moon primary xlarge'>{item.icon}
          </RkText>
          <RkText>{item.title}</RkText>
        </View>
        <RkText rkType='awesome secondaryColor small'>{FontAwesome.chevronRight}</RkText>
      </View>
    </TouchableHighlight>
  );

  render = () => (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}>
        <View style={[styles.container, styles.content]}>
          {this.renderIcon()}
          <RkText rkType='logo'>Fixer</RkText>
        </View>
        {this.renderMenu()}
      </ScrollView>
    </View>
  )
}

const styles = RkStyleSheet.create(theme => ({
  container: {
    height: 80,
    paddingHorizontal: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border.base,
  },
  root: {
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    backgroundColor: theme.colors.screen.base,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 13,
  },
}));
