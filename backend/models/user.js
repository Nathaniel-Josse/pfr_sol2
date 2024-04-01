import mongoose from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';
const userSchema = new mongoose.Schema({
    id: Number,
    username: String,
    password: String,
    email: String,
    role: String,
    favorites: Array,
    seen: Array,
    watchlist: Array
});

userSchema.plugin(mongooseUniqueValidator);

export default mongoose.model("user", userSchema, "users");