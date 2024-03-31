import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    id: Number,
    username: String,
    password: String,
    email: String,
    role: String,
    favorites: Array
});

const User = mongoose.model('user', userSchema, "users"); // 3ème paramètre facultatif: nom de la collection qui recevra les objets

module.exports = User;