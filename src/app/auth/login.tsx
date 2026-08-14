import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp, LinearTransition } from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { useHaptics } from '../../hooks/useHaptics';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Text } from '../../components/ui/Text';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { BrandLogo } from '../../components/ui/BrandLogo';
import { Ionicons } from '@expo/vector-icons';

export default function AuthScreen() {
  const params = useLocalSearchParams();
  const { colors } = useTheme();
  const { login, register, isLoading } = useAuth();
  const haptics = useHaptics();

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
  const [error, setError] = useState('');

  // Password validation checks for Sign Up
  const hasMinLength = password.length >= 6;
  const hasSpecialOrNum = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password);

  const handleTabSwitch = (tab: 'login' | 'register') => {
    haptics.selection();
    setActiveTab(tab);
    setError('');
  };

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
            {/* 1. Minimalist Header */}
            <Animated.View entering={FadeInDown.duration(400)} style={styles.headerSection}>
              <View style={styles.logoContainer}>
                <BrandLogo size={68} />
              </View>
              <Text variant="headingXL" weight="bold" style={styles.headline}>
                {activeTab === 'login' ? 'Welcome back.' : 'Create an account.'}
              </Text>
              <Text variant="body" color="secondary" style={styles.subtitle}>
                {activeTab === 'login'
                  ? 'Sign in to access your wallets, budgets, and insights.'
                  : 'Track your daily expenses, set smart budgets, and grow.'}
              </Text>
            </Animated.View>

            {/* 2. Sleek Segmented Switcher */}
            <Animated.View
              entering={FadeInDown.duration(450).delay(60)}
              style={[styles.switcherContainer, { backgroundColor: colors.surfaceMuted }]}
            >
              <TouchableOpacity
                onPress={() => handleTabSwitch('login')}
                activeOpacity={0.8}
                style={[
                  styles.switcherTab,
                  activeTab === 'login' && [
                    styles.activeTab,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                  ],
                ]}
              >
                <Text
                  variant="bodySmall"
                  weight={activeTab === 'login' ? 'bold' : 'medium'}
                  style={{ color: activeTab === 'login' ? colors.primary : colors.textTertiary }}
                >
                  Sign In
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleTabSwitch('register')}
                activeOpacity={0.8}
                style={[
                  styles.switcherTab,
                  activeTab === 'register' && [
                    styles.activeTab,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                  ],
                ]}
              >
                <Text
                  variant="bodySmall"
                  weight={activeTab === 'register' ? 'bold' : 'medium'}
                  style={{ color: activeTab === 'register' ? colors.primary : colors.textTertiary }}
                >
                  Sign Up
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* 3. Form Body */}
            <Animated.View
              layout={LinearTransition.springify()}
              entering={FadeInUp.duration(450).delay(100)}
              style={styles.formSection}
            >
              {/* Error Banner */}
              {error ? (
                <View style={[styles.errorBanner, { backgroundColor: colors.expenseSoft }]}>
                  <Ionicons name="alert-circle" size={18} color={colors.expense} />
                  <Text variant="caption" color="expense" weight="semibold" style={styles.errorText}>
                    {error}
                  </Text>
                </View>
              ) : null}

              {/* Full Name Field (Sign Up Only) */}
              {activeTab === 'register' && (
                <Input
                  label="FULL NAME"
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  leftIcon={<Ionicons name="person-outline" size={18} color={colors.textTertiary} />}
                />
              )}

              {/* Email Address Field */}
              <Input
                label="EMAIL ADDRESS"
                placeholder="name@example.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                leftIcon={<Ionicons name="mail-outline" size={18} color={colors.textTertiary} />}
              />

              {/* Password Field */}
              <Input
                label="PASSWORD"
                placeholder="••••••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                leftIcon={<Ionicons name="lock-closed-outline" size={18} color={colors.textTertiary} />}
                rightIcon={
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color={colors.textTertiary}
                    />
                  </TouchableOpacity>
                }
              />

              {/* Live Password Hints on Sign Up */}
              {activeTab === 'register' && password.length > 0 && (
                <View style={styles.hintsRow}>
                  <View style={styles.hintItem}>
                    <Ionicons
                      name={hasMinLength ? 'checkmark-circle' : 'ellipse-outline'}
                      size={14}
                      color={hasMinLength ? colors.income : colors.textTertiary}
                    />
                    <Text
                      variant="caption"
                      color={hasMinLength ? 'primary' : 'tertiary'}
                      style={{ fontSize: 11 }}
                    >
                      Min. 6 characters
                    </Text>
                  </View>
                  <View style={styles.hintItem}>
                    <Ionicons
                      name={hasSpecialOrNum ? 'checkmark-circle' : 'ellipse-outline'}
                      size={14}
                      color={hasSpecialOrNum ? colors.income : colors.textTertiary}
                    />
                    <Text
                      variant="caption"
                      color={hasSpecialOrNum ? 'primary' : 'tertiary'}
                      style={{ fontSize: 11 }}
                    >
                      Number / symbol
                    </Text>
                  </View>
                </View>
              )}

              {/* Confirm Password Field (Sign Up Only) */}
              {activeTab === 'register' && (
                <Input
                  label="CONFIRM PASSWORD"
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                  leftIcon={<Ionicons name="shield-checkmark-outline" size={18} color={colors.textTertiary} />}
                />
              )}

              {/* Submit CTA */}
              <Button
                onPress={handleSubmit}
                loading={isLoading}
                variant="primary"
                fullWidth
                size="lg"
                style={styles.submitBtn}
                iconRight={<Ionicons name="arrow-forward" size={18} color={colors.textInverse} />}
              >
                {activeTab === 'login' ? 'Sign In' : 'Create Account'}
              </Button>

              {/* Bottom Toggle Prompt */}
              <TouchableOpacity
                onPress={() => handleTabSwitch(activeTab === 'login' ? 'register' : 'login')}
                activeOpacity={0.7}
                style={styles.togglePrompt}
              >
                <Text variant="bodySmall" color="secondary">
                  {activeTab === 'login' ? "Don't have an account? " : 'Already have an account? '}
                  <Text variant="bodySmall" weight="bold" style={{ color: colors.primary }}>
                    {activeTab === 'login' ? 'Sign Up' : 'Sign In'}
                  </Text>
                </Text>
              </TouchableOpacity>
            </Animated.View>
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
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  container: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  headerSection: {
    marginBottom: spacing.xl,
  },
  logoContainer: {
    marginBottom: spacing.md,
    alignSelf: 'flex-start',
  },
  headline: {
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.5,
    marginBottom: spacing.xs,
  },
  subtitle: {
    lineHeight: 20,
  },
  switcherContainer: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: radius.md,
    marginBottom: spacing.xl,
  },
  switcherTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md - 2,
  },
  activeTab: {
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  formSection: {
    width: '100%',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
  },
  hintsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: -spacing.xs,
    marginBottom: spacing.md,
    paddingHorizontal: 2,
  },
  hintItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  submitBtn: {
    marginTop: spacing.md,
  },
  togglePrompt: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
    paddingVertical: spacing.xs,
  },
});
