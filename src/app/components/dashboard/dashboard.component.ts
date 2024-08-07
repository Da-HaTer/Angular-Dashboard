import {ChangeDetectionStrategy, ChangeDetectorRef, Component, signal} from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  readonly panelOpenState = signal(false);
  instructors: String[]=[];
  constructor(private authService: AuthService,private cdr: ChangeDetectorRef) {}
  ngOnInit() {
    const query = 'SELECT Name from Instructor;';
    const token = localStorage.getItem('token');
    this.authService.request(query, token).subscribe({
      next: (data) => {
        console.log('Instructors:', data);
        this.instructors = data.map((instructor: { Name: any; }) => instructor.Name); // Extract names
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error fetching instructors:', error);
      },
      complete: () => {
        console.log('Data fetching completed'); // (Optional) Log completion message
      }
    });
  }
}
