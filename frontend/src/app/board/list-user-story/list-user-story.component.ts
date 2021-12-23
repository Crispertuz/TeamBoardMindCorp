import { Component, OnInit } from '@angular/core';
import { BoardService } from '../../services/board.service';
import {FormGroup, FormControl} from '@angular/forms';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-list-user-story',
  templateUrl: './list-user-story.component.html',
  styleUrls: ['./list-user-story.component.css'],
})
export class ListUserStoryComponent implements OnInit {
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  opcionSeleccionada:string = '';
  userStoryStatus: any;
  userStoryBugs: any;
  updateStorySend: any;
  registerData: any;
  userData: any;
  storyData: any;
  storyActive: any;
  storyResolved: any;
  storyVerifiedQa: any;
  storyReadyForPo: any;
  message: string = '';
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  durationInSeconds: number = 2;
  accordion:boolean = false;

  constructor(
    public _userServiceIsAdmin: UserService,
    private _boardService: BoardService,
    private _userService: UserService,
    private _snackBar: MatSnackBar
  ) {
    this.storyData = [];
    this.storyActive = [];
    this.storyResolved = [];
    this.storyVerifiedQa = [];
    this.storyReadyForPo = [];
    this.userData = [];
    this.registerData = {};
    this.updateStorySend = {};
    this.userStoryStatus = {};
    this.userStoryBugs = {};
  }

  ngOnInit(): void {
    this.listUser()
    this._boardService.listUserStory().subscribe({
      next: (v) => {
        this.storyData = v.userStoryList;
        this.storyData.forEach((tk: any) => {
          if (tk.userStoryStatus === 'active') {
            this.storyActive.push(tk);
          }
          if (tk.userStoryStatus === 'verified QA') {
            this.storyVerifiedQa.push(tk);
          }
          if (tk.userStoryStatus === 'ready for PO') {
            this.storyReadyForPo.push(tk);
          }
          if (tk.userStoryStatus === 'resolved') {
            this.storyResolved.push(tk);
          }
        });
      },
      error: (e) => {
        this.message = e.error.message;
        this.openSnackBarError();
      },
    });
  }


  listUser() {
    this._userService.listUser('').subscribe({
      next: (v) => {
        for (const key in v.userList) {
          let item: any = v.userList[key];
          this.userData.push(item);
        }
      },
      error: (e) => {
        this.message = e.error.message;
      },
    });
  }

  listUserStoryAdmin() {
    if(this.opcionSeleccionada === '') {
      this.message = "Selecciona un usuario"
      this.openSnackBarError();
    }
    else{
      
    this._boardService.listUserStoryAdmin(this.opcionSeleccionada).subscribe({
      next: (v) => {
        this.resetListAdmin();
        this.storyData = v.userStoryList;
        this.storyData.forEach((tk: any) => {
          if (tk.userStoryStatus === 'active') {
            this.storyActive.push(tk);
          }
          if (tk.userStoryStatus === 'verified QA') {
            this.storyVerifiedQa.push(tk);
          }
          if (tk.userStoryStatus === 'ready for PO') {
            this.storyReadyForPo.push(tk);
          }
          if (tk.userStoryStatus === 'resolved') {
            this.storyResolved.push(tk);
          }
        });
      },
      error: (e) => {
        this.message = e.error.message;
        this.openSnackBarError();
      },
    });
    }
  }

  updateStory(item: any, i: number) {
    if(this.userStoryBugs[i] != undefined)
    {
      let nuevoBug = this.userStoryBugs[i];
      item.bugs.push(nuevoBug)
    }
    if(this.userStoryStatus[i] != undefined )
    {
      item.userStoryStatus = this.userStoryStatus[i];
    }
    this._boardService.updateStory(item).subscribe({
      next: (v) => {
        this.resetList();
      },
      error: (e) => {
        this.message = e.error.message;
        this.openSnackBarError();
      },
    });
  }

  bugArray(bug:any){
    return  bug.bugs;
  }

  resetListAdmin(){
    this.storyActive = [];
    this.storyVerifiedQa = [];
    this.storyReadyForPo = [];
    this.storyResolved = [];
  }

  resetList() {
    this.storyActive = [];
    this.storyVerifiedQa = [];
    this.storyReadyForPo = [];
    this.storyResolved = [];
    this._boardService.listUserStory().subscribe({
      next: (v) => {
        this.storyData = v.userStoryList;
        this.storyData.forEach((tk: any) => {
          if (tk.userStoryStatus === 'active') {
            this.storyActive.push(tk);
          }
          if (tk.userStoryStatus === 'verified QA') {
            this.storyVerifiedQa.push(tk);
          }
          if (tk.userStoryStatus === 'ready for PO') {
            this.storyReadyForPo.push(tk);
          }
          if (tk.userStoryStatus === 'resolved') {
            this.storyResolved.push(tk);
          }
        });
      },
      error: (e) => {
        this.message = e.error.message;
        this.openSnackBarError();
      },
    });
  }
  deleteStory(story: any) {
    this._boardService.deleteStory(story).subscribe({
      next: (v) => {
        let index = this.storyData.indexOf(story);
        if (index > -1) {
          this.storyData.splice(index, 1);
          this.message = v.message;
          this.openSnackBarSuccesfull();
          this.resetList();
        }
      },
      error: (e) => {
        this.message = e.error.message;
        this.openSnackBarError();
      },
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