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
      Alert.alert('⚠️ Missing Information', 'Please fill in all fields to calculate your savings.');
      return;
    }

    if (isNaN(salaryNum) || isNaN(billsNum) || isNaN(spendingNum)) {
      Alert.alert('❌ Invalid Input', 'Please enter valid numbers only.');
      return;
    }

    if (salaryNum < 0 || billsNum < 0 || spendingNum < 0) {
      Alert.alert('❌ Invalid Amount', 'Values cannot be negative.');
      return;
    }

    const calculatedSavings = salaryNum - billsNum - spendingNum;
    setSavings(calculatedSavings);

    if (calculatedSavings <= 0) {
      Alert.alert(
        '⚠️ Low Savings Alert', 
        `Your monthly savings is ₹${calculatedSavings.toFixed(2)}. You are spending more than you earn. Consider reducing your expenses to build savings.`
      );
    }
  };

  const getInvestmentAdvice = async () => {
    if (savings === null) {
      Alert.alert('ℹ️ Calculate First', 'Please calculate your savings first.');
      return;
    }

    if (savings <= 0) {
      Alert.alert('💡 Build Savings First', 'You need positive savings to get investment advice. Focus on reducing expenses first.');
      return;
    }

    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('token');

      if (!token) {
        Alert.alert('🔒 Authentication Required', 'Please login first to get personalized investment advice.');
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
        Alert.alert('❌ Server Error', 'Server returned invalid response. Please try again.');
        setLoading(false);
        return;
      }

      if (!res.ok) {
        console.log('Response status:', res.status);
        console.log('Response data:', data);
        if (res.status === 401) {
          Alert.alert(
            '🔒 Session Expired',
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
          Alert.alert('❌ Error', data.message || `Failed to get investment advice (Status: ${res.status})`);
        }
        setLoading(false);
        return;
      }

      setInvestmentAdvice(data.advice || 'No advice received');
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

  const resetForm = () => {
    setSalary('');
    setMonthlyBills('');
    setSpending('');
    setSavings(null);
    setInvestmentAdvice('');
  };

  const savingsRate = savings !== null && parseFloat(salary) > 0 
    ? ((savings / parseFloat(salary)) * 100).toFixed(1) 
    : null;

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section */}
      <View style={styles.headerSection}>
        <Text style={styles.mainTitle}>💰 Investment Planner</Text>
        <Text style={styles.subtitle}>
          Calculate your savings and get AI-powered investment recommendations
        </Text>
      </View>

      {/* Financial Input Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>📊 Financial Overview</Text>
          <Text style={styles.cardSubtitle}>Enter your monthly financial details</Text>
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>💵 Monthly Salary</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={styles.input}
                placeholder="50,000"
                value={salary}
                onChangeText={setSalary}
                keyboardType="numeric"
                placeholderTextColor="#94a3b8"
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>🏠 Monthly Bills</Text>
            <Text style={styles.labelHint}>Rent, utilities, insurance, etc.</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={styles.input}
                placeholder="15,000"
                value={monthlyBills}
                onChangeText={setMonthlyBills}
                keyboardType="numeric"
                placeholderTextColor="#94a3b8"
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>🛒 Monthly Spending</Text>
            <Text style={styles.labelHint}>Food, entertainment, shopping, etc.</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={styles.input}
                placeholder="10,000"
                value={spending}
                onChangeText={setSpending}
                keyboardType="numeric"
                placeholderTextColor="#94a3b8"
              />
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.calculateButton, styles.primaryButton]} 
            onPress={calculateSavings}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>📈 Calculate Savings</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Savings Result Card */}
      {savings !== null && (
        <View style={[styles.card, styles.savingsCard]}>
          <View style={styles.savingsHeader}>
            <Text style={styles.savingsTitle}>💎 Your Monthly Savings</Text>
            {savingsRate !== null && (
              <View style={styles.rateBadge}>
                <Text style={styles.rateText}>{savingsRate}% savings rate</Text>
              </View>
            )}
          </View>
          <View style={styles.savingsAmountContainer}>
            <Text
              style={[
                styles.savingsAmount,
                savings > 0 ? styles.positiveSavings : styles.negativeSavings,
              ]}
            >
              ₹{Math.abs(savings).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
            {savings <= 0 && (
              <Text style={styles.warningText}>
                ⚠️ You're spending more than you earn
              </Text>
            )}
          </View>
        </View>
      )}

      {/* Investment Advice Button */}
      {savings !== null && savings > 0 && (
        <TouchableOpacity
          style={[
            styles.adviceButton,
            styles.successButton,
            loading && styles.disabledButton
          ]}
          onPress={getInvestmentAdvice}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={[styles.buttonText, styles.loadingText]}>Generating Advice...</Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>🤖 Get AI Investment Advice</Text>
          )}
        </TouchableOpacity>
      )}

      {/* Investment Advice Card */}
      {investmentAdvice ? (
        <View style={[styles.card, styles.adviceCard]}>
          <View style={styles.adviceHeader}>
            <Text style={styles.adviceTitle}>✨ Investment Recommendations</Text>
            <View style={styles.aiBadge}>
              <Text style={styles.aiBadgeText}>AI Powered</Text>
            </View>
          </View>
          <View style={styles.adviceContent}>
            <Text style={styles.adviceText}>{investmentAdvice}</Text>
          </View>
        </View>
      ) : null}

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.resetButton, styles.secondaryButton]} 
          onPress={resetForm}
          activeOpacity={0.8}
        >
          <Text style={styles.resetButtonText}>🔄 Reset All</Text>
        </TouchableOpacity>
      </View>

      {/* Footer Spacing */}
      <View style={styles.footerSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f8fafc',
    paddingTop: 10,
  },
  headerSection: {
    marginBottom: 24,
    marginTop:24,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
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
  inputGroup: {
    gap: 18,
  },
  inputWrapper: {
    marginBottom: 4,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 6,
  },
  labelHint: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    minHeight: 52,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: '#475569',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#0f172a',
    paddingVertical: 14,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    shadowColor: '#2563eb',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  calculateButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  savingsCard: {
    backgroundColor: '#dbeafe',
    borderColor: '#93c5fd',
  },
  savingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  savingsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e40af',
  },
  rateBadge: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  rateText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  savingsAmountContainer: {
    alignItems: 'center',
  },
  savingsAmount: {
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: -1,
  },
  positiveSavings: {
    color: '#059669',
  },
  negativeSavings: {
    color: '#dc2626',
  },
  warningText: {
    marginTop: 8,
    fontSize: 13,
    color: '#dc2626',
    fontWeight: '600',
  },
  successButton: {
    backgroundColor: '#10b981',
    shadowColor: '#10b981',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  adviceButton: {
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  disabledButton: {
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    marginLeft: 8,
  },
  adviceCard: {
    backgroundColor: '#f0fdf4',
    borderColor: '#86efac',
  },
  adviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#d1fae5',
  },
  adviceTitle: {
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
    fontWeight: '600',
  },
  adviceContent: {
    marginTop: 4,
  },
  adviceText: {
    fontSize: 15,
    color: '#1f2937',
    lineHeight: 24,
  },
  actionButtons: {
    marginTop: 8,
  },
  secondaryButton: {
    backgroundColor: '#ef4444',
    shadowColor: '#ef4444',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  resetButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  footerSpacing: {
    height: 20,
  },
});
