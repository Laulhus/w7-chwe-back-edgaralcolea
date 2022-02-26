const { notFoundError, generalError } = require("../server/middlewares/errors");

describe("Given an notFoundError middleware", () => {
  describe("When it receives a response", () => {
    test("Then it should call the response status and json methods", () => {
      const res = {
        status: jest.fn(),
        json: jest.fn(),
      };

      notFoundError(null, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalled();
    });
  });
});

describe("Given a generalError middleware", () => {
  describe("When it receives an error and a response", () => {
    test("Then it should call the response status and json methods", () => {
      const res = {
        status: jest.fn(),
        json: jest.fn(),
      };
      const error = {
        code: 401,
        message: "Bad request",
      };
      const expectedError = { error: true, message: error.message };
      generalError(error, null, res);

      expect(res.status).toHaveBeenCalledWith(error.code);
      expect(res.json).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a response", () => {
    test("Then it should call the response status and json methods with errorcode 500 and errorMessage 'Internal server error'", () => {
      const res = {
        status: jest.fn(),
        json: jest.fn(),
      };
      const inputError = {
        code: null,
        message: "hola",
      };
      const expectedCode = 500;
      const expectedError = { error: true, message: "Internal server error" };
      generalError(inputError, null, res);

      expect(res.status).toHaveBeenCalledWith(expectedCode);
      expect(res.json).toHaveBeenCalledWith(expectedError);
    });
  });
});
