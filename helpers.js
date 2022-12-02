const getUserByEmail = (email, database) => {
  let user = null
  for (let ids in database){
    if (email === database[ids].email) {
      user = database[ids]
    } 
  }
  return user;
}

module.exports = getUserByEmail;