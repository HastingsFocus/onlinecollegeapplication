const Select = ({
    label,
    name,
    value,
    onChange,
    options = [],
    required = false,
    disabled = false
}) => {

    return (
        <div>

            <label>
                {label}
                {required && " *"}
            </label>


            <select
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
            >

                <option value="">
                    Select {label}
                </option>


                {
                    options.map((option, index) => {

                        /*
                        ===============================
                        HANDLE OBJECT OPTIONS
                        ===============================
                        */

                        if(typeof option === "object"){

                            return (

                                <option
                                    key={option.value || index}
                                    value={option.value}
                                >
                                    {option.label}
                                </option>

                            );

                        }


                        /*
                        ===============================
                        HANDLE SIMPLE STRING OPTIONS
                        ===============================
                        */


                        return (

                            <option
                                key={option}
                                value={option}
                            >
                                {option}
                            </option>

                        );


                    })
                }


            </select>

        </div>
    );

};


export default Select;