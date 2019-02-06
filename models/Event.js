const mongoose = require('mongoose');
const Services = require('./Service')
const User = require('./User')
const Bids = require('./Bid');

const eventSchema = mongoose.Schema({
    title: {type: String, require: true},
    location: {type: String, require: true},
    date: {type: Date},
    description: {type: String, require: true},
    services: [Bids.schema], // TBD if we need this imported or if this will just be a drop down
    servicesNeeded: [ {type: String} ],
    hostId: String, // need the hostId if you want to set bossId on bid creation
    budget: Number,
    image: String
})

// NOTE: want to set bossId on bid creation so that we can set proper access / restrictions on who 
// can accept or reject a bid 

const Event = mongoose.model('Event', eventSchema)
module.exports = Event;

