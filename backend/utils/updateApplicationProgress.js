export const updateApplicationProgress = (
  application,
  progressField
) => {

  application.progress[progressField] = true;

  // Student is active, reset reminder timer
  application.lastActivity = new Date();

};