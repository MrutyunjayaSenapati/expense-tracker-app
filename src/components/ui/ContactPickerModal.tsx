import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useHaptics } from '../../hooks/useHaptics';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { Text } from './Text';
import { Card } from './Card';
import { Button } from './Button';

export interface SelectedContact {
  id: string;
  name: string;
  phoneOrEmail: string;
}

interface ContactPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectContacts: (contacts: SelectedContact[]) => void;
}

export const ContactPickerModal: React.FC<ContactPickerModalProps> = ({
  visible,
  onClose,
  onSelectContacts,
}) => {
  const { colors } = useTheme();
  const haptics = useHaptics();

  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState<SelectedContact[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    if (!visible) {
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedIds(new Set());
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchQuery('');

    // Load contacts strictly from native device
    (async () => {
      setIsLoading(true);
      try {
        if (Platform.OS !== 'web') {
          const Contacts = await import('expo-contacts');
          const { status } = await Contacts.requestPermissionsAsync();
          setHasPermission(status === 'granted');

          if (status === 'granted') {
            const { data } = await Contacts.getContactsAsync({
              fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
              sort: Contacts.SortTypes.FirstName,
            });

            if (data && data.length > 0) {
              const formatted: SelectedContact[] = (data as any[])
                .filter((c: any) => c.name && (c.phoneNumbers?.length || c.emails?.length))
                .map((c: any) => ({
                  id: c.id || Math.random().toString(),
                  name: c.name || '',
                  phoneOrEmail:
                    c.phoneNumbers?.[0]?.number || c.emails?.[0]?.email || '',
                }))
                .filter(c => c.name.trim().length > 0);

              setContacts(formatted);
              setIsLoading(false);
              return;
            }
          }
        }
      } catch (err) {
        console.warn('Native contacts not accessible:', err);
      }

      setContacts([]);
      setIsLoading(false);
    })();
  }, [visible]);

  const filteredContacts = contacts.filter(
    c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phoneOrEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelect = (contact: SelectedContact) => {
    haptics.selection();
    const next = new Set(selectedIds);
    if (next.has(contact.id)) {
      next.delete(contact.id);
    } else {
      next.add(contact.id);
    }
    setSelectedIds(next);
  };

  const handleConfirm = () => {
    haptics.success();
    const chosen = contacts.filter(c => selectedIds.has(c.id));
    onSelectContacts(chosen);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <Ionicons name="close" size={20} color={colors.textPrimary} />
            </TouchableOpacity>

            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <Text variant="headingM" weight="bold">
                Select Roommates
              </Text>
              <Text variant="caption" color="secondary">
                {selectedIds.size} selected
              </Text>
            </View>

            {selectedIds.size > 0 && (
              <Button size="sm" variant="primary" onPress={handleConfirm}>
                Add ({selectedIds.size})
              </Button>
            )}
          </View>

          {/* Search Bar */}
          <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="search-outline" size={18} color={colors.textTertiary} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search by name or phone..."
              placeholderTextColor={colors.textTertiary}
              style={[styles.searchInput, { color: colors.textPrimary }]}
              autoCapitalize="none"
              clearButtonMode="while-editing"
            />
          </View>

          {/* Contacts List */}
          <FlatList
            data={filteredContacts}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const isSelected = selectedIds.has(item.id);
              return (
                <TouchableOpacity
                  onPress={() => toggleSelect(item)}
                  activeOpacity={0.7}
                  style={[
                    styles.contactItem,
                    {
                      backgroundColor: colors.surface,
                      borderColor: isSelected ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <View style={[styles.avatarCircle, { backgroundColor: colors.primaryLight }]}>
                    <Text variant="bodyLarge" weight="bold" color="brand">
                      {item.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>

                  <View style={{ flex: 1, marginLeft: spacing.sm }}>
                    <Text variant="bodyLarge" weight="semibold">
                      {item.name}
                    </Text>
                    {item.phoneOrEmail ? (
                      <Text variant="caption" color="secondary">
                        {item.phoneOrEmail}
                      </Text>
                    ) : null}
                  </View>

                  <View
                    style={[
                      styles.checkbox,
                      {
                        borderColor: isSelected ? colors.primary : colors.border,
                        backgroundColor: isSelected ? colors.primary : 'transparent',
                      },
                    ]}
                  >
                    {isSelected && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                  </View>
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                {isLoading ? (
                  <View style={{ alignItems: 'center' }}>
                    <Ionicons name="sync-outline" size={32} color={colors.primary} />
                    <Text variant="body" color="secondary" style={{ marginTop: spacing.sm }}>
                      Loading contacts from phone...
                    </Text>
                  </View>
                ) : (
                  <View style={{ alignItems: 'center' }}>
                    <Ionicons name="people-outline" size={40} color={colors.textTertiary} />
                    <Text variant="body" color="secondary" style={{ marginTop: spacing.sm }}>
                      {hasPermission === false
                        ? 'Contacts permission required to load phone contacts'
                        : 'No contacts found'}
                    </Text>
                  </View>
                )}
              </View>
            }
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    marginBottom: spacing.xs,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.input,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    marginBottom: spacing.md,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.xs + 2,
    fontSize: 15,
  },
  listContent: {
    paddingBottom: 40,
    gap: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1.5,
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
});
