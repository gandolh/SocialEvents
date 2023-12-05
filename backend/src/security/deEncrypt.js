const bcrypt = require('bcrypt');

const saltRounds = 10;

async function hashPassword(password) {
    return await bcrypt.hash(password, saltRounds);
}

async function checkPassword(password, hash) {
    return await bcrypt.compare(password, hash);
}

const Security = {hashPassword, checkPassword};

module.exports = Security;