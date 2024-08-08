import { ChangeDetectorRef, Component, Input, ViewChild } from "@angular/core";

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexYAxis,
  ApexLegend,
  ApexFill
} from "ng-apexcharts";
import { AuthService } from "../../../services/auth.service";
import { min } from "rxjs";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  yaxis: ApexYAxis;
  colors: string[];
  legend: ApexLegend;
  fill: ApexFill;
};

@Component({
  selector: 'app-areachart',
  templateUrl: './areachart.component.html',
  styleUrl: './areachart.component.scss'
})
export class AreachartComponent {
  @ViewChild("chart") chart: ChartComponent | any;
  @Input() public chartOptions: Partial<ChartOptions> | any;
  All: Array<[x:Number,y:Number]> = [];
  positive: Array<[x:Number,y:Number]> = [];
  negative: Array<[x:Number,y:Number]> = [];

  constructor(private Autservice: AuthService, private cdr: ChangeDetectorRef) {
    this.chartOptions = {
      series: [
        { name: "Negative", data: this.negative },
        { name: "Positive",data: this.positive},
        { name: "Total", data: this.All }

      ],
      chart: {
        type: "area",
        height: 350,
        stacked: true,
        events: {
          selection: function (chart: any, e: any) {
            console.log(new Date(e.xaxis.min));
          }
        }
      },
      colors: ["#f84f31", "#23c552", "#CED4DC"],
      dataLabels: {
        enabled: false
      },
      fill: {
        type: "gradient",
        gradient: {
          opacityFrom: 0.6,
          opacityTo: 0.8
        }
      },
      legend: {
        position: "top",
        horizontalAlign: "left"
      },
      xaxis: {
        type: "datetime"
      }
    };
  }

  ngOnInit(): void {
    this.fetch_all_data();
    this.fetch_pos_data();
    this.fetch_neg_data();
    // this.fetch_data("feedback/negative");
    // this.fetch_data("feedback/total");
  }

  public generateDayWiseTimeSeries = function (baseval: any, count: any, yrange: any) {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = baseval;
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
      series.push([x, y]);
      baseval += 86400000;
      i++;
    }
    console.log("series: ", series);
    return series;
  };

  private fetch_all_data(): void {
    const query= 'select Date_Format(Date,"%b-%Y") as Date,count(id) as count from feedback group by Year(Date),Month(Date) order by Year(Date),Month(Date);';
    const token = localStorage.getItem('token');
    this.Autservice.request(query, token).subscribe({
      next: (data) => {
        console.log(data);
        let ret = data.map((dt: { Date: any; count: any; }) => ([new Date(dt.Date).getTime(), dt.count]));
        // this.All.push(ret);
        this.All = ret
        this.Update_chart();
      },
      error: (error) => {
        console.error('Error fetching instructors:', error);
      },
      complete: () => {
        console.log('Data fetching completed'); // (Optional) Log completion message
      }
    });
  }
  private fetch_pos_data(): void {
    const query= 'select Date_Format(Date,"%b-%Y") as Date,count(id) as count from feedback where  experience_rating>=0.4 group by Year(Date),Month(Date) order by Year(Date),Month(Date);';
    const token = localStorage.getItem('token');
    this.Autservice.request(query, token).subscribe({
      next: (data) => {
        console.log(data);
        let ret = data.map((dt: { Date: any; count: any; }) => ([new Date(dt.Date).getTime(), dt.count]));
        this.positive = ret
        this.Update_chart();
        
      },
      error: (error) => {
        console.error('Error fetching instructors:', error);
      },
      complete: () => {
        console.log('Data fetching completed'); // (Optional) Log completion message
      }
    });
  }
  private fetch_neg_data(): void {
    const query= 'select Date_Format(Date,"%b-%Y") as Date,count(id) as count from feedback where  experience_rating<0.4  group by Year(Date),Month(Date) order by Year(Date),Month(Date);';
    const token = localStorage.getItem('token');
    this.Autservice.request(query, token).subscribe({
      next: (data) => {
        console.log(data);
        let ret = data.map((dt: { Date: any; count: any; }) => ([new Date(dt.Date).getTime(), dt.count]));
        this.negative = ret
        this.Update_chart();
      },
      error: (error) => {
        console.error('Error fetching instructors:', error);
      },
      complete: () => {
        console.log('Data fetching completed'); // (Optional) Log completion message
      }
    });
  }
  private Update_chart(): void {
    this.chart.updateOptions({
      series: [
        { name: "Negative", data: this.negative},
        {name: "Positive",data: this.positive},
        { name: "Total", data: this.All}
      ]
    });
    console.log("positive: ", this.positive);
  }
}
