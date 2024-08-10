import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: ``,
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  settings : boolean = false;
  private authSubscription: Subscription | undefined;
  
  constructor(private authService: AuthService,private cdr: ChangeDetectorRef,private _snackBar: MatSnackBar,private router: Router) {
    this.isLoggedIn = localStorage.getItem('token') !== null;
  }

  ngOnInit(): void {
    this.authSubscription = this.authService.token$.subscribe(token => {
      this.isLoggedIn = !!token;
      this.cdr.detectChanges(); // Ensure change detection is triggered
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  Logout() {
    if (this.isLoggedIn ){
      this.authService.logout();
      this._snackBar.open("Logged out", 'Close', {
        duration: 3000,
      });
      this.router.navigate(['/login']);
    }

  }
}
