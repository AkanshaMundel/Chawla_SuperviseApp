import React, { useState , useEffect} from 'react';
import {
    Button,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    StyleSheet,
    Alert,
    Image

} from 'react-native';
import { useAuthContext } from '../../auth/AuthGuard';
import login from './fetch/services/login';
import { showMessage } from 'react-native-flash-message';
import { ImageIndex } from '../../assets/AssetIndex';
import Snackbar from 'react-native-snackbar';

import LocalizedString from 'react-native-localization'
import DeviceInfo from 'react-native-device-info';
import { NetworkInfo} from 'react-native-network-info';
import axios from 'axios';



const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [userAgent, setUserAgent] = useState('');
    const [ipAddress, setIpAddress] = useState('');
    const [platform, setPlatform] = useState('');

    useEffect(() => {
        async function fetchIp() {
            try {
                const response = await axios.get('https://api.ipify.org?format=json');
                const ipAddress = response.data.ip;
                const { _j } = DeviceInfo.getUserAgent();
                const platform = DeviceInfo.getSystemName();
 
                setIpAddress(ipAddress);
                setUserAgent(_j);
                setPlatform(platform);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
 
        fetchIp();
    }, []);
    console.log("cccccccccccccccccccccccccccccccccc", userAgent)
   console.log("checkkkkkkkkkkkkkkkk",userAgent, ipAddress, platform )
    let strings = new LocalizedString({
        en:{
            "loginSuccess": "लॉगिन सफलतापूर्वक हुआ",
            "loginFailed": "लॉगिन असफल"
        }
    })

    const auth = useAuthContext();
    

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async () => {
     
        const isEmail = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
            email
        );

        const data = isEmail ? { email, password, userAgent , platform, ipAddress } : { phone: +email, password , userAgent , platform, ipAddress};

        // const data = isEmail ? { email, password}:{phone: +email, password };
        console.log("data login<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<newwwwwwwwwwwwww ", data);

        try {
            const res = await login(data);
            console.log("data.userrr", res.data.user);
            console.log("Calling Auth", auth.actions.login(res.data.user));
        
            Snackbar.show({
                text: `${strings.loginSuccess}`,
                backgroundColor: 'green',
                duration: 3000,
            });
        }
        catch (error: any) {
            console.log("login error:", error?.response.data.success);
            if (error?.response.data.success == false) {
                Snackbar.show({
                    text: `${strings.loginFailed}`,
                    backgroundColor: '#DC143C',
                    duration: 3000,
                    
                    
                });
            }

        }

    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white', }}>
            <View style={{}}>


                <View style={styles.container}>
                    <View style={styles.wrapper}>
                        <View style={styles.loginForm}>
                            <Text style={styles.heading}>Supervisor Login</Text>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Email or Phone Number</Text>
                                <TextInput
                                    style={styles.input}
                                    value={email}
                                    onChangeText={text => setEmail(text)}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Password</Text>
                                <View style={styles.passwordInputWrapper}>
                                    <TextInput
                                        style={styles.passwordInput}
                                        value={password}
                                        onChangeText={text => setPassword(text)}
                                        secureTextEntry={!showPassword}
                                    />
                                    <TouchableOpacity
                                        style={styles.eyeButton}
                                        onPress={togglePasswordVisibility}
                                    >
                                        {showPassword ? <Image style={{ width: 20, height: 20, }} source={ImageIndex.eyeoff} /> : <Image source={ImageIndex.eye} />}
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                                <Text style={styles.buttonText}>Login</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'yellow',
        // flex: 1



    },
    wrapper: {
        width: '90%',
        // backgroundColor: 'white'
    },
    loginForm: {
        justifyContent: 'center',
    },
    heading: {
        color: 'black',
        fontFamily: 'Inter',
        fontWeight: '700',
        paddingVertical: 30,
        fontSize: 25,
    },
    inputContainer: {
        paddingBottom: 15,
    },
    label: {
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
        color: 'black',
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
    eyeButton: {
        padding: 8,
    },
    loginButton: {
        backgroundColor: '#283093',
        justifyContent: 'center',
        alignItems: 'center',
        height: 45,
        borderRadius: 5,
        marginTop: 10,
        width: '30%',
        paddingHorizontal: 5,
        paddingVertical: 3,
    },
    buttonText: {
        color: 'white',
        paddingLeft: 10,
    },
});

export default Login;
