export type Update = {
  id: string
  userId: string
  text: string
  summary: string
  createdAt: string
}

export type CreateUpdateInput = {
  userId: string
  text: string
}
