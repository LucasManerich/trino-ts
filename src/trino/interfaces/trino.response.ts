export type QueryStage = {
  stageId: string
  state: string
  done: boolean
  nodes: number
  totalSplits: number
  queuedSplits: number
  runningSplits: number
  completedSplits: number
  cpuTimeMillis: number
  wallTimeMillis: number
  processedRows: number
  processedBytes: number
  physicalInputBytes: number
  failedTasks: number
  coordinatorOnly: boolean
  subStages: QueryStage[]
}

export interface QueryStats {
  state: string;
  queued: boolean;
  scheduled: boolean;
  nodes: number;
  totalSplits: number;
  queuedSplits: number;
  runningSplits: number;
  completedSplits: number;
  cpuTimeMillis: number;
  wallTimeMillis: number;
  queuedTimeMillis: number;
  elapsedTimeMillis: number;
  processedRows: number;
  processedBytes: number;
  physicalInputBytes: number;
  peakMemoryBytes: number;
  spilledBytes: number;
  rootStage: QueryStage;
  progressPercentage: number;
}

export type QueryFailureInfo = {
  type: string
  message: string
  suppressed: string[]
  stack: string[]
}

export type QueryError = {
  message: string;
  errorCode: number;
  errorName: string;
  errorType: string;
  failureInfo: QueryFailureInfo;
}

export interface TrinoResponse<T = any> {
  id: string;
  infoUri: string
  nextUri: string
  stats?: QueryStats
  data?: T[]
  columns?: Column[]
  warnings?: string[]
  error?: QueryError
}

export interface Column {
  name: string;
  type: string;
  typeSignature: TypeSignature;
}

export interface TypeSignature {
  rawType: string;
  arguments: TypeArgument[];
}

export interface TypeArgument {
  kind: string;
  value?: number | TypeSignature;
}