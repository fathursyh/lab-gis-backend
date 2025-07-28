import User from "./userModel";
import Event from "./eventModel";
import Registration from "./registrationModel";

// * hubungan user - registration
User.hasMany(Registration, {
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE',
  foreignKey: 'userId',
});

// * hubungan event - registration
Event.hasMany(Registration, {
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE',
  foreignKey: 'eventId',
  as: 'registrations'
});

// * hubungan registration - user
Registration.belongsTo(User, {
  foreignKey: 'userId',
});

// * hubungan registration - event
Registration.belongsTo(Event, {
  foreignKey: 'eventId',
  as: 'event'
});


export {
  User,
  Event,
  Registration,
}