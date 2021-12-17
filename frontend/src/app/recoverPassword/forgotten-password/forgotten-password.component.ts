import { Component, OnInit } from '@angular/core';
import { ForgotPasswordService } from 'src/app/services/forgot-password.service';
import { Router } from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-forgotten-password',
  templateUrl: './forgotten-password.component.html',
  styleUrls: ['./forgotten-password.component.css']
})
export class ForgottenPasswordComponent implements OnInit {
  emailRecover: any;
  message: string = '';
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  durationInSeconds: number = 2;

  constructor(
    private _forgotPasswordService: ForgotPasswordService,
    private _router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.emailRecover = {};
  }
  ngOnInit(): void {
  }

  recoverPassword(){
    if (!this.emailRecover.email) {
      this.message = 'Failed process: Imcomplete data';
      this.openSnackBarError();
    } else {
      this._forgotPasswordService.forgottenPassword(this.emailRecover).subscribe({
        next: (v) => {
          this._router.navigate(['/login']);
          this.openSnackBarSuccesfull();
          this.emailRecover = {};
        },
        error: (e) => {
          this.message = e.error.message;
          this.openSnackBarError();
        },
        complete: () => console.info('complete'),
      });
    }
  }

  openSnackBarSuccesfull() {
    this._snackBar.open(this.message, 'X', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: this.durationInSeconds * 1000,
      panelClass: ['style-snackBarTrue'],
    });
  }

  openSnackBarError() {
    this._snackBar.open(this.message, 'X', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: this.durationInSeconds * 1000,
      panelClass: ['style-snackBarFalse'],
    });
  }


}
