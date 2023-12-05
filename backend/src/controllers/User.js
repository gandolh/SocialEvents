const Users = require('../models/User');
const Security = require('../security/deEncrypt');
const Mailer = require('../functions/mail');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await Users.find(
      {},
      {_id: 0, name: 1, email: 1, department: 1, isAdmin: 1, role: 1, notifications: 1}
    );
    res.status(200).json({
      status: 'OK',
      users: users
    });
  } catch (err) {
    res.status(500).json({
      status: 'ERR',
      message: err.message
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await Users.findOne(
      {email: req.body.email},                 
      {_id: 0, name: 1, email: 1, password: 1, department: 1, isAdmin: 1, role: 1, notifications: 1} 
    ).exec();

    if(user) {
      res.status(200).json({
        status: 'OK',
        user
      });
    } else {
      res.status(404).json({ status: 'ERR' });
    }
  } catch (err) {
    res.status(500).json({
      status: 'ERR',
      message: err.message 
    });
  }
};

exports.getUserDept = async (req, res) => {
  try {
    const user = await Users.find(
      {department: req.body.department},
      {_id: 0, name: 1, email: 1, department: 1, role: 1}
    ).exec();

    if(user) {
      res.status(200).json({ 
        status: 'OK',
        user 
      });
    } else {
      res.status(404).json({ status: 'ERR' });
    }
  } catch (err) {
    res.status(500).json({
      status: 'ERR',
      message: err.message
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const body = req.body;
    const user = await Users.findOne(
      {email: req.body.email},
      {_id: 0, name: 1, email: 1, password: 1}
    ).exec();

    if(await Security.checkPassword(body.password, user.password)) {
      res.status(200).json({
        status: 'OK',
        user
      });
    } else {
      res.status(404).json({ status: 'ERR' });
    }
  } catch (err) {
    res.status(500).json({
      status: 'ERR',
      message: err.message
    });
  }
};

exports.createUser = async (req, res) => {
  let pgBody = req.body;
  try {
    const user = new Users({      
      name: pgBody.name,
      email: pgBody.email,        
      password: await Security.hashPassword(pgBody.password)
    });

    const existing = await Users.findOne(
      {email: pgBody.email} 
    ).exec();

    if(existing) {
      res.status(409).json({ status: 'ERR' });
      return;
    }

    const newUser = await user.save();

    Mailer.SendMail(pgBody.email, 
      "Social Planner - Account",
      "<p>Salut " + pgBody.name + "," +
      "<br>Contul tau a fost creat cu succes!" +
      "<br>Te poti loga cu urmatoarele date:" +
      "<ul>" +
      "<li>Username: " + pgBody.email + "</li>" +
      "<li>Parola: " + pgBody.password + "</li>" +
      "</ul>" +
      "<br>Te asteptam pe site!" +
      "<br>Echipa Social Planner</p>"
    );

    res.status(201).json({ messsage: 'OK' });

  } catch (err) {
    res.status(500).json({
      status: 'ERR',
      message: err.message
    });
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const user = await Users.findOneAndDelete(
      {email: req.body.email}
    ).exec();

    if(user) {
      res.status(200).json( { status: 'OK' } );
    } else {
      res.status(404).json({ status: 'ERR' }); 
    }
  } catch (err) {
    res.status(500).json({
      message: 'ERR',
      status: err.message,
    });
  }
}

exports.updateUser = async (req, res) => {
  let pgBody = req.body;
  try {
    const userCheck = await Users.findOne(
      {email: pgBody.email}
    ).exec();

    if(await Security.checkPassword(pgBody.oldPassword, userCheck.password)) {
      const user = await Users.findOneAndUpdate(
        {email: pgBody.email},
        {
          $set: { password: await Security.hashPassword(pgBody.newPassword) }
        }).exec();
      if(user) {
        res.status(200).json({ status: 'OK' }); 
      } else {
        res.status(404).json({ status: 'ERR' }); 
      }
    } else {
      res.status(401).json({ status: 'ERR' });
    }
  } catch (err) {
    res.status(500).json({ 
      status: 'ERR',
      message: err.message
    }); 
  }
}

exports.updateUserDept = async (req, res) => {
  try {
    const user = await Users.findOneAndUpdate(
      {email: req.body.email},
      {
        $set: { department: req.body.department }
      }).exec();

    if(user) {
      res.status(200).json({ status: 'OK' }); 
    }
  } catch (err) {
    res.status(500).json({ 
      status: 'ERR',
      message: err.message
    });
  }
}

exports.updateUserName = async (req, res) => {
  try {
    const user = await Users.findOneAndUpdate(
      {email: req.body.email},
      {
        $set: { name: req.body.name }
      }).exec();

    if(user) {
      res.status(200).json({ status: 'OK' }); 
    }
  } catch (err) {
    res.status(500).json({ 
      status: 'ERR',
      message: err.message
    });
  }
}

exports.updateUserNotifications = async (req, res) => {
  try {
    const user = await Users.findOneAndUpdate(
      {email: req.body.email},
      {
        $set: { notifications: req.body.notifs }
      }).exec();

    if(user) {
      res.status(200).json({ status: 'OK' }); 
    }
  } catch (err) {
    res.status(500).json({ 
      status: 'ERR',
      message: err.message
    });
  }
}