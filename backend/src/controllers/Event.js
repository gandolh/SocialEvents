const Events = require('../models/Event');
const Mailer = require('../functions/mail');

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Events.find(
      {}
    );
    res.status(200).json({
      status: 'OK',
      events
    });
  } catch (err) {
    res.status(500).json({
      status: 'ERR',
      message: err.message
    });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const event = await Events.findById(
      req.body.id
    ).exec();

    if(event) {
      res.status(200).json({
        status: 'OK',
        event
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

exports.createEvent = async (req, res) => {
  let pgBody = req.body;
  try {
    if (!pgBody.description) {
      pgBody.description = '';
    }
    if (!pgBody.attendees) {
      pgBody.attendees = [];
    }
    const event = new Events({      
      name: pgBody.name,
      host: pgBody.host,
      date: pgBody.date,
      description: pgBody.description,
      attendees: pgBody.attendees,
      location: pgBody.location,
      category: pgBody.category
    });

    const existing = await Events.findOne(
      {
        name: pgBody.name,
        host: pgBody.host,
        date: pgBody.date,
        description: pgBody.description,
        location: pgBody.location,
    }).exec();

    if(existing) {
      res.status(409).json({ status: 'ERR' });
      return;
    }

    const newEvent= await event.save();

    res.status(201).json({ messsage: 'OK' });

    // Send mail to child
    for (let i = 0; i < pgBody.attendees.length; i++) {
      Mailer.SendMail(pgBody.attendees[i].email, 
        "Social Planner - Event Invite",
        "<p>Salut, " + pgBody.attendees[i].name +
        "<br>Ai fost invitat la evenimentul " + "\"" + pgBody.name + "\"!" +
        "<ul>" +
        "<li>Host:" + pgBody.host + "</li>" +
        "<li>Data: " + pgBody.date + "</li>" +
        "<li>Locatie: " + pgBody.location + "</li>" +
        "<li>Descriere: " + pgBody.description + "</li>" +
        "</ul>" +
        "<br>Te asteptam la eveniment!" +
        "<br>Echipa Social Planner</p>"
      );
    }

  } catch (err) {
    res.status(500).json({
      status: 'ERR',
      message: err.message
    });
  }
}

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Events.findByIdAndDelete(
      req.body.id
    ).exec();

    if(event) {
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


exports.updateEvent = async (req, res) => {
  let pgBody = req.body;
  try {
    const event = await Events.findByIdAndUpdate(
      pgBody.id,
      {
        $set: {
          name: pgBody.name,
          host: pgBody.host,
          date: pgBody.date,
          description: pgBody.description,
          attendees: pgBody.attendees,
          location: pgBody.location,
          category: pgBody.category,
        }
      }).exec();
    
    if(event) {
      res.json({ status: 'OK' }); 
    } else {
      res.status(404).json({ status: 'ERR' }); 
    }
  } catch (err) {
    res.status(500).json({ 
      status: 'ERR',
      message: err.message
    }); 
  }
}