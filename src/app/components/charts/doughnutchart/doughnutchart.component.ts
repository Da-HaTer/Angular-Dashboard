import { Component, Input, ViewChild } from "@angular/core";
import { ChartComponent } from "ng-apexcharts";

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexFill,
  ApexDataLabels,
  ApexLegend,
  ApexTitleSubtitle
} from "ng-apexcharts";
import { title } from "process";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  fill: ApexFill;
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle
  colors: string[];
};

@Component({
  selector: 'app-doughnutchart',
  templateUrl: './doughnutchart.component.html',
  styleUrl: './doughnutchart.component.scss'
})
export class DoughnutchartComponent {
  @ViewChild("chart") chart: ChartComponent | any;
  @Input() public chartOptions: Partial<ChartOptions> | any;

  constructor() {
    this.chartOptions = {
      series: [44, 55, 41, 17, 15],
      chart: {
        width: 380,
        type: "donut"
      },
      colors:['#79c97a','#F44336'],
      dataLabels: {
        enabled: true
      },
      
      fill: {
        type: "gradient"
      },
      title: {
        text: "Donut Chart",
        align: "cneter"
      },
      legend: {
        formatter: function(val: any, opts: any) {
          return val + " - " + opts.w.globals.series[opts.seriesIndex];
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }
}