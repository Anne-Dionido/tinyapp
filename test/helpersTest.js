const { assert } = require('chai');

let { randomString, getUserByEmail, urlsForUser } = require('../helpers');

const testUsers = {
  "userRandomID1": {
    id: "userRandomID1",
    email: "user1@example.com",
    password: "red-ocean-elephant"
  },
  "userRandomID2": {
    id: "userRandomID2",
    email: "user2@example.com",
    password: "cute-cat"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user1@example.com", testUsers);
    const expectedUserID = "userRandomID1";

    assert.equal(user.id, expectedUserID);

  });

  it('should return undefined with an email that is not in our database', function() {
    const user = getUserByEmail("noemail@example.com", testUsers);
    const expectedUserID = null;

    assert.equal(user, expectedUserID);

  });
});
