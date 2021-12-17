import { Component, OnInit } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { Router } from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-history',
  templateUrl: './user-history.component.html',
  styleUrls: ['./user-history.component.css'],
})
export class UserHistoryComponent implements OnInit {
  userData: any;
  registerData: any;
  selectedFile: any;
  message: string = '';
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  durationInSeconds: number = 2;

  constructor(
    private _boardService: BoardService,
    private _router: Router,
    private _snackBar: MatSnackBar,
    private _userService: UserService
  ) {
    this.registerData = {};
    this.selectedFile = null;
    this.userData = [];
  }

  ngOnInit(): void {
    this._userService.listUser('').subscribe({
      next: (v) => {
        for (const key in v.userList) {
          let item: any = v.userList[key];
          this.userData.push(item);
          console.log(item);
        }

        console.log(this.userData);
      },
      error: (e) => {
        this.message = e.error.message;
        this.openSnackBarError();
      },
      complete: () => console.info('complete'),
    });
  }

  saveUserStory() {
    if (
      !this.registerData.name ||
      !this.registerData.userId ||
      !this.registerData.userStoryStatus ||
      !this.registerData.details
    ) {
      this.message = 'Failed process: Incomplete Data';
      this.openSnackBarError();
    } else {
      this._boardService.saveUserStory(this.registerData).subscribe({
        next: (v) => {
          this._router.navigate(['/listUserStory']);
          this.message = 'Story created';
          this.openSnackBarSuccesfull();
        },
        error: (e) => {
          this.message = e.error.message;
          this.openSnackBarError();
        },
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
