const jwt = require("jsonwebtoken");
const User = require("../db/models/User");
const {
  userRegister,
  userLogin,
} = require("../server/controllers/userController");

describe("Given a userRegister controller", () => {
  describe("When it receives a response and a request with a valid user", () => {
    test("Then it should call the response json method with the created user", async () => {
      const user = {
        userName: "Testiarman",
        password: "testpass",
        name: "Testy",
        lastName: "McTest",
        age: 30,
        city: "Testingvania",
      };

      const req = {
        body: user,
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();
      User.findOne = jest.fn().mockResolvedValue(null);
      User.create = jest.fn().mockResolvedValue(req.body);

      await userRegister(req, res, next);

      expect(res.json).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(user);
    });
  });

  describe("When it receives a response and a request with an user that already exists", () => {
    test("Then it should call the response json method with the created user", async () => {
      const user = {
        userName: "Testiarman",
        password: "testpass",
        name: "Testy",
        lastName: "McTest",
        age: 30,
        city: "Testingvania",
      };
      const req = {
        body: user,
      };
      const error = new Error("This username already exists");
      const next = jest.fn();
      User.findOne = jest.fn().mockResolvedValue(user);
      User.create = jest.fn().mockResolvedValue(req.body);

      await userRegister(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("When it receives request with invalid data format", () => {
    test("Then it should call next with error 'Invalid data format'", async () => {
      const user = {
        userName: "Testman",
        name: "Testy",
        lastName: "McTest",
        age: 30,
        city: "Testingvania",
      };
      const req = {
        body: user,
      };
      const next = jest.fn();
      const error = new Error("Invalid data format");

      User.findOne = jest.fn().mockResolvedValue(null);
      User.create = jest.fn().mockResolvedValue(null);

      await userRegister(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("When it receives a request and database isn't connected", () => {
    test("Then it should call next method with an error: 'Couldn't create user", async () => {
      const next = jest.fn();
      const req = {
        body: { name: "Testman" },
      };
      const error = new Error("Couldn't create user");

      User.findOne = jest.fn().mockResolvedValue(null);
      User.create = jest.fn().mockRejectedValue(error);

      await userRegister(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a userLogin controller", () => {
  describe("When it receives a response with invalid username", () => {
    test("Then it should call next with error 'User not found'", async () => {
      const req = {
        body: {
          username: "Testman",
          password: "testpass",
        },
      };
      const next = jest.fn();
      const error = new Error("User not found");

      User.findOne = jest.fn().mockResolvedValue(null);

      await userLogin(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("When it receives a response with invalid password", () => {
    test("Then it should call next with error 'Invalid password'", async () => {
      const req = {
        body: {
          username: "Testman",
          password: "testpass",
        },
      };
      const next = jest.fn();
      const error = new Error("Invalid password");
      const user = {
        username: "Testman",
        password:
          "$2b$10$7uqVZ5a5QmeinnPp098Us.09BLm2xUGbB7fC4P8I4lq7n5KWadpRO",
      };

      User.findOne = jest.fn().mockResolvedValue(user);

      await userLogin(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("When it receives request with valid username amd password", () => {
    test("Then it should call json method of the received response", async () => {
      const req = {
        body: {
          username: "Testman",
          password: "testpass",
        },
      };
      const user = {
        username: "Testman",
        password:
          "$2b$10$RS6/Q3otj03mJnBDQfERY.c.AA4Y9iZFGVss/JqGoxy81q7eYKmqW",
      };
      const res = {
        json: jest.fn(),
      };

      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMWEwZGJhNjVhOTg0NmVmNWU0OGZmNiIsImlhdCI6MTY0NTk1MTM5M30.D1kyjfNYanzotgAwG3qZL95gjP2VpIH7gjrs5sgmdKg";
      User.findOne = jest.fn().mockResolvedValue(user);
      jwt.sign = jest.fn().mockResolvedValue(token);

      await userLogin(req, res);

      expect(res.json).toHaveBeenCalled();
    });
  });
});
