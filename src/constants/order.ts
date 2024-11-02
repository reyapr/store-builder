/* eslint-disable no-unused-vars */
export enum EOrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export const mapOrderStatusToColor: { [key: string]: string } = {
  [EOrderStatus.PENDING]: 'orange',
  [EOrderStatus.COMPLETED]: 'green',
  [EOrderStatus.FAILED]: 'red'
}

export const mapOrderStatusToMessage: { [key: string]: string } = {
  [EOrderStatus.PENDING]: 'Menunggu pembayaran',
  [EOrderStatus.COMPLETED]: 'Telah dibayar',
  [EOrderStatus.FAILED]: 'Gagal'
}

export enum ETimeFrame {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly'
}
