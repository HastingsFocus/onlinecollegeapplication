
const PaymentMethod = ({ methods, selected, setSelected }) => {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {methods.map((method) => {
                const isSelected = selected === method.id;

                return (
                    <button
                        key={method.id}
                        type="button"
                        onClick={() => setSelected(method.id)}
                        className={`
                            w-full rounded-xl border p-5 text-left
                            transition-all duration-200
                            ${
                                isSelected
                                    ? "border-black bg-black text-white shadow-md"
                                    : "border-neutral-200 bg-white text-neutral-900 hover:border-neutral-400 hover:bg-neutral-50"
                            }
                        `}
                    >
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h3 className="text-sm font-semibold">
                                    {method.name}
                                </h3>

                                <p
                                    className={`mt-1 text-xs ${
                                        isSelected
                                            ? "text-neutral-300"
                                            : "text-neutral-500"
                                    }`}
                                >
                                    Pay using {method.name}
                                </p>
                            </div>

                            <div
                                className={`
                                    flex h-5 w-5 shrink-0 items-center
                                    justify-center rounded-full border
                                    ${
                                        isSelected
                                            ? "border-white bg-white"
                                            : "border-neutral-300 bg-white"
                                    }
                                `}
                            >
                                {isSelected && (
                                    <div className="h-2.5 w-2.5 rounded-full bg-black" />
                                )}
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
};

export default PaymentMethod;

