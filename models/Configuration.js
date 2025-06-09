import mongoose from 'mongoose';

const ConfigurationsSchema=new mongoose.Schema({
    Confi_uuid: { type: String },
    name: { type: String, required: true },
    logo: { type:String, required: true},
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true  },
    address: { type: String, required: true },
    fb: { type:String, required: true},
    insta: { type: String, required: true },
    twitter: { type: String, required: true  },
    LinkedIn: { type: String, required: true },
 })

export default mongoose.model('Configuration', ConfigurationsSchema);