import mongoose from "mongoose";

export const StudentSchema = new mongoose.Schema({
    name: String,
    className: String,
    type: Boolean,
    organizationId: String,
    registration: String,
})

const studentsModel = mongoose.model('students', StudentSchema);

export default studentsModel;