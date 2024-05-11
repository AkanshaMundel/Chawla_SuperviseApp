import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity, Modal, Image, RefreshControl,TextInput ,Button} from 'react-native'
import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import axios from 'axios'
import { ImageIndex } from '../../assets/AssetIndex'
import { Picker } from '@react-native-picker/picker';
import Feather from 'react-native-vector-icons/Feather'
import Snackbar from 'react-native-snackbar'
import Voice from '@react-native-voice/voice';
import DateTimePickerModal from 'react-native-modal-datetime-picker'


const ApprovalLogs = ({navigation}:any) => {
    const [data, setData] = useState<any>([]);
    const [pendingdata, setPendingdata] = useState<any>([]);
    const [rejecteddata, setRejecteddata] = useState<any>([]);
    const [selectedImageUrl, setSelectedImageUrl] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedOption, setSelectedOption] = useState('Approved');
    const [searchQuery, setSearchQuery] = useState('');
  const [started, setStarted] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [end, setEnd] = useState('');
  const [isModalVisible1, setIsModalVisible1] = useState(false); // State for modal visibility
  const [voiceInput, setVoiceInput] = useState('');
  const [isModalVisible2, setModalVisible2] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStart = (e:any) => {
    // Invoked when .start() is called without error
    console.log('onSpeechStart: ', e);
    setStarted('√');
    setIsModalVisible1(true); // Show the modal when speech starts
  };

  const onSpeechEnd = (e:any) => {
    // Invoked when SpeechRecognizer stops recognition
    console.log('onSpeechEnd: ', e);
    setEnd('√');
    setIsModalVisible1(false); // Hide the modal when speech ends
  };

  const onSpeechError = (e:any) => {
    // Invoked when an error occurs.
    console.log('onSpeechError: ', e);
    setError(JSON.stringify(e.error));
    setIsModalVisible1(false); // Hide the modal on error
  };

  const onSpeechResults = (e:any) => {
    // Invoked when SpeechRecognizer is finished recognizing
    console.log('onSpeechResults: ', e);
    setResults(e.value);
    setSearchQuery(e.value[0]); // Set the recognized speech as the search query
  };

    
      const startRecognizing = async ()=>{
        try{
            await Voice.start('en-US');
            setError('');
            setStarted('');
            setResults([]);
            setEnd('');
           

        }
        catch(e){
            console.log(e);
        }

      }

    

    const handleOpenButtonPress = (imageUrl: any) => {
        console.log('im from here img', imageUrl);
        setSelectedImageUrl(imageUrl);
        setIsModalVisible(!isModalVisible);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchNoData();
        setRefreshing(false);
    };
    const fetchNoData = async () => {
        const currentDate = new Date();


        const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
        try {
            const response = await axios.get(`https://chawlacomponents.com/api/v2/attendance/ownApproved?date=${formattedDate}`);
            const data1 = response.data.data;
            const data = data1.filter((e:any) => e.status === "approved");
            console.log('datale', data)
            setData(data);
            const pendingResponse = await axios.get(`https://chawlacomponents.com/api/v2/attendance/employeeUnderMe`)
            const pendingdata = pendingResponse.data.attendance;
            const pendingData = pendingdata.filter((e:any) => e.status === "pending");
            const rejected = pendingdata.filter((e:any)=> e.status ==="rejected");// getting all rejected one 
            console.log('rejected', rejected)
            setRejecteddata(rejected)
            console.log('pendinglogs', pendingData.length)

            setPendingdata(pendingData)


        }
        catch (err) {
            console.error('Error fetching data:', err);
        }
    }

    const handleReject = async ({id, PunchIn, date, shift}:any) =>{
        console.log("reject data", id, PunchIn, date, shift)
        const approveUrl = `https://chawlacomponents.com/api/v2/attendance/approveAttendance`;
        try{
            const requestData = {
                employeeId: id,
                status: "rejected", 
                punchInTime: PunchIn,
                date: date,
                shift:shift
            };
            console.log('Data of approved', requestData);
            const response = await axios.patch(approveUrl, requestData);
            console.log('calling after rejected ', response)
            // Alert.alert('approved successfully');
            Snackbar.show({
                text: 'सफलतापूर्वक अस्वीकृत',
                backgroundColor: 'green',
                duration: 4000,
            });
           
            const updatedPendingData = pendingdata.filter((entry:any) => {
                return entry.employeeId.id !== id || entry.punches[0].punchIn!== PunchIn || entry.date !== date;
            });

            setPendingdata(updatedPendingData);

        }
        catch(error) {
            Snackbar.show({
                text: 'error  in rejection ',
                backgroundColor: '#DC143C',
                duration: 4000,
            });
            console.error('Error:', error);
        }

    }
    useEffect(() => {
        fetchNoData();

    }, []);

    const searchData = (searchQuery: any) => {
        if (!searchQuery) {
            return data; // Return all data if no search query
        }
        searchQuery = searchQuery.toLowerCase(); // Convert the search query to lowercase for case-insensitive search
        return data.filter((item: any) => {
            const name = item.employeeId?.name.toLowerCase();

            return name.includes(searchQuery)
        });
      
    };
    const openModal2 = () => {
        setModalVisible2(true);
    };

    const closeModal2 = () => {
        setModalVisible2(false);
    };
  

    const handleDone = () => {
        // You can handle saving punchInDate and remark here
        // e.g., send them to an API or update your state
        // console.log('Punch In Date:', punchInDate);
        // console.log('Remark:', remark);
        closeModal2();
    };

    const showDatePicker = () => {
        setDatePickerVisibility(true);
      };
    
      const hideDatePicker = () => {
        setDatePickerVisibility(false);
      };
    
      const handleConfirm = (date:any) => {
        console.warn("A date has been picked: ", date);
        hideDatePicker();
      };
    const searchResults = searchData(searchQuery)
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Navbar navigation={navigation}/>
            <View style={{ padding: 15, flex: 1, marginBottom: 10 }}>
                
                <View style={{ margin: 15, flexDirection: 'row', justifyContent: 'space-around', }}>

                    <Text style={{ fontSize: 22, color: '#2E2E2E', fontWeight: '700' }}>ApprovalLogs</Text>
                    {/* <TouchableOpacity onPress={() => {
                        console.log('Button pressed');
                        navigation.navigate('Animatedd');
                        }}>
                        <Text>animatedScreen</Text>
                        </TouchableOpacity> */}                                                                                                        

                    <View style={{
                       
                        width: '50%',
                      
                        borderColor: '#DEDEDE',
                        borderRadius: 3,
                        borderWidth: 1,
                    }}>

                        <Picker
                            style={{
                                backgroundColor: 'white',
                                // color: '#283093',
                                color:'black',
                                fontWeight:'600'
                               

                            }}
                            selectedValue={selectedOption}
                            onValueChange={itemValue => setSelectedOption(itemValue)}
                        >
                            <Picker.Item label="Approved" value="Approved" />
                            <Picker.Item label="Pending" value="Pending" />
                            <Picker.Item label="Rejected" value="Rejected" />
                        </Picker>
                    </View>
                    

                </View>
                {selectedOption==='Approved'?
                ( <View style={{flexDirection:'row',justifyContent:'space-around', alignItems:'center'}}> 
                    
                <View style={styles.searchBarContainer}>
                        <Feather
                            name="search"
                            size={18}
                            color={'black'}
                            style={styles.searchIcon}
                        />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search by Name..."
                            onChangeText={text => setSearchQuery(text)}
                            value={searchQuery}
                            placeholderTextColor="gray"
                        />
                    </View>
                    <TouchableOpacity onPress={startRecognizing}>
                    <Feather 
                      color={'black'}
                      name="mic"
                      size={20}
                  />
                    </TouchableOpacity>
                </View>):null}

               
                {/* <View style={{backgroundColor:'yellow', borderRadius:2, borderWidth:1}}>
                    <Text>{`started: ${started}`}</Text>
                    <Text>{`error: ${error}`}</Text>
                    <Text>{`resss: ${results}`}</Text>
                </View> */}

                <ScrollView horizontal={true}


                >
                    {/* header */}
                    {selectedOption=='Approved'?(  
                    <View>
                        <View style={styles.tableHeader}>
                            <View style={styles.tableDataH}>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        color: '#2E2E2E',
                                        fontFamily: 'Inter-Medium',
                                        fontWeight:'900'
                                    }}>
                                    Date
                                </Text>
                            </View>
                            <View style={styles.tableDataH}>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        color: '#2E2E2E',
                                        fontFamily: 'Inter-Medium',
                                        fontWeight:'900'
                                    }}>
                                    Name
                                </Text>
                            </View>
                            <View style={styles.tableDataH}>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        color: '#2E2E2E',
                                        fontFamily: 'Inter-Medium',
                                        fontWeight:'900'
                                    }}>
                                   Employee Code
                                </Text>
                            </View>
                            <View style={styles.tableDataH}>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        color: '#2E2E2E',
                                        fontFamily: 'Inter-Medium',
                                        fontWeight:'900'
                                    }}>
                                    Job Profile
                                </Text>
                            </View>
                            <View style={styles.tableDataH}>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        color: '#2E2E2E',
                                        fontFamily: 'Inter-Medium',
                                        fontWeight:'900'
                                    }}>
                                    Approve Time
                                </Text>
                            </View>
                           
                            <View style={styles.tableDataH}>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        color: '#2E2E2E',
                                        fontFamily: 'Inter-Medium',
                                        fontWeight:'900'
                                    }}>
                                    Shift
                                </Text>
                            </View>
                            <View style={styles.tableDataH}>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        color: '#2E2E2E',
                                        fontFamily: 'Inter-Medium',
                                        fontWeight:'900'
                                    }}>
                                    Punch-In
                                </Text>
                            </View>
                            <View style={styles.tableDataH}>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        color: '#2E2E2E',
                                        fontFamily: 'Inter-Medium',
                                        fontWeight:'900'
                                    }}>
                                    Photo
                                </Text>
                            </View>
                            {/* <View style={styles.tableDataH}>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        color: '#2E2E2E',
                                        fontFamily: 'Inter-Medium',
                                        fontWeight:'900'
                                    }}>
                                    Punch-Out
                                </Text>
                            </View> */}
                        </View>

                        {/* body */}
                        <FlatList
                            data={searchResults}
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                            }
                       


                            renderItem={({ item: v, index }) => (
                             
                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' ,borderRadius:1.5,
                                borderColor:'#91A3B0s', borderWidth:0.18,   backgroundColor: index % 2 === 0 ? '#D0F0C0' : 'transparent'}}>

                                    <View style={styles.tableData}>
                                        <View style={{ flexShrink: 1 }}>
                                            <Text
                                                style={{
                                                    color: 'black',
                                                    fontFamily: 'Inter-Medium',
                                                }}>
                                                {v.date ? v.date.split('T')[0] : '-'}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.tableData}>
                                        <View style={{ flexShrink: 1 }}>
                                            <Text
                                                style={{
                                                    color: 'black',
                                                    fontFamily: 'Inter-Medium',
                                                }}>
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
                                                }}>
                                                 {v.employeeId?.employeeCode ? v.employeeId?.employeeCode:'-' }
                                            </Text>

                                        </View>
                                    </View>
                                    <View style={styles.tableData}>
                                        <View style={{ flexShrink: 1, flexBasis: '100%' }}>

                                            <Text
                                                style={{
                                                    color: 'black',
                                                    fontFamily: 'Inter-Medium',
                                                }}>
                                                 {v.employeeId?.jobProfileId?.jobProfileName ? v.employeeId.jobProfileId.jobProfileName:'-' }
                                            </Text>

                                        </View>
                                    </View>
                                    <View style={styles.tableData}>
                                        <View style={{ flexShrink: 1, flexBasis: '100%' }}>

                                            <Text
                                                style={{
                                                    color: 'black',
                                                    fontFamily: 'Inter-Medium',
                                                }}>
                                                {v.approvedTime ? v.approvedTime.slice(11, 16) : '-'}
                                            </Text>

                                        </View>
                                    </View>
                                  
                                    <View style={styles.tableData}>
                                        <View style={{ flexShrink: 1 }}>
                                            <Text
                                                style={{
                                                    color: 'black',
                                                    fontFamily: 'Inter-Medium',
                                                }}>
                                                {v.shift? v.shift:"-"}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.tableData}>
                                        <View style={{ flexShrink: 1 }}>
                                            <Text
                                                style={{
                                                    color: 'black',
                                                    fontFamily: 'Inter-Medium',
                                                }}>
                                                {v.punches[0]?v.punches[0].punchIn.slice(11, 16) : '-'}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.tableData}>
                                        <View style={{ flexShrink: 1, flexBasis: '100%' }}>
                                            <TouchableOpacity onPress={() => handleOpenButtonPress(v.approvedImage)}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Text
                                                        style={{
                                                            color: 'black',
                                                            fontFamily: 'Inter-Medium',
                                                        }}>
                                                        Open
                                                    </Text>
                                                    <Image style={{ width: 15, height: 15, marginLeft: 4 }} source={ImageIndex.arrowout} />
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    {/* <View style={styles.tableData}>
                                        <View style={{ flexShrink: 1 }}>
                                            {v.punches[0].punchOut ? (
                                                <Text style={{ color: 'black', fontFamily: 'Inter-Medium' }}>
                                                    {v.punches[0].punchOut.slice(11, 16)}
                                                </Text>
                                            ) : (
                                                <TouchableOpacity onPress={openModal2}  style={{borderRadius:8, backgroundColor:'#283093', width:'70%', padding:'1%', paddingVertical:'3%'}}>
                                                    <Text style={{
                                                                color: 'white',
                                                                fontFamily: 'Inter-Medium',
                                                            //    marginLeft:'2%'
                                                            justifyContent:'center',
                                                         textAlign:'center'
                                                            }}>Manual add</Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                        </View> */}

                                </TouchableOpacity>

                            )}
                        />
                    </View>): selectedOption=== "Pending"?( 
                      
                            <View>
                            <View style={styles.tableHeader}>
                                <View style={styles.tableDataH}>
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            color: '#2E2E2E',
                                            fontFamily: 'Inter-Medium',
                                            fontWeight:'900'
                                        }}>
                                        Date
                                    </Text>
                                </View>
                                <View style={styles.tableDataH}>
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            color: '#2E2E2E',
                                            fontFamily: 'Inter-Medium',
                                            fontWeight:'900'
                                        }}>
                                        Name
                                    </Text>
                                </View>
                                <View style={styles.tableDataH}>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        color: '#2E2E2E',
                                        fontFamily: 'Inter-Medium',
                                        fontWeight:'900'
                                    }}>
                                   Employee Code
                                </Text>
                            </View>
                                <View style={styles.tableDataH}>
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            color: '#2E2E2E',
                                            fontFamily: 'Inter-Medium',
                                            fontWeight:'900'
                                        }}>
                                        Status
                                    </Text>
                                </View>
                                <View style={styles.tableDataH}>
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            color: '#2E2E2E',
                                            fontFamily: 'Inter-Medium',
                                            fontWeight:'900'
                                        }}>
                                        Reject
                                    </Text>
                                </View>
                            </View>
    
                            {/* body */}
                            <FlatList
                                data={pendingdata}
                                refreshControl={
                                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                                }
                                renderItem={({ item: v, index }) => (
    
                                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' ,borderRadius:1.5,
                                    borderColor:'#91A3B0s', borderWidth:0.18,   backgroundColor: index % 2 === 0 ? '#F0E68C' : 'transparent'}}>
    
                                        <View style={styles.tableData}>
                                            <View style={{ flexShrink: 1 }}>
                                                <Text
                                                    style={{
                                                        color: 'black',
                                                        fontFamily: 'Inter-Medium',
                                                    }}>
                                                    {v.date ? v.date.split('T')[0] : ''}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={styles.tableData}>
                                            <View style={{ flexShrink: 1 }}>
                                                <Text
                                                    style={{
                                                        color: 'black',
                                                        fontFamily: 'Inter-Medium',
                                                    }}>
                                                    {v.employeeId.name}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={styles.tableData}>
                                            <View style={{ flexShrink: 1 }}>
                                                <Text
                                                    style={{
                                                        color: 'black',
                                                        fontFamily: 'Inter-Medium',
                                                    }}>
                                                    {v.employeeId?.employeeCode ?v.employeeId?.employeeCode:'-' }
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={styles.tableData}>
                                            <View style={{ flexShrink: 1, flexBasis: '100%' }}>
    
                                                <Text
                                                    style={{
                                                        color: 'black',
                                                        fontFamily: 'Inter-Medium',
                                                    }}>
                                                    {v.status}
                                                </Text>
    
                                            </View>
                                        </View>
                                        <View style={styles.tableData}>
                                            <View style={{ flexShrink: 1, flexBasis: '100%' ,}}>
                                                <TouchableOpacity style={{borderRadius:4, borderWidth:0.1, backgroundColor:'#283093', width:'50%', padding:'3%'}}
                                                            onPress={() => handleReject({ id: v.employeeId._id, PunchIn: v.punches[0].punchIn, date: v.date, shift:v.shift })}
                                                            >

                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <Text
                                                            style={{
                                                                color: 'white',
                                                                fontFamily: 'Inter-Medium',
                                                               marginLeft:'2%'
                                                            }}>
                                                           Reject
                                                        </Text>
                                                        <Feather
                                                            color={'white'}
                                                            name="x"
                                                            size={15}
                                                            style={{marginLeft:3}}
                                                        />

                                                     
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
    
                                )}
    
                            />
                        </View>

                        
                      ) : (
                        <View>
                        <View style={styles.tableHeader}>
                            <View style={styles.tableDataH}>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        color: '#2E2E2E',
                                        fontFamily: 'Inter-Medium',
                                        fontWeight:'900'
                                    }}>
                                    Date
                                </Text>
                            </View>
                            <View style={styles.tableDataH}>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        color: '#2E2E2E',
                                        fontFamily: 'Inter-Medium',
                                        fontWeight:'900'
                                    }}>
                                    Name
                                </Text>
                            </View>
                            <View style={styles.tableDataH}>
                            <Text
                                style={{
                                    fontSize: 18,
                                    color: '#2E2E2E',
                                    fontFamily: 'Inter-Medium',
                                    fontWeight:'900'
                                }}>
                               Employee Code
                            </Text>
                        </View>
                            <View style={styles.tableDataH}>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        color: '#2E2E2E',
                                        fontFamily: 'Inter-Medium',
                                        fontWeight:'900'
                                    }}>
                                    Status
                                </Text>
                            </View>
                            {/* <View style={styles.tableDataH}>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        color: '#2E2E2E',
                                        fontFamily: 'Inter-Medium',
                                        fontWeight:'900'
                                    }}>
                                    Reject
                                </Text>
                            </View> */}
                        </View>

                        {/* body */}
                        <FlatList
                            data={rejecteddata}
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                            }
                            renderItem={({ item: v, index }) => (

                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' ,borderRadius:1.5,
                                borderColor:'#91A3B0s', borderWidth:0.18,   backgroundColor: index % 2 === 0 ? '#F08080' : 'transparent'}}>

                                    <View style={styles.tableData}>
                                        <View style={{ flexShrink: 1 }}>
                                            <Text
                                                style={{
                                                    color: 'black',
                                                    fontFamily: 'Inter-Medium',
                                                }}>
                                                {v.date ? v.date.split('T')[0] : ''}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.tableData}>
                                        <View style={{ flexShrink: 1 }}>
                                            <Text
                                                style={{
                                                    color: 'black',
                                                    fontFamily: 'Inter-Medium',
                                                }}>
                                                {v.employeeId.name}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.tableData}>
                                        <View style={{ flexShrink: 1 }}>
                                            <Text
                                                style={{
                                                    color: 'black',
                                                    fontFamily: 'Inter-Medium',
                                                }}>
                                                {v.employeeId?.employeeCode ?v.employeeId?.employeeCode:'-' }
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.tableData}>
                                        <View style={{ flexShrink: 1, flexBasis: '100%' }}>

                                            <Text
                                                style={{
                                                    color: 'black',
                                                    fontFamily: 'Inter-Medium',
                                                }}>
                                                {v.status}
                                            </Text>

                                        </View>
                                    </View>
                                    {/* <View style={styles.tableData}>
                                        <View style={{ flexShrink: 1, flexBasis: '100%' ,}}>
                                            <TouchableOpacity style={{borderRadius:4, borderWidth:0.1, backgroundColor:'#283093', width:'50%', padding:'3%'}}
                                                        onPress={() => handleReject({ id: v.employeeId._id, PunchIn: v.punches[0].punchIn, date: v.date, shift:v.shift })}
                                                        >

                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <Text
                                                        style={{
                                                            color: 'white',
                                                            fontFamily: 'Inter-Medium',
                                                           marginLeft:'2%'
                                                        }}>
                                                       Reject
                                                    </Text>
                                                    <Feather
                                                        color={'white'}
                                                        name="x"
                                                        size={15}
                                                        style={{marginLeft:3}}
                                                    />

                                                 
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View> */}
                                </TouchableOpacity>

                            )}

                        />
                    </View>

                      )}
                  
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
                     <Modal
        visible={isModalVisible1}
        transparent={true}
        animationType="slide"
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:'white' }}>
          {/* You can add a loading spinner or text to indicate voice recognition is in progress */}
          <Text style={{color:'black', fontSize:20,fontWeight:'600'}}>Voice recognition in progress...</Text>
        </View>
      </Modal>
      <Modal
                visible={isModalVisible2}
                animationType="slide"
                transparent={true}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' , backgroundColor:'white'}}>
                    <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 8 , borderWidth:0.3}}>
                        <Text style={{color:'black', fontWeight:'600', fontSize:20}}>Add Details</Text>
                        {/* <TextInput
                            placeholder="Punch-In Date"
                            // value={punchInDate}
                            // onChangeText={(text) => setPunchInDate(text)}
                        /> */}
                        <View style={{ margin:'5%'}}>
                            
                            <Text style={{ color:'gray', fontWeight:'600', fontSize:17}}>Punch-Out Date</Text>
                            <TouchableOpacity onPress={showDatePicker} style={{ borderWidth: 0.4, margin: 4, width: '50%', borderRadius: 4,  }}>
                                <Text>Show Date Picker</Text>
                            </TouchableOpacity>
                            <DateTimePickerModal
                                isVisible={isDatePickerVisible}
                                mode="time"
                                onConfirm={handleConfirm}
                                onCancel={hideDatePicker}
                            />
                        </View>
                            <View>

                           

                            <Text style={{ color:'gray', fontWeight:'400', fontSize:12}}>Punch-Out Time</Text>
                            <TouchableOpacity style={{borderWidth:0.4, margin:4, height:'25%', width:'50%', borderRadius:4, }}>
                                {/* <Text>date</Text> */}
                                
                            </TouchableOpacity>
                            </View>
                      
                        {/* <TextInput
                            placeholder="Remark"

                            // value={remark}
                            // onChangeText={(text) => setRemark(text)}
                        /> */}


                        <View style={{flexDirection:'row', justifyContent:'space-evenly', alignItems:'center'}}>
                            <TouchableOpacity  onPress={handleDone} style={{...styles.modalBtn, backgroundColor:'green', flexDirection:'row',alignItems:'center', justifyContent:'center'}}>
                            <Feather
                            name="check-circle"
                            size={16}
                            color={'white'}
                            style={{marginRight:'4%'}}
                            
                            
                        />
                                <Text style={{color:'white', fontSize:16}}>Done</Text></TouchableOpacity>
                            <TouchableOpacity onPress={closeModal2}  style={{...styles.modalBtn, backgroundColor:'red',flexDirection:'row',alignItems:'center', justifyContent:'center'}}>
                            <Feather
                            name="x"
                            size={16}
                            color={'white'}
                            style={{marginRight:'4%'}}
                            
                            
                        /><Text style={{color:'white'}}>Cancel</Text></TouchableOpacity>
                       
                        </View>
                    </View>
                </View>
            </Modal>
                </ScrollView>
            </View>

        </View>
    )
}

