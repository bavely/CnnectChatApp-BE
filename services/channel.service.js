const { PrismaClient } = require("@prisma/client");
const {getUserById} = require("./user.service");

const prisma = new PrismaClient();

const getChannelsByUser = async (user_id) => {

    try {
        const channels = await prisma.channels.findMany({
            where: {
                members_ids: {
                    has: user_id,
                },
            },
        });
        const channelsWithMembers = await Promise.all(
            channels.map(async (channel) => {
                const members = await Promise.all(
                    channel.members_ids.map(async (member_id) => {
                        const member = await getUserById(member_id);
                        return member;
                    })
                );
                return {
                    ...channel,
                    members,
                };
            })
        );
        return channelsWithMembers;
    } catch (error) {
        throw new Error("Something went wrong");
    }
};

const createChannel = async ({owner_id, members_ids}) => {
   

    try {
        const channel = await prisma.channels.create({
            data: {
                owner_id,
                members_ids
            },
        });

        const members  = await Promise.all(
                    channel.members_ids.map(async (member_id) => {
                        const member = await getUserById(member_id);
                        return member;
                    })
                );
                return {
                    ...channel,
                    members,
                };
        
    } catch (error) {
        throw new Error("Something went wrong");
    }
};

module.exports = {
    getChannelsByUser,
    createChannel
}