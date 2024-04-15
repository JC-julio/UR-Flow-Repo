import mongoose from 'mongoose';

export const ManagerSchema = new mongoose.Schema({
  name: { type: String},
  password: { type: String},
  type: { type: String},
  organizationId: { type: String},
});

const managerModel = mongoose.model('manager', ManagerSchema);
export default managerModel;