export default ApprovalLogs

const styles = StyleSheet.create({
    tableHeader: {
        backgroundColor: '#ECEDFE',
        flexDirection: 'row',
        borderRadius: 8
    },
    tableData: {
        paddingVertical: 12,
        paddingLeft: 20,
        width: 160,
        
    },
    tableDataH: {
        paddingVertical: 16,
        paddingLeft: 24,
        width: 160,
        // width:50
    },
    outerView: {
        padding: '6%', borderWidth: 1, borderRadius: 10, marginLeft: '4%',
        marginRight: '4%', borderColor: '#0000001F', height: '76%',
    }, container: {
        backgroundColor: '#fafafa',
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
    closeText: {
        marginTop: 10,
        fontSize: 18,
        color: 'black',
    },
    modalBtn:{
        borderRadius:8, backgroundColor:'#283093',width:'40%', padding:'1%', paddingVertical:'3%', alignItems:'center'
    },
    searchBarContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: '5%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%',
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#DEDEDE',
        //   paddingVertical: '1%',
        marginLeft: '4%',
        //height:"10%"
    },
    searchIcon: {
        fontSize: 16,
        marginRight: 10,
        color: '#333',

    },
    searchInput: {
        fontSize: 16,
        height: 48,
        flex: 1,
        color: 'black',
    },

})






                                                           