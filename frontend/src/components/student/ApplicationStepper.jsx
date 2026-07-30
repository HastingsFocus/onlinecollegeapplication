import "./ApplicationStepper.css";

const steps = [
    "Personal",
    "Contact",
    "Next of Kin",
    "Academics",
    "Programs",
    "Documents",
    "Review",
    "Payment",
    "Submit Application"
];

const ApplicationStepper = ({ currentStep }) => {

    return (

        <div className="stepper">

            {steps.map((step, index) => {

                const stepNumber = index + 1;

                const completed = stepNumber < currentStep;

                const active = stepNumber === currentStep;

                return (

                    <div
                        className="step"
                        key={step}
                    >

                        <div className="step-title">

                            {step}

                        </div>

                        <div className="step-bottom">

                            <div
                                className={`circle
                                ${completed ? "completed" : ""}
                                ${active ? "active" : ""}`}
                            >

                                {
                                    completed
                                        ? "✓"
                                        : ""
                                }

                            </div>

                            {

                                index !== steps.length - 1 && (

                                    <div
                                        className={`line
                                        ${completed ? "completed-line" : ""}`}
                                    />

                                )

                            }

                        </div>

                    </div>

                );

            })}

        </div>

    );

};

export default ApplicationStepper;