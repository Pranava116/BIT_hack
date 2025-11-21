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

export default function InvestmentPlanner({ navigation }) {
  const [salary, setSalary] = useState('');
  const [monthlyBills, setMonthlyBills] = useState('');
  const [spending, setSpending] = useState('');
  const [savings, setSavings] = useState(null);
  const [investmentAdvice, setInvestmentAdvice] = useState('');
  const [loading, setLoading] = useState(false);

  const calculateSavings = () => {
    const salaryNum = parseFloat(salary);
    const billsNum = parseFloat(monthlyBills);
    const spendingNum = parseFloat(spending);

    if (!salary || !monthlyBills || !spending) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (isNaN(salaryNum) || isNaN(billsNum) || isNaN(spendingNum)) {
      Alert.alert('Error', 'Please enter valid numbers');
      return;
    }

    if (salaryNum < 0 || billsNum < 0 || spendingNum < 0) {
      Alert.alert('Error', 'Values cannot be negative');
      return;
    }

    const calculatedSavings = salaryNum - billsNum - spendingNum;
    setSavings(calculatedSavings);

    if (calculatedSavings <= 0) {
      Alert.alert(
        'Warning', 
        `Your monthly savings is ₹${calculatedSavings.toFixed(2)}. You are spending more than you earn. Consider reducing your expenses.`
      );
    }
  };

  const getInvestmentAdvice = async () => {
    if (savings === null) {
      Alert.alert('Error', 'Please calculate savings first');
      return;
    }

    if (savings <= 0) {
      Alert.alert('Error', 'You need positive savings to get investment advice');
      return;
    }

    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('token');

      if (!token) {
        Alert.alert('Authentication Error', 'Please login first');
        setLoading(false);
        return;
      }

      // Trim the token to remove any whitespace
      const cleanToken = token.trim();
      console.log('Token retrieved, length:', cleanToken.length);
      console.log('Token preview:', cleanToken.substring(0, 20) + '...');

      const res = await fetch(`${API_BASE_URL}/api/investment-advice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cleanToken}`,
        },
        body: JSON.stringify({
          salary: parseFloat(salary),
          monthlyBills: parseFloat(monthlyBills),
          spending: parseFloat(spending),
          savings: savings,
        }),
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
        console.log('Response status:', res.status);
        console.log('Response data:', data);
        if (res.status === 401) {
          Alert.alert(
            'Authentication Error',
            data.message || 'Your session has expired. Please login again.',
            [
              {
                text: 'OK',
                onPress: () => {
                  SecureStore.deleteItemAsync('token');
                },
              },
            ]
          );
        } else {
          Alert.alert('Error', data.message || `Failed to get investment advice (Status: ${res.status})`);
        }
        setLoading(false);
        return;
      }

      setInvestmentAdvice(data.advice || 'No advice received');
    } catch (error) {
      console.error('Error calling API:', error);
      Alert.alert(
        'Connection Error',
        'Could not connect to server. Please check your internet connection and ensure the backend server is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSalary('');
    setMonthlyBills('');
    setSpending('');
    setSavings(null);
    setInvestmentAdvice('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Investment Planner</Text>
      <Text style={styles.subtitle}>
        Calculate your savings and get personalized investment advice
      </Text>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Monthly Salary (₹)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your monthly salary"
          value={salary}
          onChangeText={setSalary}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Monthly Bills (₹)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your monthly bills (rent, utilities, etc.)"
          value={monthlyBills}
          onChangeText={setMonthlyBills}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Monthly Spending (₹)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your monthly spending (food, entertainment, etc.)"
          value={spending}
          onChangeText={setSpending}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.calculateButton} onPress={calculateSavings}>
          <Text style={styles.buttonText}>Calculate Savings</Text>
        </TouchableOpacity>
      </View>

      {savings !== null && (
        <View style={styles.savingsContainer}>
          <Text style={styles.savingsLabel}>Monthly Savings</Text>
          <Text
            style={[
              styles.savingsAmount,
              savings > 0 ? styles.positiveSavings : styles.negativeSavings,
            ]}
          >
            ₹{savings.toFixed(2)}
          </Text>
        </View>
      )}

      {savings !== null && savings > 0 && (
        <TouchableOpacity
          style={[styles.adviceButton, loading && styles.disabledButton]}
          onPress={getInvestmentAdvice}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Get AI Investment Advice</Text>
          )}
        </TouchableOpacity>
      )}

      {investmentAdvice ? (
        <View style={styles.adviceContainer}>
          <Text style={styles.adviceTitle}>Investment Recommendations</Text>
          <Text style={styles.adviceText}>{investmentAdvice}</Text>
        </View>
      ) : null}

      <TouchableOpacity style={styles.resetButton} onPress={resetForm}>
        <Text style={styles.resetButtonText}>Reset</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f0f4ff',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 20,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#f8fafc',
    marginBottom: 4,
  },
  calculateButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  adviceButton: {
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  savingsContainer: {
    backgroundColor: '#dbeafe',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  savingsLabel: {
    fontSize: 16,
    color: '#1e40af',
    fontWeight: '600',
    marginBottom: 8,
  },
  savingsAmount: {
    fontSize: 32,
    fontWeight: '800',
  },
  positiveSavings: {
    color: '#059669',
  },
  negativeSavings: {
    color: '#dc2626',
  },
  adviceContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  adviceTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  adviceText: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 24,
  },
  resetButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

