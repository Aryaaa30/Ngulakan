const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nama: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    status: { type: String, enum: ['Aktif', 'Nonaktif'], default: 'Aktif' },
    last_login: { type: Date },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

// Update the updated_at field before saving
userSchema.pre('save', function(next) {
    this.updated_at = new Date();
    next();
});

module.exports = mongoose.model('User', userSchema);