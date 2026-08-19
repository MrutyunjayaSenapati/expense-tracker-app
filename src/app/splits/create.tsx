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
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSplitBills } from '../../hooks/useSplitBills';
import { useUser } from '../../hooks/useUser';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { AmbientMeshBackground } from '../../components/ui/AmbientMeshBackground';
import { ContactPickerModal, SelectedContact } from '../../components/ui/ContactPickerModal';
import { formatCurrency } from '../../utils/currency';
import { CurrencyCode } from '../../types/currency';

interface ParticipantEntry {
  id: string;
  name: string;
  emailOrPhone: string;
  customAmount: string;
}

export default function CreateSplitScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const haptics = useHaptics();
  const { data: user } = useUser();
  const currencyCode = (user?.currency || 'INR') as CurrencyCode;

  const { createSplitBill, isCreating } = useSplitBills();

  // Form State
  const [title, setTitle] = useState('');
  const [totalAmountStr, setTotalAmountStr] = useState('');
  const [splitMode, setSplitMode] = useState<'EQUAL' | 'CUSTOM'>('EQUAL');
  const [note, setNote] = useState('');
  const [contactPickerVisible, setContactPickerVisible] = useState(false);

  // Participants list (starts with 1 friend)
  const [participants, setParticipants] = useState<ParticipantEntry[]>([
    { id: '1', name: '', emailOrPhone: '', customAmount: '' },
  ]);

  const totalAmount = parseFloat(totalAmountStr) || 0;
  const validParticipantsCount = participants.filter(p => p.name.trim()).length;
  const totalPeople = 1 + validParticipantsCount; // You + friends

  // Equal split calculation
  const equalSharePerPerson = totalPeople > 0 ? Math.round((totalAmount / totalPeople) * 100) / 100 : 0;

  const handleAddParticipant = () => {
    haptics.light();
    setParticipants([
      ...participants,
      { id: Date.now().toString(), name: '', emailOrPhone: '', customAmount: '' },
    ]);
  };

  const handleRemoveParticipant = (id: string) => {
    if (participants.length <= 1) {
      setParticipants([{ id: '1', name: '', emailOrPhone: '', customAmount: '' }]);
      return;
    }
    haptics.medium();
    setParticipants(participants.filter(p => p.id !== id));
  };

  const handleUpdateParticipant = (id: string, field: keyof ParticipantEntry, value: string) => {
    setParticipants(
      participants.map(p => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleImportContacts = (selectedContacts: SelectedContact[]) => {
    haptics.success();
    const existing = participants.filter(p => p.name.trim());
    const imported: ParticipantEntry[] = selectedContacts.map(c => ({
      id: Math.random().toString(),
      name: c.name,
      emailOrPhone: c.phoneOrEmail,
      customAmount: '',
    }));
    setParticipants([...existing, ...imported]);
  };

  // Custom split sum validation
  const customFriendsTotal = participants.reduce((sum, p) => {
    const amt = parseFloat(p.customAmount) || 0;
    return sum + amt;
  }, 0);
  const yourCustomShare = Math.max(0, totalAmount - customFriendsTotal);

  const handleSubmit = async () => {
    if (!title.trim() || totalAmount <= 0) return;

    const validParticipants = participants.filter(p => p.name.trim());
    if (validParticipants.length === 0) return;

    haptics.success();

    const formattedParticipants = validParticipants.map(p => {
      const share = splitMode === 'EQUAL'
        ? equalSharePerPerson
        : (parseFloat(p.customAmount) || 0);

      return {
        name: p.name.trim(),
        email_or_phone: p.emailOrPhone.trim() || undefined,
        amount_owed: share,
      };
    });

    const yourFinalShare = splitMode === 'EQUAL' ? equalSharePerPerson : yourCustomShare;

    await createSplitBill({
      title: title.trim(),
      total_amount: totalAmount,
      your_share: yourFinalShare,
      paid_by: 'YOU',
      participants: formattedParticipants,
      note: note.trim() || undefined,
    });

    router.replace('/splits' as any);
  };

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
                  Split an Expense
                </Text>
                <Text variant="caption" color="secondary">
                  You paid the bill • Split with friends & request UPI
                </Text>
              </View>
            </View>

            {/* Bill Details Card */}
            <Animated.View entering={FadeInDown.duration(350).delay(40)}>
              <Card elevation="subtle" style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text variant="caption" weight="bold" color="secondary" style={styles.sectionTitle}>
                  BILL DETAILS
                </Text>

                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Expense description (e.g. Pizza Hut Dinner, Uber, Groceries)"
                  placeholderTextColor={colors.textTertiary}
                  style={[
                    styles.input,
                    { backgroundColor: colors.surfaceMuted, borderColor: colors.border, color: colors.textPrimary },
                  ]}
                />

                <TextInput
                  value={totalAmountStr}
                  onChangeText={setTotalAmountStr}
                  placeholder="Total amount you paid (e.g. 1200)"
                  placeholderTextColor={colors.textTertiary}
                  keyboardType="decimal-pad"
                  style={[
                    styles.input,
                    { backgroundColor: colors.surfaceMuted, borderColor: colors.border, color: colors.textPrimary, marginTop: 10 },
                  ]}
                />
              </Card>
            </Animated.View>

            {/* Split Mode & Participants */}
            <Animated.View entering={FadeInDown.duration(350).delay(80)}>
              <Card elevation="subtle" style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, marginTop: spacing.sm }]}>
                <View style={styles.splitHeader}>
                  <Text variant="caption" weight="bold" color="secondary" style={styles.sectionTitle}>
                    SPLIT METHOD
                  </Text>
                  <View style={styles.modeToggleRow}>
                    <TouchableOpacity
                      onPress={() => {
                        haptics.selection();
                        setSplitMode('EQUAL');
                      }}
                      style={[
                        styles.modePill,
                        splitMode === 'EQUAL' && { backgroundColor: colors.primary },
                      ]}
                    >
                      <Text
                        variant="caption"
                        weight="bold"
                        style={{ color: splitMode === 'EQUAL' ? '#FFFFFF' : colors.textSecondary, fontSize: 11 }}
                      >
                        Equal Split
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        haptics.selection();
                        setSplitMode('CUSTOM');
                      }}
                      style={[
                        styles.modePill,
                        splitMode === 'CUSTOM' && { backgroundColor: colors.primary },
                      ]}
                    >
                      <Text
                        variant="caption"
                        weight="bold"
                        style={{ color: splitMode === 'CUSTOM' ? '#FFFFFF' : colors.textSecondary, fontSize: 11 }}
                      >
                        Custom Split
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Live Split Preview Box */}
                <View style={[styles.previewBox, { backgroundColor: colors.surfaceMuted, borderColor: colors.border }]}>
                  <View style={styles.previewRow}>
                    <Text variant="body" weight="medium" color="primary">
                      Your share (You paid):
                    </Text>
                    <Text variant="bodyLarge" weight="bold" color="brand">
                      {formatCurrency(
                        splitMode === 'EQUAL' ? equalSharePerPerson : yourCustomShare,
                        { currency: currencyCode }
                      )}
                    </Text>
                  </View>
                  <Text variant="caption" color="secondary" style={{ marginTop: 2, fontSize: 11 }}>
                    {splitMode === 'EQUAL'
                      ? `Divided equally between you and ${validParticipantsCount} friend${validParticipantsCount === 1 ? '' : 's'}`
                      : `Total bill: ${formatCurrency(totalAmount, { currency: currencyCode })}`}
                  </Text>
                </View>

                {/* Participants Entry List */}
                <View style={styles.friendsHeaderRow}>
                  <Text variant="caption" weight="bold" color="secondary" style={styles.sectionTitle}>
                    FRIENDS IN THIS SPLIT
                  </Text>

                  {/* Native Address Book Contact Picker Button */}
                  <TouchableOpacity
                    onPress={() => {
                      haptics.light();
                      setContactPickerVisible(true);
                    }}
                    style={[styles.importContactsBtn, { backgroundColor: colors.primaryLight }]}
                  >
                    <Ionicons name="book-outline" size={14} color={colors.primary} />
                    <Text variant="caption" weight="bold" color="brand" style={{ marginLeft: 4, fontSize: 11 }}>
                      Add from Contacts
                    </Text>
                  </TouchableOpacity>
                </View>

                {participants.map((p, index) => (
                  <View key={p.id} style={styles.participantItem}>
                    <View style={styles.participantTop}>
                      <View style={[styles.pIndexCircle, { backgroundColor: colors.primaryLight }]}>
                        <Text variant="caption" weight="bold" color="brand" style={{ fontSize: 11 }}>
                          {index + 1}
                        </Text>
                      </View>

                      <TextInput
                        value={p.name}
                        onChangeText={text => handleUpdateParticipant(p.id, 'name', text)}
                        placeholder="Friend name (e.g. Rahul, Priya)"
                        placeholderTextColor={colors.textTertiary}
                        style={[
                          styles.pInput,
                          { backgroundColor: colors.surfaceMuted, borderColor: colors.border, color: colors.textPrimary },
                        ]}
                      />

                      {participants.length > 1 && (
                        <TouchableOpacity
                          onPress={() => handleRemoveParticipant(p.id)}
                          style={styles.pDeleteBtn}
                        >
                          <Ionicons name="trash-outline" size={18} color={colors.expense} />
                        </TouchableOpacity>
                      )}
                    </View>

                    <View style={styles.pBottom}>
                      <TextInput
                        value={p.emailOrPhone}
                        onChangeText={text => handleUpdateParticipant(p.id, 'emailOrPhone', text)}
                        placeholder="Phone / UPI ID (for WhatsApp & UPI Pay)"
                        placeholderTextColor={colors.textTertiary}
                        style={[
                          styles.pInputSecondary,
                          { backgroundColor: colors.surfaceMuted, borderColor: colors.border, color: colors.textPrimary },
                        ]}
                      />

                      {splitMode === 'CUSTOM' && (
                        <TextInput
                          value={p.customAmount}
                          onChangeText={text => handleUpdateParticipant(p.id, 'customAmount', text)}
                          placeholder="Amount"
                          placeholderTextColor={colors.textTertiary}
                          keyboardType="decimal-pad"
                          style={[
                            styles.pCustomAmountInput,
                            { backgroundColor: colors.surfaceMuted, borderColor: colors.border, color: colors.textPrimary },
                          ]}
                        />
                      )}
                    </View>
                  </View>
                ))}

                <View style={styles.buttonActionRow}>
                  <TouchableOpacity
                    onPress={handleAddParticipant}
                    style={[styles.addParticipantBtn, { borderColor: colors.border, flex: 1 }]}
                  >
                    <Ionicons name="person-add-outline" size={15} color={colors.primary} />
                    <Text variant="caption" weight="bold" color="brand" style={{ marginLeft: 6 }}>
                      + Add Name Manually
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      haptics.light();
                      setContactPickerVisible(true);
                    }}
                    style={[styles.addContactsQuickBtn, { backgroundColor: colors.primaryLight }]}
                  >
                    <Ionicons name="people-outline" size={16} color={colors.primary} />
                    <Text variant="caption" weight="bold" color="brand" style={{ marginLeft: 6 }}>
                      Pick Contacts
                    </Text>
                  </TouchableOpacity>
                </View>
              </Card>
            </Animated.View>

            {/* Optional Note */}
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Add an optional note or location..."
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
                loading={isCreating}
                disabled={!title.trim() || totalAmount <= 0 || validParticipantsCount === 0}
                fullWidth
              >
                Create Split & Request Payment
              </Button>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Native Address Book Contact Picker Modal */}
        <ContactPickerModal
          visible={contactPickerVisible}
          onClose={() => setContactPickerVisible(false)}
          onSelectContacts={handleImportContacts}
        />
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
  splitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modeToggleRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: radius.full,
    padding: 2,
  },
  modePill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
  },
  previewBox: {
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    marginTop: spacing.sm,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  friendsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  importContactsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  participantItem: {
    marginBottom: spacing.sm,
  },
  participantTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pIndexCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radius.input,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 4,
    fontSize: 14,
  },
  pDeleteBtn: {
    padding: 6,
  },
  pBottom: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
    marginLeft: 32,
  },
  pInputSecondary: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radius.input,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
    fontSize: 13,
  },
  pCustomAmountInput: {
    width: 90,
    borderWidth: 1,
    borderRadius: radius.input,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
    fontSize: 13,
  },
  buttonActionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: spacing.xs,
  },
  addParticipantBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: radius.button,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  addContactsQuickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.button,
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
