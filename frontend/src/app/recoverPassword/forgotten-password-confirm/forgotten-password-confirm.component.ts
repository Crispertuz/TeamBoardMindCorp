import { Component, OnInit } from '@angular/core';
import { ForgotPasswordService } from 'src/app/services/forgot-password.service';
import { Router, ActivatedRoute } from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';


@Component({
  selector: 'app-forgotten-password-confirm',
  templateUrl: './forgotten-password-confirm.component.html',
  styleUrls: ['./forgotten-password-confirm.component.css']
})
export class ForgottenPasswordConfirmComponent implements OnInit {

  passwordData: any;
  message: string = '';
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  durationInSeconds: number = 2;
  
  constructor(
    private _forgotPasswordService: ForgotPasswordService,
    private _router: Router,
    private _snackBar: MatSnackBar,
    private _Arouter: ActivatedRoute
  ) {
    this.passwordData = {};
  }

  ngOnInit(): void {
    console.log(this._Arouter.params); 
  }

  getRecoverPassword(){
    if (!this.passwordData.password || !this.passwordData.passwordConfirm) {
      this.message = 'Failed process: Imcomplete data';
      this.openSnackBarError();
    } else {
      this.getParams();
      console.log(this.passwordData);
      this._forgotPasswordService.forgottenPasswordConfirm(this.passwordData).subscribe({
        next: (v) => {
          this._router.navigate(['/login']);
          this.openSnackBarSuccesfull();
          this.passwordData = {};
        },
        error: (e) => {
          this.message = e.error.message;
          this.openSnackBarError();
        },
        complete: () => console.info('Password recovered correctly'),
      });
    }
  }

  getParams(){
    this._Arouter.params.subscribe((params) => {
      this.passwordData.forgotPasswordCode = params['forgotPasswordCode'];
    });
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
