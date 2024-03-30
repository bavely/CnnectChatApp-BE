const { getAllUsers, createUser } = require("../services/user.service");


 const  getUsers= async (req, res) => {
    try {
      const users = await getAllUsers(req.query);
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


  const createNewUser= async (req, res) => {
    try {
      const user = await createUser(req.body);

      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: JSON.parse(error.message) });
    }
  };

  


  module.exports = {
    getUsers,
    createNewUser
}
