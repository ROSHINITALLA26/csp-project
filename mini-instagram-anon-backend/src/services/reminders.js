import cron from 'node-cron';
import User from '../models/User.js';

/**
 * For demo: once per day at REMINDER_HOUR_IST, mark users who haven't been active in 48h for a "gentle ping".
 * In production, you'd send push/email. Here we just log and expose metrics.
 */
let lastRun = null;
let lastNotified = 0;

export function getReminderMetrics() {
  return { lastRun, lastNotified };
}

export function runDailyReminders() {
  const hour = Number(process.env.REMINDER_HOUR_IST || 20);
  // Run every day at :00 IST hour -> cron runs by server timezone; we assume IST server or ignore exact TZ for demo.
  cron.schedule(`0 ${hour} * * *`, async () => {
    const cutoff = new Date(Date.now() - 1000 * 60 * 60 * 48);
    const targets = await User.find({ remindersOptIn: true, lastActiveAt: { $lt: cutoff } });
    lastRun = new Date();
    lastNotified = targets.length;
    console.log('🔔 Daily reminders (demo): would ping', targets.length, 'users');
  });
}
