import User from "./userModel";
import Event from "./eventModel";
import Registration from "./registrationModel";
import Payment from "./paymentModel";
import Certification from "./certificationModel";

// * User - Registration
User.hasMany(Registration, {
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE',
  foreignKey: 'userId',
});
Registration.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// * Event - Registration
Event.hasMany(Registration, {
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE',
  foreignKey: 'eventId',
  as: 'registrations',
});
Registration.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });

// * Registration - Payment
Registration.hasOne(Payment, { foreignKey: 'registrationId', as: 'payment' });
Payment.belongsTo(Registration, { foreignKey: 'registrationId', as: 'registration' });

// * Registration - Certification
Registration.hasOne(Certification, { foreignKey: 'registrationId', as: 'certification' });
Certification.belongsTo(Registration, { foreignKey: 'registrationId', as: 'registration' });

export {
  User,
  Event,
  Registration,
  Payment,
  Certification,
}