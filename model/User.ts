import mongoose, {model, models} from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
name:string,
email:string,
password:string,
id?:mongoose.Types.ObjectId,
updatedAt?:Date,
createdAt?:Date
}


const userSchema = new mongoose.Schema<IUser>({

    name:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},

}, {timestamps:true})

userSchema.pre("save", function(next){
    if(!this.isModified("password")) return next();
    this.password = bcrypt.hashSync(this.password, 10);
    next();
})

  const User = models?.User || model<IUser>("User", userSchema);
  export default User;

