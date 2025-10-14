const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    fullName: {
        type:String,
        required:true,
    },
    email: {
        type:String,
        required:true,
        unique:true
    },
    password: {
        type:String,
        required:true
    },
    profileimageurl: {
        type:String,
        default:null
    }
},{timestamps: true});

//hash password before saving
UserSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

UserSchema.methods.comparepassword = async function (candidatepassword) {
    return await bcrypt.compare(candidatepassword, this.password);
} 

module.exports = mongoose.model('user',UserSchema);