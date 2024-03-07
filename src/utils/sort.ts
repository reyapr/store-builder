
export const sortByCreatedAt = (a: any, b: any) =>
  new Date(a.createdAt) > new Date(b.createdAt) ? 1 : -1;