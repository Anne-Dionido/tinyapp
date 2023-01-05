let randomString = function() {
  const inputArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  let randomStr = '';
  for (let i = 0; i <= 6; i++) {
    let randomNum = Math.floor(Math.random() * inputArr.length);
    randomStr = randomStr + inputArr[randomNum];
  }
  return randomStr;
};

// Helper function - find user in db with email address
const getUserByEmail = function(userEmail, users) {
  let foundUser = null;
  for (let key in users) {
    if (userEmail === users[key].email) {
      return users[key];
    }
  }
  return foundUser;
};

// Create an object of urldatabase objects with matching userID to id
const urlsForUser = function(id, urlDatabase) {
  const urlObject = {};
  for (let key in urlDatabase) {
    if (urlDatabase[key].userID === id) {
      const valueObj = {
        longURL: urlDatabase[key].longURL,
        userID: urlDatabase[key].userID
      };
      urlObject[key] = valueObj;
    }
  }
  return urlObject;
};

module.exports = { randomString, getUserByEmail, urlsForUser };