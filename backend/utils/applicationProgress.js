export const getNextIncompleteStep = (progress) => {

  if (!progress.personalCompleted) {
    return {
      step: "Personal Information",
      route: "/student/application/personal",
      message:
        "You started your application but have not completed your personal information yet."
    };
  }


  if (!progress.contactCompleted) {
    return {
      step: "Contact Information",
      route: "/student/application/contact",
      message:
        "Your personal information is complete. Please continue with your contact information."
    };
  }


  if (!progress.nextOfKinCompleted) {
    return {
      step: "Next of Kin",
      route: "/student/application/next-of-kin",
      message:
        "Your contact information is complete. The next step is adding your next of kin details."
    };
  }


  if (!progress.academicCompleted) {
    return {
      step: "Academic Information",
      route: "/student/application/academic",
      message:
        "Please provide your academic background to continue your application."
    };
  }


  if (!progress.programCompleted) {
    return {
      step: "Program Selection",
      route: "/student/application/programs",
      message:
        "Your next step is selecting your preferred programs."
    };
  }


  if (!progress.documentsCompleted) {
    return {
      step: "Document Upload",
      route: "/student/application/documents",
      message:
        "Please upload your required supporting documents."
    };
  }


  return {
    step: "Review and Submit",
    route: "/student/application/review",
    message:
      "Your application is complete. Please review and submit it."
  };

};