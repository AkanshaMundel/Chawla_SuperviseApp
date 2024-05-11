import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import AuthGuard from './src/auth/AuthGuard';

import FlashMessage from 'react-native-flash-message';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DashBoard from './src/screens/DashBoard/DashBoard';
import QrScanner from './src/screens/QrScanner/QrScanner';
import EmployeeDetail from './src/screens/EmployeeDetail/EmployeeDetail';
import ApprovalLogs from './src/screens/ApprovalLogs/ApprovalLogs';
import Camera from './src/screens/Camera/Camera';
import Internet from './src/InternetCheck/Internet'
import ChangePassword from './src/screens/ChangePassword/ChangePassword'
import Practice from './src/screens/Practice/Practice'
import DailyLogs from './src/screens/DailyLogs/DailyLogs'
import SlipCamera  from './src/screens/SlipCamera/SlipCamera'
import { AlertNotificationRoot } from 'react-native-alert-notification';
import ManualEntry from  './src/screens/ManualEntry/ManualEntry';
import ScanList from './src/screens/ScanList/ScanList'


const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <>
      <FlashMessage position="top" />
      <NavigationContainer>
      <AlertNotificationRoot>
        <AuthGuard>
          <Stack.Navigator initialRouteName="DashBoard">
            <Stack.Screen
              options={{
                headerShown: false,
              }}
              name="DashBoard"
              component={DashBoard}
            />
            <Stack.Screen
              options={{
                headerShown: false,
              }}
              name="QrScanner"
              component={QrScanner}
            />
            <Stack.Screen
              options={{
                headerShown: false,
              }}
              name="EmployeeDetail"
              component={EmployeeDetail}
            />
            <Stack.Screen
              options={{
                headerShown: false,
              }}
              name="ApprovalLogs"
              component={ApprovalLogs}
            />
            <Stack.Screen
              options={{
                headerShown: false,
              }}
              name="Camera"
              component={Camera}
            />
            <Stack.Screen
              options={{
                headerShown: false,
              }}
              name="Internet"
              component={Internet}
            />
            <Stack.Screen
              options={{
                headerShown: false,
              }}
              name="ChangePassword"
              component={ChangePassword}
            />
             <Stack.Screen
              options={{
                headerShown: false,
              }}
              name="DailyLogs"
              component={DailyLogs}
            />
             <Stack.Screen
              options={{
                headerShown: false,
              }}
              name="SlipCamera"
              component={SlipCamera}
            />
             <Stack.Screen
              options={{
                headerShown: false,
              }}
              name="ManualEntry"
              component={ManualEntry}
            />
              <Stack.Screen
              options={{
                headerShown: false,
              }}
              name="ScanList"
              component={ScanList}
            />
             
          </Stack.Navigator>
        </AuthGuard>
        </AlertNotificationRoot>
      </NavigationContainer>
    </>
  );
};

export default App;

const styles = StyleSheet.create({});
