import { Component } from '@angular/core';
import { TrackMap } from "../../models/track-map.model";
import { SharedService } from "../../../../shared/services/shared.service";
import * as d3 from "d3";
import { LapDataDetail } from "../../models/lap-data-detail.model";

@Component({
  selector: 'app-track-map',
  templateUrl: './track-map.component.html',
  styleUrls: ['./track-map.component.scss']
})
export class TrackMapComponent {
  private trackMap: TrackMap = {track: [], corners: []};

  constructor(private sharedService: SharedService) {
    this.sharedService.telemetryData$.subscribe(distance => {
      if (distance !== null) {
        this.drawSelectedPosition(distance);
      }
    });
  }

  drawTrackMap(trackMapData: TrackMap) {

    d3.select('#trackMap').selectAll("*").remove();

    this.trackMap = trackMapData

    const svg = d3.select('#trackMap');
    const trackData = trackMapData.track;
    const cornerData = trackMapData.corners;

    const xExtent = d3.extent(trackData, d => d.x);
    const yExtent = d3.extent(trackData, d => d.y);

    if (xExtent[0] === undefined || xExtent[1] === undefined || yExtent[0] === undefined || yExtent[1] === undefined) {
      console.error('Data extents are not defined correctly.');
      return;
    }

    const trackWidth = xExtent[1] - xExtent[0];
    const trackHeight = yExtent[1] - yExtent[0];
    const width = +svg.attr('width');
    const scaledTrackHeight = (width / trackWidth) * trackHeight;

    svg.attr('height', scaledTrackHeight + 150);

    const height = +svg.attr('height');
    const padding = 50;

    const scalingFactor = Math.min(
      (width - 2 * padding) / (xExtent[1] - xExtent[0]),
      (height - 2 * padding) / (yExtent[1] - yExtent[0])
    );

    const xScale = d3.scaleLinear()
      .domain([xExtent[0] as number, xExtent[1] as number])
      .range([padding, padding + scalingFactor * (xExtent[1] - xExtent[0])]);

    const yScale = d3.scaleLinear()
      .domain([yExtent[0] as number, yExtent[1] as number])
      .range([height - padding, height - padding - scalingFactor * (yExtent[1] - yExtent[0])]);

    const lineGenerator = d3.line<{ x: number, y: number }>()
      .x(d => xScale(d.x) as number)
      .y(d => yScale(d.y) as number)
      .curve(d3.curveLinearClosed);

    const path = svg.append("path")
      .datum(trackData)
      .attr("fill", "none")
      .attr("stroke", "#FFFFFF")
      .attr("stroke-width", 14)
      .attr("d", lineGenerator as any);

    const totalLength = (path.node() as any).getTotalLength();

    path.attr("stroke-dasharray", `${totalLength} ${totalLength}`)
      .attr("stroke-dashoffset", totalLength);

    const animationDuration = 2000;

    path.transition()
      .duration(animationDuration)
      .ease(d3.easeCubicInOut)
      .attr("stroke-dashoffset", 0);

    const distance = (x1: number, y1: number, x2: number, y2: number) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

    let runningDistance = 0;

    const startingPoint = (path.node() as any).getPointAtLength(0);

    cornerData.forEach((corner, index) => {
      if (index === 0) {
        runningDistance += distance(startingPoint.x, startingPoint.y, xScale(corner.track_position[0]) as number, yScale(corner.track_position[1]) as number);
      } else {
        runningDistance += distance(xScale(cornerData[index - 1].track_position[0]) as number, yScale(cornerData[index - 1].track_position[1]) as number, xScale(corner.track_position[0]) as number, yScale(corner.track_position[1]) as number);
      }
      corner.distanceFromStart = runningDistance;
    });

    cornerData.forEach(corner => {

      const delayTime = this.findTimeToReachDistance(corner.distanceFromStart, totalLength, animationDuration);

      svg.append("circle")
        .attr("cx", xScale(corner.text_position[0]))
        .attr("cy", yScale(corner.text_position[1]))
        .attr("r", 13)
        .attr("fill", "#FFFFFF")
        .attr("opacity", 0)
        .transition()
        .delay(delayTime)
        .attr("opacity", 1);

      svg.append("text")
        .attr("x", xScale(corner.text_position[0]))
        .attr("y", yScale(corner.text_position[1]))
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .attr("fill", "#000b18")
        .attr("opacity", 0)
        .text(corner.corner_number)
        .transition()
        .delay(delayTime)
        .attr("opacity", 1);
    });
  }

  findTimeToReachDistance(distance: number, totalLength: number, animationDuration: number): number {
    const normalizedDistance = distance / totalLength;

    let tGuess = normalizedDistance;

    const epsilon = 1e-5;

    for (let i = 0; i < 100; ++i) {
      const functionValue = (3 * tGuess ** 2 - 2 * tGuess ** 3) - normalizedDistance;
      const derivativeValue = 6 * tGuess - 6 * tGuess ** 2;

      const tNext = tGuess - functionValue / derivativeValue;

      if (Math.abs(tNext - tGuess) < epsilon) {
        break;
      }

      tGuess = tNext;
    }

    return tGuess * animationDuration;
  }

