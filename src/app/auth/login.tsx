import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import Svg, { Path, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Text } from '../../components/ui/Text';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { BrandLogo } from '../../components/ui/BrandLogo';
import { Ionicons } from '@expo/vector-icons';

export default function AuthScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { colors } = useTheme();
  const { login, register, isLoading } = useAuth();

  // Tab state: 'login' | 'register'
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(
    params.tab === 'register' ? 'register' : 'login'
  );

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  // Password strength calculation
  const calculateStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score; // 0 to 4
  };

  const strengthScore = calculateStrength(password);
  const strengthLabels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['#EF4444', '#F59E0B', '#3B82F6', '#10B981', '#059669'];

  const handleSubmit = async () => {
    setError('');

    if (activeTab === 'register') {
      if (!name.trim()) {
        setError('Please enter your full name');
        return;
      }
      if (!email.trim()) {
        setError('Please enter your email address');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      try {
        await register({ name: name.trim(), email: email.trim().toLowerCase(), password });
      } catch (err: any) {
        setError(err.message || 'Registration failed');
      }
    } else {
      if (!email.trim()) {
        setError('Please enter your email address');
        return;
      }
      if (!password) {
        setError('Please enter your password');
        return;
      }

      try {
        await login({ email: email.trim().toLowerCase(), password });
      } catch (err: any) {
        setError(err.message || 'Invalid email or password');
      }
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            {/* 1. Hero Brand Zone */}
            <Animated.View entering={FadeInDown.duration(450)} style={styles.heroSection}>
              <BrandLogo />
              <Text variant="headingXL" weight="bold" align="center" style={styles.heroTitle}>
                {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
              </Text>
              <Text variant="bodySmall" color="secondary" align="center" style={styles.heroSubtitle}>
                {activeTab === 'login'
                  ? 'Sign in to manage your wallets, budgets, and expenses'
                  : 'Start tracking your daily expenses and grow your savings'}
              </Text>
            </Animated.View>

            {/* 2. Form Card with Segmented Pill Switcher */}
            <Animated.View entering={FadeInUp.duration(500).delay(80)}>
              <Card elevation="sm" style={styles.formCard}>
                {/* Segmented Pill Switcher */}
                <View style={[styles.tabSwitcher, { backgroundColor: colors.surfaceMuted }]}>
                  <TouchableOpacity
                    onPress={() => {
                      setActiveTab('login');
                      setError('');
                    }}
                    activeOpacity={0.8}
                    style={[
                      styles.tabPill,
                      activeTab === 'login' && [styles.activeTabPill, { backgroundColor: colors.surface }],
                    ]}
                  >
                    <Ionicons
                      name="log-in-outline"
                      size={16}
                      color={activeTab === 'login' ? colors.primary : colors.textTertiary}
                    />
                    <Text
                      variant="bodySmall"
                      weight={activeTab === 'login' ? 'bold' : 'medium'}
                      style={{ color: activeTab === 'login' ? colors.primary : colors.textSecondary }}
                    >
                      Sign In
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setActiveTab('register');
                      setError('');
                    }}
                    activeOpacity={0.8}
                    style={[
                      styles.tabPill,
                      activeTab === 'register' && [styles.activeTabPill, { backgroundColor: colors.surface }],
                    ]}
                  >
                    <Ionicons
                      name="person-add-outline"
                      size={16}
                      color={activeTab === 'register' ? colors.primary : colors.textTertiary}
                    />
                    <Text
                      variant="bodySmall"
                      weight={activeTab === 'register' ? 'bold' : 'medium'}
                      style={{ color: activeTab === 'register' ? colors.primary : colors.textSecondary }}
                    >
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Error Banner */}
                {error ? (
                  <View style={[styles.errorBanner, { backgroundColor: colors.expenseSoft }]}>
                    <Ionicons name="alert-circle" size={17} color={colors.expense} />
                    <Text variant="caption" color="expense" weight="semibold" style={styles.errorText}>
                      {error}
                    </Text>
                  </View>
                ) : null}

                {/* Form Fields */}
                {activeTab === 'register' && (
                  <Input
                    label="Full Name"
                    placeholder="Rahul Sharma"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    leftIcon={
                      <View style={[styles.inputIconCircle, { backgroundColor: 'rgba(99, 102, 241, 0.12)' }]}>
                        <Ionicons name="person" size={14} color="#6366F1" />
                      </View>
                    }
                  />
                )}

                <Input
                  label="Email Address"
                  placeholder="name@example.com"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  leftIcon={
                    <View style={[styles.inputIconCircle, { backgroundColor: 'rgba(79, 70, 229, 0.12)' }]}>
                      <Ionicons name="mail" size={14} color="#4F46E5" />
                    </View>
                  }
                />

                <Input
                  label="Password"
                  placeholder="••••••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  leftIcon={
                    <View style={[styles.inputIconCircle, { backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}>
                      <Ionicons name="lock-closed" size={14} color="#10B981" />
                    </View>
                  }
                  rightIcon={
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={20}
                        color={colors.textTertiary}
                      />
                    </TouchableOpacity>
                  }
                />

                {/* Password Strength Meter on Register */}
                {activeTab === 'register' && password.length > 0 && (
                  <View style={styles.strengthContainer}>
                    <View style={styles.strengthBarsRow}>
                      {[1, 2, 3, 4].map(step => (
                        <View
                          key={step}
                          style={[
                            styles.strengthBar,
                            {
                              backgroundColor:
                                step <= strengthScore
                                  ? strengthColors[strengthScore]
                                  : colors.surfaceMuted,
                            },
                          ]}
                        />
                      ))}
                    </View>
                    <Text
                      variant="caption"
                      weight="semibold"
                      style={{ color: strengthColors[strengthScore], fontSize: 11, marginTop: 3 }}
                    >
                      {`Strength: ${strengthLabels[strengthScore]}`}
                    </Text>
                  </View>
                )}

                {activeTab === 'register' && (
                  <Input
                    label="Confirm Password"
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showPassword}
                    leftIcon={
                      <View style={[styles.inputIconCircle, { backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}>
                        <Ionicons name="shield-checkmark" size={14} color="#10B981" />
                      </View>
                    }
                  />
                )}

                {/* Remember Me (on Login) */}
                {activeTab === 'login' && (
                  <View style={styles.optionsRow}>
                    <TouchableOpacity
                      onPress={() => setRememberMe(!rememberMe)}
                      activeOpacity={0.7}
                      style={styles.rememberMeBtn}
                    >
                      <Ionicons
                        name={rememberMe ? 'checkbox' : 'square-outline'}
                        size={18}
                        color={rememberMe ? colors.primary : colors.textTertiary}
                      />
                      <Text variant="caption" color="secondary" style={styles.rememberText}>
                        Remember me
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Submit Action Button */}
                <Button
                  onPress={handleSubmit}
                  loading={isLoading}
                  variant="primary"
                  fullWidth
                  size="lg"
                  style={styles.submitBtn}
                >
                  {activeTab === 'login' ? 'Sign In' : 'Create Account'}
                </Button>
              </Card>
            </Animated.View>

            {/* 3. Security & Trust Badge Footer */}
            <View style={styles.footerTrust}>
              <Ionicons name="shield-checkmark" size={14} color={colors.income} />
              <Text variant="caption" color="tertiary" style={styles.trustText}>
                256-bit Encrypted • Supabase Cloud Storage
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.lg,
  },
  container: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logoContainer: {
    marginBottom: spacing.sm,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  heroTitle: {
    fontSize: 24,
    lineHeight: 30,
    marginBottom: 4,
  },
  heroSubtitle: {
    paddingHorizontal: spacing.lg,
  },
  formCard: {
    padding: spacing.lg,
    borderRadius: radius.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 4,
  },
  tabSwitcher: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: radius.input,
    marginBottom: spacing.md,
    gap: 4,
  },
  tabPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: radius.input - 3,
    gap: 5,
  },
  activeTabPill: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm + 2,
    borderRadius: radius.sm,
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
  },
  inputIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  strengthContainer: {
    marginTop: -spacing.xs,
    marginBottom: spacing.sm,
  },
  strengthBarsRow: {
    flexDirection: 'row',
    gap: 4,
    height: 4,
    borderRadius: 2,
  },
  strengthBar: {
    flex: 1,
    borderRadius: 2,
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -spacing.xs,
    marginBottom: spacing.sm,
  },
  rememberMeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rememberText: {
    fontSize: 12,
  },
  submitBtn: {
    marginTop: spacing.xs,
  },
  footerTrust: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    gap: 5,
  },
  trustText: {
    fontSize: 11,
  },
});


