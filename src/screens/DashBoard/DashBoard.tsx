import { Image, StyleSheet, Text, View, TouchableOpacity, RefreshControl, ScrollView, SafeAreaView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import { ImageIndex } from '../../assets/AssetIndex'
import { responsiveHeight } from 'react-native-responsive-dimensions';
import axios from 'axios'
import Internet from '../../InternetCheck/Internet';
import { Camera } from 'react-native-vision-camera';
import Feather from 'react-native-vector-icons/Feather'
import Snackbar from 'react-native-snackbar';


const DashBoard = ({ navigation }: any) => {
    const [isDayButtonEnabled, setIsDayButtonEnabled] = useState(true);
    const [isNightButtonEnabled, setIsNightButtonEnabled] = useState(false);
    const checkCameraPermission = async () => {
        let status = await Camera.getCameraPermissionStatus();
        if (status !== 'authorized') {
            await Camera.requestCameraPermission();
            status = await Camera.getCameraPermissionStatus();
            if (status === 'denied') {
                Alert.alert(
                    'You will not be able to scan if you do not allow camera access',
                );
            }
        }
    };
    useEffect(() => {
        checkCameraPermission();
    }, []);
    const day = "day";
    const night = "night"
    const handleLoginPress = () => {
        console.log('scannn')
        navigation.navigate('QrScanner', { day })
    };
    const [shopName, setShopName] = useState('');
    const [len, setlen] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [pendingdata, setPendingdata] = useState<any>('');
    // const[isConnected , setIsConnected] = useState(false);
    const [role, setRole] = useState('')
    const onRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        await fetchNoData();
        setRefreshing(false);
    };
    const fetchData = async () => {
        try {
            console.log('cccccccccccccccccc')
            const response = await axios.get('https://chawlacomponents.com/api/v1/auth/myprofile');
            const data = response.data;
            console.log('ans', data)
            let role = data?.admin?.role
            setRole(role)
            console.log("role-------------------------", role)
            let fetchedJobProfileName: any;
            if (response.data && response.data.employee) {
                fetchedJobProfileName = response.data.employee.jobProfileId.jobProfileName;
                console.log('profilename', fetchedJobProfileName)
            } else {
                console.error('Invalid API response structure');
            }



            const shopApi = await axios.get(`https://chawlacomponents.com/api/v1/shop`);
            if (shopApi.data && shopApi.data.success && shopApi.data.shops) {
                const shops = shopApi.data.shops;
                console.log('shopppp', shops)
                const matchingShop = shops.find((shop: any) => shop.jobProfile.jobProfileName === fetchedJobProfileName);
                if (matchingShop) {
                    setShopName(matchingShop.shopName);
                    console.log('Matching Shop Name:', shopName);
                } else {
                    console.error('No matching shop found for the job profile name.');
                }
            } else {
                console.error('Invalid API response structure for the second API');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const fetchNoData = async () => {
        const currentDate = new Date();
        const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
        try {
            const response = await axios.get(`https://chawlacomponents.com/api/v2/attendance/ownApproved?date=${formattedDate}`);
            const datalen = response.data.total;
            console.log('datale', datalen)
            setlen(datalen);
            //for pending
            const pendingResponse = await axios.get(`https://chawlacomponents.com/api/v2/attendance/employeeUnderMe`)
            const pendingdata = pendingResponse.data.attendance;
            const pendingData = pendingdata.filter((e: any) => e.status === "pending");
            console.log('pendinglogson dashboard', pendingData.length)
            setPendingdata(pendingData.length)
        }
        catch (err) {
            console.error('Error fetching data:', err);
        }
    }
    useEffect(() => {
        const currentTime = new Date();
        const currentHour = currentTime.getHours();
        const isDayButtonDisabled = currentHour < 7 || currentHour >= 21;
    const isNightButtonDisabled = currentHour < 19 && currentHour >= 9;
    setIsDayButtonEnabled(!isDayButtonDisabled);
            setIsNightButtonEnabled(!isNightButtonDisabled);

        fetchData();
        fetchNoData();
    }, [shopName, len, role]);
    console.log("---------------------", role)
    return (




        <View style={{ backgroundColor: 'white', flex: 1 }}>
            <Navbar navigation={navigation} />
            <ScrollView
                style={{ backgroundColor: 'white' }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View style={{ padding: '6%', marginBottom: '20%', maxHeight: '80%' }} >
                    <View style={{ flexDirection: 'column' }}>
                        {/* <View style={{flexDirection:'row'}}> */}
                        {shopName ? (
                            <Text style={{ color: '#949494', fontWeight: '500', fontSize: 17 }}>{shopName}</Text>
                        ) : <Text style={{ color: '#949494', fontWeight: '500', fontSize: 17 }}>
                            NoShop</Text>}
                        {/* </View> */}
                        <Text style={{ color: '#2E2E2E', fontSize: 20, fontWeight: '700' }}>Today Staff</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            <TouchableOpacity style={{ width: '40%', height: '75%', borderRadius: 6, borderWidth: 1, marginTop: 10, justifyContent: 'center', alignItems: 'center', borderColor: '#DEDEDE' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >
                                    {len ? (<Text style={{ fontSize: 25, fontWeight: '600', color: '#283093', }}>{len}</Text>) : <Text style={{ fontSize: 25, fontWeight: '600', color: '#283093', }}>0</Text>}
                                    <Feather
                                        color={'#283093'}
                                        name="arrow-up"
                                        size={23}
                                    // style={{marginLeft:9}}
                                    />
                                </View>
                                <Text style={{ color: 'black' }} >Check-In</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ width: '40%', height: '75%', borderRadius: 6, borderWidth: 1, marginTop: 10, justifyContent: 'center', alignItems: 'center', borderColor: '#DEDEDE' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }} >
                                    {pendingdata ? (<Text style={{ fontSize: 25, fontWeight: '600', color: '#283093', }}>{pendingdata}</Text>) : <Text style={{ fontSize: 25, fontWeight: '600', color: '#283093', }}>0</Text>}
                                    <Feather
                                        color={'#283093'}
                                        name="arrow-down"
                                        size={23}
                                    // style={{marginLeft:9}}
                                    />
                                </View>
                                <Text style={{ color: 'black' }} >Pending logs</Text>
                            </TouchableOpacity>
                        </View>



                    </View>
                    <View
                        style={{
                            borderBottomColor: '#DEDEDE',
                            borderBottomWidth: StyleSheet.hairlineWidth,
                            marginTop: responsiveHeight(4),
                            marginBottom: '10%'
                        }}
                    />
                    {/* <View > */}
                    <TouchableOpacity style={styles.approvalView} onPress={() => { navigation.navigate('ApprovalLogs') }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}  >
                            <Text style={{ color: '#283093', fontWeight: '500', marginLeft: '5%', fontSize: 17 }}>
                                View Approval Logs
                            </Text>
                            <Image style={{ width: 19, height: 19, marginLeft: '40%' }} source={ImageIndex.squarearrow} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={{...styles.approvalView, marginTop:'8%'}} onPress={() => { navigation.navigate('DailyLogs') }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', }}  >
                            <Text style={{ color: '#283093', fontWeight: '500', marginLeft: '5%', fontSize: 17 }}>
                                Daily Logs
                            </Text>
                            <Image style={{ width: 19, height: 19, marginLeft:'60%' }} source={ImageIndex.squarearrow} />
                        </View>
                    </TouchableOpacity>
                    {/* </View> */}

                </View>
            </ScrollView>
        
            {/* <Internet isConnected=
        {isConnected} setIsConnected={setIsConnected}/> */}
        {/* //just checking for admin  */}
            {role === "admin" ?
                <>
                <View style={{ flexDirection: 'column', marginBottom: responsiveHeight(10), alignItems: 'flex-end', marginRight: '10%' }}>
                    <TouchableOpacity
                        style={{
                            width: '50%',
                            borderRadius: 14,
                            backgroundColor: isDayButtonEnabled ? '#283093' : 'rgba(48, 60, 147, 0.7)',
                            padding: '5%',
                        }}
                        onPress={() => Snackbar.show({
                            text: 'You are not supervisor',
                            backgroundColor: '#FFC72C',
                            duration: 2000,
                        })}>
                    
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Image style={{ width: 19, height: 19 }} source={ImageIndex.scan} />
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={styles.buttonText}>Scan QR (DAY)</Text>
                                <Text style={styles.buttonText}>(7am - 9pm)</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            width: '50%',
                            borderRadius: 14,
                            backgroundColor: isNightButtonEnabled ? '#283093' : 'rgba(48, 60, 147, 0.7)', // Change color based on button state
                            padding: '5%',
                            marginTop: '6%',
                        }}
                        onPress={() => Snackbar.show({
                            text: 'You are not supervisor',
                            backgroundColor: '#FFC72C',
                            duration: 2000,
                        })}>
                    
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Image style={{ width: 19, height: 19 }} source={ImageIndex.scan} />
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={styles.buttonText}>Scan QR (Night)</Text>
                                <Text style={styles.buttonText}>(7pm - 9am)</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

                  
                </> :
                <View style={{ flexDirection: 'column', marginBottom: responsiveHeight(10), alignItems: 'flex-end', marginRight: '10%' }}>
                    <TouchableOpacity
                        style={{
                            width: '50%',
                            borderRadius: 14,
                            backgroundColor: isDayButtonEnabled ? '#283093' : 'rgba(48, 60, 147, 0.7)',
                            padding: '5%',
                        }}
                        onPress={() => isDayButtonEnabled ? navigation.navigate('QrScanner', { shift: 'day' }) : null} // Disable onPress if button is disabled
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Image style={{ width: 19, height: 19 }} source={ImageIndex.scan} />
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={styles.buttonText}>Scan QR (DAY)</Text>
                                <Text style={styles.buttonText}>(7am - 9pm)</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            width: '50%',
                            borderRadius: 14,
                            backgroundColor: isNightButtonEnabled ? '#283093' : 'rgba(48, 60, 147, 0.7)', // Change color based on button state
                            padding: '5%',
                            marginTop: '6%',
                        }}
                        onPress={() => isNightButtonEnabled ? navigation.navigate('QrScanner', { shift: 'night' }) : null} // Disable onPress if button is disabled
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Image style={{ width: 19, height: 19 }} source={ImageIndex.scan} />
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={styles.buttonText}>Scan QR (Night)</Text>
                                <Text style={styles.buttonText}>(7pm - 9am)</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>



            }





        </View>




    )
}
export default DashBoard
const styles = StyleSheet.create({
    approvalView:{
        flexDirection: 'row', alignItems: 'center', borderRadius: 6, backgroundColor: '#ECEDFE', width: '100%', height: '18%', padding: '3%'
    },
    loginButton: {
        backgroundColor: '#283093',
        // justifyContent: 'center',
        // alignItems: 'center',
        height: '7%',
        borderRadius: 14,
        // marginTop: '175%',
        width: '35%',
        position: 'absolute',
        // marginLeft: '60%',
        // marginRight: '5%',
    },
    buttonText: {
        color: 'white',
        paddingLeft: 10,
    },
})


