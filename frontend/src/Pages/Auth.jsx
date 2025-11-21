import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import styles from "./Authstyles.js";   // ⬅ import external style file

const BACKEND_URL = "http://localhost:8081"; 
export default function Auth({ navigation }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleAuth = async () => {
    if (!email || !password) return Alert.alert("Please fill all fields");
    if (!isLogin && password !== confirm)
      return Alert.alert("Passwords do not match");

    const endpoint = isLogin ? "login" : "register";
    const payload = isLogin ? { email, password } : { name, email, password };

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) return Alert.alert(data.message || "Error");

      // store token
      await SecureStore.setItemAsync("token", data.token);

      navigation.replace("Home");
    } catch (error) {
      Alert.alert("Server error");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? "Login" : "Register"}</Text>

      {!isLogin && (
        <TextInput
          placeholder="Name"
          value={name}
          style={styles.input}
          onChangeText={setName}
        />
      )}

      <TextInput
        placeholder="Email"
        value={email}
        style={styles.input}
        keyboardType="email-address"
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        value={password}
        style={styles.input}
        secureTextEntry
        onChangeText={setPassword}
      />

      {!isLogin && (
        <TextInput
          placeholder="Confirm Password"
          value={confirm}
          style={styles.input}
          secureTextEntry
          onChangeText={setConfirm}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handleAuth}>
        <Text style={styles.buttonText}>
          {isLogin ? "Login" : "Register"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.switchText}>
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
