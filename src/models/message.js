import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
});

const Message = mongoose.model('Message', messageSchema);

export default Message;