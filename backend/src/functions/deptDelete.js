const Users = require('../models/User');

async function changeAllDeptsOnRemove(department) {
    try {
        const users = await Users.find({
            department: department
        }).exec();
        
        if (users) {
            users.forEach(user => {
                user.department = 'Guest';
                user.save();
            });
        }
    } catch (err) {
        console.log(err);
    }
};

module.exports = {changeAllDeptsOnRemove};