import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

// Configure foreground notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const DAILY_REMINDER_ID = 'daily-expense-logging-reminder';

class NotificationService {
  private isInitialized = false;

  /**
   * Initialize notification channels for Android
   */
  async init() {
    if (this.isInitialized) return;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('reminders', {
        name: 'Daily Reminders',
        description: 'Reminders to log daily expenses and maintain tracking streak',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#4F46E5',
      });

      await Notifications.setNotificationChannelAsync('budget-alerts', {
        name: 'Budget Alerts',
        description: 'Realtime warnings when budget limits are near or exceeded',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 500, 200, 500],
        lightColor: '#EF4444',
      });

      await Notifications.setNotificationChannelAsync('default', {
        name: 'General Updates',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    this.isInitialized = true;
  }

  /**
   * Request notification permissions from user
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      return finalStatus === 'granted';
    } catch (error) {
      console.warn('Error requesting notification permissions:', error);
      return false;
    }
  }

  /**
   * Check if notifications are currently permitted
   */
  async hasPermissions(): Promise<boolean> {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      return status === 'granted';
    } catch {
      return false;
    }
  }

  /**
   * Get Device Push Token (Ready for future FCM / Expo Push server implementation)
   */
  async getPushToken(): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;

      const tokenData = await Notifications.getExpoPushTokenAsync(
        projectId ? { projectId } : undefined
      );

      return tokenData.data;
    } catch (error) {
      console.warn('Error obtaining push token:', error);
      return null;
    }
  }

  /**
   * Schedule repeating Daily Reminder to log expenses
   */
  async scheduleDailyReminder(hour: number = 20, minute: number = 0): Promise<string | null> {
    try {
      const hasPerms = await this.requestPermissions();
      if (!hasPerms) return null;

      await this.init();
      // Cancel previous reminder if scheduled
      await this.cancelDailyReminder();

      const identifier = await Notifications.scheduleNotificationAsync({
        identifier: DAILY_REMINDER_ID,
        content: {
          title: 'Track Today’s Expenses',
          body: 'Take 30 seconds to log today’s spending and keep your streak alive.',
          color: '#4F46E5',
          data: { screen: '/(tabs)/add' },
          categoryIdentifier: 'reminders',
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour,
          minute,
        },
      });

      return identifier;
    } catch (error) {
      console.warn('Error scheduling daily reminder:', error);
      return null;
    }
  }

  /**
   * Cancel scheduled daily reminder
   */
  async cancelDailyReminder(): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(DAILY_REMINDER_ID);
    } catch {
      // Ignore if not exists
    }
  }

  /**
   * Trigger immediate local budget warning alert
   */
  async sendBudgetAlert(params: {
    categoryName: string;
    spent: number;
    limit: number;
    percentage: number;
  }): Promise<void> {
    try {
      const hasPerms = await this.hasPermissions();
      if (!hasPerms) return;

      await this.init();

      const isOver = params.percentage >= 100;
      const title = isOver
        ? `Over Budget: ${params.categoryName}`
        : `Budget Alert: ${params.categoryName}`;

      const body = isOver
        ? `You've spent ₹${params.spent.toLocaleString('en-IN')} of ₹${params.limit.toLocaleString('en-IN')} limit (${params.percentage}%).`
        : `You've reached ${params.percentage}% of your ₹${params.limit.toLocaleString('en-IN')} monthly budget.`;

      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          color: isOver ? '#EF4444' : '#F59E0B',
          data: { screen: '/(tabs)/reports' },
          categoryIdentifier: 'budget-alerts',
        },
        trigger: null, // trigger immediately
      });
    } catch (error) {
      console.warn('Error sending budget alert:', error);
    }
  }

  /**
   * Trigger instant test notification
   */
  async sendTestNotification(): Promise<boolean> {
    try {
      const hasPerms = await this.requestPermissions();
      if (!hasPerms) return false;

      await this.init();

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Notifications Working',
          body: 'Expense Tracker notifications are active, scheduled, and working smoothly.',
          color: '#4F46E5',
          data: { test: true },
        },
        trigger: null, // Instant
      });

      return true;
    } catch (error) {
      console.warn('Error triggering test notification:', error);
      return false;
    }
  }
}

export const notificationService = new NotificationService();
