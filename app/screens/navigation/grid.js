    import React from 'react';
    import {
      ScrollView,
      Dimensions,
    } from 'react-native';
    import {
      RkButton, RkStyleSheet,
      RkText,
    } from 'react-native-ui-kitten';
    import { MainRoutes } from '../../config/navigation/routes';
    import NavigationType from '../../config/navigation/propTypes';
    import {
  Notifications} from 'expo';

    const paddingValue = 8;
    var auxRoutes=[];
    export class GridV1 extends React.Component {

      static propTypes = {
        navigation: NavigationType.isRequired,
      };
      static navigationOptions = {
        title: 'Menu'.toUpperCase(),
      };

      state = {
          notification: {},
        };
        componentDidMount(){
          this._notificationSubscription = Notifications.addListener(this._handleNotification);
        }
      constructor(props) {
        super(props);

        this.filterRoutes();
        const screenWidth = Dimensions.get('window').width;
        this.itemSize = {
          width: (screenWidth - (paddingValue * 6)) / 2,
          height: (screenWidth - (paddingValue * 6)) / 2,
        };
      }
      _handleNotification = (notification) => {
        this.setState({notification: notification});
      };



      onItemPressed = (item) => {
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
        console.log(auxRoutes);
        console.log("Main routes:",MainRoutes);
      }

      renderItems = () => auxRoutes.map(route => (
        <RkButton
          rkType='square shadow'
          style={{ ...this.itemSize }}
          key={route.id}
          onPress={() => this.onItemPressed(route)}>
          <RkText style={styles.icon} rkType='primary moon menuIcon'>
            {route.icon}
          </RkText>
          <RkText>{route.title}</RkText>
        </RkButton>
      ));

      render = () => (
        <ScrollView
          style={styles.root}
          contentContainerStyle={styles.rootContainer}>
          {this.renderItems()}
        </ScrollView>
      );
    }

    const styles = RkStyleSheet.create(theme => ({
      root: {
        backgroundColor: theme.colors.screen.scroll,
        padding: paddingValue,
      },
      rootContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
      },
      icon: {
        marginBottom: 16,
      },
    }));
