export const motivation = {
  id: true,
  textResponse: true,
  option: {
    select: { label: true, id: true },
  },
};

export const cookieName = "otp_code_session";

/**
 * @constant
 * OTP code validity period, after this period otp code expired
 */
export const validityPeriodOtpCodeInSecond = 10 * 60;

export const cookieMaxAge = validityPeriodOtpCodeInSecond + 2 * 60;

/**
 * @constant
 * length a otp code
 */
export const lengthOtpCode = 4;

/**
 * @constant
 * Number of allowed attempts for an OTP code
 */
export const nbAttempts = 5;

// error messages
