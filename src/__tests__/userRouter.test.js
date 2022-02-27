require("dotenv").config();
const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");
const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");
const connectDatabase = require("../db/connectDatabase");
const app = require("../server");
const User = require("../db/models/User");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const connectString = mongoServer.getUri();

  await connectDatabase(connectString);
});

beforeEach(async () => {
  const cryptPassword = await bcrypt.hash("testpass", 10);
  await User.create({
    name: "Testman",
    lastName: "McTest",
    userName: "Testman",
    password: cryptPassword,
    age: 30,
    city: "Testingvania",
  });
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Given a /users/login endpoint", () => {
  describe("When it receives a request with method POST and a valid username and password", () => {
    test("Then it should response with status 200 and a token", async () => {
      const user = {
        userName: "Testman",
        password: "testpass",
      };

      const { body } = await request(app)
        .post("/users/login")
        .send(user)
        .expect(200);

      expect(body).toHaveProperty("token");
    });
  });

  describe("When it receives a request with method POST and a valid username and wrong password", () => {
    test("Then it should response with status 401 and an error", async () => {
      const user = {
        userName: "Testman",
        password: "testopass",
      };

      const { body } = await request(app)
        .post("/users/login")
        .send(user)
        .expect(401);

      expect(body).toHaveProperty("error");
    });
  });

  describe("When it receives a request with method POST and a wrong username", () => {
    test("Then it should response with status 404 and an error", async () => {
      const user = {
        userName: "Testoman",
        password: "testpass",
      };

      const { body } = await request(app)
        .post("/users/login")
        .send(user)
        .expect(404);

      expect(body).toHaveProperty("error");
    });
  });
});

describe("Given a /users/register endpoint", () => {
  describe("When it receives a request with method POST and a valid username and password", () => {
    test("Then it should response with status 201 and the created user", async () => {
      const user = {
        name: "Testman",
        lastName: "McTest",
        userName: "Testoman",
        password: "hola",
        age: 30,
        city: "Testingvania",
      };

      const { body } = await request(app)
        .post("/users/register")
        .send(user)
        .expect(201);

      expect(body).toHaveProperty("userName");
    });
  });
});
