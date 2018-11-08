/* eslint-disable react/no-multi-comp */
import React from 'react';

import { CategoryMenu } from './categoryMenu';
import * as Routes from '../../config/navigation/routesBuilder';
import NavigationType from '../../config/navigation/propTypes';
import { AsyncStorage } from "react-native"

export class LoginMenu extends React.Component {
  static propTypes = {
    navigation: NavigationType.isRequired,
  };
  static navigationOptions = {
    title: 'Login'.toUpperCase(),
  };
  render = () => (
    <CategoryMenu navigation={this.props.navigation} items={Routes.LoginRoutes} />
  );
}

export class NavigationMenu extends React.Component {
  static propTypes = {
    navigation: NavigationType.isRequired,
  };
  static navigationOptions = {
    title: 'Navigation'.toUpperCase(),
  };
  render = () => (
    <CategoryMenu navigation={this.props.navigation} items={Routes.NavigationRoutes} />
  );
}

export class SocialMenu extends React.Component {
  static propTypes = {
    navigation: NavigationType.isRequired,
  };
  static navigationOptions = {
    title: 'Profile'.toUpperCase(),
  };
  render = () => (
    <CategoryMenu navigation={this.props.navigation} items={Routes.SocialRoutes} />
  );
}

export class ArticleMenu extends React.Component {
  static propTypes = {
    navigation: NavigationType.isRequired,
  };
  static navigationOptions = {
    title: 'Orders'.toUpperCase(),
  };
  constructor(){
    super();
    this.getUser();
  }
  state ={
    menu:[],
    user:{}
  }
  getUser = async()=> {
    let res = await AsyncStorage.getItem('currentUser');
    this.setState({user:JSON.parse(res).data});
    await this.filterMenu();
  }
  filterMenu = async() =>{
    let menu = [];
    let exclude = "";
    const { user } = this.state;
    await Routes.ArticleRoutes.forEach((route)=>{
      exclude = user.type=="Technician" ? "newOrder" : "AvaliablesOrders";
      if(route.id !== exclude){
        menu.push(route);
      }
    });
    this.setState({menu});
  }

  render = () => (<CategoryMenu navigation={this.props.navigation} items={this.state.menu} />);
}

export class MessagingMenu extends React.Component {
  static propTypes = {
    navigation: NavigationType.isRequired,
  };
  static navigationOptions = {
    title: 'Messaging'.toUpperCase(),
  };
  render = () => (
    <CategoryMenu navigation={this.props.navigation} items={Routes.MessagingRoutes} />
  );
}

export class DashboardMenu extends React.Component {
  static propTypes = {
    navigation: NavigationType.isRequired,
  };
  static navigationOptions = {
    title: 'Dashboards'.toUpperCase(),
  };
  render = () => (
    <CategoryMenu navigation={this.props.navigation} items={Routes.DashboardRoutes} />
  );
}

export class WalkthroughMenu extends React.Component {
  static propTypes = {
    navigation: NavigationType.isRequired,
  };
  static navigationOptions = {
    title: 'Walkthrough'.toUpperCase(),
  };
  render = () => (
    <CategoryMenu navigation={this.props.navigation} items={Routes.WalkthroughRoutes} />
  );
}

export class EcommerceMenu extends React.Component {
  static propTypes = {
    navigation: NavigationType.isRequired,
  };
  static navigationOptions = {
    title: 'Payments'.toUpperCase(),
  };
  render = () => (
    <CategoryMenu navigation={this.props.navigation} items={Routes.EcommerceRoutes} />
  );
}

export class OtherMenu extends React.Component {
  static propTypes = {
    navigation: NavigationType.isRequired,
  };
  static navigationOptions = {
    title: 'Other'.toUpperCase(),
  };
  render = () => (
    <CategoryMenu navigation={this.props.navigation} items={Routes.OtherRoutes} />
  );
}
