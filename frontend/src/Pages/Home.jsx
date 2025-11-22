import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const features = [
  { 
    icon: "⚡", 
    label: "Instant Comparisons", 
    description: "Compare prices across multiple retailers in real-time",
    color: "#3b82f6"
  },
  { 
    icon: "🔔", 
    label: "Smart Alerts", 
    description: "Get notified about the best deals and price drops",
    color: "#10b981"
  },
  { 
    icon: "🔒", 
    label: "Secure & Private", 
    description: "Your data is protected with enterprise-grade security",
    color: "#8b5cf6"
  },
];

const quickActions = [
  {
    icon: "🔍",
    title: "Product Search",
    subtitle: "Compare prices instantly",
    color: "#2563eb",
    action: "ProductSearch",
  },
  {
    icon: "🤖",
    title: "AI Financial Advisor",
    subtitle: "Get personalized financial advice",
    color: "#007AFF",
    action: "AIsuggest",
  },
  {
    icon: "💰",
    title: "Investment Planner",
    subtitle: "Plan your investments smartly",
    color: "#10b981",
    action: "InvestmentPlanner",
  },
];

const Home = ({ navigation }) => {
  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.badgeContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>✨ Your Smart Shopping Copilot</Text>
          </View>
        </View>
        <Text style={styles.heroTitle}>
          Find the Best Price{`\n`}Every Time
        </Text>
        <Text style={styles.heroSubtitle}>
          Search once, compare everywhere. Get the best deals from top retailers powered by RapidAPI.
        </Text>
      </View>

      {/* Quick Actions Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🚀 Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.actionCard, { borderLeftColor: action.color }]}
              onPress={() => navigation.navigate(action.action)}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: `${action.color}15` }]}>
                <Text style={styles.actionIcon}>{action.icon}</Text>
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
              </View>
              <Text style={[styles.arrowIcon, { color: action.color }]}>→</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Primary CTA */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.primaryCTA}
          onPress={() => navigation.navigate("ProductSearch")}
          activeOpacity={0.8}
        >
          <View style={styles.ctaContent}>
            <Text style={styles.ctaIcon}>🔍</Text>
            <View style={styles.ctaTextContainer}>
              <Text style={styles.ctaTitle}>Start Comparing Products</Text>
              <Text style={styles.ctaSubtitle}>Find the best deals now</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Features Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💎 Key Features</Text>
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={[styles.featureIconContainer, { backgroundColor: `${feature.color}15` }]}>
                <Text style={styles.featureIcon}>{feature.icon}</Text>
              </View>
              <Text style={styles.featureLabel}>{feature.label}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* How It Works Section */}
      <View style={styles.section}>
        <View style={styles.howItWorksCard}>
          <View style={styles.howItWorksHeader}>
            <Text style={styles.howItWorksTitle}>📖 How It Works</Text>
          </View>
          <View style={styles.stepsContainer}>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Enter Product Name</Text>
                <Text style={styles.stepDescription}>Type what you're looking for</Text>
              </View>
            </View>
            <View style={styles.stepDivider} />
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>We Search Everywhere</Text>
                <Text style={styles.stepDescription}>Query RapidAPI's real-time catalog</Text>
              </View>
            </View>
            <View style={styles.stepDivider} />
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Get Instant Results</Text>
                <Text style={styles.stepDescription}>Compare prices and retailers</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Financial Tools Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💼 Financial Tools</Text>
        <View style={styles.financialToolsContainer}>
          <TouchableOpacity
            style={[styles.financialToolCard, styles.aiToolCard]}
            onPress={() => navigation.navigate("AIsuggest")}
            activeOpacity={0.8}
          >
            <View style={styles.toolHeader}>
              <Text style={styles.toolIcon}>🤖</Text>
              <View style={styles.toolBadge}>
                <Text style={styles.toolBadgeText}>AI</Text>
              </View>
            </View>
            <Text style={styles.toolTitle}>AI Financial Advisor</Text>
            <Text style={styles.toolDescription}>
              Get personalized financial advice powered by AI. Make smarter decisions with expert guidance.
            </Text>
            <View style={styles.toolFooter}>
              <Text style={styles.toolActionText}>Get Advice →</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.financialToolCard, styles.investmentToolCard]}
            onPress={() => navigation.navigate("InvestmentPlanner")}
            activeOpacity={0.8}
          >
            <View style={styles.toolHeader}>
              <Text style={styles.toolIcon}>💰</Text>
              <View style={[styles.toolBadge, styles.investmentBadge]}>
                <Text style={styles.toolBadgeText}>NEW</Text>
              </View>
            </View>
            <Text style={styles.toolTitle}>Investment Planner</Text>
            <Text style={styles.toolDescription}>
              Calculate your savings and get AI-powered investment recommendations tailored to your financial situation.
            </Text>
            <View style={styles.toolFooter}>
              <Text style={[styles.toolActionText, styles.investmentActionText]}>Plan Now →</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

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
  heroSection: {
    padding: 24,
    paddingTop: 20,
    alignItems: "center",
  },
  badgeContainer: {
    marginBottom: 16,
  },
  badge: {
    backgroundColor: "#e0e7ff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#c7d2fe",
  },
  badgeText: {
    color: "#1e3a8a",
    fontWeight: "600",
    fontSize: 13,
    letterSpacing: 0.3,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: "800",
    color: "#0f172a",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: -0.5,
    lineHeight: 44,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  quickActionsGrid: {
    gap: 12,
  },
  actionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginBottom: 4,
  },
  actionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  actionIcon: {
    fontSize: 24,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 13,
    color: "#64748b",
  },
  arrowIcon: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 8,
  },
  primaryCTA: {
    backgroundColor: "#2563eb",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#2563eb",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  ctaContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  ctaIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  ctaTextContainer: {
    flex: 1,
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 4,
  },
  ctaSubtitle: {
    fontSize: 14,
    color: "#bfdbfe",
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  featureCard: {
    flexBasis: "48%",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 28,
  },
  featureLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 6,
    textAlign: "center",
  },
  featureDescription: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 18,
  },
  howItWorksCard: {
    backgroundColor: "#dbeafe",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "#93c5fd",
  },
  howItWorksHeader: {
    marginBottom: 20,
  },
  howItWorksTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e40af",
  },
  stepsContainer: {
    gap: 0,
  },
  step: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  stepNumberText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  stepContent: {
    flex: 1,
    paddingTop: 4,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e40af",
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: "#1e3a8a",
    lineHeight: 20,
  },
  stepDivider: {
    height: 20,
    width: 2,
    backgroundColor: "#93c5fd",
    marginLeft: 15,
    marginVertical: 8,
  },
  financialToolsContainer: {
    gap: 16,
  },
  financialToolCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 22,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  aiToolCard: {
    borderTopWidth: 3,
    borderTopColor: "#007AFF",
  },
  investmentToolCard: {
    borderTopWidth: 3,
    borderTopColor: "#10b981",
  },
  toolHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  toolIcon: {
    fontSize: 36,
  },
  toolBadge: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  investmentBadge: {
    backgroundColor: "#10b981",
  },
  toolBadgeText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  toolTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 10,
  },
  toolDescription: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 22,
    marginBottom: 16,
  },
  toolFooter: {
    alignItems: "flex-end",
  },
  toolActionText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#007AFF",
  },
  investmentActionText: {
    color: "#10b981",
  },
  footerSpacing: {
    height: 30,
  },
});

export default Home;
