export enum EOrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export const mapOrderStatusToColor: {[key: string]: string} = {
  [EOrderStatus.PENDING]: "orange",
  [EOrderStatus.COMPLETED]: "green",
  [EOrderStatus.FAILED]: "red",
}

export enum ETimeFrame {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly'
}