import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useGroupDetail } from '../../../hooks/useGroups';
import { useUser } from '../../../hooks/useUser';
import { useTheme } from '../../../hooks/useTheme';
import { useHaptics } from '../../../hooks/useHaptics';
import { spacing } from '../../../theme/spacing';
import { radius } from '../../../theme/radius';
import { Text } from '../../../components/ui/Text';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { AmbientMeshBackground } from '../../../components/ui/AmbientMeshBackground';
import { formatCurrency } from '../../../utils/currency';
import { CurrencyCode } from '../../../types/currency';

export default function AddGroupExpenseScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const groupId = typeof params.id === 'string' ? params.id : '';

  const { colors } = useTheme();
  const haptics = useHaptics();
  const { data: user } = useUser();
  const currencyCode = (user?.currency || 'INR') as CurrencyCode;

  const { group, addExpense, isAddingExpense } = useGroupDetail(groupId);

  const [title, setTitle] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [payerMemberId, setPayerMemberId] = useState<string>('');
  const [selectedSplitMemberIds, setSelectedSplitMemberIds] = useState<Set<string>>(new Set());
  const [note, setNote] = useState('');

  // Default payer to logged in user's member entry
  React.useEffect(() => {
    if (group && group.members.length > 0 && !payerMemberId) {
      const userMember = group.members.find(m => m.userId === user?.id) || group.members[0];
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPayerMemberId(userMember.id);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedSplitMemberIds(new Set(group.members.map(m => m.id)));
    }
  }, [group, user, payerMemberId]);

  const amount = parseFloat(amountStr) || 0;
  const splitCount = selectedSplitMemberIds.size;
  const sharePerPerson = splitCount > 0 ? Math.round((amount / splitCount) * 100) / 100 : 0;

  const toggleSplitMember = (memberId: string) => {
    haptics.selection();
    const next = new Set(selectedSplitMemberIds);
    if (next.has(memberId)) {
      if (next.size <= 1) return; // Must have at least 1
      next.delete(memberId);
    } else {
      next.add(memberId);
    }
    setSelectedSplitMemberIds(next);
  };

  const handleSubmit = async () => {
    if (!title.trim() || amount <= 0 || !payerMemberId || splitCount === 0) return;

    haptics.success();
    await addExpense({
      title: title.trim(),
      amount,
      paid_by_member_id: payerMemberId,
      split_member_ids: Array.from(selectedSplitMemberIds),
      note: note.trim() || undefined,
    });

    router.back();
  };

  if (!group) return null;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <AmbientMeshBackground>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
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
                  Add Group Expense
                </Text>
                <Text variant="caption" color="secondary">
                  {group.name}
                </Text>
              </View>
            </View>

            {/* Expense Details Card */}
            <Animated.View entering={FadeInDown.duration(350).delay(40)}>
              <Card elevation="subtle" style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text variant="caption" weight="bold" color="secondary" style={styles.sectionTitle}>
                  EXPENSE DETAILS
                </Text>

                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Expense description (e.g. WiFi Bill, Groceries, Rent)"
                  placeholderTextColor={colors.textTertiary}
                  style={[
                    styles.input,
                    { backgroundColor: colors.surfaceMuted, borderColor: colors.border, color: colors.textPrimary },
                  ]}
                />

                <TextInput
                  value={amountStr}
                  onChangeText={setAmountStr}
                  placeholder="Amount (e.g. 900)"
                  placeholderTextColor={colors.textTertiary}
                  keyboardType="decimal-pad"
                  style={[
                    styles.input,
                    { backgroundColor: colors.surfaceMuted, borderColor: colors.border, color: colors.textPrimary, marginTop: 10 },
                  ]}
                />

                {/* Who paid selector */}
                <Text variant="caption" weight="bold" color="secondary" style={[styles.sectionTitle, { marginTop: spacing.md }]}>
                  WHO PAID?
                </Text>
                <View style={styles.payerWrap}>
                  {group.members.map(m => {
                    const isSelected = payerMemberId === m.id;
                    const isYou = m.userId === user?.id;
                    return (
                      <TouchableOpacity
                        key={m.id}
                        onPress={() => {
                          haptics.selection();
                          setPayerMemberId(m.id);
                        }}
                        style={[
                          styles.payerChip,
                          isSelected
                            ? { backgroundColor: colors.primary, borderColor: colors.primary }
                            : { backgroundColor: colors.surfaceMuted, borderColor: colors.border },
                        ]}
                      >
                        <Ionicons
                          name={isYou ? 'person' : 'people'}
                          size={13}
                          color={isSelected ? '#FFFFFF' : colors.textSecondary}
                        />
                        <Text
                          variant="caption"
                          weight="bold"
                          style={{
                            color: isSelected ? '#FFFFFF' : colors.textSecondary,
                            marginLeft: 4,
                            fontSize: 12,
                          }}
                        >
                          {m.name} {isYou ? '(You)' : ''}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Split With Checkboxes */}
                <Text variant="caption" weight="bold" color="secondary" style={[styles.sectionTitle, { marginTop: spacing.md }]}>
                  SPLIT BETWEEN ({splitCount} people)
                </Text>

                <View style={[styles.sharePreviewBox, { backgroundColor: colors.surfaceMuted, borderColor: colors.border }]}>
                  <Text variant="caption" color="secondary">
                    Each person pays:
                  </Text>
                  <Text variant="bodyLarge" weight="bold" color="brand">
                    {formatCurrency(sharePerPerson, { currency: currencyCode })}
                  </Text>
                </View>

                {group.members.map(m => {
                  const isChecked = selectedSplitMemberIds.has(m.id);
                  const isYou = m.userId === user?.id;
                  return (
                    <TouchableOpacity
                      key={m.id}
                      onPress={() => toggleSplitMember(m.id)}
                      style={[
                        styles.splitMemberRow,
                        { borderColor: colors.border },
                      ]}
                    >
                      <Text variant="body" weight="medium">
                        {m.name} {isYou ? '(You)' : ''}
                      </Text>

                      <View
                        style={[
                          styles.checkbox,
                          {
                            borderColor: isChecked ? colors.primary : colors.border,
                            backgroundColor: isChecked ? colors.primary : 'transparent',
                          },
                        ]}
                      >
                        {isChecked && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </Card>
            </Animated.View>

            {/* Optional Note */}
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Optional notes or bill receipt number..."
              placeholderTextColor={colors.textTertiary}
              style={[
                styles.noteInput,
                { backgroundColor: colors.surface, borderColor: colors.border, color: colors.textPrimary },
              ]}
            />

            {/* Submit Button */}
            <View style={{ marginTop: spacing.lg }}>
              <Button
                variant="primary"
                size="lg"
                onPress={handleSubmit}
                loading={isAddingExpense}
                disabled={!title.trim() || amount <= 0 || splitCount === 0}
                fullWidth
              >
                Log Group Expense
              </Button>
            </View>
          </ScrollView>
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
  },
  content: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.xs,
    paddingBottom: 100,
    width: '100%',
    maxWidth: 540,
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
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
  },
  sectionTitle: {
    letterSpacing: 0.6,
    marginBottom: spacing.xs + 2,
  },
  input: {
    borderWidth: 1,
    borderRadius: radius.input,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: 15,
  },
  payerWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  payerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  sharePreviewBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  splitMemberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs + 4,
    borderBottomWidth: 1,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteInput: {
    borderWidth: 1,
    borderRadius: radius.input,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: 14,
    marginTop: spacing.sm,
  },
});
