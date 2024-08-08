import {ChangeDetectionStrategy, ChangeDetectorRef, Component, signal} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { get } from 'http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {

  panelOpenStates: Array<{ open: boolean }> = [];
  instructors: String[]=[];
  instructor_data: Array<{course: String, Date: String}>=[]
  constructor(private authService: AuthService,private cdr: ChangeDetectorRef,private router: Router) {}
  ngOnInit() {
    this.fetch_instrucotrs();
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
