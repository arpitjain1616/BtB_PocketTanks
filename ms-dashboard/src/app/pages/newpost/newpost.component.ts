import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UserService } from 'app/shared/Services/user/user.service';
import { Component, OnInit, Inject, ViewChild, Optional, Input } from "@angular/core";
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';

export class ImageFile {
  Name: string;
  Base64: any;
  ImageType: string;
  CommentText: string;
}

@Component({
  selector: 'app-newpost',
  templateUrl: './newpost.component.html',
  styleUrls: ['./newpost.component.scss']
})
export class NewpostComponent implements OnInit {
  @ViewChild("file", { static: true }) file;

  private files: Array<File> = new Array();
  private fileImageError: boolean = false;
  private fileImageName: string[] = [];
  private fileImageBase64: any[] = [];
  listImageFile: ImageFile[] = [];

  @Input() tweet;

  twitterSelected = true;
  imageUploaded = false;
  editPost = false;
  newPostFormGroup: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _userService: UserService,
    private _activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) { }

  // #region drag N drop
  addFiles() {
    this.file.nativeElement.click();
  }

  onFilesAdded() {
    this.onDroppedFilesChange(this.file.nativeElement.files);
  }

  async onDroppedFilesChange(files: Array<File>) {

    if (this.files.length + Object.keys(files).length > 1) {

      Swal.fire({
        title: 'Oops!',
        text: "You can upload only one file with extension png, jpg and jpeg",
        icon: 'error'
      });

      return;
    }

    const allowedExtensions: Array<string> = [
      "png",
      "jpg",
      "jpeg"
    ];
    for (const key in files) {
      if (!isNaN(parseInt(key, 10))) {
        const ext = files[key].name
          .split(".")
        [files[key].name.split(".").length - 1].toLocaleLowerCase();

        if (
          allowedExtensions.lastIndexOf(ext) !== -1 &&
          files[key].name.length <= 100
        ) {
          this.fileImageError = false;
          //To do : need to check for duplicate images
          this.files.push(files[key]);
          this.fileImageBase64.push({ name: files[key].name, Base64: await this.getBase64(files[key]) });
          this.imageUploaded = true;
        } else {

          return;
        }
      }
    }
  }

  remove(filename) {
    this.imageUploaded = false;
    this.fileImageBase64 = [];
    this.files.splice(this.files.findIndex(a => a.name == filename), 1);
  }

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = error => reject(error);
    });
  }

  ngOnInit() {

    this.tweet = {
      isScheduled: true,
      dateTime: '',
      profile_image: "https://material.angular.io/assets/img/examples/shiba2.jpg",
      screen_name: "@Shibu_the_dog",
      username: "Shibu",
      image: "https://material.angular.io/assets/img/examples/shiba2.jpg",
      text: "Hiii, guys. All the best.",
      scheduled_at: "12 DEC 2019"
    }


    // If there's no input
    // if (this.tweet != "")
    //   this.editPost = true;

    this.newPostFormGroup = this._fb.group({
      text: [
        "",
        [
          <any>Validators.required
        ]
      ],
      scheduleIt: [
        ""
      ],
      dateTime: new FormControl({ value: "", disabled: true }, <any>Validators.required),
    });

    this.newPostFormGroup.get('scheduleIt').valueChanges.subscribe(value => {
      if (value)
        this.newPostFormGroup.get('dateTime').enable();
      else
        this.newPostFormGroup.get('dateTime').disable();
    });
  }

  submitForm() {

    this.markFormGroupTouched(this.newPostFormGroup)

    if (this.newPostFormGroup.valid) {
      let newPost = {
        text: this.newPostFormGroup.get('text').value,
        isScheduled: this.newPostFormGroup.get('scheduleIt').value,
        time: this.newPostFormGroup.get('dateTime').value,
        mediaPath: (this.fileImageBase64.length > 0 ? this.fileImageBase64[0].Base64 : ''),
        containsMedia: (this.fileImageBase64.length > 0 ? true : false)
      }

      if (this.editPost) {
        // api to edit post
      }
      else {
        // api to create new
        this._userService.newPost(newPost).subscribe(response => {
          if (response.success) {
            Swal.fire({
              title: 'Success',
              text: 'Your tweet has been scheduled',
              icon: 'success'
            });

            this.clearForm();
          }
        },
          error => {
            Swal.fire({
              title: 'Oops',
              text: 'There might be some problem. Please try again later',
              icon: 'error'
            });
          });
      }
    }
  }

  clearForm() {
    this.newPostFormGroup.reset();
    this.imageUploaded = false;
    this.fileImageBase64 = [];
    this.files = [];
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

  markFormGroupTouched(FormGroup: FormGroup) {
    (<any>Object).values(FormGroup.controls).forEach(control => {
      try {
        control.markAsTouched();
        if (control.controls) {
          this.markFormGroupTouched(control);
        }
      }
      catch (e) { }
    });
  }
}