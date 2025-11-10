import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, sparse: true },
  passwordHash: String,
  anonId: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
  lastActiveAt: { type: Date, default: Date.now },
  remindersOptIn: { type: Boolean, default: true },
}, { versionKey: false });

userSchema.methods.setPassword = async function(password) {
  this.passwordHash = await bcrypt.hash(password, 10);
}

userSchema.methods.checkPassword = async function(password) {
  return bcrypt.compare(password, this.passwordHash || '');
}

export default mongoose.model('User', userSchema);
