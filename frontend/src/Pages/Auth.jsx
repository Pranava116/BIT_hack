import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import styles from "./Authstyles";
 

export default function Auth({ navigation }) {
  
const BACKEND_URL = "http:/10.14.217.126:3000"; 
  const [isLogin, setIsLogin] = useState(true);       
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleAuth = async () => {
  if (!email || !password) return Alert.alert("Please fill all fields");
  if (!isLogin && password !== confirm)
    return Alert.alert("Passwords do not match");

  const endpoint = isLogin ? "login" : "signup";
  const body = isLogin ? { email, password } : { username, email, password };

  try {
    const res = await fetch(`${BACKEND_URL}/auth/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

if (!data.success) {
  return Alert.alert(data.message || "Authentication failed");
}


await SecureStore.setItemAsync("token", data.token);
navigation.navigate("Home");

  } catch (error) {
    Alert.alert("Server not reachable. Check backend URL.");
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? "Login" : "Register"}</Text>

      {!isLogin && (
        <TextInput
          placeholder="Name"
          value={username}
          onChangeText={setName}
          style={styles.input}
        />
      )}

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {!isLogin && (
        <TextInput
          placeholder="Confirm Password"
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry
          style={styles.input}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handleAuth}>
        <Text style={styles.buttonText}>{isLogin ? "Login" : "signup"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsLogin((prev) => !prev)}>
        <Text style={styles.switchText}>
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
