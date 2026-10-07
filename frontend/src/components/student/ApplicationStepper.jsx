
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
        <div className="w-full overflow-x-auto pb-2">

            <div className="flex min-w-[850px] items-start gap-2 py-2 sm:min-w-0">

                {steps.map((step, index) => {

                    const stepNumber = index + 1;

                    const completed = stepNumber < currentStep;
                    const active = stepNumber === currentStep;

                    return (
                        <div
                            className="flex min-w-0 flex-1 flex-col items-center"
                            key={step}
                        >

                            {/* Step Title */}
                            <div
                                className={`
                                    mb-4
                                    flex
                                    h-10
                                    items-center
                                    justify-center
                                    px-1
                                    text-center
                                    text-xs
                                    font-semibold
                                    leading-tight
                                    transition-colors
                                    duration-200
                                    sm:text-sm
                                    ${
                                        active
                                            ? "text-neutral-950"
                                            : completed
                                            ? "text-neutral-700"
                                            : "text-neutral-400"
                                    }
                                `}
                            >
                                {step}
                            </div>


                            {/* Circle + Line */}
                            <div className="flex w-full items-center">

                                {/* Circle */}
                                <div
                                    className={`
                                        flex
                                        h-8
                                        w-8
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-full
                                        text-xs
                                        font-bold
                                        transition-all
                                        duration-200
                                        ${
                                            completed
                                                ? "bg-black text-white"
                                                : active
                                                ? "bg-black text-white ring-4 ring-neutral-200"
                                                : "border-2 border-neutral-300 bg-white text-neutral-400"
                                        }
                                    `}
                                >
                                    {completed ? "✓" : stepNumber}
                                </div>


                                {/* Connecting Line */}
                                {index !== steps.length - 1 && (
                                    <div
                                        className={`
                                            h-1
                                            flex-1
                                            transition-colors
                                            duration-300
                                            ${
                                                completed
                                                    ? "bg-black"
                                                    : "bg-neutral-200"
                                            }
                                        `}
                                    />
                                )}

                            </div>

                        </div>
                    );

                })}

            </div>

        </div>
    );
};

export default ApplicationStepper;

