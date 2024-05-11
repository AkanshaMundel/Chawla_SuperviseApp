import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, Dimensions, } from 'react-native';
import { ImageIndex } from '../../assets/AssetIndex';
import Navbar from '../../components/Navbar/Navbar';
// import { showMessage } from 'react-native-flash-message';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import axios from 'axios';


const EmployeeDetail = ({ route, navigation }: any) => {
    // Get the data from the navigation route
    const { pic, punch, empData,shift } = route.params;
    console.log('dataon emplyy', pic, punch, empData)
    const id = empData._id;

    const handleConfirm = async () => {
        try {
            console.log('calling');
            const singleData = await axios.get(`https://chawlacomponents.com/api/v2/attendance/singleEmployee/${id}`);

            // Check if there is data in the API response
            if (singleData.data && singleData.data.data && singleData.data.data.length > 0) {
                // Extract date and punchIn from the first entry in the data array
                const data = singleData.data.data[0]; // Assuming there's only one entry
                const date = data.date;
                // const punchIn = data.punches[0]?.punchIn; // Use optional chaining in case punches[0] is undefined
                console.log('dataaaaaaaaaa', data)
                console.log('date', date)
                const punches = data.punches;
                console.log('punches', punches)
                let PunchIn;
                // Extract punchIn times from the punches array
                // const punchIn = punches.map((punch: any) => punch[0].punchIn);
                // console.log('punchessingleeee', punchIn)
                if (punches.length > 0) {
                    PunchIn = punches[0].punchIn;
                    console.log('First punchIn time:', PunchIn);
                } else {
                    console.log('No punches found in the array.');
                }

                const approved = 'approved';
                console.log("single data on employeeffinalchhh: ", id, approved, PunchIn, date);
                navigation.navigate('Camera', { id, approved, PunchIn, date,shift });
            } else {
                console.log('No data found in the API response');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    // const handleConfirm = async () => {
    //     try {
    //         console.log('calling')
    //         const singleData = await axios.get(`https://chawlacomponents.com/api/v1/attendance/singleEmployee/${id}`);

    //         const data = singleData.data.data
    //         const date = data.date
    //         const punch = data.punches[0].punchIn
    //         const approved = 'approved'
    //         console.log("signledata on empy ", data)
    //         navigation.navigate('Camera', { id, approved, punch, date, })

    //     } catch (error) {
    //         console.error('Error:', error);
    //     }

    //     // try {
    //     //     axios.post(`https://chawlacomponents.com/api/v2/attendance/addAttendance`, { id }) // Make the API call using the requestBody from id:_id
    //     //         .then(async (response) => {
    //     //             console.log("getting from comfim emp ", response);
    //     //             const { success, message } = response.data;
    //     //             if (success) {
    //     //                 let { data } = await axios.post(`https://chawlacomponents.com/api/v1/notifications`, { id, notificationType: 'Attendance', message: `Attendance of ${empData.name} ${punch}` })
    //     //                 console.log("Attendance Message", data);
    //     //                 // alert(`${str1} successfully.`);
    //     //                 showMessage({
    //     //                     message: message,
    //     //                     type: 'success',
    //     //                     duration: 5000,
    //     //                     floating: true
    //     //                 })
    //     //                 navigation.navigate('Camera');
    //     //             } else {
    //     //                 Alert.alert('Login as Supervisor')
    //     //             }
    //     //         })
    //     //         .catch(err => {
    //     //             // alert('Error:', error.message);
    //     //             showMessage({
    //     //                 message: err.response.data.message,
    //     //                 type: 'info',
    //     //                 duration: 5000,
    //     //                 floating: true
    //     //             })

    //     //         });
    //     // } catch (err) {
    //     //     // alert('Error:', error.message);
    //     //     showMessage({
    //     //         message: err.response.data.message,
    //     //         type: 'info',
    //     //         duration: 5000,
    //     //         floating: true
    //     //     })

    //     // }
    // };
    return (
        <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
            <Navbar navigation={navigation} />
            <View style={{ padding: 12, marginBottom: 30 }} >
                <Text style={{ fontSize: 25, fontWeight: '700', color: '#2E2E2E', justifyContent: 'center', }}>Employee Details for {shift}</Text>
            </View>

            <View style={styles.container}>
                {pic ? (<Image source={{ uri: pic }} style={styles.profileImage} />) : (<Image
                    source={{
                        uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
                    }}
                    style={styles.profileImage}
                />)}

                <Text style={styles.name}>{empData.name}</Text>
                <View style={{ flexDirection: 'column', alignItems: 'center' }}>


                    <Text style={{ color: '#2E2E2E', fontSize: 12, }}>GroupName: {empData.groupId.groupName}</Text>
                    {/* <Text style={{ color: '#2E2E2E', fontSize: 18, marginLeft: 8, fontWeight: '700' }}>|</Text> */}
                    <Text style={{ color: '#2E2E2E', fontSize: 12, marginLeft: 9 }}>JobProfileName: {empData.jobProfileId.jobProfileName}</Text>
                </View>
            </View>
            <View style={{ marginTop: responsiveHeight(30),  }}>
                <TouchableOpacity style={styles.confirmView} onPress={handleConfirm}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', fontSize: 18 }}>Confirm Employee</Text>
                        <Image style={{ width: 19, height: 19, marginLeft: 12 }} source={ImageIndex.arrowright} />
                    </View>
                </TouchableOpacity>
            </View>

        </View>
    );
};


export default EmployeeDetail;

const styles = StyleSheet.create({
    confirmView :{
        backgroundColor: '#283093', marginLeft: 20, marginRight: 20, borderRadius: 9, padding: 20 , 
    },
    container: {
        padding: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F0F0F0',
        marginLeft: '5%',
        marginRight: '5%',
        borderRadius: 9,
        borderWidth: 1,
        borderColor: '#DEDEDE',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black'
    },
    email: {
        fontSize: 18,
        color: 'gray',
    },
    profilePicture: {
        width: Dimensions.get('window').height * 0.04,
        height: Dimensions.get('window').height * 0.04,
        borderRadius: Dimensions.get('window').height * 0.02,
    },
});