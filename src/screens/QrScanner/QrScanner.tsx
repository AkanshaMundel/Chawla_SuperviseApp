import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, Vibration, Alert } from 'react-native';
import { Camera, useCameraDevices, useFrameProcessor } from 'react-native-vision-camera';
import { useScanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner';
import { RNHoleView } from 'react-native-hole-view';
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import axios from 'axios';
import Snackbar from 'react-native-snackbar';
import LocalizedString from 'react-native-localization'
import { useRoute } from '@react-navigation/native';

const QrScanner = ({ navigation }: any) => {
    const route=useRoute()
    const {shift}:any = route.params
    console.log(shift);
    let strings = new LocalizedString({

        en: {
            "qrScannedSuccess": "क्यूआर स्कैन सफलतापूर्वक हुआ",
            "alreadyApproved": "पहले से मंजूर",
            "needToPunchIn": "पहले पंच-इन करना होगा",
            "errorScanningBarcode": "बारकोड स्कैन करते समय त्रुटि"

        }
    })
    const devices = useCameraDevices();
    const device = devices.back;
    const [torchOn, setTorchOn] = useState(false);
    const [isFocused, setIsFocused] = useState(true); // Track screen focus

    const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.ALL_FORMATS]);
    const [barcode, setBarcode] = useState<string>(''); // Provide a default value of an empty string
    const [hasPermission, setHasPermission] = useState(false);
    const [isScanned, setIsScanned] = useState(false);

    useEffect(() => {
        checkCameraPermission();
    }, []);

    const checkCameraPermission = async () => {
        const status = await Camera.getCameraPermissionStatus();
        setHasPermission(status === 'authorized');
    };
    

    useEffect(() => {
        toggleActiveState();
    }, [barcodes]);

    const toggleActiveState = () => {
        if (barcodes && barcodes.length > 0 && !isScanned) {
            setIsScanned(true);
            barcodes.forEach(async (scannedBarcode) => {
                if (scannedBarcode.rawValue && scannedBarcode.rawValue !== '') {
                    setBarcode(scannedBarcode.rawValue);
                    console.log(scannedBarcode.rawValue);
                    let data = scannedBarcode.rawValue;
                    try {
                        console.log('ammmmm')
                        let res = await axios.post(`https://chawlacomponents.com/api/v2/attendance/find-employee-by-Qr`, { data,shift });
                        // let res = await axios.post(`https://chawlacomponents.com/api/v2/attendance/find-employee-by-Qr`, { resdata })
                        let resData = await res
                        console.log("resdaata", resData)
                        console.log("iddddddddd", resData.data.employee._id)
                        let pic = resData?.data?.docs?.profilePicture
                        let punch = resData?.data?.punch
                        let empData = resData?.data?.employee
                        let id = resData?.data?.employee._id
                        console.log('punnchhhhh', punch)
                        const singleData = await axios.get(`https://chawlacomponents.com/api/v2/attendance/singleEmployee/${id}`);
                        console.log("??????????????????????????????????????????????????????", singleData?.data);
                        console.log("??????????????????????????????????????????????????????", singleData?.data?.data.length);
                        Snackbar.show({
                            text: `${strings.qrScannedSuccess}`,
                            backgroundColor: 'green',
                            duration: 2000,
                        });
                        let statusfromapi
                        if (singleData?.data && singleData?.data?.data && singleData?.data?.data?.length > 0) {

                            const data = singleData.data.data[0];
                            const date = data.date;

                            console.log('dataaaaaaaaaa', data)
                            console.log('date', date)
                            statusfromapi = data.status;

                        }
                        if (statusfromapi == "approved") {
                            Snackbar.show({
                                text: `${strings.alreadyApproved}`,
                                backgroundColor: 'green',
                                duration: 2000,
                            });
                            navigation.navigate('DashBoard')

                        }

                        else if (singleData?.data?.data.length==0) {
                            // Alert.alert('Need to First Punch-In')
                            Snackbar.show({
                                text: `${strings.needToPunchIn}`,
                                backgroundColor: '#FFC72C',
                                duration: 2000,
                            });
                            navigation.navigate('DashBoard')
                        }
                        else {
                            navigation.navigate('EmployeeDetail', { pic, punch, empData,shift })
                        }

                    }
                    catch (error) {
                        console.log("error while scanning barcode", error)


                        Snackbar.show({
                            text: `${strings.errorScanningBarcode}`,
                            backgroundColor: '#FFC72C',
                            duration: 2000,
                        });
                        navigation.navigate('DashBoard')
                    }
                }
            });
        }
    };

    return (
        device != null &&
        hasPermission && (
            <>
                <StatusBar barStyle="light-content" backgroundColor="#000000" />
                <Camera
                    style={StyleSheet.absoluteFill}
                    device={device}
                    isActive={!isScanned}
                    frameProcessor={frameProcessor}
                    frameProcessorFps="auto"
                    audio={false}
                    enableZoomGesture
                />

                <RNHoleView
                    holes={[
                        {
                            x: widthPercentageToDP('10.5%'),
                            y: heightPercentageToDP('25%'),
                            width: widthPercentageToDP('80%'),
                            height: heightPercentageToDP('30%'),
                            borderRadius: 10,
                        },
                    ]}
                    style={styles.rnholeView}
                />
            </>
        )
    );
};

export default QrScanner;

const overlayBackgroundColor = 'rgba(0, 0, 0, 0)';

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: overlayBackgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    centerBox: {
        width: 250,
        height: 250,
        borderColor: 'white',
        borderWidth: 2,
        alignItems: 'center',

        justifyContent: 'center',
    },
    transparentBackground: {
        width: '100%',
        height: '100%',
        // backgroundColor: 'yellow',
    },
    scanButton: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        alignItems: 'center',
        backgroundColor: '#283093',
        padding: 20,
        borderRadius: 10,
    },
    // scannedDataContainer: {
    //     position: 'absolute',
    //     top: 20,
    //     left: 20,
    //     right: 20,
    //     backgroundColor: 'white',
    //     padding: 10,
    //     borderRadius: 10,
    // },
    container: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },
    scannerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scannerBorder: {
        width: 250,
        height: 250,
        borderWidth: 2,
        borderColor: 'white',
        position: 'relative',
    },
    scannerCorner: {
        width: 16,
        height: 16,
        borderWidth: 2,
        borderColor: '#4CAF50',
        position: 'absolute',
    },
    topLeftCorner: {
        top: -1,
        left: -1,
        borderTopLeftRadius: 8,
        borderLeftWidth: 0,
        borderTopWidth: 0,
    },
    topRightCorner: {
        top: -1,
        right: -1,
        borderTopRightRadius: 8,
        borderRightWidth: 0,
        borderTopWidth: 0,
    },
    bottomLeftCorner: {
        bottom: -1,
        left: -1,
        borderBottomLeftRadius: 8,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
    },
    bottomRightCorner: {
        bottom: -1,
        right: -1,
        borderBottomRightRadius: 8,
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    scannedDataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scannedDataText: {
        fontSize: 20,
        marginTop: 16,
        textAlign: 'center',
        color: 'black',
        margin: 10
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