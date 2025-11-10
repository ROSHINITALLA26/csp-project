export async function sendNotification(user, message) {
  // if you want push notifications later, integrate Firebase Cloud Messaging
  // for now, just store in DB
  user.notifications.push({ message, createdAt: new Date() });
  await user.save();
}
