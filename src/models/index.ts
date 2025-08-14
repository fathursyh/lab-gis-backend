import User from "./userModel";
import Event from "./eventModel";
import Registration from "./registrationModel";
import Payment from "./paymentModel";

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
  as: 'user'
});

// * hubungan registration - event
Registration.belongsTo(Event, {
  foreignKey: 'eventId',
  as: 'event'
});

// * hubungan registration - payment
Registration.hasOne(Payment, {
  foreignKey: 'registrationId',
});

export {
  User,
  Event,
  Registration,
  Payment
}