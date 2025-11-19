const bcrypt = require("bcryptjs");

async function generateHash() {
  const password = "superadmin"; // Replace with your desired password
  const saltRounds = 10;

  const hash = await bcrypt.hash(password, saltRounds);
  console.log("Hashed password:", hash);
}

generateHash();
