import crypto from "crypto";

const generateActivationToken = () => {

    return crypto
        .randomBytes(32)
        .toString("hex");

};

export default generateActivationToken;