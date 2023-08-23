import { Driver } from "./driver.model";

export interface LapDataDetail {
  lapNumber: number;
  driver: Driver;
  lapTime: string;
  compound: string;
  deleted: boolean;
  deletedReason: string;
  tyreLife: string;
  stint: number;
  sector1Time: string;
  sector2Time: string;
  sector3Time: string;
  telemetryData: TelemetryData[];
}

export interface TelemetryData {
  timestamp: string;
  x: number;
  y: number;
  z: number;
  status: string;
  throttle: number;
  brake: boolean;
  speed: number;
  gear: number;
  rpm: number;
  drs: DRSStatus;
  distance: number;
}

export enum DRSStatus {
  OFF = 0,
  OFF_ALT = 1,
  UNKNOWN_2 = 2,
  UNKNOWN_3 = 3,
  ELIGIBLE_ACTIVATION_ZONE = 8,
  ON_10 = 10,
  ON_12 = 12,
  ON_14 = 14
}

