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
import { useGroups } from '../../hooks/useGroups';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { AmbientMeshBackground } from '../../components/ui/AmbientMeshBackground';
import { ContactPickerModal, SelectedContact } from '../../components/ui/ContactPickerModal';
import { GroupCategory } from '../../types/group';

interface MemberEntry {
  id: string;
  name: string;
  emailOrPhone: string;
}

export default function CreateGroupScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const haptics = useHaptics();

  const { createGroup, isCreating } = useGroups();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<GroupCategory>('HOME');
  const [members, setMembers] = useState<MemberEntry[]>([
    { id: '1', name: '', emailOrPhone: '' },
  ]);
  const [contactPickerVisible, setContactPickerVisible] = useState(false);

  const handleAddMember = () => {
    haptics.light();
    setMembers([...members, { id: Date.now().toString(), name: '', emailOrPhone: '' }]);
  };

  const handleRemoveMember = (id: string) => {
    haptics.medium();
    setMembers(members.filter(m => m.id !== id));
  };

  const handleUpdateMember = (id: string, field: keyof MemberEntry, value: string) => {
    setMembers(members.map(m => (m.id === id ? { ...m, [field]: value } : m)));
  };

  const handleImportContacts = (selectedContacts: SelectedContact[]) => {
    haptics.success();
    const existing = members.filter(m => m.name.trim());
    const imported: MemberEntry[] = selectedContacts.map(c => ({
      id: Math.random().toString(),
      name: c.name,
      emailOrPhone: c.phoneOrEmail,
    }));
    setMembers([...existing, ...imported]);
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;

    haptics.success();
    const formattedMembers = members
      .filter(m => m.name.trim())
      .map(m => ({
        name: m.name.trim(),
        email_or_phone: m.emailOrPhone.trim() || undefined,
      }));

    const result = await createGroup({
      name: name.trim(),
      category,
      members: formattedMembers,
    });

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
                  Create Group
                </Text>
                <Text variant="caption" color="secondary">
                  Track shared room or trip expenses
                </Text>
              </View>
            </View>

            {/* Group Name & Category */}
            <Animated.View entering={FadeInDown.duration(350).delay(40)}>
              <Card elevation="subtle" style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text variant="caption" weight="bold" color="secondary" style={styles.sectionTitle}>
                  GROUP DETAILS
                </Text>

                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Group Name (e.g. Flat 302, Room Expenses, Goa Trip)"
                  placeholderTextColor={colors.textTertiary}
                  style={[
                    styles.input,
                    { backgroundColor: colors.surfaceMuted, borderColor: colors.border, color: colors.textPrimary },
                  ]}
                />

                <Text variant="caption" weight="bold" color="secondary" style={[styles.sectionTitle, { marginTop: spacing.md }]}>
                  CATEGORY
                </Text>
                <View style={styles.categoryRow}>
                  {[
                    { id: 'HOME', label: 'Home / Room', icon: 'home-outline' },
                    { id: 'TRIP', label: 'Trip', icon: 'airplane-outline' },
                    { id: 'COUPLE', label: 'Couple', icon: 'heart-outline' },
                    { id: 'OTHER', label: 'Other', icon: 'people-outline' },
                  ].map(cat => (
                    <TouchableOpacity
                      key={cat.id}
                      onPress={() => {
                        haptics.selection();
                        setCategory(cat.id as GroupCategory);
                      }}
                      style={[
                        styles.catPill,
                        category === cat.id
                          ? { backgroundColor: colors.primary, borderColor: colors.primary }
                          : { backgroundColor: colors.surfaceMuted, borderColor: colors.border },
                      ]}
                    >
                      <Ionicons
                        name={cat.icon as any}
                        size={14}
                        color={category === cat.id ? '#FFFFFF' : colors.textSecondary}
                      />
                      <Text
                        variant="caption"
                        weight="bold"
                        style={{
                          color: category === cat.id ? '#FFFFFF' : colors.textSecondary,
                          marginLeft: 4,
                          fontSize: 11,
                        }}
                      >
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </Card>
            </Animated.View>

            {/* Roommates / Members */}
            <Animated.View entering={FadeInDown.duration(350).delay(80)}>
              <Card elevation="subtle" style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, marginTop: spacing.sm }]}>
                <View style={styles.membersHeader}>
                  <Text variant="caption" weight="bold" color="secondary" style={styles.sectionTitle}>
                    ROOMMATES & MEMBERS
                  </Text>

                  {/* Native Contact Picker Button */}
                  <TouchableOpacity
                    onPress={() => {
                      haptics.light();
                      setContactPickerVisible(true);
                    }}
                    style={[styles.importContactsBtn, { backgroundColor: colors.primaryLight }]}
                  >
                    <Ionicons name="book-outline" size={13} color={colors.primary} />
                    <Text variant="caption" weight="bold" color="brand" style={{ marginLeft: 4, fontSize: 11 }}>
                      From Contacts
                    </Text>
                  </TouchableOpacity>
                </View>

                {members.map((m, index) => (
                  <View key={m.id} style={styles.memberRow}>
                    <View style={[styles.memberIndexCircle, { backgroundColor: colors.primaryLight }]}>
                      <Text variant="caption" weight="bold" color="brand" style={{ fontSize: 11 }}>
                        {index + 1}
                      </Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      <TextInput
                        value={m.name}
                        onChangeText={t => handleUpdateMember(m.id, 'name', t)}
                        placeholder="Roommate name (e.g. Rahul)"
                        placeholderTextColor={colors.textTertiary}
                        style={[
                          styles.mInput,
                          { backgroundColor: colors.surfaceMuted, borderColor: colors.border, color: colors.textPrimary },
                        ]}
                      />
                      <TextInput
                        value={m.emailOrPhone}
                        onChangeText={t => handleUpdateMember(m.id, 'emailOrPhone', t)}
                        placeholder="Phone / Email (for UPI & Auto-sync)"
                        placeholderTextColor={colors.textTertiary}
                        style={[
                          styles.mInputSecondary,
                          { backgroundColor: colors.surfaceMuted, borderColor: colors.border, color: colors.textPrimary },
                        ]}
                      />
                    </View>

                    {members.length > 1 && (
                      <TouchableOpacity
                        onPress={() => handleRemoveMember(m.id)}
                        style={styles.deleteBtn}
                      >
                        <Ionicons name="trash-outline" size={18} color={colors.expense} />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}

                <TouchableOpacity
                  onPress={handleAddMember}
                  style={[styles.addMemberBtn, { borderColor: colors.border }]}
                >
                  <Ionicons name="person-add-outline" size={15} color={colors.primary} />
                  <Text variant="caption" weight="bold" color="brand" style={{ marginLeft: 6 }}>
                    + Add Another Roommate
                  </Text>
                </TouchableOpacity>
              </Card>
            </Animated.View>

            {/* Create Button */}
            <View style={{ marginTop: spacing.lg }}>
              <Button
                variant="primary"
                size="lg"
                onPress={handleSubmit}
                loading={isCreating}
                disabled={!name.trim()}
                fullWidth
              >
                Create Room Expenses Group
              </Button>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Contact Picker Modal */}
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
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  catPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  membersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  importContactsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: spacing.sm,
  },
  memberIndexCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  mInput: {
    borderWidth: 1,
    borderRadius: radius.input,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
    fontSize: 14,
  },
  mInputSecondary: {
    borderWidth: 1,
    borderRadius: radius.input,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    fontSize: 12,
    marginTop: 4,
  },
  deleteBtn: {
    padding: 8,
    marginTop: 4,
  },
  addMemberBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: radius.button,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginTop: spacing.xs,
  },
});
