import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import axios from "axios";

const ProductSearch = () => {
  const [query, setQuery] = useState("");
  const [balance, setBalance] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [recommended, setRecommended] = useState(null);

  const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL || "http://10.14.217.126:3000";
  // backend must fetch data from Amazon, Flipkart, etc.

  const searchProduct = async () => {
    if (!query) return alert("Enter a product name");
    if (!balance) return alert("Enter your balance");

    setLoading(true);
    setRecommended(null);
    setResults([]);

    console.log('Searching for:', query);
    console.log('Backend URL:', BACKEND_URL);

    try {
      const url = `${BACKEND_URL}/api/compare?q=${encodeURIComponent(query)}`;
      console.log('Requesting:', url);
      
      const res = await axios.get(url, {
        timeout: 20000 // 20 second timeout
      });
      const data = res.data;

      // Check if response is an error object
      if (data && data.success === false) {
        alert(data.message || "Error fetching product prices");
        setResults([]);
        setLoading(false);
        return;
      }

      // Ensure data is an array
      const products = Array.isArray(data) ? data : [];

      setResults(products);

      // find affordable product
      const affordable = products.filter(item => item.price <= Number(balance));

      if (affordable.length > 0) {
        const best = affordable.reduce((a, b) => (a.price < b.price ? a : b));
        setRecommended(best);
      } else {
        setRecommended({ name: "None", site: "N/A", price: 0 });
      }

    } catch (err) {
      console.error("Error fetching products:", err);
      console.error("Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      let errorMessage = "Error fetching product prices";
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = "Request timeout. Please try again.";
      } else if (err.message === 'Network Error' || err.code === 'ERR_NETWORK') {
        errorMessage = `Cannot connect to backend at ${BACKEND_URL}. Make sure:\n1. Backend server is running\n2. URL is correct (use your computer's IP if on physical device)`;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      alert(errorMessage);
      setResults([]);
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔎 Product Price Comparison</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter product name (Ex: iPhone 14)"
        value={query}
        onChangeText={setQuery}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter your balance"
        keyboardType="numeric"
        value={balance}
        onChangeText={setBalance}
      />

      <TouchableOpacity style={styles.btn} onPress={searchProduct}>
        <Text style={styles.btnText}>Search</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}

      {results.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Price Comparison</Text>

          <FlatList
            data={results}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.product}>{item.name}</Text>
                <Text style={styles.price}>₹{item.price}</Text>
                <Text style={styles.site}>Source: {item.site}</Text>
              </View>
            )}
          />
        </>
      )}

      {recommended && (
        <View style={styles.recommendBox}>
          <Text style={styles.recommendTitle}>💡 Recommendation</Text>

          {recommended.name === "None" ? (
            <Text style={{ fontSize: 16 }}>No products fit your balance.</Text>
          ) : (
            <Text style={styles.recommendText}>
              Buy **{recommended.name}** from **{recommended.site}** for **₹{recommended.price}**.
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

export default ProductSearch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#f1f1f1",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    fontSize: 16,
  },
  btn: {
    marginTop: 20,
    backgroundColor: "#4a90e2",
    padding: 14,
    borderRadius: 10,
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 20,
  },
  card: {
    backgroundColor: "#f8f8f8",
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  product: {
    fontSize: 18,
    fontWeight: "600",
  },
  price: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 4,
  },
  site: {
    fontSize: 14,
    marginTop: 4,
    color: "gray",
  },
  recommendBox: {
    backgroundColor: "#e3f7d4",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  recommendTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  recommendText: {
    fontSize: 16,
  },
});
