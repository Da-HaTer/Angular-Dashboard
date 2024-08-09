import {ChangeDetectionStrategy, ChangeDetectorRef, Component, QueryList, signal, viewChild, ViewChild, ViewChildren} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { get } from 'http';
import { BarchartComponent } from '../charts/barchart/barchart.component';
import { RadialchartComponent } from '../charts/radialchart/radialchart.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  @ViewChild(RadialchartComponent) radialchart!: RadialchartComponent;
  @ViewChildren(BarchartComponent) barcharts!: QueryList<BarchartComponent>;
  panelOpenStates: Array<{ open: boolean }> = [];
  instructors: String[]=[];
  instructor_data: Array<{course: String, Date: String}>=[]
  settings: boolean = false;
  tot_feedbacks: any;
  tot_courses: any;
  top_courses: { columns: string[]; data: number[]; } = { columns: [], data: [] };
  constructor(private authService: AuthService,private cdr: ChangeDetectorRef,private router: Router) {}
  ngOnInit() {
    this.fetch_instrucotrs();
    this.fetch('SELECT count(*) as total_feedbacks from feedback;').then((data) => {
      this.tot_feedbacks = data[0].total_feedbacks;
    });
    this.fetch('SELECT count(distinct course_name) as total_courses from feedback;').then((data) => {
      this.tot_courses = data[0].total_courses;
    });
    this.fetch('SELECT course_name, count(*) as total_feedbacks from feedback group by course_name order by total_feedbacks desc limit 5;').then((data) => {
      const columns = data.map((course: { course_name: any; }) => course.course_name);
      const feedbacks = data.map((course: { total_feedbacks: any; }) => course.total_feedbacks);
      let bc=this.barcharts.toArray()[1];
      bc.chartOptions.series = [{ name: 'Feedbacks', data: feedbacks }];
      bc.chartOptions.xaxis = { categories: columns };
      bc.chartOptions.title = { text: 'Top 5 Formations par partiicipcation',align: 'center' };
      console.log(this.top_courses);
    });
    this.fetch('SELECT course_name, avg(experience_rating) as av from feedback group by course_name order by av desc limit 5;').then((data) => {  
      const columns = data.map((course: { course_name: any; }) => course.course_name);
      const av = data.map((instructor: { av: any; }) => this.format_100(instructor.av));
      let bc=this.barcharts.toArray()[0];
      bc.chartOptions.series = [{ name: 'Average', data: av }];
      bc.chartOptions.xaxis = { categories: columns, };
      bc.chartOptions.title = { text: 'Top 5 formation par score Moyen',align: 'center' };
    });
    this.fetch('Select instructor_name, avg(overall_quality) as av from feedback group by instructor_name order by av desc limit 4;').then((data) => {
      const columns = data.map((instructor: { instructor_name: any; }) => instructor.instructor_name);
      const score = data.map((instructor: { av: any; }) => this.format_100(instructor.av));
      let rc=this.radialchart;
      rc.chartOptions.series = score.map((value: number) => value);
      rc.chartOptions.labels = columns;
      rc.chartOptions.title = { text: 'Top 5 Formateur par score',align: 'center' };
    });
  }


  fetch_instrucotrs(): void {
    const query = 'SELECT Name from Instructor;';
    const token = localStorage.getItem('token');
    this.authService.request(query, token).subscribe({
      next: (data) => {
        this.instructors = data.map((instructor: { Name: any; }) => instructor.Name); // Extract names
        this.panelOpenStates = this.instructors.map(() => ({ open: false })); // Initialize panel
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error fetching instructors:', error);
        this.authService.logout();
        this.router.navigate(['/login']);
      },
      complete: () => {
        console.log('Data fetching completed'); // (Optional) Log completion message
      }
    });
  }

  fetch_Instructor_courses(instructor: String): void {
    const query = `SELECT distinct course_name, Date_Format(Date," %d-%m-%Y") as Date from feedback where instructor_name = '${instructor}';`;
    const token = localStorage.getItem('token');
    this.authService.request(query, token).subscribe({
      next: (data) => {
        this.instructor_data = data.map((course: { course_name: any; Date: any; }) => ({ course: course.course_name, Date: course.Date }));
        this.cdr.markForCheck();
        // Do something with the data
      },
      error: (error) => {
        console.error('Error fetching courses:', error);
      },
      complete: () => {
        console.log('Data fetching completed'); // (Optional) Log completion message
      }
    });
  }

  fetch(query:string): Promise<any> {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('token');
      this.authService.request(query, token).subscribe({
        next: (data) => {
          // const instructors = data.map((instructor: { Name: any; }) => instructor.Name); // Extract names
          // this.panelOpenStates = instructors.map(() => ({ open: false })); // Initialize panel
          this.cdr.markForCheck();
          resolve(data); // Resolve the promise with the instructors' names
        },
        error: (error) => {
          console.error('Error fetching instructors:', error);
          this.handle_error(error);
          reject(error); // Reject the promise with the error
        },
        complete: () => {
          console.log('Data fetching completed'); // (Optional) Log completion message
        }
      });
    });
  }
  handle_error(error: any) {
    throw new Error('error: ',error);
  }
  format_100(value: number): number {
    return Math.trunc(value*100);
  }
  setPanelState(index: number, state: boolean): void {
    this.panelOpenStates[index].open = state;
  }
  getPanelState(index: number): boolean {
    return this.panelOpenStates[index]?.open;
  }

  handle_Row(row: any):void {
    console.log(row)
    }
}
