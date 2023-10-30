import { LapDataDetail } from "./lap-data-detail.model";

export interface DriversDataDetail {
  firstLapData: LapDataDetail,
  secondLapData: LapDataDetail,
  fasterDriverBySegment: FasterDriverBySegment[]
}

export interface FasterDriverBySegment {
  fasterDriver: number
  firstDriverIndices: DriverIndices,
  secondDriverIndices: DriverIndices
}

interface DriverIndices {
  start: number,
  end: number
}
