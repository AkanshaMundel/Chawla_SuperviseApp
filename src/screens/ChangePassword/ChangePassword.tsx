import {
    Text,
    TextInput,
    TouchableOpacity,
    View,
    StyleSheet,
  } from 'react-native';
  import React, {useContext, useState} from 'react';
  import Feather from 'react-native-vector-icons/Feather';
//   import {AuthContext} from '../context/AuthContext';
  import {showMessage} from 'react-native-flash-message';
//   import Navbar from './Navbar';
  import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import Snackbar from 'react-native-snackbar';
  
  const ChangePassword = ({navigation}:any) => {
    const [curpassword, cursetPassword] = useState(null);
    const [newpassword, newsetPassword] = useState(null);
    const [confpassword, confsetPassword] = useState(null);
    const [showCurPassword, setShowCurPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfPassword, setShowConfPassword] = useState(false);
    // const {isLoading, isLogin, login, logout} = useContext(AuthContext);
  
    const toggleCurPasswordVisibility = () => {
      setShowCurPassword(!showCurPassword);
    };
  
    const toggleNewPasswordVisibility = () => {
      setShowNewPassword(!showNewPassword);
    };
  
    const toggleConfPasswordVisibility = () => {
      setShowConfPassword(!showConfPassword);
    };
    const curhandlePasswordChange = (text:any) => {
      cursetPassword(text);
    };
    const newhandlePasswordChange = (text:any )=> {
      newsetPassword(text);
    };
    const confhandlePasswordChange = (text:any ) => {
      confsetPassword(text);
    };
    const handleChnagePassword = async () => {
      try {
        if (!curpassword || !newpassword || !confpassword) {
        //   showMessage({
        //     message: 'Please fill in all fields.',
        //     type: 'warning',
        //     floating: true,
        //   });
          Snackbar.show({
            text: 'कृपया सभी स्थानों को भरें',
            backgroundColor: '#FFC72C',
            duration: 2000,
        });
          return;
        }
  
        if (newpassword !== confpassword) {
        //   Snackbar.show({
        //    text: 'New password and confirm password do not match.',
        //    backgroundColor: '#FFC72C',
        //    duration: 2000,
          
        //   });
          Snackbar.show({
            text: 'New password and confirm password do not match',
            backgroundColor: '#DC143C',
            duration: 4000,
        });
          return;
        }
  
        const reqdata = {
          oldPassword: curpassword,
          newPassword: newpassword,
        };
        console.log(reqdata);
        const response = await axios.post(
          `https://chawlacomponents.com/api/v1/auth/changePassword`,
          reqdata,
        );
        if (response.data.success) {
          
          Snackbar.show({
            text: 'पासवर्ड सफलतापूर्वक बदला गया',
            backgroundColor: 'green',
            duration: 4000,
        });
        } else {
        //   showMessage({
        //     message: 'Password change failed. Please check your credentials.',
        //     type: 'danger',
        //     floating: true,
        //     duration: 4000,
        //   });
          Snackbar.show({
            text: 'संकेत शब्द बदलने में असफल। कृपया अपनी साख जांचें',
            backgroundColor: '#DC143C',
            duration: 4000,
        });
        }
      } catch (error) {
        console.error('Error changing password:', error);
      }
      navigation.navigate('DashBoard');
    };
  
    return (
      <View style={{flex:1, backgroundColor:'white'}}>
        <Navbar navigation={navigation} />
  
        <View style={styles.container}>
          <View style={styles.wrapper}>
            <View style={{justifyContent: 'center'}}>
              <Text
                style={{
                  color: 'black',
                  fontWeight: '700',
                  paddingVertical: 30,
                  fontSize: 25,
                }}
              >
                Change Password
              </Text>
              <View style={{paddingBottom: 15}}>
                <Text style={styles.labelTxt}>Current Password</Text>
                <View style={styles.passwordInputWrapper}>
                  <TextInput
                    style={styles.passwordInput}
                    value={curpassword}
                    onChangeText={curhandlePasswordChange}
                    secureTextEntry={!showCurPassword} // Toggle secureTextEntry based on showPassword state
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={toggleCurPasswordVisibility}
                  >
                    <Feather
                      name={showCurPassword ? 'eye-off' : 'eye'}
                      size={18}
                      color={'black'}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{paddingBottom: 15}}>
                <Text style={styles.labelTxt}>New Password</Text>
                <View style={styles.passwordInputWrapper}>
                  <TextInput
                    style={styles.passwordInput}
                    value={newpassword}
                    onChangeText={newhandlePasswordChange}
                    secureTextEntry={!showNewPassword} // Toggle secureTextEntry based on showPassword state
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={toggleNewPasswordVisibility}
                  >
                    <Feather
                      name={showNewPassword ? 'eye-off' : 'eye'}
                      size={18}
                      color={'black'}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{paddingBottom: 15}}>
                <Text style={styles.labelTxt}>Confirm Password</Text>
                <View style={styles.passwordInputWrapper}>
                  <TextInput
                    style={styles.passwordInput}
                    value={confpassword}
                    onChangeText={confhandlePasswordChange}
                    secureTextEntry={!showConfPassword} // Toggle secureTextEntry based on showPassword state
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={toggleConfPasswordVisibility}
                  >
                    <Feather
                      name={showConfPassword ? 'eye-off' : 'eye'}
                      size={18}
                      color={'black'}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{marginTop: 12}}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleChnagePassword}
                >
                  <View style={{flexDirection: 'row'}}>
                    <Feather name="refresh-ccw" size={15} color={'white'} />
                    <Text style={styles.buttonText}>Change Password</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };
  
  export default ChangePassword;
  
  const styles = StyleSheet.create({
    container: {
      // flex: 1,
      // paddingTop: 4,
      alignItems: 'center',
      justifyContent: 'center',
    },
    wrapper: {
      width: '90%',
    },
    labelTxt: {
      color: 'black',
      fontWeight: '400',
      fontFamily: 'Inter',
      paddingBottom: 10,
      marginRight: 12,
      paddingTop: 12,
    },
    input: {
      marginBottom: 12,
      borderWidth: 1,
      borderColor: '#666666',
      borderRadius: 5,
      paddingHorizontal: 14,
    },
    button: {
      backgroundColor: '#283093',
      // padding: 5,
      justifyContent: 'center',
      alignItems: 'center',
      // width:102,
      height: 45,
      // padding: 10,
      borderRadius: 5,
      marginTop: 10,
      width: '40%',
      paddingHorizontal: 5,
      paddingVertical: 3,
      // height: '20%',
    },
    buttonText: {
      color: 'white',
      paddingLeft: 7,
      fontSize: 14,
      // textAlign: 'center',
    },
    link: {
      backgroundColor: '#283093',
      color: 'white',
      padding: 10,
      borderRadius: 10,
    },
    eyeButton: {
      padding: 8,
    },
    passwordInputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#666666',
      borderRadius: 5,
      paddingHorizontal: 10,
    },
    passwordInput: {
      flex: 1,
      paddingVertical: 8,
      color: 'black',
    },
  });
  