import User from "./userModel";
import Project from "./projectModel";

// * hubungan user - project
User.hasOne(Project, {
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE',
  foreignKey: 'userId',
  as: 'project'
});

Project.belongsTo(User, {
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE',
  foreignKey: 'userId',
  as: 'user',
});

export {
  User,
  Project
}