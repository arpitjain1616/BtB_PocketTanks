import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from 'app/shared/Services/user/user.service';

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss']
})
export class ProfileDialogComponent {

  userInfo;

  constructor(
    private _userService: UserService,
    public dialogRef: MatDialogRef<ProfileDialogComponent>
  ){
  }

  ngOnInit(){

    this.userInfo = {
      "background_image" : localStorage.getItem('background_image'),
      "profile_image" : localStorage.getItem('profileImage'),
      "followers_count" : localStorage.getItem('followersCount'),
      "following_count" : localStorage.getItem('followingCount'),
      "screen_name" : localStorage.getItem('screenName'),
      "name" : localStorage.getItem('name'),
      "statuses_count" : localStorage.getItem('statusesCount'),
      "description" : localStorage.getItem('description')
    }
  }

  onNoClick(): void {
    this.dialogRef.close()
  }
}
