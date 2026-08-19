import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useGroups } from '../../hooks/useGroups';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { AmbientMeshBackground } from '../../components/ui/AmbientMeshBackground';

export default function JoinGroupScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const haptics = useHaptics();

  const { joinGroup, isJoining } = useGroups();
  const [inviteCode, setInviteCode] = useState('');

  const handleJoin = async () => {
    if (!inviteCode.trim()) return;
    haptics.success();

    const result = await joinGroup(inviteCode.trim().toUpperCase());
    if (result && result.id) {
      router.replace(`/groups/${result.id}` as any);
    } else {
      router.replace('/groups' as any);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <AmbientMeshBackground>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerRow}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={[styles.backBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
                accessibilityRole="button"
                accessibilityLabel="Go back"
              >
                <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
              </TouchableOpacity>

              <View style={{ flex: 1, marginLeft: spacing.sm }}>
                <Text variant="headingM" weight="bold">
                  Join a Group
                </Text>
                <Text variant="caption" color="secondary">
                  Enter invite code from your flatmate
                </Text>
              </View>
            </View>

            <Animated.View entering={FadeInDown.duration(400).delay(40)} style={{ marginTop: spacing.md }}>
              <Card elevation="subtle" style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.iconCircle}>
                  <Ionicons name="key-outline" size={32} color={colors.primary} />
                </View>

                <Text variant="headingM" weight="bold" align="center" style={{ marginTop: spacing.md }}>
                  Enter 6-Digit Group Code
                </Text>
                <Text variant="caption" color="secondary" align="center" style={styles.subtitle}>
                  Ask your roommate or trip organizer for their group invite code (e.g. ROOM302).
                </Text>

                <TextInput
                  value={inviteCode}
                  onChangeText={t => setInviteCode(t.toUpperCase())}
                  placeholder="e.g. FLAT02"
                  placeholderTextColor={colors.textTertiary}
                  autoCapitalize="characters"
                  maxLength={10}
                  style={[
                    styles.codeInput,
                    {
                      backgroundColor: colors.surfaceMuted,
                      borderColor: colors.border,
                      color: colors.textPrimary,
                    },
                  ]}
                />

                <Button
                  variant="primary"
                  size="lg"
                  onPress={handleJoin}
                  loading={isJoining}
                  disabled={inviteCode.trim().length < 3}
                  fullWidth
                  style={{ marginTop: spacing.lg }}
                >
                  Join Shared Group
                </Button>
              </Card>
            </Animated.View>
          </View>
        </KeyboardAvoidingView>
      </AmbientMeshBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.xs,
    maxWidth: 540,
    width: '100%',
    alignSelf: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    marginBottom: spacing.xs,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    padding: spacing.xl,
    borderRadius: radius.card,
    borderWidth: 1,
    alignItems: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    maxWidth: 280,
  },
  codeInput: {
    width: '100%',
    borderWidth: 1.5,
    borderRadius: radius.input,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 4,
  },
});
