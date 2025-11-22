// import React, { useEffect, useState } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import SmsAndroid from 'react-native-get-sms-android'
// import Auth from './src/Pages/Auth';
// import Home from './src/Pages/Home';
// import AIsuggest from './src/Pages/AIsuggest'; 
// import ProductSearch from './src/Pages/ProductSearch';
// import InvestmentPlanner from './src/Pages/InvestmentPlanner';
// import { FlatList, PermissionsAndroid, View } from 'react-native';
// const Stack = createNativeStackNavigator();


// // const SMSReader = () => {
// //   cont [smsList, setSmsList] = useState([])

// //   async function requestPerm(){
// //     try{
// //       const granted = await PermissionsAndroid.request(
// //         PermissionsAndroid.PERMISSIONS.READ_SMS, {
// //           title: "SMS Permission",
// //           message: "Needs access to SMS Messages",
// //           buttonNeutral: "Ask me later",
// //           buttonNegative: "Cancel",
// //           buttonPositive: "Ok"
// //         }
// //       )
// //       return granted == PermissionsAndroid.RESULTS.GRANTED
// //     }
// //     catch(error){
// //       console.log(error)
// //       return false
// //     }
// //   }
// // }
// // useEffect(() => {
// //   async function fetchSms(){
// //     const hasPermission = await requestPerm()

// //     if(hasPermission){
// //       SmsAndroid.list(
// //         JSON.stringify({
// //           box: 'inbox',
// //           maxCount: 10
// //         }),
// //         (fail) => {
// //           console.log("Failed with this error");
// //         },
// //         (count, smsList)=>{
// //           const messages=  JSON.parse(smsList)
// //           setSmsList(messages)
// //         }
// //       )
// //     }
// //   }
// //   fetchSms()
// // }, [])

// // const renderItems = ({item})=>{
// //   return(
// //     <View>
// //       <Text>{item.body}</Text>
// //       <Text>{item.address}</Text>
// //     </View>
// //   )
// // }


// export default function App() {
//   const [smsList, setSmsList] = useState([])

//   async function requestPerm(){
//     try{
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.READ_SMS, {
//           title: "SMS Permission",
//           message: "Needs access to SMS Messages",
//           buttonNeutral: "Ask me later",
//           buttonNegative: "Cancel",
//           buttonPositive: "Ok"
//         }
//       )
//       return granted == PermissionsAndroid.RESULTS.GRANTED
//     }
//     catch(error){
//       console.log(error)
//       return false
//     }
//   }

// useEffect(() => {
//   async function fetchSms(){
//     const hasPermission = await requestPerm()

//     if(hasPermission){
//       SmsAndroid.list(
//         JSON.stringify({
//           box: 'inbox',
//           maxCount: 10
//         }),
//         (fail) => {
//           console.log("Failed with this error");
//         },
//         (count, smsList)=>{
//           const messages=  JSON.parse(smsList)
//           setSmsList(messages)
//           console.log(smsList)
//         }
//       )
//     }
//   }
//   fetchSms()
// }, [])

// // const renderItems = ({item})=>{
// //   return(
// //     <View>
// //       <Text>{item.body}</Text>
// //       <Text>{item.address}</Text>
// //     </View>
// //   )
// // }
//   return (
//       // {/* <FlatList
//       // data={smsList}
//       // keyExtractor={(item, index) => index.toString()}
//       // renderItem={renderItems}
//       // ListEmptyComponent={<Text>No SMS found</Text>} 
//       // /> */}
//     <NavigationContainer>
//       <Stack.Navigator screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="Auth" component={Auth} />
//         <Stack.Screen name="Home" component={Home} />
//         <Stack.Screen name="ProductSearch" component={ProductSearch} />
//         <Stack.Screen name="AIsuggest" component={AIsuggest} />
//         <Stack.Screen name="InvestmentPlanner" component={InvestmentPlanner} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SmsAndroid from 'react-native-get-sms-android';
import Auth from './src/Pages/Auth';
import Home from './src/Pages/Home';
import AIsuggest from './src/Pages/AIsuggest'; 
import ProductSearch from './src/Pages/ProductSearch';
import InvestmentPlanner from './src/Pages/InvestmentPlanner';
import { PermissionsAndroid, View, Text } from 'react-native'; // Added Text import
const Stack = createNativeStackNavigator();

export default function App() {
  const [smsList, setSmsList] = useState([]);

  // Function to request SMS permission
  async function requestPerm() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        {
          title: "SMS Permission",
          message: "Needs access to SMS Messages",
          buttonNeutral: "Ask me later",
          buttonNegative: "Cancel",
          buttonPositive: "Ok"
        }
      );
      // Log the result of the permission request for debugging
      console.log("Permission granted:", granted === PermissionsAndroid.RESULTS.GRANTED);
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      console.log("Permission request error:", error);
      return false;
    }
  }

  // Effect hook to run when the component mounts
  useEffect(() => {
    async function fetchSms() {
      const hasPermission = await requestPerm();

      if (hasPermission) {
        SmsAndroid.list(
          JSON.stringify({
            box: 'inbox',
            maxCount: 10
          }),
          (fail) => {
            console.log("Failed to fetch SMS:", fail);
          },
          (count, smsListString) => { // Renamed parameter to avoid conflict
            try {
              const messages = JSON.parse(smsListString);
              setSmsList(messages);
              console.log("Fetched SMS messages:", messages);
            } catch (e) {
              console.log("Error parsing SMS list:", e);
            }
          }
        );
      } else {
        console.log("SMS permission denied. Cannot fetch messages.");
      }
    }

    fetchSms();
  }, []); // The empty dependency array ensures this runs once when the app starts

  // You can use the smsList state here for rendering if needed

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={Auth} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="ProductSearch" component={ProductSearch} />
        <Stack.Screen name="AIsuggest" component={AIsuggest} />
        <Stack.Screen name="InvestmentPlanner" component={InvestmentPlanner} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

