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
  protocol?: 'http' | 'grpc'
}

export type PerformanceMetrics = {
  http?: {
    startTime: number
    endTime: number
    duration: number
  }
  grpc?: {
    startTime: number
    endTime: number
    duration: number
  }
}

export type ProtocolType = 'http' | 'grpc' | 'both'