  drawDominanceMap(firstDriverLapData: LapDataDetail, secondDriverLapData: LapDataDetail,
                   year: number, venue: string, session: string) {
    const svg = d3.select('#trackMap');
    const width = +svg.attr('width');
    const height = +svg.attr('height');
    const padding = 50;

    if (!firstDriverLapData || !secondDriverLapData) {
      console.log('Lap data not initialized.');
      return;
    }

    const xExtent = d3.extent([...firstDriverLapData.telemetryData, ...secondDriverLapData.telemetryData], d => d.x) as [number, number];
    const yExtent = d3.extent([...firstDriverLapData.telemetryData, ...secondDriverLapData.telemetryData], d => d.y) as [number, number];

    const scalingFactor = Math.min(
      (width - 2 * padding) / (xExtent[1] - xExtent[0]),
      (height - 2 * padding) / (yExtent[1] - yExtent[0])
    );

    const xScale = d3.scaleLinear()
      .domain([xExtent[0] as number, xExtent[1] as number])
      .range([padding, padding + scalingFactor * (xExtent[1] - xExtent[0])]);

    const yScale = d3.scaleLinear()
      .domain([yExtent[0] as number, yExtent[1] as number])
      .range([height - padding, height - padding - scalingFactor * (yExtent[1] - yExtent[0])]);

    const telemetryPosData1 = this.calculateCumulativeDistance([...firstDriverLapData.telemetryData]);
    const telemetryPosData2 = this.calculateCumulativeDistance([...secondDriverLapData.telemetryData]);


    const numSegments = 25;
    const segmentDistance = Math.min(telemetryPosData1[telemetryPosData1.length - 1].cumulativeDistance, telemetryPosData2[telemetryPosData2.length - 1].cumulativeDistance) / numSegments;

    let startIdx1 = 0, startIdx2 = 0;

    let totalDelay = 0;
    const segmentDuration = 100;

    for (let i = 0; i < numSegments; i++) {
      const targetDistanceEnd = (i + 1) * segmentDistance;

      const endIdx1 = telemetryPosData1.findIndex(d => d.cumulativeDistance >= targetDistanceEnd);
      const endIdx2 = telemetryPosData2.findIndex(d => d.cumulativeDistance >= targetDistanceEnd);

      if (endIdx1 === -1 || endIdx2 === -1) {
        console.log(`Skipping segment ${i + 1} due to undefined index.`);
        continue;
      }

      const segment1 = telemetryPosData1.slice(startIdx1, endIdx1 + 1);
      const segment2 = telemetryPosData2.slice(startIdx2, endIdx2 + 1);

      const elapsed1 = parseFloat(segment1[segment1.length - 1].timestamp) - parseFloat(segment1[0].timestamp);
      const elapsed2 = parseFloat(segment2[segment2.length - 1].timestamp) - parseFloat(segment2[0].timestamp);

      const fasterDriver = elapsed1 < elapsed2 ? 'Driver 1' : 'Driver 2';

      const determineColor = (fasterDriver: string) => {
        if (firstDriverLapData.driver.teamColor === secondDriverLapData.driver.teamColor) {
          return fasterDriver === 'Driver 1' ? firstDriverLapData.driver.teamColor : '#000';
        } else {
          return fasterDriver === 'Driver 1' ? firstDriverLapData.driver.teamColor : secondDriverLapData.driver.teamColor;
        }
      };

      const color = determineColor(fasterDriver);

      const lineGenerator = d3.line<any>()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y));

