import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import API_BASE_URL from '../config/api';

export default function AIsuggest() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!query.trim()) return Alert.alert('Please enter your financial query.');

    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('token'); // Retrieve JWT

      if (!token) {
        Alert.alert('Authentication Error', 'Please login first');
        setLoading(false);
        return;
      }

      // Trim the token to remove any whitespace
      const cleanToken = token.trim();
      console.log('Token retrieved, length:', cleanToken.length);

      const res = await fetch(`${API_BASE_URL}/api/callai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cleanToken}`, // JWT token
        },
        body: JSON.stringify({ query }),
      });


      const text = await res.text(); 
      let data;
      try {
        data = JSON.parse(text); 
      } catch (err) {
        console.log('Invalid JSON from backend:', text);
        Alert.alert('Error', 'Server returned invalid response');
        setLoading(false);
        return;
      }

      if (!res.ok) {
        // Handle specific error cases
        if (res.status === 401) {
          Alert.alert(
            'Authentication Error', 
            data.message || 'Your session has expired. Please login again.',
            [
              { text: 'OK', onPress: () => {
                // Optionally clear token and redirect to login
                SecureStore.deleteItemAsync('token');
              }}
            ]
          );
        } else {
          Alert.alert('Error', data.message || 'Failed to get AI response');
        }
        setLoading(false);
        return;
      }

      setResponse(data.response || 'No response received');
    } catch (error) {
      console.error('Error calling API:', error);
      Alert.alert('Connection Error', 'Could not connect to server. Please check your internet connection and ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>AI Financial Advisor</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your financial decision"
        value={query}
        onChangeText={setQuery}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Generating...' : 'Get Advice'}</Text>
      </TouchableOpacity>

      {response ? (
        <View style={styles.responseBox}>
          <Text style={styles.responseText}>{response}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: {
    width: '100%',
    minHeight: 80,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  responseBox: {
    width: '100%',
    padding: 15,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
  },
  responseText: { fontSize: 16 },
});
