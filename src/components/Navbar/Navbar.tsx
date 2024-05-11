import {
    Image,
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    Modal,
    TouchableWithoutFeedback,
} from 'react-native';
import React, { useState, useEffect } from 'react'
import { ImageIndex } from '../../assets/AssetIndex';
import { useAuthContext } from '../../auth/AuthGuard';
import axios from 'axios';
import Snackbar from 'react-native-snackbar';
import Internet from '../../InternetCheck/Internet';
import Feather from 'react-native-vector-icons/Feather'
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';

export default function Navbar({navigation}:any) {
    const[isConnected , setIsConnected] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [profilePicture, setProfilePicture] = useState('');
    useEffect(() => {
        fetchProfilePicture();
    }, []);

    const fetchProfilePicture = async () => {
        try {
            const response = await axios.get(`https://chawlacomponents.com/api/v1/auth/myprofile`);
            const data = response.data;
            console.log('navbarrrrrrrrrrrr', data.profilePicture);
            if (data.success && data.profilePicture) {
                setProfilePicture(data.profilePicture);
            }
        } catch (error) {
            console.error('Error fetching profile picture:', error);
        }
    };
    
    const auth = useAuthContext();
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
        console.log('im clicked ');
    };
    const handleFunc = () => {

        auth.actions.logout()

    }
    const handleChange= () => {

    navigation.navigate('ChangePassword')

    }
    console.log('phooot name', auth.authData?.name, auth.authData?.profilePicture)
    return (
        <>
        <View >
            <View style={styles.container}>
                <View style={styles.logoWrapper}>
                    <Image
                        style={styles.logoIcon}
                        resizeMode="cover"
                        source={ImageIndex.logo}
                    />
                    

                    <View style={{flexDirection:'column'}}>
                    <View style={{marginLeft:'2%'}}>
                        <Text style={styles.companyName}>Chawla Ispat</Text>
                    </View>
                    <View style={{marginLeft:'3%'}}>
                            <Text style={styles.versionText}>version 2.4.2</Text>
                        </View>
                        </View>
                       
                    
                </View>
                
                <View style={{flexDirection:'row', marginRight:'5%'}}>
                <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems:'flex-end' , marginRight:'2%',}}>
                    <View style={{ marginRight: 5 }}>
                        <Text style={{color:'black', fontSize:11}} >{auth.authData.name.length>20 ? auth.authData.name.slice(0, 20)+'...': auth.authData.name } </Text>
                    </View>
                    <View className='flex-row '>
                  
                  {isConnected==true? <Text style={{fontWeight:'600',marginLeft:'8%', color:'black'}}>cellular</Text>:<Text style={{fontWeight:'600',marginLeft:'8%'}}>No Net</Text>}
                  {isConnected==true?
                  <Feather
                      color={'blue'}
                      name="wifi"
                      size={18}
                      style={{marginLeft:9, marginRight:2}}
                     
                  />:<Feather
                
                  color={'red'}
                  name="wifi-off"
                  size={18}
                  style={{marginLeft:9, marginRight:2}}
              />} 
              </View>
                    
                </View>
                <View>
                        <TouchableOpacity onPress={toggleModal}>
                            {profilePicture ? (
                                <Image
                                    style={styles.profilePicture}
                                    resizeMode="cover"
                                    source={{ uri: profilePicture }}
                                />
                            ) : (
                                <Image
                                    source={{
                                        uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
                                    }}
                                    style={styles.profilePicture}
                                />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={toggleModal}
            >
                <TouchableWithoutFeedback onPress={toggleModal}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.4)', padding: 30, borderRadius: 10, borderWidth: 0.4, borderColor: 'gray' }}>
                                <TouchableOpacity onPress={handleChange}>

                                                
                                <View style={{ backgroundColor: 'white', paddingHorizontal: 20, paddingVertical: 20, borderRadius: 10 , marginBottom:10}}>
                                <Text style={{ color: '#283093', fontWeight: '500', fontSize: 18 }}>Change Password</Text>
                                </View>
                                </TouchableOpacity>
                        <TouchableOpacity onPress={handleFunc}>

                                  
                            <View style={{ backgroundColor: 'white', paddingHorizontal: 20, paddingVertical: 20, borderRadius: 10 }}>
                                <Text style={{ color: '#283093', fontWeight: '500', fontSize: 18 }}>Logout</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
            
        
        </View>
        <Internet isConnected= 
        
        {isConnected} setIsConnected={setIsConnected}/>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 70,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 16,
        // backgroundColor: 'yellow',
        borderColor: '#D9D9D9',
        borderWidth: 1,
        width:responsiveWidth(100)
    },
    logo: {
        height: 25,
        // marginLeft: 1,
    },
    logoWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor:'pink'
    },
    logoIcon: {
        width: Dimensions.get('window').height * 0.04,
        height: Dimensions.get('window').height * 0.04,
    },
    companyNameWrapper: {
        paddingHorizontal: Dimensions.get('window').width * 0.02,
    },
    companyName: {
        fontSize: Dimensions.get('window').height * 0.025,
        color: '#283093',
        fontWeight: '500',
    },

    profilePicture: {
        width: Dimensions.get('window').height * 0.04,
        height: Dimensions.get('window').height * 0.04,
        borderRadius: Dimensions.get('window').height * 0.02,
        position:'absolute',
        
       
    },
    versionText: {
        fontSize: 14, 
        color: 'black', 
        fontWeight:'600'
        
        
    },
    versionTextWrapper: {
        alignItems: 'center', 
        marginTop: responsiveHeight(5), 
        
    },
})
 