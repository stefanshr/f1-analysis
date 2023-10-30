import { Component, Input, OnInit } from '@angular/core';
import { DRSStatus, LapDataDetail } from "../../models/lap-data-detail.model";
import { ApexOptions } from "ng-apexcharts";
import { SharedService } from "../../../../shared/services/shared.service";


@Component({
  selector: 'app-telemetry-analysis-component',
  templateUrl: './telemetry-analysis.component.html',
  styleUrls: ['./telemetry-analysis.component.scss']
})
export class TelemetryAnalysisComponent implements OnInit {

  @Input({required: true}) firstDriverData!: LapDataDetail;
  @Input({required: true}) secondDriverData!: LapDataDetail;

  public commonChartOptions: Partial<ApexOptions> = {};
  public speedChartOptions: Partial<ApexOptions> = {};
  public throttleChartOptions: Partial<ApexOptions> = {};
  public brakeChartOptions: Partial<ApexOptions> = {};
  public gearChartOptions: Partial<ApexOptions> = {};
  public drsChartOptions: Partial<ApexOptions> = {};

  showCharts: boolean = false;

  constructor(private sharedService: SharedService) {
  }

  ngOnInit(): void {
    this.initializeChartOptions();
    this.prepareChartData();
    setTimeout(() => {
      this.showCharts = true;
    }, 3000);
  }

