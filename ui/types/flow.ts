// enum with all the possible flow types for entering address and showing qr code for unregistered users
export enum QUICKSTART_PROGRESS {
  // start
  START = "start",
  ENTER_BUSINESS_NAME = "enter_business_name",
  ENTER_ADDRESS = "enter_address",
  SHOW_QR_CODE = "show_qr_code",
}

export enum SETUP_PROGRESS {
  // start
  START = "start",
  ENTER_BUSINESS_NAME = "enter_business_name",
  ENTER_PHONE_NUMBER = "enter_phone_number",
  REVIEW = "review",
}

export enum PAYMENT_PROGRESS {
  // start
  START = "start",
  ENTER_RECEIVER = "enter_receiver",
  ENTER_AMOUNT = "enter_amount",
  REVIEW = "review",
}
