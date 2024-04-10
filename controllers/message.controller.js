const { getMessagesByChannel, createMessage } = require("../services/messages.service");




const getMessagesByChannelId = async (req, res) => {
    console.log(req.params.channelId);
    try {
        const messages = await getMessagesByChannel(req.params.channelId);
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createNewMessage = async (req, res) => {
    try {
        const message = await createMessage(req.body);
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    getMessagesByChannelId,
    createNewMessage
}