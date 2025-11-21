import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const highlights = [
  { label: "Instant Comparisons", description: "Check prices on top stores." },
  { label: "Smart Alerts", description: "Spot the best savings quickly." },
  { label: "Secure Workspace", description: "Built with Expo + RapidAPI." },
];

const Home = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.heroBadge}>
        <Text style={styles.heroBadgeText}>Your shopping copilot</Text>
      </View>
      <Text style={styles.title}>Find the best price every time</Text>
      <Text style={styles.subtitle}>
        Search once and compare offers from multiple retailers powered by
        RapidAPI integrations.
      </Text>

      <View style={styles.ctaGroup}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("ProductSearch")}
        >
          <Text style={styles.primaryButtonText}>Start comparing</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("ProductSearch")}
        >
          <Text style={styles.secondaryButtonText}>Browse demo search</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.highlights}>
        {highlights.map((item) => (
          <View key={item.label} style={styles.highlightCard}>
            <Text style={styles.highlightLabel}>{item.label}</Text>
            <Text style={styles.highlightDescription}>{item.description}</Text>
          </View>
        ))}
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>How it works</Text>
        <Text style={styles.infoText}>
          1. Enter a product keyword{`\n`}
          2. We query RapidAPI’s real-time catalog{`\n`}
          3. You get price and retailer comparisons instantly
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#f0f4ff",
  },
  heroBadge: {
    backgroundColor: "#e0e7ff",
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 16,
  },
  heroBadgeText: {
    color: "#1e3a8a",
    fontWeight: "600",
    fontSize: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#1f2937",
    marginBottom: 24,
    lineHeight: 22,
  },
  ctaGroup: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#bfdbfe",
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#1d4ed8",
    fontWeight: "700",
    fontSize: 16,
  },
  highlights: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  highlightCard: {
    flexBasis: "48%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginTop: 4,
    shadowColor: "#111827",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  highlightLabel: {
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  highlightDescription: {
    color: "#4b5563",
  },
  infoCard: {
    marginTop: 32,
    backgroundColor: "#dbeafe",
    padding: 18,
    borderRadius: 18,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 8,
  },
  infoText: {
    color: "#1f2937",
    lineHeight: 22,
  },
});

export default Home;
