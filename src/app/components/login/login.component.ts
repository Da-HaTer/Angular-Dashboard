import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, ReactiveFormsModule, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { response } from 'express';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,MatFormFieldModule,MatInputModule,MatButtonModule,MatCheckboxModule,MatIconModule],
  templateUrl: './login.component.html',
})

export class LoginComponent {
  loginForm: FormGroup;
  private _error: string = '';
  @Input() option='Sign in';
  hide=true;
  matcher = new MyErrorStateMatcher();
  private _token: string ='';

  constructor(private fb: FormBuilder, private authService: AuthService,private _snackBar: MatSnackBar) {
    this.loginForm = this.fb.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl(''),
    });
  }  

  set token(value: string ) {
    this._token = value;
  }

  get error(): string {
    return this._error;
  }

  set error(value: string) {
    this._error = value;
    if (value) {
      this.openSnackBar(value);
    }
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }

  handleClick(event: Event): void {
    event.preventDefault();
    this.option = this.option === 'Sign in' ? 'Sign up' : 'Sign in';
  }


  TogglePasswordVisibility(){
    this.hide=!this.hide;
  }

  onSubmit() {
    const { username, password, confirmPassword} = this.loginForm.value;

    if (["log in","login","sign in","signin"].includes(this.option.toLocaleLowerCase())){
      if (username.length < 4) {
        this.error = 'Username must be at least 4 characters';
        return;
      }
      this.authService.login(username, password).subscribe({
        next: (response: { token: string; }) => {
          localStorage.setItem('token', response.token);
          console.log(response); 
          // console.log(this.TEST("select * from feedback;",response.token));
          this.openSnackBar("Login successful");
          // Login successful, redirect to dashboard or other
        },
        error: (err: any) => this.error = err.error
      });
    }
    else if (["register","sign up","signup"].includes(this.option.toLocaleLowerCase())){
      if (password !== confirmPassword) {
        console.log(password,confirmPassword);
        this.error = 'Passwords do not match';
        return;
      }
      if (password.length < 8) {
        this.error = 'Password must be at least 8 characters';
        return;
      }
      if (username.length < 4) {
        this.error = 'Username must be at least 4 characters';
        return;}
      this.authService.register(username, password).subscribe({
        next: (response: { token: string; }) => {
          localStorage.setItem('token', response.token); 
          console.log(response);
          this.openSnackBar("Registration successful");
          // Registration successful, redirect to dashboard or other
        },
        error: (err: any) =>  err.error
      });

    }
    else{
      this.error = 'Invalid option';
    }
  }
  // TEST(query: string,token: any): Promise<any> {
  //   return new Promise<any>((resolve, reject) => {
  //     this.authService.request(query, token).subscribe({
  //       next: (response: any) => {
  //         resolve(response);
  //       },
  //       error: (err: any) => {
  //         reject(err);
  //       }
  //     });
  //   });
  // }
}


