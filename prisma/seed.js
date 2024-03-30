const { encrypt } = require("../middleware/password");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.Users.create({
    data: {
      user_name: "pavliTawfik90",
      first_name: "pavli",
      last_name: "tawfik",
      email: "bavlesamy@gmail.com",
      phone: "6266265854",
      password: await encrypt("P@ssw0rd"),
      type: "admin",
      register_source: "email",
      is_email_verified: true,
      is_phone_verified: true,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
