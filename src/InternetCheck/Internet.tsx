import { StyleSheet, Text, TouchableOpacity, View ,Dimensions} from 'react-native'
import React, {useEffect,useState} from 'react'
import NetInfo from '@react-native-community/netinfo'
import Modal from 'react-native-modal'

import LocalizedString from 'react-native-localization'

const Internet = ({isConnected, setIsConnected}:any) => {
  let strings = new LocalizedString({
    en:{
        "InternetIssue": "ओह! लगता है कि आपका डिवाइस इंटरनेट से जुड़ा नहीं है। कृपया इंटरनेट कनेक्शन की जाँच करें।",
     
    }
})
  const [isLoading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [isOffline, setOfflineStatus] = useState(false);
  const Button = ({ children, ...props }:any) => (
    <TouchableOpacity style={styles.button} {...props}>
        <Text style={styles.buttonText}>{children}</Text>
    </TouchableOpacity>
);

  useEffect(()=>{
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
      setIsConnected(state.isConnected)
    });
    const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
      const offline = !(state.isConnected && state.isInternetReachable);
      setOfflineStatus(offline);
  });
  
    return ()=>{
      unsubscribe();
      removeNetInfoSubscription();
    }
  },[])
  const checkConnection =() =>{
    NetInfo.fetch().then(state => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
      setIsConnected(state.isConnected)
    });
  }

  return (
    <View style={styles.container}>

{isConnected== true ?'' :
     
     <Modal isVisible={isOffline} style={styles.modal} animationInTiming={600}>
     <View style={styles.modalContainer}>
         <Text style={styles.modalTitle}>Connection Error</Text>
         <Text style={styles.modalText}>
             {strings.InternetIssue}
         </Text>
         <Button onPress={checkConnection} disabled={isLoading}>
             Try Again
         </Button>
     </View>
 </Modal>
      
  }
    </View>
  )
}

export default Internet

const styles = StyleSheet.create({
  container: {
      ...StyleSheet.absoluteFillObject,
  },
  user: {
      width: Dimensions.get('screen').width - 32,
      alignSelf: 'center',
      marginVertical: 8,
      padding: 12,
      borderWidth: 1,
      borderColor: '#eee',
      borderRadius: 6,
      flexDirection: 'row',
      alignItems: 'center',
  },
  info: {
      marginLeft: 10,
  },
  avatar: {
      width: 60,
      height: 60,
      borderRadius: 100,
  },
  name: {
      color: '#424242',
      fontSize: 16,
      fontWeight: '600',
  },
  email: {
      marginTop: 6,
      color: '#888',
  },
  modal: {
      justifyContent: 'flex-end',
      margin: 0,
  },
  modalContainer: {
      backgroundColor: 'white',
      paddingHorizontal: 16,
      paddingTop: 30,
      paddingBottom: 40,
      alignItems: 'center',
  },
  modalTitle: {
      fontSize: 25,
      fontWeight: '800',
      // color:'black'
  },
  button: {
      backgroundColor: '#283093',
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
  },
  buttonText: {
      color: 'white',
      fontSize: 16,
      textAlign: 'center',
  },
  modalText:{
    fontSize:15,
    fontWeight:'600',
    // color:'black'
  }
});