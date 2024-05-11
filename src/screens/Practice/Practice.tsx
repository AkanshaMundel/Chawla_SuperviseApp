import { View, Text , TouchableOpacity, Pressable} from 'react-native'
import React, { useEffect } from 'react'
import Animated , {useSharedValue, useAnimatedStyle, withTiming} from 'react-native-reanimated'

const TAB_WIDTH= 150;
const TABS = ['home', 'search', 'profile']




// useEffect = ()=>{
//    offset.value = withRepeat(
//     withTiming(-offset.value,{duration:1500});

//    )

// }


const Practice = ({navigation}:any) => {
  const offset = useSharedValue(-TAB_WIDTH)
  const animatedStyles = useAnimatedStyle(()=>(
    {
      transform:[{translateX:offset.value}]
    }
  ))
  return (
    <View>
     {/* <Animated.View>
     <View>
        <TouchableOpacity onPress={handler}>

            <Text>press</Text>
        </TouchableOpacity>
     </View>

     </Animated.View> */}

   
    <View>
      {TABS.map(()=>(
        <Pressable><Text>btn</Text>
        <View>
          {/* <Text>{React.Fragment}</Text> */}
     
          </View>
          </Pressable>



      ))}
      <View>

      </View>
    </View>
    </View>
  )
}

export default Practice


