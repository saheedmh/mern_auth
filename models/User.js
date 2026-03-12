import mongoose from 'mongoose';
 const UserSchema = new mongoose.Schema({
    name : {type:String, required:true, unique:true},
    email : {type:String, required:true, unique:true},
    password : {type:String, require:true}


 })

 const UserModel = mongoose.model("User", UserSchema)
 export {UserModel as User}
 