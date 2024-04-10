const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getMessagesByChannel = async (channel_id) => {
    console.log(channel_id, "channel_id in service");
    try {
        const messages = await prisma.messages.findMany({
            where: {
                channel_id,
            },
        });
        
        return messages;
    } catch (error) {
        throw new Error("Something went wrong");
    }
};

const createMessage = async (data) => {
    try {
        const message = await prisma.messages.create({
            data,
        });
        return message;
    } catch (error) {
        throw new Error("Something went wrong");
    }
};

module.exports = {
    getMessagesByChannel,
    createMessage
}