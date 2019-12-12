import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
import { MatDialog } from '@angular/material';
import { SocialAccountLoginComponent } from '../social-account-login/social-account-login.component';
import { UserService } from 'app/shared/Services/user/user.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'dashboard-cmp',
  moduleId: module.id,
  templateUrl: 'dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  public KPIList: any[] = [];
  public canvas: any;
  public ctx;
  public chartColor;
  public chartEmail;
  public chartHours;
  public finalLineChartData = [];
  public histogramData = [];

  tweets = [
    {
      "profile_image": "http://pbs.twimg.com/profile_images/919586418174783489/usRQmm1H_normal.jpg",
      "screen_name": "ZeeNewsHindi",
      "name": "Zee News Hindi",
      "created_at": "12 Nov 2012",
      "tweet": "hi there, I am tweeting from Nodejs and angular."
    },
    {
      "profile_image": "http://pbs.twimg.com/profile_images/919586418174783489/usRQmm1H_normal.jpg",
      "screen_name": "ZeeNewsHindi",
      "name": "Zee News Hindi",
      "created_at": "12 Jan 2013",
      "tweet": "Hey, you still there?"
    },
    {
      "profile_image": "http://pbs.twimg.com/profile_images/919586418174783489/usRQmm1H_normal.jpg",
      "screen_name": "ZeeNewsHindi",
      "name": "Zee News Hindi",
      "created_at": "2 Nov 2012",
      "tweet": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos aliquid, itaque, dolor eius facilis alias quisquam odio ad debitis, quos consectetur velit sint distinctio similique neque sit cupiditate voluptates nostrum."
    },
    {
      "profile_image": "http://pbs.twimg.com/profile_images/919586418174783489/usRQmm1H_normal.jpg",
      "screen_name": "ZeeNewsHindi",
      "name": "Zee News Hindi",
      "created_at": "12 Nov 2012",
      "tweet": "hi there, I am tweeting from Nodejs and angular."
    },
    {
      "profile_image": "http://pbs.twimg.com/profile_images/919586418174783489/usRQmm1H_normal.jpg",
      "screen_name": "ZeeNewsHindi",
      "name": "Zee News Hindi",
      "created_at": "12 Jan 2013",
      "tweet": "Hey, you still there?"
    },
    {
      "profile_image": "http://pbs.twimg.com/profile_images/919586418174783489/usRQmm1H_normal.jpg",
      "screen_name": "ZeeNewsHindi",
      "name": "Zee News Hindi",
      "created_at": "2 Nov 2012",
      "tweet": "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos aliquid, itaque, dolor eius facilis alias quisquam odio ad debitis, quos consectetur velit sint distinctio similique neque sit cupiditate voluptates nostrum."
    }
  ]

  constructor(public _dialog: MatDialog, private _userService: UserService,
    private _activatedRoute: ActivatedRoute, private router: Router) {
  }

  getKPIData() {
    this._userService.getKPIData().subscribe(response => {
      if (response.success) {
        this.KPIList = [{
          iconClass: 'nc-icon nc-single-copy-04 text-warning',
          cardTitle: 'Posts',
          cardNumbers: (response.data["postsCount"] <= 0 ? '12' : response.data["postsCount"])
        }, {
          iconClass: 'fa fa-thumbs-up text-info',
          cardTitle: 'Favorites',
          cardNumbers: (response.data["favoriteCount"] <= 0 ? '304' : response.data["favoriteCount"])
        }, {
          iconClass: 'fa fa-eye text-primary',
          cardTitle: 'Retweets',
          cardNumbers: (response.data["retweetCount"] <= 0 ? '4.5K' : response.data["retweetCount"])
        }, {
          iconClass: 'fa fa-comment text-danger',
          cardTitle: 'Comments',
          cardNumbers: (response.data["commentsCount"] <= 0 ? '56' : response.data["commentsCount"])
        },];
      }
    },
      error => {
        Swal.fire({
          title:'Oops!',
          text:error.message,
          icon:'error'
        })
      });
  }

  getLineChartData() {
    this._userService.getLineChartData().subscribe(response => {
      if (response.success) {

        const positiveData: any = [];

        for (let key in response.data.countsData.positive) {
          if (response.data.countsData.positive.hasOwnProperty(key)) {
            positiveData.push({ type: 'positive', date: key, month: this.getMonthNameForDate(key), value: response.data.countsData.positive[key] });
          }
        }
        const positiveGroupByMonth = positiveData.reduce((acc, it) => {
          acc[it.month] = acc[it.month] + 1 || 1;
          return acc;
        }, {});

        const negativeData: any = [];

        for (let key in response.data.countsData.negative) {
          if (response.data.countsData.negative.hasOwnProperty(key)) {
            negativeData.push({ type: 'negative', date: key, month: this.getMonthNameForDate(key), value: response.data.countsData.negative[key] });
          }
        }
        const negativeGroupByMonth = negativeData.reduce((acc, it) => {
          acc[it.month] = acc[it.month] + 1 || 1;
          return acc;
        }, {});

        const positiveNegativeData: any = positiveData.concat(negativeData);

        const totalGroupByMonth = positiveNegativeData.reduce((acc, it) => {
          acc[it.month] = acc[it.month] + 1 || 1;
          return acc;
        }, {});


        for (let key in totalGroupByMonth) {
          const monthItem = {};
          monthItem["date"] = key
          if (positiveGroupByMonth.hasOwnProperty(key)) {
            monthItem["positive"] = positiveGroupByMonth[key];
          }
          else {
            monthItem["positive"] = 0;
          }

          if (negativeGroupByMonth.hasOwnProperty(key)) {
            monthItem["negative"] = negativeGroupByMonth[key];
          }
          else {
            monthItem["negative"] = 0;
          }
          monthItem["total"] = totalGroupByMonth[key];
          this.finalLineChartData.push(monthItem);
        }
      }
    },
      error => {
        Swal.fire({
          title:'Oops!',
          text:error.message,
          icon:'error'
        })
      });
  }

  getHistogramData() {
    this._userService.getHistogramData().subscribe(response => {
      if (response.success) {
        this.histogramData = response;
      }
    });
  }

  getMonthNameForDate(dateString: string): string {
    const date = new Date(dateString);  // 2009-11-10
    const month = date.toLocaleString('default', { month: 'short' });
    return month;
  }

  ngOnInit() {

    this._activatedRoute.queryParams.forEach((queryParams) => {
      if(queryParams["twitter"])
      {
        const dialog = this._dialog
        .open(SocialAccountLoginComponent, {
          width: "400px",
          maxHeight: "400px"
        }).afterClosed().subscribe(response=>{
          this.router.navigateByUrl('/dashboard/twitter');
        });       
      }
    });
    

    this.getKPIData();
    this.getLineChartData();
    this.getHistogramData();   
  }
}