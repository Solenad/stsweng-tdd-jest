const { addPost, updatePost } = require("../postController");
const postModel = require("../../models/post.js");
const { validationResult } = require("express-validator");

jest.mock("../../models/post", () => ({
  create: jest.fn(),
  // FAILING FUNCTION (non existent)
  update: jest.fn(),
}));

jest.mock("express-validator", () => ({
  validationResult: jest.fn(),
}));

describe("Post Controller", () => {
  let req, res;

  // clear mocks
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * sample jest it function here
   * template should be followed for the next tests
   */
  it("should add a new post", () => {
    // mock request for new post
    req = {
      body: { title: "Test post title", content: "Hello World!" },
      session: { user: "User1" },
      flash: jest.fn(),
    };
    res = {
      redirect: jest.fn(),
    };

    // mocking correct returns from these functions
    validationResult.mockReturnValue({ isEmpty: () => true });
    postModel.create.mockImplementation((data, cb) => cb(null, data));

    // run the function to be tested
    addPost(req, res);

    // expect results
    expect(postModel.create).toHaveBeenCalledWith(
      { title: "Test post title", content: "Hello World!" },
      expect.any(Function),
    );
    expect(res.redirect).toHaveBeenCalledWith("/posts");
  });

  it("should update a post", () => {
    // mock post
    const mockPost = {
      body: { id: "123", title: "Post title", content: "Hello World!" },
    };

    // mock request
    req = {
      params: { id: "123" },
      body: { title: "Updated post title", content: "Hello Weirdos!" },
      flash: jest.fn(),
    };
    res = {
      redirect: jest.fn(),
    };

    // mocking correct returns from these functions
    validationResult.mockReturnValue({ isEmpty: () => true });
    postModel.update.mockImplementation((id, data, cb) =>
      cb(null, { _id: id, ...data }),
    );

    // run the function to be tested
    updatePost(req, res);

    // expect results
    expect(postModel.update).toHaveBeenCalledWith(
      "123",
      { title: "Updated post title", content: "Hello Weirdos!" },
      expect.any(Function),
    );
    expect(res.redirect).toHaveBeenCalledWith("/posts");
  });
});
