import { Platform } from 'react-native';

export class UIConstants {
  static AppbarHeight = Platform.OS === 'ios' ? 44 : 56;
  static StatusbarHeight = Platform.OS === 'ios' ? 20 : 0;
  static HeaderHeight = UIConstants.AppbarHeight + UIConstants.StatusbarHeight;
  static URL = 'http://192.168.1.2:8000/api/';
  //static URL = 'https://fixercr.herokuapp.com/api/';
}
