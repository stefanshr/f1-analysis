export interface TrackMap {
  track: TrackData[];
  corners: CornerData[];
}

export interface TrackData {
  x: number,
  y: number,
  z: number,
  distance: number
}

export interface CornerData {
  corner_number: string;
  text_position: number[];
  track_position: number[];
  distanceFromStart: number;
}
