// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import Auth from './src/Pages/Auth';
// import Home from './src/Pages/Home'; 
// const Stack = createNativeStackNavigator();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="Auth" component={Auth} />
//         <Stack.Screen name="Home" component={Home} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }


import React, { useEffect } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Auth from './src/Pages/Auth'; 
import Home from './src/Pages/Home'; 

import {
  checkIfHasSMSPermission,
  requestReadSMSPermission,
  startReadSMS,
  stopReadSMS,
} from "@maniac-tech/react-native-expo-read-sms";
const Stack = createNativeStackNavigator();
const smsParser = (message) => {
  const amountMatch = message.match(/₹\s?([\d,\.]+)/);
  const balanceMatch =
    message.match(/bal(?:ance)?[:\s]?₹\s?([\d,\.]+)/i) ||
    message.match(/avl bal(?:ance)?[:\s]?₹\s?([\d,\.]+)/i) ||
    message.match(/closing bal(?:ance)?[:\s]?₹\s?([\d,\.]+)/i);

  const type = message.toLowerCase().includes("debited")
    ? "debit"
    : message.toLowerCase().includes("credited")
    ? "credit"
    : "unknown";

  return {
    type,
    amount: amountMatch ? amountMatch[1] : null,
    balance: balanceMatch ? balanceMatch[1] : null,
  };
};

export default function App() {
  useEffect(() => {
    const initSMSListener = async () => {
      const perm = await checkIfHasSMSPermission();

      if (!perm.hasReceiveSmsPermission || !perm.hasReadSmsPermission) {
        const granted = await requestReadSMSPermission();
        if (!granted) {
          console.warn("Permission denied");
          return;
        }
      }

      startReadSMS((sms) => {
        const [sender, text] = sms;

        if (text.includes("₹")) {
          const parsed = smsParser(text);
          console.log("📩 SMS:", text);
          console.log("🔍 Detected:", parsed);
        }
      }, (error) => {
        console.log("SMS Error:", error);
      });
    };

    initSMSListener();

    return () => {
      stopReadSMS();
      <NavigationContainer>
//       <Stack.Navigator screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="Auth" component={Auth} />
//         <Stack.Screen name="Home" component={Home} />
//       </Stack.Navigator>
//     </NavigationContainer>// cleanup when app closes
    };
  }, []);

  return null; // You can replace this with navigation or UI
}

