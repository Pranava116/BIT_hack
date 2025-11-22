import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  ActivityIndicator, 
  StyleSheet, 
  ScrollView,
  Alert 
} from "react-native";
import axios from "axios";
import API_BASE_URL from '../config/api';

const ProductSearch = ({ navigation }) => {
  const [query, setQuery] = useState("");
  const [balance, setBalance] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [recommended, setRecommended] = useState(null);

  const BACKEND_URL = API_BASE_URL || process.env.EXPO_PUBLIC_API_URL || "http://192.168.56.1:3000";

  const searchProduct = async () => {
    if (!query.trim()) {
      Alert.alert("⚠️ Missing Product", "Please enter a product name to search.");
      return;
    }
    if (!balance.trim()) {
      Alert.alert("⚠️ Missing Budget", "Please enter your budget to find affordable options.");
      return;
    }

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
        Alert.alert("❌ Error", data.message || "Error fetching product prices");
        setResults([]);
        setLoading(false);
        return;
      }

      // Ensure data is an array
      const products = Array.isArray(data) ? data : [];

      if (products.length === 0) {
        Alert.alert("ℹ️ No Results", "No products found. Try a different search term.");
        setLoading(false);
        return;
      }

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
        errorMessage = "⏱️ Request timeout. Please try again.";
      } else if (err.message === 'Network Error' || err.code === 'ERR_NETWORK') {
        errorMessage = `🌐 Cannot connect to server.\n\nMake sure:\n• Backend server is running\n• URL is correct\n• Check your internet connection`;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      Alert.alert("❌ Connection Error", errorMessage);
      setResults([]);
    }

    setLoading(false);
  };

  const getSiteIcon = (site) => {
    const siteLower = site?.toLowerCase() || '';
    if (siteLower.includes('amazon')) return '📦';
    if (siteLower.includes('flipkart')) return '🛒';
    if (siteLower.includes('myntra')) return '👕';
    if (siteLower.includes('ajio')) return '🛍️';
    return '🏪';
  };

  const formatPrice = (price) => {
    return `₹${parseFloat(price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section */}
      <View style={styles.headerSection}>
        <Text style={styles.mainTitle}>🔍 Product Price Comparison</Text>
        <Text style={styles.subtitle}>
          Compare prices across multiple retailers and find the best deals
        </Text>
      </View>

      {/* Search Form Card */}
      <View style={styles.searchCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>📊 Search Products</Text>
          <Text style={styles.cardSubtitle}>Enter product name and your budget</Text>
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>🔎 Product Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., iPhone 14, Laptop, Headphones"
              value={query}
              onChangeText={setQuery}
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>💰 Your Budget</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={styles.input}
                placeholder="50000"
                keyboardType="numeric"
                value={balance}
                onChangeText={setBalance}
                placeholderTextColor="#94a3b8"
              />
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.searchButton, loading && styles.disabledButton]} 
            onPress={searchProduct}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={styles.buttonText}>Searching...</Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>🔍 Search & Compare</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Recommendation Card */}
      {recommended && (
        <View style={styles.recommendationCard}>
          <View style={styles.recommendationHeader}>
            <Text style={styles.recommendationIcon}>💡</Text>
            <View style={styles.recommendationTitleContainer}>
              <Text style={styles.recommendationTitle}>Best Match for Your Budget</Text>
              <View style={styles.bestBadge}>
                <Text style={styles.bestBadgeText}>BEST DEAL</Text>
              </View>
            </View>
          </View>
          {recommended.name === "None" ? (
            <View style={styles.noRecommendation}>
              <Text style={styles.noRecommendationText}>
                😔 No products found within your budget. Try increasing your budget or searching for different products.
              </Text>
            </View>
          ) : (
            <View style={styles.recommendationContent}>
              <View style={styles.recommendationProduct}>
                <Text style={styles.recommendationProductName}>{recommended.name}</Text>
                <View style={styles.recommendationDetails}>
                  <View style={styles.recommendationSite}>
                    <Text style={styles.recommendationSiteIcon}>{getSiteIcon(recommended.site)}</Text>
                    <Text style={styles.recommendationSiteName}>{recommended.site}</Text>
                  </View>
                  <Text style={styles.recommendationPrice}>{formatPrice(recommended.price)}</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      )}

      {/* Results Section */}
      {results.length > 0 && (
        <View style={styles.resultsSection}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>📋 Price Comparison Results</Text>
            <View style={styles.resultsCount}>
              <Text style={styles.resultsCountText}>{results.length} found</Text>
            </View>
          </View>

          <FlatList
            data={results}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
            renderItem={({ item, index }) => {
              const isBest = recommended && recommended.name === item.name && recommended.site === item.site;
              return (
                <View style={[styles.productCard, isBest && styles.bestProductCard]}>
                  {isBest && (
                    <View style={styles.bestIndicator}>
                      <Text style={styles.bestIndicatorText}>⭐ Best Match</Text>
                    </View>
                  )}
                  <View style={styles.productHeader}>
                    <Text style={styles.productIcon}>{getSiteIcon(item.site)}</Text>
                    <View style={styles.productInfo}>
                      <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                      <Text style={styles.productSite}>{item.site}</Text>
                    </View>
                  </View>
                  <View style={styles.productPriceContainer}>
                    <Text style={styles.productPrice}>{formatPrice(item.price)}</Text>
                    {item.price <= Number(balance) && (
                      <View style={styles.affordableBadge}>
                        <Text style={styles.affordableBadgeText}>Within Budget</Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            }}
          />
        </View>
      )}

      {/* Empty State */}
      {!loading && results.length === 0 && !recommended && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>🔍</Text>
          <Text style={styles.emptyStateText}>Start searching to compare prices</Text>
          <Text style={styles.emptyStateSubtext}>Enter a product name and your budget above</Text>
        </View>
      )}

      {/* Footer Spacing */}
      <View style={styles.footerSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f8fafc",
    paddingTop: 10,
  },
  headerSection: {
    padding: 24,
    paddingTop: 20,
    alignItems: "center",
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  searchCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cardHeader: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#64748b",
  },
  inputGroup: {
    gap: 18,
  },
  inputWrapper: {
    marginBottom: 4,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#cbd5e1",
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 16,
    minHeight: 52,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: "600",
    color: "#475569",
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#0f172a",
    paddingVertical: 14,
  },
  searchButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#2563eb",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  disabledButton: {
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  recommendationCard: {
    backgroundColor: "#f0fdf4",
    borderRadius: 20,
    padding: 22,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#86efac",
    shadowColor: "#10b981",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  recommendationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  recommendationIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  recommendationTitleContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#065f46",
    flex: 1,
  },
  bestBadge: {
    backgroundColor: "#10b981",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bestBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  noRecommendation: {
    paddingVertical: 12,
  },
  noRecommendationText: {
    fontSize: 15,
    color: "#64748b",
    lineHeight: 22,
  },
  recommendationContent: {
    marginTop: 4,
  },
  recommendationProduct: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
  },
  recommendationProductName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 12,
  },
  recommendationDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recommendationSite: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  recommendationSiteIcon: {
    fontSize: 20,
  },
  recommendationSiteName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#475569",
  },
  recommendationPrice: {
    fontSize: 22,
    fontWeight: "800",
    color: "#059669",
  },
  resultsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0f172a",
    letterSpacing: -0.3,
  },
  resultsCount: {
    backgroundColor: "#e0e7ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  resultsCountText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1e40af",
  },
  productCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  bestProductCard: {
    borderWidth: 2,
    borderColor: "#86efac",
    backgroundColor: "#f0fdf4",
  },
  bestIndicator: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#10b981",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bestIndicatorText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  productHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  productIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 4,
    lineHeight: 22,
  },
  productSite: {
    fontSize: 13,
    color: "#64748b",
  },
  productPriceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  productPrice: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2563eb",
  },
  affordableBadge: {
    backgroundColor: "#dbeafe",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  affordableBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#1e40af",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
  },
  footerSpacing: {
    height: 30,
  },
});

export default ProductSearch;
