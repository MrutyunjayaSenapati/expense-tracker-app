import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Text } from '../../components/ui/Text';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    try {
      await login({ email: email.trim(), password });
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  const handleFillDemo = () => {
    setEmail('demo@expensetracker.app');
    setPassword('Password123!');
    setError('');
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
        >
          <View style={styles.container}>
            {/* Brand Logo Header */}
            <View style={styles.header}>
              <View style={[styles.logoCircle, { backgroundColor: colors.primary }]}>
                <Ionicons name="wallet" size={36} color="#FFFFFF" />
              </View>
              <Text variant="headingXL" weight="bold" align="center" style={styles.title}>
                Welcome Back
              </Text>
              <Text variant="body" color="secondary" align="center" style={styles.subtitle}>
                Sign in to track your expenses, budgets, and savings
              </Text>
            </View>

            {/* Form Card */}
            <Card elevation="sm" style={styles.formCard}>
              {error ? (
                <View style={[styles.errorBanner, { backgroundColor: colors.expenseSoft }]}>
                  <Ionicons name="alert-circle" size={18} color={colors.expense} />
                  <Text variant="caption" color="expense" weight="medium" style={styles.errorText}>
                    {error}
                  </Text>
                </View>
              ) : null}

              <Input
                label="Email Address"
                placeholder="name@example.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                leftIcon={<Ionicons name="mail-outline" size={20} color={colors.textTertiary} />}
              />

              <Input
                label="Password"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                leftIcon={
                  <Ionicons name="lock-closed-outline" size={20} color={colors.textTertiary} />
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

              <Button
                onPress={handleLogin}
                loading={isLoading}
                variant="primary"
                fullWidth
                size="lg"
                style={styles.submitBtn}
              >
                Log In
              </Button>

              {/* Demo Account Quick Fill */}
              <TouchableOpacity
                onPress={handleFillDemo}
                activeOpacity={0.7}
                style={[styles.demoButton, { borderColor: colors.border }]}
              >
                <Ionicons name="flash-outline" size={16} color={colors.primary} />
                <Text variant="bodySmall" weight="semibold" color="brand">
                  Fill Demo Credentials
                </Text>
              </TouchableOpacity>
            </Card>

            {/* Footer Navigation */}
            <View style={styles.footer}>
              <Text variant="body" color="secondary">
                {"Don't have an account? "}
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/auth/register')}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text variant="body" weight="bold" color="brand">
                  Sign Up
                </Text>
              </TouchableOpacity>
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
    paddingVertical: spacing.xl,
  },
  container: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    marginBottom: spacing.xs,
  },
  subtitle: {
    paddingHorizontal: spacing.md,
  },
  formCard: {
    padding: spacing.xl,
    borderRadius: radius.card,
    marginBottom: spacing.xl,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.sm,
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  errorText: {
    flex: 1,
  },
  submitBtn: {
    marginTop: spacing.sm,
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.input,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
