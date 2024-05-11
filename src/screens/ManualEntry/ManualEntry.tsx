import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Alert, ScrollView, Modal } from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar';
import { Dialog, ALERT_TYPE, AlertNotificationDialog } from 'react-native-alert-notification';
import axios from 'axios';
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { ImageIndex } from '../../assets/AssetIndex';
import { Picker } from '@react-native-picker/picker';

const ManualEntry = ({ route, navigation }: any) => {
    const [manualp, setManualp] = useState<any>();
    const [registerp, setRegisterp] = useState<any>();
    const [shop, setshop] = useState<any>();
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [dateAdd, setdateAdd] = useState<any>('00/00/00');
    const [datestate, setdateState] = useState<any>();
    const [selectedImageUrl, setSelectedImageUrl] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedOption2, setSelectedOption2] = useState('');
    const [err, setErr] = useState<any>('');
    const { image } = route.params || {};
    console.log("image on manualentryyy page", image)

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };
    const handleOpenButtonPress = (imageUrl: any) => {
        console.log('im from here img', imageUrl);
        setSelectedImageUrl(imageUrl);
        setIsModalVisible(!isModalVisible);
    };

    const handleConfirm = (date: any) => {
        // console.warn("A date has been picked: ", date);
        console.log("selected date", date)
        const formatted = new Date(date)

        // Format the date as "26-10-23"
        const formattedDate = formatted.toLocaleDateString('en-GB', {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\//g, '-').slice(-8);
        console.log("h0000000000000000000", formattedDate)

        const dateObject = new Date(date);

        // Get the date in YYYY-MM-DD format
        const formattedDatestate = dateObject.toISOString().split('T')[0];

        console.log("state date..................", formattedDatestate);
        setdateState(formattedDatestate)
        setdateAdd(formattedDate)

        hideDatePicker();

    };
    const hideDatePicker = () => {
        setDatePickerVisibility(false);

    };


    console.log("shopppppp", shop)

    const fetchshop = async () => {
        try {
            console.log("hiiii")
            const response = await axios.get('https://chawlacomponents.com/api/v1/auth/myprofile');
            const data = response.data;
            console.log('ans----------', data)
            let shopp = data?.shop?.shopName
            setshop(shopp);
            console.log("shoopp", shopp);

        }
        catch (err) {
            console.log(err);
            Alert.alert(`${err}`)
        }
    }
    console.log("shoppoutside", shop, err)
    useEffect(() => {
        fetchshop();
    }, [])
    const handleConfirmUpdate = async () => {
        if (!manualp || !registerp || !datestate || !shop|| !selectedOption2) {
            setErr("All fields required");
            // Alert.alert("All fields are required")
            Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: 'Alert',
                textBody: 'All fields are required',
                button: 'close',
            })
            
            
            return;
        }
        console.log("data comming in api", shop, manualp, registerp, dateAdd, datestate,selectedOption2)
        const apiScan = `https://chawlacomponents.com/api/v2/scanSlip/add`;
        try {
            const formData = new FormData();
            formData.append('file', {
                uri: image,
                name: 'photo.jpg', //name 
                type: 'image/jpeg', // Replace with the appropriate image type if needed
            });
            formData.append('registered', registerp)
            formData.append('manual', manualp)
            formData.append('date', datestate)
            formData.append('shopName', shop)
            formData.append('shift', selectedOption2)
            const headers = {
                'Content-Type': 'multipart/form-data',
            };
            console.log('I am Form Data of manuall', formData);


            const ressp = await axios.post(apiScan, formData, {
                headers,
                withCredentials: true,
            })
            Dialog.show({
                type: ALERT_TYPE.SUCCESS,
                title: 'Success',
                textBody: 'Successfully uploaded sheet',
                button: 'close',

            })


        }
        catch (error) {
            console.log("errror,", error)
            Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: 'Danger',
                textBody: 'failed to update',
                button: 'close',
            })
        }
        navigation.navigate('DailyLogs');
    }
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Navbar navigation={navigation} />
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: '2%' }}>
                <Text className='text-[#283093]' style={{ fontWeight: 'bold', fontSize: 25, }}>Uploaded Sheet</Text>
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center', maxHeight: '50%' }}>
                {/* <View style={{
                    width: '80%',
                    height: '90%',
                    borderRadius: 10,
                    shadowColor: 'black',
                    shadowOffset: { width: 1, height: 7 },
                    shadowOpacity: 4,
                    shadowRadius: 4,
                    elevation: 7,
                   


                }}> */}
                <Image
                    source={{ uri: image }}
                    style={{
                        width: 249,
                        height: 300,
                        borderRadius: 10,
                        // aspectRatio: 4 / 5,
                        // resizeMode:'contain'
                        // resizeMode:'cover'
                    }}
                />
                {/* </View> */}
            </View>



            <ScrollView style={{ marginTop: '6%' }}>
                {/* <View style={{ flexDirection:'row',marginLeft:'10%' , alignItems:'center', justifyContent:'space-between',marginRight:'20%' }}>

<Text style={{ color:'black', fontSize:20, fontWeight:'600', marginBottom:'2%', marginTop:'2%' }}>Uploaded Image</Text>
<TouchableOpacity onPress={() => handleOpenButtonPress(image)}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Text
                                                        style={{
                                                            color: 'black',
                                                            fontFamily: 'Inter-Medium',
                                                            textDecorationLine:'underline',
                                                            fontSize:15
                                                        }}>
                                                        Open
                                                    </Text>
                                                    <Image style={{ width: 15, height: 15, marginLeft: 4 }} source={ImageIndex.arrowout} />
                                                </View>
                                            </TouchableOpacity>

               </View> */}
                <View style={{ flexDirection: 'column' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'column', }}>
                            <Text style={{ color: 'black', fontSize: 20, fontWeight: '600', marginBottom: '2%' }}>Manual Entry</Text>
                            <TextInput
                                style={{
                                    borderColor: '#DEDEDE',
                                    borderRadius: 8,
                                    borderWidth: 1, width: '120%', color: 'black',
                                }}
                                placeholder="Enter manual entry"
                                keyboardType='numeric'

                                value={manualp}
                                onChangeText={(text) => setManualp(text)}
                            />
                        </View>
                        <View style={{ flexDirection: 'column', marginLeft: '-13%' }}>
                            <Text style={{ color: 'black', fontSize: 20, fontWeight: '600', marginBottom: '2%', marginTop: '2%' }}>Registerd Entry</Text>
                            <TextInput
                                style={{
                                    borderColor: '#DEDEDE',
                                    borderRadius: 8,
                                    borderWidth: 1, width: '110%',
                                    color: 'black'
                                }}
                                placeholder="Enter Register entry"
                                keyboardType='numeric'
                                value={registerp}
                                onChangeText={(text) => setRegisterp(text)}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'column', marginLeft: '12%' }}>

                        <Text style={{ color: 'black', fontSize: 20, fontWeight: '600', marginBottom: '2%', marginTop: '2%' }}>Select Date</Text>
                        <TouchableOpacity onPress={showDatePicker} style={{ borderWidth: 1, margin: 1, borderRadius: 8, padding: '4%', width: '90%', borderColor: '#DEDEDE', }}>
                            <View><Text style={{ color: 'black' }}>{dateAdd}</Text></View>
                            {/* {punchDate.toString() || '00/00/00' */}

                        </TouchableOpacity>
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            onConfirm={handleConfirm}
                            onCancel={hideDatePicker}
                        />
                    </View>
                       <View style={{ flexDirection: 'column', width: '80%' , marginLeft:'12%'}}>

                                        <Text style={{ color: 'black', fontWeight: '600', fontSize: 20,marginTop: '2%' ,marginBottom:'2%' }}>Shift</Text>
                                        <View style={{
                                            width: '100%',
                                            //    paddingHorizontal:10,
                                            //  backgroundColor:'pink',
                                            borderColor: '#DEDEDE',
                                            borderRadius: 10,
                                            borderWidth: 1,

                                        }}>

                                            <Picker
                                                style={{

                                                    //    backgroundColor: 'pink',
                                                    // color: '#283093',
                                                    color: 'black',
                                                    fontWeight: '600',
                                                    borderRadius: 8,
                                                    //    backgroundColor:'yellow',



                                                }}
                                                selectedValue={selectedOption2}
                                                onValueChange={itemValue => setSelectedOption2(itemValue)}
                                            >
                                                <Picker.Item label="Select shift" value="shift" />
                                                <Picker.Item label="Day" value="day" />
                                                <Picker.Item label="Night" value="night" />

                                            </Picker>
                                        </View>
                                    </View>
                </View>

                <View style={{ flexDirection: 'column', marginTop: '4%', alignItems: 'center' }}>



                    <TouchableOpacity
                        onPress={handleConfirmUpdate} style={{
                            ...styles.modalBtn, backgroundColor: '#283093',
                            borderColor: '#DEDEDE',
                            borderRadius: 10,
                            shadowColor: '#171717',
                            elevation: 5, paddingVertical: '4%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
                        }}>
                        <Feather
                            name="check-circle"
                            size={16}
                            color={'white'}
                            style={{ marginRight: '3%' }}


                        />
                        <Text style={{ color: 'white', fontSize: 16, marginLeft: 6 }}>Done</Text></TouchableOpacity>
                </View>
                {/* {err &&   Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: 'Alert',
                textBody: 'All fields are required',
                button: 'close',
            })} */}

            </ScrollView>
            {selectedImageUrl && (
                <Modal
                    visible={isModalVisible}
                    animationType="fade"
                    transparent={true}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setIsModalVisible(false)}
                            >
                                <Image style={{ width: 20, height: 25, marginTop: 3 }} source={ImageIndex.cross} />
                                {/* <Icon name="close" size={20} color="black" /> */}
                            </TouchableOpacity>
                            <Image
                                source={{ uri: selectedImageUrl }}
                                style={styles.modalImage}
                                resizeMode="contain"
                            />

                        </View>
                    </View>
                </Modal>

            )}








        </View>
    )
}

export default ManualEntry

const styles = StyleSheet.create({
    modalBtn: {
        borderRadius: 8, backgroundColor: '#283093', width: '33%', padding: '1%', paddingVertical: '3%', alignItems: 'center',
    },
    modalImage: {
        width: '90%',
        height: undefined,
        aspectRatio: 1, // To maintain a square format
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 15,
        color: 'white',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 20,
        alignItems: 'center',
    },
})