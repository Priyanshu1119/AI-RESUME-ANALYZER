const UserModel = require('../Models/user');

const login = async (req, res) => {
    try {
        const { userInfo } = req.body;

        let user = await UserModel.findOne({ email: userInfo.email });

        if (!user) {
            user = await UserModel.create({
                email: userInfo.email,
                name: userInfo.name,
                photoUrl: userInfo.photo,
                role: "user"
            });
        }

        res.status(200).json({ message: "Login Successful", user });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Something Went Wrong" });
    }
}

module.exports = { login };