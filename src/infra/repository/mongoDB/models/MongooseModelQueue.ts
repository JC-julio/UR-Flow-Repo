import mongoose from 'mongoose';

export const queueSchema = new mongoose.Schema({
    sequence: Array<String>,
    organizationId: String,
});

const queueModel = mongoose.model('queue', queueSchema);
export default queueModel;