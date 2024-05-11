import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { useRoute } from '@react-navigation/native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import axios from 'axios';
import { Image } from 'react-native';
// import {BASE_URL} from '../ConfigLinks';
// import { showMessage } from 'react-native-flash-message';
import Snackbar from 'react-native-snackbar';
// const BASE_URL = 'https://chawlacomponents.com/api/v2'
import LocalizedString from 'react-native-localization'

const Camera = ({ navigation, route }: any) => {
    //changing in the 
    let strings = new LocalizedString({
        en:{ 
                "imageUploadSuccess": "चित्र अपलोड सफलतापूर्वक हुआ",
                "approvalSuccess": "मंजूरी सफलतापूर्वक हुई",
                "errorInApprovedAttendance": "मंजूरी करते समय त्रुटि" 
        }
    })

    const [image, setImage] = useState(null);
    const [showPhoto, setShowPhoto] = useState(false);
    const cameraRef = useRef(null);

    // const { total } = route.params || {};
    // const employeeId = total.requestBody.employeeId;
    // const qrData=total.requestBody.data;
    const { id, approved, PunchIn, date,shift } = route.params || {};

    console.log("detail of empyeeeee", id, approved, PunchIn, date);

    const handleTakePhoto = async () => {
        if (cameraRef.current) {
            const options = {
                quality: 1,
                // quality: 0.9,
                width: 500,
                height: 500,
                base64: true,
            };
            try {
                const data = await cameraRef.current.takePictureAsync(options);
                setImage(data.uri);
                setShowPhoto(true);
            } catch (error) {
                console.log('Error taking photo:', error);
            }
        }
    };

    const handleConfirm = () => {
        if (image) {
            imageUpload(image);
        }
    };
    const handleRetake = () => {
        setShowPhoto(false);
        setImage(null);
    };

    console.log('image is here ', image);
    const imageUpload = async (data: any) => {
        const apiUrl = `https://chawlacomponents.com/api/v2/attendance/uploadApproveImage`; // Replace with the backend API URL
        const approveUrl = `https://chawlacomponents.com/api/v2/attendance/approveAttendance`;

        try {
            const formData = new FormData();
            formData.append('file', {
                uri: data,
                name: 'photo.jpg', //name 
                type: 'image/jpeg', // Replace with the appropriate image type if needed
            });
            formData.append('employeeId', id);

            formData.append('date', date);

            const headers = {
                'Content-Type': 'multipart/form-data',
            };
            console.log('I am Form Data', formData);
            let res = await axios.post(apiUrl, formData, {
                headers,
                withCredentials: true,
            });
              //image suucessfully 
            Snackbar.show({
                text: `${strings.imageUploadSuccess}`,
                backgroundColor: 'green',
                duration: 4000,
            });
             
            console.log('Data', res.data);
            const requestData = {
                employeeId: id,
                status: approved, 
                punchInTime: PunchIn,
                date: date,
                shift: shift
            };

            console.log('Data of approved', requestData);
            const response = await axios.patch(approveUrl, requestData);
            console.log('calling after approve ', response)
            // Alert.alert('approved successfully');
            
            Snackbar.show({
                text: `${strings.approvalSuccess}`,
                backgroundColor: 'green',
                duration: 4000,
            });
            navigation.navigate('DashBoard'); 
        } catch (err) {
            // navigation.navigate('Final', { total });
            console.log('Error uploading image:', err);
            // Alert.alert('Error uploading image');
            //message for allert  

            Snackbar.show({
                text: `${strings.errorInApprovedAttendance}`,
                backgroundColor: '#DC143C',
                duration: 4000,
            });
            // navigation.navigate('EmployeeDetail');
        }
    };

    return (
        <View style={{ flex: 1 }}>
            {showPhoto && image && <Image source={{ uri: image }} style={{ flex: 1, margin: '10%' }} />}
            {!showPhoto && (
                <RNCamera
                    ref={cameraRef}
                    style={{ flex: 1 }}
                    captureAudio={false}

                    type={RNCamera.Constants.CaptureTarget}
                />
            )}
            {!showPhoto && (
                <View style={styles.confirmButtonContainer}>
                    <TouchableOpacity onPress={handleTakePhoto} style={styles.confirmButton}>
                        <Text style={styles.confirmButtonText}>Capture Photo</Text>
                    </TouchableOpacity>
                </View>
            )}
            {showPhoto && (
                <View style={styles.confirmButtonContainer}>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            onPress={handleRetake}
                            style={styles.confirmRButton}
                        >
                            <Text style={styles.confirmRButtonText}>Retake</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleConfirm}
                            style={{ ...styles.confirmButton, marginTop: '5%' }}
                        >
                            <Text style={styles.confirmButtonText}>Approve Presence</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    confirmButtonContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20,
        
    },
    confirmRButton: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 5,
        marginHorizontal: 10,
    },
    confirmButton: {
        backgroundColor: '#283093',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 5,
        marginHorizontal: 10,
    },
    confirmButtonText: {
        fontWeight: '600',
        color: 'white',
        textAlign: 'center',
        fontSize: 15,
    },
    confirmRButtonText: {
        fontWeight: '600',

        color: '#283093',
        textAlign: 'center',
    },
    buttonRow: {
        flexDirection: 'column',
    },
});

export default Camera;