  initializeChartOptions() {
    this.commonChartOptions = {
      chart: {
        type: 'line',
        height: 400,
        width: 800,
        foreColor: 'var(--text-color)',
        animations: {
          enabled: true,
          easing: 'easeout',
        },
        toolbar: {
          tools: {
            download: false,
          }
        },
        group: 'telemetryCharts'
      },
      xaxis: {
        labels: {
          show: false,
        },
        tooltip: {
          enabled: false
        },
        axisBorder: {
          show: true
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: 'var(--text-color)'
          }
        },
      },
      tooltip: {
        theme: 'dark',
        custom: ({series, seriesIndex, dataPointIndex, w}) => {
          const hoveredX = w.globals.seriesX[seriesIndex][dataPointIndex];
          const hoveredY = series[seriesIndex][dataPointIndex];

          const secondSeriesIndex = seriesIndex === 0 ? 1 : 0;
          const interpolatedY = this.interpolate(hoveredX, w.globals.seriesX[secondSeriesIndex], series[secondSeriesIndex]);

          const hoveredValue = seriesIndex === 0 ? hoveredY : interpolatedY;
          const otherDriverValue = seriesIndex === 0 ? interpolatedY : hoveredY;

          return `
            <div style="background-color: var(--surface-card); padding: 10px; border: 1px solid white; border-radius: 5px; color: var(--text-color);">
                ${this.firstDriverData.driver.lastName}: ${hoveredValue.toFixed(2)}
                <br>
                ${this.secondDriverData.driver.lastName}: ${otherDriverValue.toFixed(2)}
            </div>
          `;
        },
        x: {
          formatter: (distance: number) => {
            this.sharedService.updateTelemetryData(distance);
            return ""
          }
        }
      },
      stroke: {
        width: 2,
      },
      grid: {
        strokeDashArray: 5
      },
      legend: {
        show: false
      },
      markers: {
        size: 0,
        hover: {
          size: 0
        }
      }
    };
  }

  interpolate(x: number, xValues: number[], yValues: number[]): number {
    for (let i = 0; i < xValues.length - 1; i++) {
      if (xValues[i] <= x && x <= xValues[i + 1]) {
        return yValues[i] + (x - xValues[i]) * (yValues[i + 1] - yValues[i]) / (xValues[i + 1] - xValues[i]);
      }
    }
    return NaN; // or some fallback value
  }


  prepareChartData() {
    this.speedChartOptions = {
      ...this.commonChartOptions,
      series: this.getSeries('speed'),
      chart: {
        ...this.commonChartOptions.chart!,
        height: 400,
        id: 'speed-chart',
      },
      stroke: {
        ...this.commonChartOptions.stroke!,
        curve: 'smooth',
        colors: this.getStrokeColor()
      },
      yaxis: {
        title: {
          text: 'Speed',
          style: {
            fontSize: '22px'
          },
        }
      }
    };
    this.throttleChartOptions = {
      ...this.commonChartOptions,
      series: this.getSeries('throttle'),
      chart: {
        ...this.commonChartOptions.chart!,
        height: 300,
        id: 'throttle-chart',
      },
      stroke: {
        ...this.commonChartOptions.stroke!,
        curve: 'smooth',
        colors: this.getStrokeColor()
      },
      yaxis: {
        min: 0,
        max: 100,
        tickAmount: 5,
        title: {
          text: 'Throttle',
          style: {
            fontSize: '22px'
          },
        }
      }
    };
    this.brakeChartOptions = {
      ...this.commonChartOptions,
      series: this.getSeries('brake'),
      chart: {
        ...this.commonChartOptions.chart!,
        height: 200,
        id: 'brake-chart',
      },
      stroke: {
        ...this.commonChartOptions.stroke!,
        curve: 'stepline',
        colors: this.getStrokeColor()
      },
      yaxis: {
        min: 0,
        max: 1,
        tickAmount: 1,
        title: {
          text: 'Brake',
          style: {
            fontSize: '22px'
          },
        }
      }
    };
    this.gearChartOptions = {
      ...this.commonChartOptions,
      series: this.getSeries('gear'),
      chart: {
        ...this.commonChartOptions.chart!,
        height: 300,
        id: 'gear-chart',
      },
      stroke: {
        ...this.commonChartOptions.stroke!,
        curve: 'stepline',
        colors: this.getStrokeColor()
      },
      yaxis: {
        title: {
          text: 'Gear',
          style: {
            fontSize: '22px'
          },
        }
      }
    };
    this.drsChartOptions = {
      ...this.commonChartOptions,
      series: this.getSeries('drs'),
      chart: {
        ...this.commonChartOptions.chart!,
        height: 200,
        id: 'drs-chart',
      },
      stroke: {
        ...this.commonChartOptions.stroke!,
        curve: 'stepline',
        colors: this.getStrokeColor()
      },
      yaxis: {
        title: {
          text: 'DRS',
          style: {
            fontSize: '22px'
          },
        }
      },
      xaxis: {
        ...this.commonChartOptions.xaxis!,
        title: {
          text: 'Distance',
          style: {
            fontSize: '22px'
          },
        }
      },
      tooltip: {
        ...this.commonChartOptions.tooltip!,
        custom: ({series, seriesIndex, dataPointIndex, w}) => {
          const hoveredX = w.globals.seriesX[seriesIndex][dataPointIndex];
          const hoveredY = series[seriesIndex][dataPointIndex];

          const secondSeriesIndex = seriesIndex === 0 ? 1 : 0;
          const interpolatedY = this.interpolate(hoveredX, w.globals.seriesX[secondSeriesIndex], series[secondSeriesIndex]);

          const hoveredValue = seriesIndex === 0 ? hoveredY : interpolatedY;
          const otherDriverValue = seriesIndex === 0 ? interpolatedY : hoveredY;

          return `
            <div style="background-color: var(--surface-card); padding: 10px; border: 1px solid white; border-radius: 5px; color: var(--text-color);">
                ${this.firstDriverData.driver.lastName}: ${DRSStatus[hoveredValue]}
                <br>
                ${this.secondDriverData.driver.lastName}: ${DRSStatus[otherDriverValue]}
            </div>
          `;
        },
      }
    };
  }

  getSeries(key: string) {
    const firstDriverDataSeries = this.firstDriverData.telemetryData.map(telemetry => ({
      x: telemetry.distance,
      y: Number((telemetry as any)[key])
    }));

    const firstDriverSeriesData = {
      name: this.firstDriverData.driver.lastName,
      data: firstDriverDataSeries
    };

    const secondDriverDataSeries = this.secondDriverData.telemetryData.map(telemetry => ({
      x: telemetry.distance,
      y: Number((telemetry as any)[key])
    }));

    const secondDriverSeriesData = {
      name: this.secondDriverData.driver.lastName,
      data: secondDriverDataSeries
    };

    return [firstDriverSeriesData, secondDriverSeriesData];
  }

  getStrokeColor() {
    if (this.firstDriverData.driver.teamColor === this.secondDriverData.driver.teamColor) {
      return [this.firstDriverData.driver.teamColor, '#FFF'];
    } else {
      return [this.firstDriverData.driver.teamColor, this.secondDriverData.driver.teamColor];
    }
  }
}
