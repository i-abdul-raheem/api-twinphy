const Response = require("./Response");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User: UserModel } = require("../models");

class Auth extends Response {
  createProfile = async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        userName,
        avatar,
        email,
        password,
        gender,
        dateOfBirth,
        city,
        country,
      } = req.body;

      const user = await UserModel.findOne({ email });

      if (user) {
        return this.sendResponse(res, {
          message: "User with same email already exist",
          data: {
            user: email,
          },
          status: 302,
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new UserModel({
        firstName,
        lastName,
        userName,
        avatar,
        email,
        password: hashedPassword,
        gender,
        dateOfBirth,
        location: {
          city,
          country,
        },
      });
      await newUser.save();

      console.log(newUser);

      // Create a JWT token
      const token = jwt.sign(
        { userName: newUser.userName, email: newUser.email },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );
      return this.sendResponse(res, {
        message: "User Added successfully",
        data: {
          user: newUser,
          token,
        },
        status: 201,
      });
    } catch (err) {
      return this.sendResponse(res, {
        message: "User Not Added!",
        data: err,
        status: 500,
      });
    }
  };

  login = async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await UserModel.findOne({ email: email });
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (user === null) {
        return this.sendResponse(res, {
          message: "Email not found",
          status: 404,
        });
      } else if (email === user.email && passwordMatch) {
        const token = jwt.sign(
          { email: email, id: user._id },
          process.env.SECRET_KEY,
          { expiresIn: "10m" }
        );

        return this.sendResponse(res, {
          message: "logged IN",
          data: { token, user },
          status: 202,
        });
      } else {
        return this.sendResponse(res, {
          message: "check your email and password",
          data: { token, user },
          status: 401,
        });
      }
    } catch (err) {
      return this.sendResponse(res, {
        message: "Internal server error!",
        data: err,
        status: 500,
      });
    }
  };

  refresh = async (req, res) => {
    const getToken = req.headers.authorization?.split(' ')[1]; //'Bearer <token>'
    if (!getToken) {
      return res.status(403).json({
        message: 'No token provided!',
      });
    }
  
    const userDecoded= jwt.verify(getToken, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: 'Failed to authenticate token!',
        });
      }
      return decoded;
    });

    const token = jwt.sign(
      { email: userDecoded.email, id: userDecoded.id },
      process.env.SECRET_KEY,
      { expiresIn: "10m" }
    );

    return this.sendResponse(res, {
      data: { token },
      status: 202,
    });
  };
}

module.exports = {
  Auth,
};
