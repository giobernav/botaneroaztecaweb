import { totp } from "otplib";

totp.options = { digits: 6, step: 60, window: 2 };

export default totp;