      const path = svg.append('path')
        .datum(segment1)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 8)
        .attr('d', lineGenerator as any)
        .attr('stroke-dasharray', function () {
          return (this as any).getTotalLength();
        })
        .attr('stroke-dashoffset', function () {
          return (this as any).getTotalLength();
        });

      path.transition()
        .delay(totalDelay)
        .duration(segmentDuration)
        .attr('stroke-dashoffset', 0);

      startIdx1 = endIdx1;
      startIdx2 = endIdx2;

      totalDelay += segmentDuration;
    }

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .attr("fill", "#FFFFFF")
      .style("font-size", "26px")
      .text(`${year} | ${venue} | ${session}`);

    const legendColors = [
      {driver: firstDriverLapData.driver, color: firstDriverLapData.driver.teamColor},
      {
        driver: secondDriverLapData.driver,
        color: (firstDriverLapData.driver.teamColor === secondDriverLapData.driver.teamColor) ? '#000' : secondDriverLapData.driver.teamColor
      }
    ];

    const legendTemp = svg.append("g");

    legendTemp.selectAll("rect")
      .data(legendColors)
      .enter().append("rect")
      .attr("x", 0)
      .attr("y", (d, i) => i * 30)
      .attr("width", 20)
      .attr("height", 20)
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("fill", d => d.color)
      .attr("stroke", "#FFFFFF")
      .attr("stroke-width", 3);

    legendTemp.selectAll("image")
      .data([firstDriverLapData, secondDriverLapData])
      .enter().append("image")
      .attr('xlink:href', d => `/assets/tyres/${d.compound}.svg`)  // Replace with the actual path
      .attr("x", 30)
      .attr("y", (d, i) => i * 30)
      .attr("width", 20)
      .attr("height", 20);

    legendTemp.selectAll("text")
      .data([firstDriverLapData, secondDriverLapData])
      .enter().append("text")
      .attr("x", 60)
      .attr("y", (d, i) => i * 30 + 15)
      .attr("fill", "#FFFFFF")
      .style("font-size", "14px")
      .text(d => `${d.driver.driverNumber} - ${d.driver.lastName} | Lap ${d.lapNumber}: ${this.formatTime(d.lapTime)}`);

    const tempNode = legendTemp.node();
    let bbox;

    if (tempNode !== null) {
      bbox = tempNode.getBBox();
    } else {
      console.error("Failed to calculate bounding box for legend");
      return;
    }

    legendTemp.remove();

    const legend = svg.append("g")
      .attr("transform", `translate(${(width - bbox.width) / 2}, 60)`);


    legend.selectAll("rect")
      .data(legendColors)
      .enter().append("rect")
      .attr("x", 0)
      .attr("y", (d, i) => i * 30)
      .attr("width", 20)
      .attr("height", 20)
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("fill", d => d.color)
      .attr("stroke", "#FFFFFF")
      .attr("stroke-width", 3);

    legend.selectAll("image")
      .data([firstDriverLapData, secondDriverLapData])
      .enter().append("image")
      .attr('xlink:href', d => `/assets/tyres/${d.compound}.svg`)  // Replace with the actual path
      .attr("x", 30)
      .attr("y", (d, i) => i * 30)
      .attr("width", 20)
      .attr("height", 20);

    legend.selectAll("text")
      .data([firstDriverLapData, secondDriverLapData])
      .enter().append("text")
      .attr("x", 60)
      .attr("y", (d, i) => i * 30 + 15)
      .attr("fill", "#FFFFFF")
      .style("font-size", "14px")
      .text(d => `${d.driver.driverNumber} - ${d.driver.lastName} | Lap ${d.lapNumber}: ${this.formatTime(d.lapTime)}`);
  }

  formatTime(value: number | string): string {
    const totalSeconds = parseFloat(value.toString());
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const milliseconds = ((totalSeconds % 1) * 1000).toFixed(0);
    return `${minutes}:${seconds}.${milliseconds}`;
  }

  calculateCumulativeDistance(data: any[]) {
    let cumulativeDistance = 0;
    for (let i = 1; i < data.length; i++) {
      const dx = data[i].x - data[i - 1].x;
      const dy = data[i].y - data[i - 1].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      cumulativeDistance += distance;
      data[i].cumulativeDistance = cumulativeDistance;
    }
    return data;
  }

  drawSelectedPosition(distance: number) {
    const svg = d3.select('#trackMap')
    let circle = svg.select(".position-circle") as d3.Selection<SVGCircleElement, unknown, HTMLElement, any>;

    if (circle.empty()) {
      circle = svg.append("circle")
        .attr("class", "position-circle")
        .attr("r", 4)
        .attr("fill", "#FFF");
    }

    const nearestPoint = this.getCoordinatesatDistance(distance);

    const trackData = this.trackMap.track;

    const xExtent = d3.extent(trackData, d => d.x);
    const yExtent = d3.extent(trackData, d => d.y);

    if (xExtent[0] === undefined || xExtent[1] === undefined || yExtent[0] === undefined || yExtent[1] === undefined) {
      console.error('Data extents are not defined correctly.');
      return;
    }

    const trackWidth = xExtent[1] - xExtent[0];
    const trackHeight = yExtent[1] - yExtent[0];
    const width = +svg.attr('width');
    const scaledTrackHeight = (width / trackWidth) * trackHeight;

    svg.attr('height', scaledTrackHeight + 150);

    const height = +svg.attr('height');
    const padding = 50;

    const scalingFactor = Math.min(
      (width - 2 * padding) / (xExtent[1] - xExtent[0]),
      (height - 2 * padding) / (yExtent[1] - yExtent[0])
    );

    const xScale = d3.scaleLinear()
      .domain([xExtent[0] as number, xExtent[1] as number])
      .range([padding, padding + scalingFactor * (xExtent[1] - xExtent[0])]);

    const yScale = d3.scaleLinear()
      .domain([yExtent[0] as number, yExtent[1] as number])
      .range([height - padding, height - padding - scalingFactor * (yExtent[1] - yExtent[0])]);

    circle.transition()
      .duration(150)
      .attr("cx", xScale(nearestPoint.x))
      .attr("cy", yScale(nearestPoint.y));
  }

  getCoordinatesatDistance(distance: number) {
    return this.trackMap.track.reduce((nearestPoint, currentPoint) => {
      const nearestDistance = Math.abs(nearestPoint.distance - distance);
      const currentDistance = Math.abs(currentPoint.distance - distance);

      return currentDistance < nearestDistance ? currentPoint : nearestPoint;
    }, this.trackMap.track[0]);
  }
}
