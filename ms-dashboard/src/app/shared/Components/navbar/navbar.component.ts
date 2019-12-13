import { Component, OnInit, Renderer, ViewChild, ElementRef } from '@angular/core';
import { ROUTES } from '../../../sidebar/sidebar.component';
import { Router } from '@angular/router';
import { Location} from '@angular/common';
import { MatDialog } from "@angular/material";
import { FixedPluginComponent } from '../fixedplugin/fixedplugin.component';
import { ProfileDialogComponent } from 'app/user/profile-dialog/profile-dialog.component';
import { UserService } from 'app/shared/Services/user/user.service';

@Component({
    moduleId: module.id,
    selector: 'navbar-cmp',
    templateUrl: 'navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit{
  private listTitles: any[];
  location: Location;
  private nativeElement: Node;
  private toggleButton;
  private sidebarVisible: boolean;

  isCollapsed = true;
  profileData;

  @ViewChild("navbar-cmp", {static: false}) button;

  constructor(
    location:Location, 
    private renderer : Renderer, 
    private element : ElementRef,
    private router: Router,
    public _dialog: MatDialog,
    private _userService: UserService
  ) 
  {
      this.location = location;
      this.nativeElement = element.nativeElement;
      this.sidebarVisible = false;
  }

  getProfileData() {
    this._userService.getProfileData().subscribe(response => {
      if (response.success) {
        this.profileData = response.data;
        localStorage.setItem('background_image', this.profileData.backgroundImage)
        localStorage.setItem('description', this.profileData.description)
        localStorage.setItem('followersCount', this.profileData.followersCount)
        localStorage.setItem('followingCount', this.profileData.followingCount)
        localStorage.setItem('name', this.profileData.name)
        localStorage.setItem('profileImage', this.profileData.profileImage)
        localStorage.setItem('screenName', this.profileData.screenName)
        localStorage.setItem('statusesCount', this.profileData.statusesCount)
      }
    });
  }

  ngOnInit(){
    this.getProfileData();
    this.listTitles = ROUTES.filter(listTitle => listTitle);
    var navbar : HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
    this.router.events.subscribe((event) => {
      this.sidebarClose();
    });
  }
  getTitle(){
    // fetches title from the route
    var titlee = this.location.prepareExternalUrl(this.location.path());
    
    for(var item = 0; item < this.listTitles.length; item++){
        if(this.listTitles[item].path === titlee){
            return this.listTitles[item].title;
        }
    }

    return titlee.split('/')[1].replace('-',' ');
    // { path: '/calendar',     title: 'Scheduled Posts',         icon:'fa fa-calendar',       class: '' },
    // { path: '/newpost',     title: 'New Post',         icon:'fa fa-plus',       class: '' }
    
    // return 'Dashboard';
  }
  sidebarToggle() {
    if (this.sidebarVisible === false) {
        this.sidebarOpen();
    } else {
        this.sidebarClose();
    }
  }
  sidebarOpen() {
      const toggleButton = this.toggleButton;
      const html = document.getElementsByTagName('html')[0];
      const mainPanel =  <HTMLElement>document.getElementsByClassName('main-panel')[0];
      setTimeout(function(){
          toggleButton.classList.add('toggled');
      }, 500);

      html.classList.add('nav-open');
      if (window.innerWidth < 991) {
        mainPanel.style.position = 'fixed';
      }
      this.sidebarVisible = true;
  };
  sidebarClose() {
      const html = document.getElementsByTagName('html')[0];
      const mainPanel =  <HTMLElement>document.getElementsByClassName('main-panel')[0];
      if (window.innerWidth < 991) {
        setTimeout(function(){
          mainPanel.style.position = '';
        }, 500);
      }
      this.toggleButton.classList.remove('toggled');
      this.sidebarVisible = false;
      html.classList.remove('nav-open');
  };
  collapse(){
    this.isCollapsed = !this.isCollapsed;
    const navbar = document.getElementsByTagName('nav')[0];
    if (!this.isCollapsed) {
      navbar.classList.remove('navbar-transparent');
      navbar.classList.add('bg-white');
    }else{
      navbar.classList.add('navbar-transparent');
      navbar.classList.remove('bg-white');
    }
  }
  openTheme()
  {
    // <fixedplugin-cmp></fixedplugin-cmp>
    this._dialog
    .open(FixedPluginComponent, {
      width: "400px",
      maxHeight: "400px"
    })
  }

  logoutUser()
  {
    if(localStorage != undefined)
    {
      localStorage.removeItem('userid');
      localStorage.removeItem('authToken');
    }

    this.router.navigateByUrl("/login");
  }


  openDialog(): void {
    const dialogRef = this._dialog.open(ProfileDialogComponent, {
      width: '400px',
      data: {} 
    });
    dialogRef.afterClosed().subscribe(result => {
      result = JSON.stringify(result)
    });
  }
}
