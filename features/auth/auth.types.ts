export type RequestOtpPayload = {
  phone: string;
};

export type VerifyOtpPayload = {
  phone: string;
  code: string;
};
