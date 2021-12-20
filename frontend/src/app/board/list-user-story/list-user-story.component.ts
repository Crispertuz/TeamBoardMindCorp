import { Component, OnInit } from '@angular/core';
import { BoardService } from '../../services/board.service';
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

@Component({
  selector: 'app-list-user-story',
  templateUrl: './list-user-story.component.html',
  styleUrls: ['./list-user-story.component.css'],
})
export class ListUserStoryComponent implements OnInit {
  storyData: any;
  storyActive: any;
  storyResolved: any;
  storyVerifiedQa: any;
  storyReadyForPo: any;
  message: string = '';
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  durationInSeconds: number = 2;

  constructor(
    private _boardService: BoardService,
    private _snackBar: MatSnackBar
  ) {
    this.storyData = {};
    this.storyActive = [];
    this.storyResolved = [];
    this.storyVerifiedQa = [];
    this.storyReadyForPo = [];
  }

  ngOnInit(): void {
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
          console.log(this.storyData);
        });
      },
      error: (e) => {
        this.message = e.error.message;
        this.openSnackBarError();
      },
      complete: () => console.info('complete'),
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.dropUpdate();
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.dropUpdate();
    }
  }
  dropUpdate() {
    this.storyActive.forEach((tk: any) => {
      if (tk.userStoryStatus !== 'active') {
        this.updateStory(tk, 'active');
      }
    });
    this.storyVerifiedQa.forEach((tk: any) => {
      if (tk.userStoryStatus !== 'verified QA') {
        this.updateStory(tk, 'verified QA');
      }
    });
    this.storyReadyForPo.forEach((tk: any) => {
      if (tk.userStoryStatus !== 'ready for PO') {
        this.updateStory(tk, 'ready for PO');
      }
    });
    this.storyResolved.forEach((tk: any) => {
      if (tk.userStoryStatus !== 'resolved') {
        this.updateStory(tk, 'resolved');
      }
    });
  }

  updateStory(story: any, status: string) {
    let tempStatus = story.userStoryStatus;
    story.userStoryStatus = status;
    this._boardService.updateStory(story).subscribe({
      next: (v) => {
        story.status = status;
        this.resetList();
      },
      error: (e) => {
        story.status = tempStatus;
        this.message = e.error.message;
        this.openSnackBarError();
      },
      complete: () => console.info('complete'),
    });
  }

  resetList() {
    this.storyActive = [];
    this.storyVerifiedQa = [];
    this.storyReadyForPo = [];
    this.storyResolved = [];
    this._boardService.listUserStory().subscribe({
      next: (v) => {
        this.storyData = v.storyList;
        this.storyData.forEach((tk: any) => {
          if (tk.userStoryStatus !== 'active') {
            this.updateStory(tk, 'active');
          }
        });
        this.storyVerifiedQa.forEach((tk: any) => {
          if (tk.userStoryStatus !== 'verified QA') {
            this.updateStory(tk, 'verified QA');
          }
        });
        this.storyReadyForPo.forEach((tk: any) => {
          if (tk.userStoryStatus !== 'ready for PO') {
            this.updateStory(tk, 'ready for PO');
          }
        });
        this.storyResolved.forEach((tk: any) => {
          if (tk.userStoryStatus !== 'resolved') {
            this.updateStory(tk, 'resolved');
          }
        });
      },
      error: (e) => {
        this.message = e.error.message;
        this.openSnackBarError();
      },
      complete: () => console.info('complete'),
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
