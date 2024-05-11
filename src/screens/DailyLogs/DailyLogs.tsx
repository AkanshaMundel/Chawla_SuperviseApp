import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    FlatList,
    TouchableOpacity,
    Modal,
    Image,
    RefreshControl,
    TextInput,
    Button,
    ActivityIndicator,
    Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import Feather from 'react-native-vector-icons/Feather';
import Snackbar from 'react-native-snackbar';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { ImageIndex } from '../../assets/AssetIndex';
import { Dialog, ALERT_TYPE, Toast } from 'react-native-alert-notification';
import LoadingScreen from '../../components/loading/LoadingScreen';

const DailyLogs = ({ navigation }: any) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>([]);
    const [isModalVisible2, setModalVisible2] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isDatePickerVisibleT, setDatePickerVisibilityT] = useState(false);
    const [isDatePickerVisibleTable, setDatePickerVisibilityTable] = useState(
        false,
    ); //for time after table
    const [selectedOption, setSelectedOption] = useState('shop'); //shop
    const [selectedOptionshift, setSelectedOptionshift] = useState('day'); //shift fliter
    const [selectedOption1, setSelectedOption1] = useState(''); //grpppp
    const [refreshing, setRefreshing] = useState(false);
    const [groupname, setgroupName] = useState<any>([]);
    const [punchTime, setpunchTime] = useState<any>(''); //punchout time manually
    const [punchTimeApi, setpunchTimeApi] = useState<any>(''); //store correct time format of punchout
    const [punchDate, setpunchDate] = useState<any>('00/00/00'); //for showing in modal formated selected date
    const [punchDateApi, setpunchDateApi] = useState<any>('');
    const [remark, setremark] = useState<any>('');
    const [selectedOption2, setSelectedOption2] = useState<any>('shift'); //shift
    const [selectedWorkItem, setSelectedWorkItem] = useState<any>(null); //storing the value from flatlist
    const [id, setid] = useState<any>(null);
    const [manualNumber, setManualNumber] = useState<any>(0);
    const [registeredNo, setRegisteredNo] = useState<any>(0);
    const [TotalNumber, setTotalNumber] = useState<any>(0);
    const [pendingNumber, setPenderingNumber] = useState<any>(0);
    const [shop, setshop] = useState<any>();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [shiftApi, setShiftApi] = useState<any>('');
    const [err, seterr] = useState('');
    // const [dataday, setDataday] = useState<any>([]);
    // const [data, setData] = useState<any>([]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    };

    const openModal2 = () => {
        // setSelectedWorkItem(item);
        setModalVisible2(true);
    };

    const closeModal2 = () => {
        setModalVisible2(false);
        setSelectedWorkItem(null); //puchin null
        setpunchDateApi(null); //date null
        setremark(null); //remark
        setpunchTime('0.00AM');
        setpunchDate('00/00/00');
        setpunchTimeApi(null); //time
        setSelectedOption2(null);
        setid(null);
        setShiftApi(null);
        seterr('');
    };
    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };
    const showDatePickerTable = () => {
        console.log('-----------------------------------');
        setDatePickerVisibilityTable(true);
    };
    const hideDatePickerTable = () => {
        setDatePickerVisibilityTable(false);
    };
    const showDatePickerT = () => {
        setDatePickerVisibilityT(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    // const handleConfirm = (date: any) => {
    //     console.warn("A date has been picked: ", date);
    //     console.log("A date has been picked: ", date);
    //     if (date) {
    //         const formattedDate = date.slice(0, 10);
    //         console.log("dateeeslice", formattedDate)
    //         setpunchDate((prevFromDate)=>{
    //             return formattedDate
    //         });
    //     }

    //     hideDatePicker();
    // };
    const handleConfirm = (date: any) => {
        // console.warn("A date has been picked: ", date);
        console.log('selected date', date);
        const formatted = new Date(date);

        // Format the date as "26-10-23"
        const formattedDate = formatted
            .toLocaleDateString('en-GB', {
                year: '2-digit',
                month: '2-digit',
                day: '2-digit',
            })
            .replace(/\//g, '-')
            .slice(-8);
        console.log('h0000000000000000000', formattedDate);
        const originalDate = date;
        console.log('original date', originalDate);
        setpunchDate(formattedDate);

        hideDatePicker();
    };
    const handleConfirmTable = (date: any) => {
        const dateselected = new Date(date);
        console.log('date-------------------------------', dateselected);
        // const formattedDatestate = dateselected.toISOString().split('T')[0];
        // console.log("formatedd---------------------",formattedDatestate)
        // prevDate.setDate(prevDate.getDate() - 1);
        setSelectedDate(dateselected);
        hideDatePickerTable();
    };

    // const handleConfirmT = (dateTime: any) => {
    //     console.log("time seleteced", dateTime)
    //     console.warn("A date has been picked: ", dateTime);
    //     if (dateTime) {
    //         // Format the selected time as desired (e.g., HH:mm AM/PM)
    //         const hours = dateTime.getHours() % 12 || 12;
    //         const minutes = dateTime.getMinutes();
    //         const ampm = dateTime.getHours() >= 12 ? 'PM' : 'AM';
    //         const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;

    //         // Use a functional update to access the updated state value
    //         setpunchTime((prevFromTime: any) => {
    //             return formattedTime; // is displaying on uii
    //         });
    //         const originalDate = new Date(dateTime);

    //         // Create a new date object to adjust the time
    //         const adjustedDate = new Date(originalDate);
    //         adjustedDate.setUTCHours(adjustedDate.getUTCHours() + 5); // Adding 5 hours
    //         adjustedDate.setUTCMinutes(adjustedDate.getUTCMinutes() + 30); // Adding 30 minutes

    //         // Convert the adjusted date back to an ISO string
    //         const adjustedDateTimeString = adjustedDate.toISOString();
    //         setpunchTimeApi(adjustedDateTimeString); // sending in apiii
    //         console.log("Original Date: ", originalDate);
    //         console.log("Adjusted Date: ", adjustedDateTimeString);
    //     }

    //     hideDatePickerT();
    // };
    const handleConfirmT = (time: any) => {
        console.log('selectedtime', time);
        const dateTime = new Date(time);
        console.log('selectedtimenew date', dateTime);
        if (dateTime) {
            // Format the selected time as desired (e.g., HH:mm AM/PM)
            const hours = dateTime.getHours() % 12 || 12;
            const minutes = dateTime.getMinutes();
            const ampm = dateTime.getHours() >= 12 ? 'PM' : 'AM';
            const formattedTime = `${hours}:${minutes < 10 ? '0' : ''
                }${minutes} ${ampm}`;
            // Use a functional update to access the updated state value
            console.log('FORMATEDTIME', formattedTime);
            setpunchTime((prevFromTime: any) => {
                return formattedTime;
            });

            // Create a new date object to adjust the time
            const adjustedDate = new Date(dateTime);
            adjustedDate.setUTCHours(adjustedDate.getUTCHours() + 5); // Adding 5 hours
            adjustedDate.setUTCMinutes(adjustedDate.getUTCMinutes() + 30); // Adding 30 minutes

            // Convert the adjusted date back to an ISO string
            const adjustedDateTimeString = adjustedDate.toISOString();

            setpunchTimeApi(adjustedDateTimeString); // sending in apiii
            // console.log("Original Date: ", dateTime);
            console.log('Adjusted Date: ', adjustedDateTimeString);
        }
        hideDatePicker();
    };
    const hideDatePickerT = () => {
        setDatePickerVisibilityT(false);
    };

    const handleDone = async () => {
        if (!remark || !punchTimeApi || !punchDate) {
            seterr('All fields are mandatory');
            Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: 'Alert',
                textBody: 'All fields are required',
                button: 'close',
            });
            return;
        }
        const approveUrl = `https://chawlacomponents.com/api/v2/attendance/updatePunchOut/${id}`;
        try {
            console.log('id', id);
            console.log('punchin ', selectedWorkItem);
            console.log('punchout time', punchTimeApi);
            console.log('shift', shiftApi);
            console.log('date', punchDateApi);
            console.log('remark', remark);
            const reqData = {
                punchIn: selectedWorkItem,
                punchOut: punchTimeApi,
                date: punchDateApi,
                remarks: remark,
                shift: shiftApi,
            };
            console.log('Data of approved', reqData);
            const response = await axios.patch(approveUrl, reqData);
            console.log('manual entry doneee', response.data);
            closeModal2();
            Dialog.show({
                type: ALERT_TYPE.SUCCESS,
                title: 'Success',
                textBody:
                    'Added punchOut time successfully! refresh page to see the changes!',
                button: 'close',
            });
        } catch (error) {
            console.log('errror,', error);
            Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: 'Danger',
                textBody: 'failed to update',
                button: 'close',
            });
        }

        closeModal2();
    };
    const fetchGroup = async () => {
        try {
            const res = await axios.get(`https://chawlacomponents.com/api/v1/group`);
            console.log('gropppp', res.data.docs);
            setgroupName(res.data.docs);
            //console.log(jobProfiles.length)
        } catch (err) {
            console.log(err);
        }
    };

    const handlePrevDate = () => {
        const prevDate = new Date(selectedDate);
        prevDate.setDate(prevDate.getDate() - 1);
        setSelectedDate(prevDate);
    };
    console.log('Date', selectedDate);

    const handleNextDate = () => {
        const nextDate = new Date(selectedDate);
        nextDate.setDate(nextDate.getDate() + 1);
        setSelectedDate(nextDate);
    };
    const fetchData = async () => {
        const datePart = selectedDate.toISOString().split('T')[0];
        console.log('new added date<<<<<<<<<<<<<<<', datePart);
        const currentDate = new Date();

        const formattedDate = `${currentDate.getFullYear()}-${String(
            currentDate.getMonth() + 1,
        ).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
        try {
            setLoading(true);
            const response = await axios.get(
                `https://chawlacomponents.com/api/v2/attendance/ownApproved?date=${datePart}&groupName=${selectedOption1}&shift=${selectedOptionshift}`,
            );
            const data = response.data.data;
            console.log('datale', data);
            setData(data);
            console.log('lengthhhh----', data.length);
            setTotalNumber(data.length);

            //for pending length number
            const pendingResponse = await axios.get(
                `https://chawlacomponents.com/api/v2/attendance/employeeUnderMe`,
            );
            const pendingdata = pendingResponse.data.attendance;
            const pendingData = pendingdata.filter(
                (e: any) => e.status === 'pending',
            );
            
            console.log('pendendinglength----------', pendingData.length);
            setPenderingNumber(pendingData.length);

            const resprofile = await axios.get(
                'https://chawlacomponents.com/api/v1/auth/myprofile',
            );
            const dataprofile = resprofile.data;
            console.log('dataprofileee', dataprofile);
            let shopp = dataprofile?.shop?.shopName;
            setshop(shopp);
            console.log('shooppfinal--------------------', shopp);

            const manualnumber = await axios.get(
                `https://chawlacomponents.com/api/v2/scanSlip?date=${datePart}&shopName=${shopp}`,
            );
            const ddddata = manualnumber.data.slips[0].shop[0].manual;
            console.log('aaaaaaaaaaaaaaaaaaaaaaa44444444------------------', ddddata)
            // console.log("manual number registered number", datamanualnumber.manual, datamanualnumber.registered)
            // setManualNumber(datamanualnumber?.manual);
            // setRegisteredNo(datamanualnumber?.registered);
            // const datamanualnumber = manualnumber.data.slips[0];
            // console.log("monday testing---------------------------------------------------------------------->", datamanualnumber)

            // if (datamanualnumber) {
                console.log("nanananaa",manualnumber.data?.slips[0]?.shop[0]?.registered+manualnumber.data?.slips[1]?.shop[0]?.registered )
                const getValidNumber = (value:any) => (typeof value === 'number' && !isNaN(value) ? value : 0);

                const registered1 = getValidNumber(manualnumber.data?.slips[0]?.shop[0]?.registered);
                const registered2 = getValidNumber(manualnumber.data?.slips[1]?.shop[0]?.registered);
                
                const manual1 = getValidNumber(manualnumber.data?.slips[0]?.shop[0]?.manual);
                const manual2 = getValidNumber(manualnumber.data?.slips[1]?.shop[0]?.manual);
                
                const datamanualnumber = {
                  registered: registered1 + registered2,
                  manual: manual1 + manual2,
                };
                
            console.log(
                '4----------------------------------------<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<',
                datamanualnumber,
            );
            const firstShop = datamanualnumber; // Assuming you want to access the data for the first shop in the array
            console.log('firstshoppp', firstShop);
            const registeredNumber = firstShop.registered;
            const manualnnumber = firstShop.manual;

            console.log('Registered number:', registeredNumber);
            console.log('Manual number:', manualnnumber);

            setRegisteredNo(datamanualnumber.registered);
            setManualNumber(datamanualnumber.manual);

            // }
            setLoading(false);
        } catch (err) {
            // &groupName=${selectedOption1}
            console.error('Error fetching data-------------:', err);
            setLoading(false);
        }
    };
    console.log("ddddddddddddddddddddddddddddddddddddddddddddddddddddddddd", registeredNo, manualNumber)
    useEffect(() => {
        fetchData();
        fetchGroup();
    }, [
        selectedOption1,
        registeredNo,
        manualNumber,
        pendingNumber,
        TotalNumber,
        selectedDate,
        selectedOptionshift,
    ]);
    // if (loading) {
    //     console.log("loading happens")
    //     return <LoadingScreen />
    //     // return  <ActivityIndicator size="large" color="#0000ff" />
    // }
    console.log('errrrrrrrrrrrrrrrrrrrrr--->>>>>>>>>>', selectedOptionshift);
    const [expandedPunches, setExpandedPunches] = useState([]);

    const togglePunches = (index: any) => {
        const newExpandedPunches = [...expandedPunches];
        newExpandedPunches[index] = !newExpandedPunches[index];
        setExpandedPunches(newExpandedPunches);
    };
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Navbar navigation={navigation} />

            <View style={{ padding: 10, flex: 1 }}>
                {/* <View style={{flexDirection:'column'}}> */}
                <View
                    style={{
                        margin: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <Text style={{ fontSize: 22, color: '#2E2E2E', fontWeight: '700' }}>
                        Daily Logs
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('ScanList')}
                            style={{
                                width: '40%',
                                padding: '3%',

                                // backgroundColor: '#283093',
                                borderColor: 'black',
                                borderRadius: 4,
                                borderWidth: 0.2,
                                // shadowOffset: {width: -2, height: 4},
                                // shadowColor: '#171717',
                                // shadowOpacity: 0.2,
                                // shadowRadius: 3,
                                // elevation: 5
                            }}
                        >
                            <View
                                style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}
                            >
                                <Text
                                    style={{
                                        color: '#283093',
                                        fontSize: 13,
                                        marginRight: '2%',
                                        fontWeight: '900',
                                        textDecorationLine: 'underline',
                                    }}
                                >
                                    Scan Sheet list
                                </Text>
                                <Feather name="chevrons-right" size={18} color={'#283093'} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('SlipCamera')}
                            style={{
                                width: '40%',
                                padding: '3%',

                                backgroundColor: '#283093',
                                borderColor: '#DEDEDE',
                                borderRadius: 10,
                                // borderWidth: 1,
                                // shadowOffset: {width: -2, height: 4},
                                shadowColor: '#171717',
                                // shadowOpacity: 0.2,
                                // shadowRadius: 3,
                                elevation: 5,
                            }}
                        >
                            <View
                                style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}
                            >
                                <Feather name="upload" size={15} color={'white'} />
                                <Text style={{ color: 'white', fontSize: 13, marginLeft: '2%' }}>
                                    Upload Sheet
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView
                    style={{ backgroundColor: 'white', maxHeight: '17%' }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    scrollEnabled={false}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                            marginHorizontal: '1%',
                            marginVertical: 5,
                            marginBottom: '40%',
                            marginTop: '2%',
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                borderRadius: 8,
                                borderWidth: 1,
                                borderColor: '#DEDEDE',
                                //   borderWidth: 1,
                                //   borderColor: 'black',
                                paddingHorizontal: '3%',
                                paddingVertical: '4%',
                                shadowColor: 'gray', // Shadow color
                                //   shadowOffset: { width: 0, height: 1 }, // Shadow offset
                                //   shadowOpacity: 0.1, // Shadow opacity
                                //   shadowRadius: 4, // Shadow radius
                                //   elevation: 0.1, // Android-specific elevation
                            }}
                        >
                            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                <Text className="text-blue-900 font-bold text-xl">
                                    {TotalNumber}
                                </Text>
                                <Text
                                    className="text-black font-semibold"
                                    style={{ fontSize: 17 }}
                                >
                                    {' '}
                                    Total{' '}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                borderRadius: 8,
                                borderWidth: 1,
                                borderColor: '#DEDEDE',
                                paddingHorizontal: '1%',
                                paddingVertical: '4%',
                            }}
                        >
                            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                <Text className="text-blue-900 font-bold text-xl">
                                    {pendingNumber}
                                </Text>
                                <Text
                                    className="text-black font-semibold "
                                    style={{ fontSize: 17 }}
                                >
                                    {' '}
                                    Pending{' '}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                borderRadius: 8,
                                borderWidth: 1,
                                borderColor: '#DEDEDE',
                                paddingHorizontal: '1%',
                                paddingVertical: '4%',
                            }}
                        >
                            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                <Text className="text-blue-900 font-bold text-xl">
                                    {registeredNo ? registeredNo : '0'}
                                </Text>
                                <Text
                                    className="text-black font-semibold "
                                    style={{ fontSize: 17 }}
                                >
                                    Registered
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                borderRadius: 8,
                                borderWidth: 1,
                                borderColor: '#DEDEDE',
                                paddingHorizontal: '1%',
                                paddingVertical: '4%',
                            }}
                        >
                            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                <Text className="text-blue-900 font-bold text-xl">
                                    {manualNumber ? manualNumber : 0}
                                </Text>
                                <Text
                                    className="text-black font-semibold "
                                    style={{ fontSize: 17 }}
                                >
                                    {' '}
                                    Manual{' '}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        height: '7%',
                        marginBottom: '1%',
                        marginTop: '1%',
                    }}
                >
                    <View
                        style={{
                            width: '95%',

                            borderColor: '#DEDEDE',
                            borderRadius: 10,
                            borderWidth: 1,
                        }}
                    >
                        <Picker
                            style={{
                                //    backgroundColor: 'white',
                                // color: '#283093',
                                color: 'black',
                                fontWeight: '600',
                            }}
                            selectedValue={selectedOption1}
                            onValueChange={itemValue => setSelectedOption1(itemValue)}
                            dropdownIconColor={'black'}
                        >
                            <Picker.Item label="All Group" value="" />
                            {groupname.map((item: any, index: any) => (
                                <Picker.Item label={item.groupName} value={item.groupName} />
                            ))}
                        </Picker>
                    </View>
                </View>

                <ScrollView horizontal={true}>
                    <View style={{ marginTop: '1%' }}>
                        <View style={styles.tableHeader}>
                            <View style={{ ...styles.tableDataH, width: 120 }}>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        color: '#2E2E2E',
                                        fontFamily: 'Inter-Medium',
                                        fontWeight: '900',
                                    }}
                                >
                                    S.No.
                                </Text>
                            </View>
                            <View style={styles.tableDataH}>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        color: '#2E2E2E',
                                        fontFamily: 'Inter-Medium',
                                        fontWeight: '900',
                                    }}
                                >
                                    Date
                                </Text>
                            </View>
                            <View style={styles.tableDataH}>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        color: '#2E2E2E',
                                        fontFamily: 'Inter-Medium',
                                        fontWeight: '900',
                                    }}
                                >
                                    Name
                                </Text>
                            </View>
                            <View style={styles.tableDataH}>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        color: '#2E2E2E',
                                        fontFamily: 'Inter-Medium',
                                        fontWeight: '900',
                                    }}
                                >
                                    Employee Code
                                </Text>
                            </View>
                            <View style={styles.tableDataH}>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        color: '#2E2E2E',
                                        fontFamily: 'Inter-Medium',
                                        fontWeight: '900',
                                    }}
                                >
                                    Group Name
                                </Text>
                            </View>

                            <View style={{ ...styles.tableDataH, width: 120 }}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'flex-start',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            color: '#2E2E2E',
                                            fontFamily: 'Inter-Medium',
                                            fontWeight: '900',
                                        }}
                                    >
                                        Shift
                                    </Text>
                                    <View>
                                        <Picker
                                            selectedValue={selectedOptionshift}
                                            onValueChange={itemValue =>
                                                setSelectedOptionshift(itemValue)
                                            }
                                            style={{ height: 20, width: 30, marginLeft: '10%' }}
                                            dropdownIconColor={'black'}
                                        >
                                            {/* <Picker.Item label='' value='' /> */}
                                            <Picker.Item label="day" value="day" />
                                            <Picker.Item label="night" value="night" />
                                        </Picker>
                                    </View>
                                </View>
                            </View>
                            <View style={{ ...styles.tableDataH, width: 120, justifyContent:'center' ,}}>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        color: '#2E2E2E',
                                        fontFamily: 'Inter-Medium',
                                        fontWeight: '900',
                                        marginLeft:'15%'
                                       
                                    }}
                                >
                                    Punch-In
                                </Text>
                            </View>
                            <View style={{ ...styles.tableDataH , justifyContent:'center',  }}>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        color: '#2E2E2E',
                                        fontFamily: 'Inter-Medium',
                                        fontWeight: '900',
                                        textAlignVertical:'center',
                                        marginLeft:'10%'
                                    }}
                                >
                                    Punch-Out
                                </Text>
                            </View>
                        </View>

                        {/* body */}
                        {loading ? (
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: 'flex-start',
                                    alignItems: 'flex-start',
                                    marginLeft: '25%',
                                }}
                            >
                                <ActivityIndicator size="small" color="#0000ff" />
                            </View>
                        ) : (
                            <FlatList
                                data={data}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={onRefresh}
                                    />
                                }
                                renderItem={({ item: v, index }) => (
                                    console.log(
                                        'log of punchess------------------------------',
                                        v.punches.length,
                                    ),
                                    (
                                        <TouchableOpacity
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                borderRadius: 1.5,
                                                borderColor: '#91A3B0s',
                                                borderWidth: 0.18,
                                                backgroundColor:
                                                    index % 2 === 0 ? 'transparent' : 'transparent',
                                            }}
                                        >
                                            <View style={{ ...styles.tableData, width: 120 }}>
                                                <View style={{ flexShrink: 1 }}>
                                                    <Text
                                                        style={{
                                                            color: 'black',
                                                            fontFamily: 'Inter-Medium',
                                                        }}
                                                    >
                                                        {index + 1}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={{ ...styles.tableData }}>
                                                <View style={{ flexShrink: 1 }}>
                                                    <Text
                                                        style={{
                                                            color: 'black',
                                                            fontFamily: 'Inter-Medium',
                                                            // textAlign:'center',
                                                        }}
                                                    >
                                                        {v.date ? v.date.split('T')[0] : '-'}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={{ ...styles.tableData }}>
                                                <View style={{ flexShrink: 1 }}>
                                                    <Text
                                                        style={{
                                                            color: 'black',
                                                            fontFamily: 'Inter-Medium',
                                                            // textAlign:'center',
                                                        }}
                                                    >
                                                        {v.employeeId?.name}
                                                    </Text>
                                                </View>
                                            </View>

                                            <View style={styles.tableData}>
                                                <View style={{ flexShrink: 1, flexBasis: '100%' }}>
                                                    <Text
                                                        style={{
                                                            color: 'black',
                                                            fontFamily: 'Inter-Medium',
                                                            textAlignVertical: 'center',
                                                            textAlign: 'center',
                                                            // marginLeft:'10%',
                                                            // backgroundColor:'yellow'
                                                        }}
                                                    >
                                                        {v.employeeId?.employeeCode
                                                            ? v.employeeId?.employeeCode
                                                            : '-'}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={styles.tableData}>
                                                <View style={{ flexShrink: 1, flexBasis: '100%' }}>
                                                    <Text
                                                        style={{
                                                            color: 'black',
                                                            fontFamily: 'Inter-Medium',
                                                        }}
                                                    >
                                                        {v.employeeId?.groupId?.groupName
                                                            ? v.employeeId.groupId.groupName
                                                            : '-'}
                                                    </Text>
                                                </View>
                                            </View>

                                            <View style={{ ...styles.tableData, width: 120 }}>
                                                <View style={{ flexShrink: 1 }}>
                                                    <Text
                                                        style={{
                                                            color: 'black',
                                                            fontFamily: 'Inter-Medium',
                                                        }}
                                                    >
                                                        {v.shift ? v.shift : '-'}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={{ ...styles.tableData, width: 120 }}>
                                                <View
                                                    style={{
                                                        flexShrink: 1,
                                                        alignItems:'center'
                                                    }}
                                                >
                                                    {v.punches.length > 1 ? (
                                                        <TouchableOpacity
                                                            onPress={() => togglePunches(index)}
                                                        >
                                                            <View style={{}}>
                                                                {expandedPunches[index] ? (
                                                                    <View style={{ flexDirection: 'row' ,marginLeft:'31%', }}>
                                                                        <Text style={{color:'black'}}>
                                                                            {v.punches[0]?.punchIn.slice(11, 16)}
                                                                        </Text>
                                                                        <Feather
                                                                            name="chevron-up"
                                                                            size={15}
                                                                            color={'black'}
                                                                            style={{ marginLeft: '4%' }}
                                                                        // style={styles.searchIcon}
                                                                        />
                                                                    </View>
                                                                ) : (
                                                                    <View style={{ flexDirection: 'row', marginLeft:'33%' }}>
                                                                        <Text style={{color:'black'}}>
                                                                            {v.punches[0]?.punchIn.slice(11, 16)}
                                                                        </Text>
                                                                        <Feather
                                                                            name="chevron-down"
                                                                            size={15}
                                                                            color={'black'}
                                                                            style={{ marginLeft: '4%' }}
                                                                        // style={styles.searchIcon}
                                                                        />
                                                                    </View>
                                                                )}
                                                            </View>
                                                        </TouchableOpacity>
                                                    ) : (
                                                        <Text style={{color:'black'}}>
                                                            {v.punches[0]
                                                                ? v.punches[0].punchIn.slice(11, 16)
                                                                : '-'}
                                                        </Text>
                                                    )}
                                                  
                                                    {expandedPunches[index] && (
                                                        <FlatList
                                                        data={v.punches.slice(1)}
                                                            //   style={{borderBottomWidth:1}}
                                                            renderItem={({ item: punch }) => (
                                                                <View style={{ flexDirection: 'row',  }}>
                                                                    <View
                                                                        style={{
                                                                            ...styles.tableData,
                                                                            width: 120,
                                                                            flexDirection: 'row',
                                                                            // borderColor:'red', borderWidth:1
                                                                           
                                                                        }}
                                                                    ><View style={{
                                                                        flexShrink: 1,
                                                                        // borderColor: 'blue',
                                                                        // borderWidth: 2,
                                                                         marginLeft:'20%',
                                                                          padding:'4%'
                                                                    }}>
                                                                        <Text style={{color:'black'}}>{punch?.punchIn.slice(11, 16)}</Text>
                                                                        </View>
                                                                        
                                                                    </View>
                                                                 
                                                                </View>
                                                            )}
                                                            keyExtractor={(item, index) => index.toString()}
                                                        />

                                                        
                                                    )}
                                                </View>
                                            </View>
                                            <View style={{ ...styles.tableData,}}>
                                                <View style={{ flexShrink: 1 ,alignItems:'center'}}>
                                                    {expandedPunches[index] && v.punches.length > 1  ? 
                                                    (
                                                        // Show first punchOut if expanded and punches length > 1
                                                        <Text style={{color:'black'}}>
                                                          {v.punches[0].punchOut
                                                            ? v.punches[0].punchOut.slice(11, 16)
                                                            : '-'}
                                                        </Text>
                                                      ): v.punches.length > 1 ?
                                                    
                                                    (
                                                        <Text style={{color:'black'}}>
                                                            {v.punches[v.punches.length - 1].punchOut!== null
                                                                ? v.punches[
                                                                    v.punches.length - 1
                                                                ].punchOut.slice(11, 16)
                                                                : '-'}
                                                        </Text>
                                                    ) : v.punches.length === 1 ? (
                                                       
                                                            v.punches[0].punchOut ? (
                                                               <Text style={{color:'black'}}>{v.punches[0]?.punchOut.slice(11, 16)}</Text>
                                                            ) : (
                                                                <TouchableOpacity
                                                                    onPress={() => {
                                                                        setSelectedWorkItem(v.punches[0].punchIn);
                                                                        setpunchDateApi(v.date);
                                                                        setid(v.employeeId._id);
                                                                        setShiftApi(v.shift);
                                                                        setModalVisible2(true);
                                                                    }}
                                                                    style={{
                                                                        borderRadius: 8,
                                                                        backgroundColor: '#283093',
                                                                        width: '70%',
                                                                        
                                                                        padding: '1%',
                                                                        paddingVertical: '3%',
                                                                        // paddingHorizontal:'7%'
                                                                    }}
                                                                >
                                                                    <Text
                                                                        style={{
                                                                            color: 'white',
                                                                            fontFamily: 'Inter-Medium',
                                                                            justifyContent: 'center',
                                                                            textAlign: 'center',
                                                                            padding:'5%'
                                                                        }}
                                                                    >
                                                                        Manual add
                                                                    </Text>
                                                                </TouchableOpacity>
                                                            )
                                                        
                                                    ) : (
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                setSelectedWorkItem(v.punches[0].punchIn);
                                                                setpunchDateApi(v.date);
                                                                setid(v.employeeId._id);
                                                                setShiftApi(v.shift);
                                                                setModalVisible2(true);
                                                            }}
                                                            style={{
                                                                borderRadius: 8,
                                                                backgroundColor: '#283093',
                                                                width: '70%',
                                                                padding: '1%',
                                                                paddingVertical: '3%',
                                                                // marginTop:'10%'
                                                            }}
                                                        >
                                                            <Text
                                                                style={{
                                                                    color: 'white',
                                                                    fontFamily: 'Inter-Medium',
                                                                    justifyContent: 'center',
                                                                    textAlign: 'center',
                                                                }}
                                                            >
                                                                Manual add
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                       {expandedPunches[index] && (
                                                        <FlatList
                                                        data={v.punches.slice(1)}
                                                            //   style={{borderBottomWidth:1}}
                                                            renderItem={({ item: punch }) => (
                                                                <View style={{ flexDirection: 'row',  }}>
                                                                    <View
                                                                        style={{
                                                                            ...styles.tableData,
                                                                            width: 120,
                                                                            flexDirection: 'row',
                                                                            // borderColor:'red', borderWidth:1
                                                                           
                                                                        }}
                                                                    ><View style={{
                                                                        flexShrink: 1,
                                                                        // borderColor: 'blue',
                                                                        // borderWidth: 2,
                                                                        marginLeft:'22%',
                                                                        padding:'4%',
                                                                        alignItems:'center'
                                                                    }}>
                                                                         <Text style={{color:'black'}}>{punch?.punchOut?.slice(11, 16) ? punch?.punchOut?.slice(11, 16):(
                                                                            <TouchableOpacity
                                                                            onPress={() => {
                                                                                setSelectedWorkItem(v.punches[0].punchIn);
                                                                                setpunchDateApi(v.date);
                                                                                setid(v.employeeId._id);
                                                                                setShiftApi(v.shift);
                                                                                setModalVisible2(true);
                                                                            }}
                                                                            style={{
                                                                                borderRadius: 8,
                                                                                backgroundColor: '#283093',
                                                                                width: '70%',
                                                                                padding: '1%',
                                                                                paddingVertical: '3%',
                                                                                // marginTop:'10%'
                                                                            }}
                                                                        >
                                                                            <Text
                                                                                style={{
                                                                                    color: 'white',
                                                                                    fontFamily: 'Inter-Medium',
                                                                                    justifyContent: 'center',
                                                                                    textAlign: 'center',
                                                                                }}
                                                                            >
                                                                                Manual add
                                                                            </Text>
                                                                        </TouchableOpacity>
                                                                         )}</Text>
                                                                        </View>
                                                                        
                                                                    </View>
                                                                    {/* <View
                                                                        style={{
                                                                            ...styles.tableData,
                                                                            width: 120,
                                                                            flexDirection: 'row',
                                                                        }}
                                                                    >
                                                                        <Text>{punch?.punchOut?.slice(11, 16)}</Text>
                                                                    </View> */}
                                                                </View>
                                                            )}
                                                            keyExtractor={(item, index) => index.toString()}
                                                        />

                                                        
                                                    )}
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                )}
                            />
                        )}
                    </View>
                    <Modal
                        visible={isModalVisible2}
                        animationType="slide"
                        transparent={true}
                    >
                        <View
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            }}
                        >
                            <View
                                style={{
                                    backgroundColor: 'white',
                                    elevation: 10,
                                    padding: 20,
                                    borderRadius: 8,
                                }}
                            >
                                <Text style={{ color: 'black', fontWeight: '600', fontSize: 20 }}>
                                    Add Details
                                </Text>
                                {/* <TextInput
                            placeholder="Punch-In Date"
                            // value={punchInDate}
                            // onChangeText={(text) => setPunchInDate(text)}
                        /> */}
                                <View
                                    style={{ flexDirection: 'row', justifyContent: 'space-around' }}
                                >
                                    <View style={{ margin: '5%' }}>
                                        <Text
                                            style={{ color: 'gray', fontWeight: '600', fontSize: 17 }}
                                        >
                                            Punch-Out Date
                                        </Text>
                                        <TouchableOpacity
                                            onPress={showDatePicker}
                                            style={{
                                                borderWidth: 0.4,
                                                margin: 4,
                                                borderRadius: 4,
                                                padding: '8%',
                                            }}
                                        >
                                            <View>
                                                <Text style={{ color: 'black' }}>{punchDate}</Text>
                                            </View>
                                            {/* {punchDate.toString() || '00/00/00' */}
                                        </TouchableOpacity>
                                        <DateTimePickerModal
                                            isVisible={isDatePickerVisible}
                                            mode="date"
                                            onConfirm={handleConfirm}
                                            onCancel={hideDatePicker}
                                        />
                                    </View>
                                    <View style={{ margin: '5%' }}>
                                        <Text
                                            style={{ color: 'gray', fontWeight: '600', fontSize: 17 }}
                                        >
                                            Punch-Out Time
                                        </Text>
                                        <TouchableOpacity
                                            onPress={showDatePickerT}
                                            style={{
                                                borderWidth: 0.4,
                                                margin: 4,
                                                borderRadius: 4,
                                                padding: '8%',
                                            }}
                                        >
                                            <View>
                                                <Text style={{ color: 'black' }}>
                                                    {punchTime || '0.00AM'}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                        <DateTimePickerModal
                                            isVisible={isDatePickerVisibleT}
                                            mode="time"
                                            is24Hour={false}
                                            onConfirm={handleConfirmT}
                                            onCancel={hideDatePickerT}
                                        />
                                    </View>
                                </View>
                                <View
                                    style={{ flexDirection: 'row', justifyContent: 'space-around' }}
                                >
                                    {/* <View style={{ flexDirection: 'column', width: '40%' }}>

                                        <Text style={{ color: 'gray', fontWeight: '600', fontSize: 17, marginBottom: '5%' }}>Shift</Text>
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
                                                <Picker.Item label="shift" value="shift" />
                                                <Picker.Item label="Day" value="Day" />
                                                <Picker.Item label="Night" value="Night" />

                                            </Picker>
                                        </View>
                                    </View> */}
                                    <View style={{ flexDirection: 'column', width: '85%' }}>
                                        <Text
                                            style={{
                                                color: 'gray',
                                                fontWeight: '600',
                                                fontSize: 17,
                                                marginBottom: '5%',
                                            }}
                                        >
                                            Remark
                                        </Text>
                                        <TextInput
                                            style={{
                                                borderColor: '#DEDEDE',
                                                borderRadius: 10,
                                                borderWidth: 1,
                                                width: '100%',
                                                color: 'black',
                                            }}
                                            placeholder="Remark"
                                            // keyboardType='twitter'

                                            value={remark}
                                            onChangeText={text => setremark(text)}
                                        />
                                    </View>
                                </View>

                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-evenly',
                                        alignItems: 'center',
                                        marginTop: '6%',
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={closeModal2}
                                        style={{
                                            ...styles.modalBtn,
                                            backgroundColor: 'white',
                                            borderColor: '#DEDEDE',
                                            borderRadius: 10,
                                            // borderWidth: 1,
                                            // shadowOffset: {width: -2, height: 4},
                                            shadowColor: '#171717',
                                            // shadowOpacity: 0.2,
                                            // shadowRadius: 3,
                                            elevation: 5,
                                            paddingVertical: '5%',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Feather
                                            name="x"
                                            size={16}
                                            color={'black'}
                                            style={{ marginRight: '4%' }}
                                        />
                                        <Text style={{ color: 'black' }}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={handleDone}
                                        style={{
                                            ...styles.modalBtn,
                                            backgroundColor: '#283093',
                                            borderColor: '#DEDEDE',
                                            borderRadius: 10,
                                            // borderWidth: 1,
                                            // shadowOffset: {width: -2, height: 4},
                                            shadowColor: '#171717',
                                            // shadowOpacity: 0.2,
                                            // shadowRadius: 3,
                                            elevation: 5,
                                            paddingVertical: '5%',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Feather
                                            name="check-circle"
                                            size={16}
                                            color={'white'}
                                            style={{ marginRight: '4%' }}
                                        />
                                        <Text style={{ color: 'white', fontSize: 16 }}>Done</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </ScrollView>

                <View style={styles.dateFilterContainer}>
                    <TouchableOpacity onPress={handlePrevDate}>
                        <Feather name="arrow-left" size={20} color="#283093" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={showDatePickerTable}>
                        <Text style={styles.dateText}>{selectedDate.toDateString()}</Text>
                    </TouchableOpacity>
                    <DateTimePickerModal
                        isVisible={isDatePickerVisibleTable}
                        mode="date"
                        onConfirm={handleConfirmTable}
                        onCancel={hideDatePickerTable}
                    />
                    <TouchableOpacity onPress={handleNextDate}>
                        <Feather name="arrow-right" size={20} color="#283093" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default DailyLogs;

const styles = StyleSheet.create({
    tableHeader: {
        backgroundColor: '#ECEDFE',
        flexDirection: 'row',
        borderRadius: 8,
        // alignItems:'center'
    },
    tableData: {
        paddingVertical: 12,
        paddingLeft: 20,
        width: 160,
    },
    tableDataH: {
        paddingVertical: 14,
        paddingLeft: 24,
        width: 160,
        // width:50
    },
    modalBtn: {
        borderRadius: 8,
        backgroundColor: '#283093',
        width: '40%',
        padding: '1%',
        paddingVertical: '3%',
        alignItems: 'center',
    },
    dateFilterContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '2%',
        borderColor: '#283093',
        borderWidth: 1,
        borderRadius: 10, // Adjust the border radius as needed
        paddingHorizontal: 12,
        paddingVertical: '2.5%',
        maxWidth: 200,
        marginLeft: '25%',
    },
    dateText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginHorizontal: 10,
        color: '#283093',
    },
});
