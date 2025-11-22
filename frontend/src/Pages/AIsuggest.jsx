import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  ScrollView,
  ActivityIndicator 
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import API_BASE_URL from '../config/api';

export default function AIsuggest() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!query.trim()) {
      Alert.alert('⚠️ Missing Query', 'Please enter your financial question or decision to get AI advice.');
      return;
    }

    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('token');

      if (!token) {
        Alert.alert('🔒 Authentication Required', 'Please login first to get personalized financial advice.');
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
          Authorization: `Bearer ${cleanToken}`,
        },
        body: JSON.stringify({ query }),
      });

      const text = await res.text(); 
      let data;
      try {
        data = JSON.parse(text); 
      } catch (err) {
        console.log('Invalid JSON from backend:', text);
        Alert.alert('❌ Server Error', 'Server returned invalid response. Please try again.');
        setLoading(false);
        return;
      }

      if (!res.ok) {
        if (res.status === 401) {
          Alert.alert(
            '🔒 Session Expired', 
            data.message || 'Your session has expired. Please login again.',
            [
              { 
                text: 'OK', 
                onPress: () => {
                  SecureStore.deleteItemAsync('token');
                }
              }
            ]
          );
        } else {
          Alert.alert('❌ Error', data.message || 'Failed to get AI response');
        }
        setLoading(false);
        return;
      }

      setResponse(data.response || 'No response received');
    } catch (error) {
      console.error('Error calling API:', error);
      Alert.alert(
        '🌐 Connection Error', 
        'Could not connect to server. Please check your internet connection and ensure the backend server is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setQuery('');
    setResponse('');
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section */}
      <View style={styles.headerSection}>
        <Text style={styles.mainTitle}>🤖 AI Financial Advisor</Text>
        <Text style={styles.subtitle}>
          Get personalized financial advice powered by AI. Ask any financial question or get guidance on your decisions.
        </Text>
      </View>

      {/* Input Card */}
      <View style={styles.inputCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>💬 Your Financial Question</Text>
          <Text style={styles.cardSubtitle}>Describe your situation or ask for advice</Text>
        </View>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="e.g., Should I invest in stocks or mutual funds? Is it a good time to buy a house? How can I save more money?"
            value={query}
            onChangeText={setQuery}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            placeholderTextColor="#94a3b8"
            editable={!loading}
          />
          {query.length > 0 && (
            <View style={styles.characterCount}>
              <Text style={styles.characterCountText}>{query.length} characters</Text>
            </View>
          )}
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, loading && styles.disabledButton]} 
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={styles.buttonText}>Generating Advice...</Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>✨ Get AI Advice</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Response Card */}
      {response ? (
        <View style={styles.responseCard}>
          <View style={styles.responseHeader}>
            <View style={styles.responseHeaderLeft}>
              <Text style={styles.responseIcon}>💡</Text>
              <Text style={styles.responseTitle}>AI Financial Advice</Text>
            </View>
            <View style={styles.aiBadge}>
              <Text style={styles.aiBadgeText}>AI</Text>
            </View>
          </View>
          
          <View style={styles.responseContent}>
            <Text style={styles.responseText}>{response}</Text>
          </View>

          <View style={styles.responseFooter}>
            <TouchableOpacity 
              style={styles.clearButton} 
              onPress={clearAll}
              activeOpacity={0.7}
            >
              <Text style={styles.clearButtonText}>🔄 Ask Another Question</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>💭</Text>
          <Text style={styles.emptyStateTitle}>Ready to Help</Text>
          <Text style={styles.emptyStateText}>
            Enter your financial question above and get personalized AI-powered advice tailored to your situation.
          </Text>
          <View style={styles.exampleQuestions}>
            <Text style={styles.exampleTitle}>💡 Example Questions:</Text>
            <View style={styles.exampleList}>
              <Text style={styles.exampleItem}>• Should I invest in cryptocurrency?</Text>
              <Text style={styles.exampleItem}>• Is it better to rent or buy a house?</Text>
              <Text style={styles.exampleItem}>• How much should I save each month?</Text>
              <Text style={styles.exampleItem}>• What's the best retirement plan for me?</Text>
            </View>
          </View>
        </View>
      )}

      {/* Info Card */}
      <View style={styles.infoCard}>
        <View style={styles.infoHeader}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoTitle}>About AI Financial Advisor</Text>
        </View>
        <Text style={styles.infoText}>
          Our AI advisor provides personalized financial guidance based on your questions. 
          The advice considers your financial situation, goals, and risk tolerance to help you make informed decisions.
        </Text>
      </View>

      {/* Footer Spacing */}
      <View style={styles.footerSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 10,
  },
  headerSection: {
    padding: 24,
    paddingTop: 20,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  inputCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardHeader: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#64748b',
  },
  inputWrapper: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
    minHeight: 120,
    maxHeight: 200,
  },
  characterCount: {
    marginTop: 8,
    alignItems: 'flex-end',
  },
  characterCountText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  disabledButton: {
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  responseCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 20,
    padding: 22,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#86efac',
    shadowColor: '#10b981',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  responseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#d1fae5',
  },
  responseHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  responseIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  responseTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#065f46',
    flex: 1,
  },
  aiBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  aiBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  responseContent: {
    marginTop: 4,
    marginBottom: 16,
  },
  responseText: {
    fontSize: 16,
    color: '#1f2937',
    lineHeight: 26,
  },
  responseFooter: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#d1fae5',
  },
  clearButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#86efac',
  },
  clearButtonText: {
    color: '#10b981',
    fontSize: 15,
    fontWeight: '600',
  },
  emptyState: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 32,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  exampleQuestions: {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
  },
  exampleTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  exampleList: {
    gap: 8,
  },
  exampleItem: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
  infoCard: {
    backgroundColor: '#dbeafe',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#93c5fd',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e40af',
  },
  infoText: {
    fontSize: 14,
    color: '#1e3a8a',
    lineHeight: 22,
  },
  footerSpacing: {
    height: 30,
  },
});
