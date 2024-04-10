const {getChannelsByUser, createChannel} = require("../services/channel.service");


const getChannelsByUserId = async (req, res) => {

    try {
        const channels = await getChannelsByUser(req.params.userId);

        res.json(channels);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createNewChannel = async (req, res) => {

    try {
        const channel = await createChannel(req.body);

        res.status(201).json(channel);
    } catch (error) {

        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    getChannelsByUserId,
    createNewChannel
}