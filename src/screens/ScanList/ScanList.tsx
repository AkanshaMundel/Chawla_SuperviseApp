import { StyleSheet, Text, View ,ScrollView, FlatList,RefreshControl,Alert,TouchableOpacity,Image, Modal,ActivityIndicator} from 'react-native'
import React ,{useState, useEffect}from 'react'
import Navbar from '../../components/Navbar/Navbar'
import axios from 'axios'
import { Picker } from '@react-native-picker/picker';
import Feather from 'react-native-vector-icons/Feather'
import Snackbar from 'react-native-snackbar'
import { ImageIndex } from '../../assets/AssetIndex';

import DateTimePickerModal from 'react-native-modal-datetime-picker'

import { Dialog, ALERT_TYPE } from 'react-native-alert-notification';

const ScanList = ({navigation,route}:any) => {
    const [loading, setLoading] = useState(false);
    // const {selectedDate} = route.params ||{};
    // console.log("selecteddate on scanlist", selectedDate)
    const [dateToShow, setDateToShow] = useState<any>(null);
    const [shop, setshop]= useState<any>();
    const [data, setData] = useState<any>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedOption, setSelectedOption] = useState('day');
    const [isDatePickerVisibleTable, setDatePickerVisibilityTable] = useState(false);
    const onRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    };
    const handleOpenButtonPress = (imageUrl: any) => {
        console.log('im from here img', imageUrl);
        setSelectedImageUrl(imageUrl);
        setIsModalVisible(!isModalVisible);
    };
    // const closeModal2 = () => {
    //     setModalVisible2(false);
    // };
    
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
      const handleConfirmTable = (date:any)=>{
        const dateselected = new Date(date);
        console.log("date-------------------------------", dateselected)
        // const formattedDatestate = dateselected.toISOString().split('T')[0];
        // console.log("formatedd---------------------",formattedDatestate)
        // prevDate.setDate(prevDate.getDate() - 1);
        setSelectedDate(dateselected);
        hideDatePickerTable();

    }
    const showDatePickerTable = () => {
        console.log("-----------------------------------")
        setDatePickerVisibilityTable(true);
    };
    const hideDatePickerTable = () => {
        setDatePickerVisibilityTable(false);

    };
  console.log("selection option shift-----------", selectedOption, selectedDate)
    const fetchData = async () => {
        const datePart = selectedDate.toISOString().split('T')[0];
        console.log("new added date on scanlist<<<<<<<<<<<<<<<",datePart);
        const currentDate = new Date();
        // const currentDate = new Date();
       console.log("api parammss------------------->",datePart,shop, selectedOption)

        const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
        try {
         
            setLoading(true);

            const resprofile = await axios.get('https://chawlacomponents.com/api/v1/auth/myprofile');
            const dataprofile = resprofile.data;
            console.log('dataprofileee', dataprofile)
            let shopp = dataprofile?.shop?.shopName
           setshop(shopp);
           console.log("shoopp--------------------", shopp);
           console.log("datepart", datePart)



            console.log("------------------------------------------------>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", datePart, shop, selectedOption)
            const manualnumber = await axios.get(`https://chawlacomponents.com/api/v2/scanSlip?date=${datePart}&shopName=${shopp}&shift=${selectedOption}`)
            const datamanualnumber = manualnumber.data?.slips[0]?.shop[0]?.scannedSlip
            console.log('api data coming-------------------------------------------------------------------------', datamanualnumber)
            setData(datamanualnumber)
            setLoading(false);
           
            
        }
        // &groupName=${selectedOption1}
        catch (err) {
            console.error('Error fetching data IN SCANNNNN:', err);
            // Alert.alert('error from api');
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchData();
        // if (selectedDate) {
        //     // Update state with the selected date
        //     setDateToShow(new Date(selectedDate).toLocaleString());
        //   }
        

        

    }, [selectedDate, selectedOption]);
    console.log("dataaaaaaaaaaaaaaaaaaaaaaaa", data)
    console.log("shoppp on listscan",shop)
    console.log("date ", dateToShow)

  return (
    <View style={{ flex: 1, backgroundColor: 'white' , paddingBottom:'2%'}}>
    <Navbar navigation={navigation} />
    <View style={{flexDirection:'row',justifyContent:'space-evenly', alignItems:'center'}}>
    <Text style={{ fontSize: 20, color: '#2E2E2E', fontWeight: '700', margin:'5%' }}>  Scan sheet Logs </Text>
    <View style={{
                       
                       width: '45%',
                     
                       borderColor: '#DEDEDE',
                       borderRadius: 3,
                       borderWidth:1,
                       elevation:2
                       
                   }}>

                       <Picker
                           style={{
                               backgroundColor: 'white',
                               // color: '#283093',
                               color:'black',
                               fontWeight:'600',
                               borderRadius:8,
                               borderWidth:1,

                           }}
                           selectedValue={selectedOption}
                           onValueChange={itemValue => setSelectedOption(itemValue)}
                           dropdownIconColor={'black'}
                       >
                           <Picker.Item label="Select shift" value="shift" />
                           <Picker.Item label="day" value="day" />
                           <Picker.Item label="night" value="night" />
                       </Picker>
                   </View>
                   
    </View>
    
    {/* {dateToShow ? (
        <Text style={{ fontSize: 18, color: '#333', margin: '5%' }}>
          {dateToShow}
        </Text>
      ) : (
        <Text style={{ fontSize: 18, color: '#FF0000', margin: '5%' }}>
          No date selected
        </Text>
      )} */}
    <ScrollView  style={{maxHeight:'90%', marginBottom:'3%', margin:'2%',}}>
                    <View style={{ margin: '1%',}}>
                        <View style={styles.tableHeader}>
                            <View style={{ ...styles.tableDataH, width: 120 }}>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        color: '#2E2E2E',
                                        fontFamily: 'Inter-Medium',
                                        fontWeight: '900'
                                    }}>
                                    S.No.
                                </Text>
                            </View>
                            <View style={styles.tableDataH}>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        color: '#2E2E2E',
                                        fontFamily: 'Inter-Medium',
                                        fontWeight: '900'
                                    }}>
                                    Shop Name
                                </Text>
                            </View>
                            <View style={styles.tableDataH}>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        color: '#2E2E2E',
                                        fontFamily: 'Inter-Medium',
                                        fontWeight: '900'
                                    }}>
                                    Photo
                                </Text>
                            </View>
                           

                        </View>
                        {loading?(
            <View style={{ flex: 1, justifyContent:'center', alignItems:'center', }}>
              <ActivityIndicator size="small" color="#0000ff" />
            </View>
          ):(
            // {/* body */}
            <FlatList
            data={data}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({ item: v, index }) =>
         
             (    console.log("tableeeeeeeeeee",v),
                <TouchableOpacity style={{
                    flexDirection: 'row', alignItems: 'center', borderRadius: 1.5,
                    borderColor: '#91A3B0s', borderWidth: 0.18,
                }}>

                    <View style={{ ...styles.tableData, width: 120, }}>
                        <View style={{ flexShrink: 1 }}>
                            <Text
                                style={{
                                    color: 'black',
                                    fontFamily: 'Inter-Medium',
                                }}>
                                {index+1}
                            </Text>
                        </View>
                    </View>
                    <View style={{ ...styles.tableData, }}>
                        <View style={{ flexShrink: 1 }}>
                            <Text
                                style={{
                                    color: 'black',
                                    fontFamily: 'Inter-Medium',
                                    // textAlign:'center',

                                }}>
                                {shop}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.tableData}>
                        <View style={{ flexShrink: 1, flexBasis: '100%' }}>
                            <TouchableOpacity onPress={() => handleOpenButtonPress(v)}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text
                                        style={{
                                            color: 'black',
                                            fontFamily: 'Inter-Medium',
                                            textDecorationLine:'underline'
                                        }}>
                                        Open
                                    </Text>
                                    <Image style={{ width: 15, height: 15, marginLeft: 4 }} source={ImageIndex.arrowout} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    
                    
                </TouchableOpacity>

            )}
        />
          )}

                        
                    </View>
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
                    

                </ScrollView>
                <View style={styles.dateFilterContainer}>
          <TouchableOpacity onPress={handlePrevDate}>
            <Feather
                                name="arrow-left" size={20} color='#283093' />
          </TouchableOpacity>
          <TouchableOpacity onPress={showDatePickerTable}><Text style={styles.dateText}>{selectedDate.toDateString()}</Text></TouchableOpacity>
          <DateTimePickerModal
                    isVisible={isDatePickerVisibleTable}
                    mode="date"
                    onConfirm={handleConfirmTable}
                    onCancel={hideDatePickerTable}
                />
          <TouchableOpacity onPress={handleNextDate}>
            <Feather name="arrow-right" size={20} color='#283093' />
          </TouchableOpacity>
        </View>
    </View>
  )
}

export default ScanList

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
        borderRadius: 8, backgroundColor: '#283093', width: '40%', padding: '1%', paddingVertical: '3%', alignItems: 'center'
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
})