export enum ENotiType {
  ORDER = "ORDER",
  SYSTEM = "SYSTEM",
  SUPPORT = "SUPPORT",
}

export enum EOrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PREPARING = "PREPARING",
  DELIVERING = "DELIVERING",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
}

export enum ECakeType {
  CHESECAKE = "CHESECAKE",
  BIRTHDAYCAKE = "BIRTHDAYCAKE",
  MOUSE = "MOUSE",
}

export enum EPayment {
  COD = "COD",
  VNPAY = "VNPAY",
}

export enum EPayStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export enum ECategory {
  CAKE = "CAKE",
  BREAD = "BREAD",
  COOKIE = "COOKIE",
  OTHER = "OTHER",
}

export enum EAddressType {
  HOME = "HOME",
  OFFICE = "OFFICE",
  SCHOOL = "SCHOOL",
}
