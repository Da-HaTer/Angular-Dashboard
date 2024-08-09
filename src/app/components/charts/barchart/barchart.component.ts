import { Component, Input, ViewChild } from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions,
  ApexTitleSubtitle
} from "ng-apexcharts";
import { title } from "process";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};
@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrl: './barchart.component.scss'
})
export class BarchartComponent {
  @ViewChild("chart") chart: ChartComponent | undefined;
  @Input() public chartOptions: Partial<ChartOptions> | any;
  @Input() public data: {columns: Array<string>, data: Array<number>} = {
    columns: [
      "South Korea",
      "Canada",
      "United Kingdom",
      "Netherlands",
      "Italy",
      "France",
      "Japan",
      "United States",
      "China",
      "Germany"
    ],
    data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
  };
  constructor() {
    this.chartOptions = {
      series: [
        {
          name: "basic",
          data: this.data.data
        }
      ],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      dataLabels: {
        enabled: true
      },
      xaxis: {
        categories: this.data.columns
      }
    };
  }
}