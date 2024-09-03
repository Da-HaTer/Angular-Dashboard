import { ChangeDetectionStrategy, ChangeDetectorRef, Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { BarchartComponent } from '../charts/barchart/barchart.component';
import { RadialchartComponent } from '../charts/radialchart/radialchart.component';
import { DoughnutchartComponent } from '../charts/doughnutchart/doughnutchart.component';
import { RadarchartComponent } from '../charts/radarchart/radarchart.component';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  @ViewChild(RadialchartComponent) radialchart!: RadialchartComponent;
  @ViewChildren(BarchartComponent) barcharts!: QueryList<BarchartComponent>;
  @ViewChild(DoughnutchartComponent) doughnutchart!: DoughnutchartComponent;
  @ViewChild(RadarchartComponent) radarchart!: RadarchartComponent;
  panelOpenStates: Array<{ open: boolean }> = [];
  instructors: String[] = [];
  instructor_selected: String = '';
  instructor_courses: number = 0;
  instructor_feedbacks: number = 0;

  courses: String[] = [];
  course_selected: String = '';
  course_feedbacks: number = 0;
  course_participation: number = 0;
  instructor_data: Array<{ course: String, Date: String }> = []
  course_data: Array<{ instructor: String, Date: String }> = []
  settings: boolean = false;
  tot_feedbacks: any;
  tot_courses: any;
  top_courses: { columns: string[]; data: number[]; } = { columns: [], data: [] };
  section: string = 'main';

  // table attributes
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any> | any;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | any;
  @ViewChild(MatTable) table: MatTable<any> | any;

  constructor(private authService: AuthService, private cdr: ChangeDetectorRef, private router: Router) { }
  ngOnInit() {
    this.dataSource= new MatTableDataSource([]);
    this.update_dashboard();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log("filter: ",filterValue)
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  fetch_instrucotrs(): void {
    const query = 'SELECT Name from Instructor;';
    this.fetch(query).then((data) => {
      this.instructors = data.map((instructor: { Name: any; }) => instructor.Name); // Extract names
      this.update_instructor(0);
      this.panelOpenStates = this.instructors.map(() => ({ open: false })); // Initialize panel
      this.cdr.markForCheck();
    });
  }
  fetch_courses(): void {
    const query = 'SELECT distinct course_name from feedback;';
    this.fetch(query).then((data) => {
      this.courses = data.map((course: { course_name: any; }) => course.course_name); // Extract names
      // this.update_course(0);
      this.panelOpenStates = this.courses.map(() => ({ open: false })); // Initialize panel
      this.cdr.markForCheck();
    });
  }

  fetch_Instructor_courses(instructor: String): void {
    const query = `SELECT distinct course_name, Date_Format(Date," %d-%m-%Y") as Date from feedback where instructor_name = '${instructor}';`;
    this.fetch(query).then((data) => {
      this.instructor_data = data.map((course: { course_name: any; Date: any; }) => ({ course: course.course_name, Date: course.Date }));
      this.cdr.markForCheck();
    });
  }
  fetch_course_instructors(course: String): void {
    const query = `SELECT instructor_name, Date_Format(Date," %d-%m-%Y") as Date from feedback where course_name = '${course}';`;
    this.fetch(query).then((data) => {
      this.course_data = data.map((course: { instructor_name: any; Date: any; }) => ({ course: course.instructor_name, Date: course.Date }));
      this.cdr.markForCheck();
    });
  }

  get_course_feedbacks(course: String) {
    const query = `SELECT count(*) from feedback where course_name = '${course}';`;
    this.fetch(query).then((data) => {
      this.course_feedbacks = data[0]['count(*)'];
      this.cdr.markForCheck();
    }
    );
  }
  get_course_participation(course: String) {
    const query = `SELECT count(distinct instructor_name) as count from feedback where course_name = '${course}';`;
    this.fetch(query).then((data) => {
      this.course_participation = data[0]['count'];
      this.cdr.markForCheck();
    });
  }

  get_course_attributes(course: String) {
    const query = `SELECT avg(relevance_course), avg(clarity_objectives), avg(quality_materials), avg(usefulness_content),avg(depth_coverage) from feedback where course_name='${course}';`;
    this.fetch(query).then((data) => {
      const columns = ['Relevance', 'Clarity', 'Quality', 'Usefulness', 'Depth'];
      const values = Object.values(data[0]).map((value: unknown, index: number, array: unknown[]) => this.format_100(value as number));
      let bc = this.barcharts.toArray()[0];
      bc.chartOptions.series = [{ name: 'Average', data: values }];
      bc.chartOptions.xaxis = { categories: columns, };
      bc.chartOptions.title = { text: 'Evaluation', align: 'center' };
    });
  }

  get_course_ratings(course: String) {
    const query = `SELECT 
    count(CASE WHEN experience_rating >= 0.4 THEN 1 ELSE NULL END) AS positive,
    count(CASE WHEN experience_rating < 0.4 THEN 1 ELSE NULL END) AS negative
    FROM  feedback where course_name='${course}';`;
    this.fetch(query).then((data) => {
      const columns = ['Positive', 'Negative'];
      const values = Object.values(data[0])
      let bc = this.doughnutchart;
      bc.chartOptions.series = values;
      bc.chartOptions.labels = columns;
      bc.chartOptions.title = { text: 'course ratings', align: 'center' };
    });
  }

  get_instructor_courses(instructor: String) {
    const query = `SELECT count(distinct course_name) as count from feedback where instructor_name = '${instructor}';`;
    this.fetch(query).then((data) => {
      this.instructor_courses = data[0]['count'];
      this.cdr.markForCheck();
    });
  }
  get_instructor_feedbacks(instructor: String) {
    const query = `SELECT count(*) from feedback where instructor_name = '${instructor}';`;
    this.fetch(query).then((data) => {
      this.instructor_feedbacks = data[0]['count(*)'];
      this.cdr.markForCheck();
    });
  }
  get_intructor_attributes(instructor: String) {
    const query = `SELECT avg(knowledge_subject), avg(professionalism),avg(communication_skills),avg(engagement_participants),avg(answering_questions),avg(pacing_course) from feedback where instructor_name='${instructor}';`;
    this.fetch(query).then((data) => {
      const columns = ['Knowledge', 'Professionalism', 'Communication', 'Engagement', 'Answering', 'Pacing'];
      const values = Object.values(data[0]).map((value: unknown, index: number, array: unknown[]) => this.format_100(value as number));
      let bc = this.radarchart;
      bc.chartOptions.series = [{ name: 'Average', data: values }];
      bc.chartOptions.xaxis = { categories: columns, };
      bc.chartOptions.title = { text: 'Qualités', align: 'center' };
    });
  }
  get_instrucor_ratings(instructor: String) {
    const query = `SELECT 
    count(CASE WHEN overall_quality >= 0.4 THEN 1 ELSE NULL END) AS positive,
    count(CASE WHEN overall_quality < 0.4 THEN 1 ELSE NULL END) AS negative
    FROM  feedback where instructor_name='${instructor}';`;
    this.fetch(query).then((data) => {
      const columns = ['Positive', 'Negative'];
      const values = Object.values(data[0]);
      let bc = this.doughnutchart;
      bc.chartOptions.series = values;
      bc.chartOptions.labels = columns;
      bc.chartOptions.title = { text: 'Feedback scores  ', align: 'center' };
    });
  }

  update_table() {
    const query = `SELECT Id, instructor_name as instructor, course_name as Course, employee_name as Employee, Date_Format(Date," %d-%m-%Y") as Date, format(experience_rating*100,1) as Score, text as Notes from feedback;`;
    this.fetch(query).then((data) => {
      console.log("datta :",data.slice(0,2));
      // let values= data.map((row: any) => Object.values(row))
      // this.displayedColumns=['id', 'name', 'score', 'data'];
      // let test_data= [{id:1,name:"test",score:0.5,data:"2021-09-01"},{id:2,name:"test2",score:0.6,data:"2021-09-01"}]
      // this.dataSource = new MatTableDataSource(test_data);
      this.displayedColumns = Object.keys(data[0]);
      this.dataSource = new MatTableDataSource(data);
      console.log("datasouce ",this.dataSource)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.table.renderRows();
      this.cdr.markForCheck();
    });
  }

  update_dashboard() {
    this.fetch_instrucotrs();
    this.fetch_courses();
    this.update_table();
    this.fetch('SELECT count(*) as total_feedbacks from feedback;').then((data) => {
      this.tot_feedbacks = data[0].total_feedbacks;
    });
    this.fetch('SELECT count(distinct course_name) as total_courses from feedback;').then((data) => {
      this.tot_courses = data[0].total_courses;
    });
    this.fetch('SELECT course_name, count(*) as total_feedbacks from feedback group by course_name order by total_feedbacks desc limit 5;').then((data) => {
      const columns = data.map((course: { course_name: any; }) => course.course_name);
      const feedbacks = data.map((course: { total_feedbacks: any; }) => course.total_feedbacks);
      let bc = this.barcharts.toArray()[0];
      bc.chartOptions.series = [{ name: 'Feedbacks', data: feedbacks }];
      bc.chartOptions.xaxis = { categories: columns };
      bc.chartOptions.title = { text: 'Top 5 Courses by participcation', align: 'center' };
    });
    this.fetch('SELECT course_name, avg(experience_rating) as av from feedback group by course_name order by av desc limit 5;').then((data) => {
      const columns = data.map((course: { course_name: any; }) => course.course_name);
      const av = data.map((instructor: { av: any; }) => this.format_100(instructor.av));
      let bc = this.barcharts.toArray()[1];
      console.log("bc", this.barcharts.toArray())
      bc.chartOptions.series = [{ name: 'Average', data: av }];
      bc.chartOptions.xaxis = { categories: columns, };
      bc.chartOptions.title = { text: 'Top 5 courses by average score', align: 'center' };
    });
    this.fetch('Select instructor_name, avg(overall_quality) as av from feedback group by instructor_name order by av desc limit 4;').then((data) => {
      const columns = data.map((instructor: { instructor_name: any; }) => instructor.instructor_name);
      const score = data.map((instructor: { av: any; }) => this.format_100(instructor.av));
      let rc = this.radialchart;
      rc.chartOptions.series = score.map((value: number) => value);
      rc.chartOptions.labels = columns;
      rc.chartOptions.title = { text: 'Top 5 Instructors by score', align: 'center' };
    });

  }
  update_course(i: number) {
    this.course_selected = this.courses[i];
    this.get_course_feedbacks(this.course_selected);
    this.get_course_participation(this.course_selected);
    this.get_course_attributes(this.course_selected);
    this.get_course_ratings(this.course_selected);
  }
  update_instructor(i: number) {
    this.instructor_selected = this.instructors[i];
    this.get_instructor_courses(this.instructor_selected);
    this.get_instructor_feedbacks(this.instructor_selected);
    this.get_intructor_attributes(this.instructor_selected);
    this.get_instrucor_ratings(this.instructor_selected);
  }
  fetch(query: string): Promise<any> {
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
    if (error.status === 403) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
    throw new Error('error: ', error);  
  }
  format_100(value: number): number {
    return Math.trunc(value * 100);
  }
  setPanelState(index: number, state: boolean): void {
    this.panelOpenStates[index].open = state;
  }
  getPanelState(index: number): boolean {
    return this.panelOpenStates[index]?.open;
  }
  navigateTo(section: string) {
    this.section = section;
    this.cdr.markForCheck();
  }

  handle_Row(row: any): void { // takes to table component with filter
    console.log(row)
  }
}
