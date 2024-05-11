import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity,Image , Dimensions, PixelRatio} from 'react-native';
import { RNCamera } from 'react-native-camera';
import Snackbar from 'react-native-snackbar';
import { RNHoleView } from 'react-native-hole-view';
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import { responsiveHeight } from 'react-native-responsive-dimensions';


const SlipCamera = ({ navigation, route }: any) => {
  
    const [image, setImage] = useState(null);
    const [showPhoto, setShowPhoto] = useState(false);
    const cameraRef = useRef(null);
    // const w1 = Dimensions.get('window')*1.5;
    // width: Dimensions.get('window').height * 0.04,
    // const {width, height} = Dimensions.get('window') * 1.5;
    // let pictureWidth = PixelRatio.getPixelSizeForLayoutSize(width);

    // console.log("pixxel-----------------------------------", width, height, pictureWidth)

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
            // imageUpload(image);
            navigation.navigate('ManualEntry', {image});
        }
    };
    const handleRetake = () => {
        setShowPhoto(false);
        setImage(null);
    };

    console.log('image is here ', image);
    // const imageUpload = async (data: any) => {
    //     const apiUrl = `https://chawlacomponents.com/api/v2/attendance/uploadApproveImage`; // Replace with the backend API URL
    //     const approveUrl = `https://chawlacomponents.com/api/v2/attendance/approveAttendance`;

    //     try {
    //         const formData = new FormData();
    //         formData.append('file', {
    //             uri: data,
    //             name: 'photo.jpg', //name 
    //             type: 'image/jpeg', // Replace with the appropriate image type if needed
    //         });
    //         formData.append('employeeId', id);

    //         formData.append('date', date);

    //         const headers = {
    //             'Content-Type': 'multipart/form-data',
    //         };
    //         console.log('I am Form Data', formData);
    //         let res = await axios.post(apiUrl, formData, {
    //             headers,
    //             withCredentials: true,
    //         });
    //           //image suucessfully 
    //         Snackbar.show({
    //             text: `${strings.imageUploadSuccess}`,
    //             backgroundColor: 'green',
    //             duration: 4000,
    //         });
             
    //         console.log('Data', res.data);
    //         const requestData = {
    //             employeeId: id,
    //             status: approved, 
    //             punchInTime: PunchIn,
    //             date: date,
    //             shift: shift
    //         };

    //         console.log('Data of approved', requestData);
    //         const response = await axios.patch(approveUrl, requestData);
    //         console.log('calling after approve ', response)
    //         // Alert.alert('approved successfully');
            
    //         Snackbar.show({
    //             text: `${strings.approvalSuccess}`,
    //             backgroundColor: 'green',
    //             duration: 4000,
    //         });
    //         navigation.navigate('DashBoard'); 
    //     } catch (err) {
            
    //         console.log('Error uploading image:', err);
           
    //        Snackbar.show({
    //             text: "error from api",
    //             backgroundColor: '#DC143C',
    //             duration: 4000,
    //         });
    //         // navigation.navigate('EmployeeDetail');
    //     }
    // };

    return (
        <View style={{ flex: 1,backgroundColor:'rgba(0,0,0,0.1)' }}>
            {showPhoto && image && 
            <View style={{ justifyContent:'center', alignItems:'center',}}>
            <Text className='text-[#283093]' style={{fontWeight:'bold', fontSize:25, marginBottom:'6%'}}>Uploaded Sheet</Text>
             {/* <Image source={{ uri: image }} style={{ width:'80%', height:'50%', borderRadius:10, }} className='border shadow-md shadow-orange-700'/> */}
             <View style={{
      width: '80%',
      height: '75%',
      borderRadius: 10,
      shadowColor: 'black',
      shadowOffset: { width: 4, height: 7 },
      shadowOpacity: 4,
      shadowRadius: 4,
      elevation: 7, // On Android, you can use the elevation property for shadows.
    }}>
      <Image
        source={{ uri: image }}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 10,
          // resizeMode:'contain'
        }}
      />
    </View>
            </View>
           }
            {!showPhoto && (
              <>
                <RNCamera
                    ref={cameraRef}
                    style={{ flex: 1 }}
                    captureAudio={false}

                    type={RNCamera.Constants.CaptureTarget}
                />
                <RNHoleView
                    holes={[
                        {
                            x: widthPercentageToDP('8%'),
                            y: heightPercentageToDP('8%'),
                            width: widthPercentageToDP('85%'),
                            height: heightPercentageToDP('75%'),
                            borderRadius: 10,
                        },
                    ]}
                    style={styles.rnholeView}
                />
                </>
            )}
            {!showPhoto && (
                <View style={styles.confirmButtonContainer}>
                    <TouchableOpacity onPress={handleTakePhoto} style={styles.confirmButton}>
                        <Text style={styles.confirmButtonText}>Capture Photo</Text>
                    </TouchableOpacity>
                </View>
            )}
            {showPhoto && (
                <View style={styles.confirmButtonContainerr}>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            onPress={handleRetake}
                            style={styles.confirmRButton}
                        >
                            <Text style={styles.confirmRButtonText}>Retake</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleConfirm}
                            style={{ ...styles.confirmButton, }}
                        >
                            <Text style={styles.confirmButtonText}>Confirm</Text>
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
        paddingBottom: responsiveHeight(7),
        // paddingBottom: responsiveHeight(20),
        // backgroundColor: 'rgba(0,0,0,0.1)'
        
    },
    confirmButtonContainerr: {
      // position: 'absolute',
      bottom: 0,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      // paddingBottom: responsiveHeight(7),
      paddingBottom: responsiveHeight(10),
      // backgroundColor: 'rgba(0,0,0,0.1)'
      
  },
    confirmRButton: {
        backgroundColor: '#283093',
        paddingHorizontal: 25,
        paddingVertical: 15,
        borderRadius: 5,
        marginHorizontal: 10,
    },
    confirmButton: {
        backgroundColor: '#283093',
        paddingHorizontal: 25,
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
        fontSize: 15,

        color: 'white',
        textAlign: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
    },
    rnholeView: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

export default SlipCamera;