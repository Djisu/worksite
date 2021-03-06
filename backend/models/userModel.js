import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false, required: true },
    address: { type: String, required: true },
    telno: { type: String, required: true },
    employmentStatus: { type: String, required: true },
    country: { type: String, required: true },
  },
  {
    timestamps: true,
  },
)
const User = mongoose.model('User', userSchema)
export default User
