import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import Chart from 'chart.js';

@Component({
  selector: 'histogram',
  templateUrl: './histogram.component.html',
  styleUrls: ['./histogram.component.scss']
})
export class HistogramComponent implements OnInit, OnChanges {

  @Input() histogramResponseData;
  canvas: any;
  ctx;
  myBarChart;
  noGridLines = {}
  data;

  month = [];
  likes = [];
  comments = [];
  retweets = [];
  modifiedData;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes["histogramResponseData"].firstChange) {

      if (this.histogramResponseData.success)
        this.data = this.histogramResponseData["data"];
      else
        return;

      this.data = this.histogramResponseData["data"];

      this.data.forEach(element => {
        this.likes.push(element.sumFavoriteCount)
        this.comments.push(element.sumCommentCount)
        this.retweets.push(element.sumRetweetCount)
        this.month.push(element.month)
      });

      this.modifiedData = {
        labels: this.month,
        datasets: [
          {
            label: "Likes",
            backgroundColor: "#6bd098",
            data: this.likes
          },
          {
            label: "Retweets",
            backgroundColor: "#f17e5d",
            data: this.retweets
          },
          {
            label: "Comments",
            backgroundColor: "#fcc468",
            data: this.comments
          }
        ]
      }

      this.noGridLines = {
        xAxes: [{
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
          }
        }],
        yAxes: [{
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
          },
          ticks: {
            min: 0,
          }
        }]
      }

      this.createChart()
    }
  }

  createChart() {
    this.canvas = document.getElementById("histogram");
    this.ctx = this.canvas.getContext("2d");

    let options = {
      barValueSpacing: 20,
      scales: this.noGridLines,
      legend: {
        display: false
      },
      animation: false
    }

    this.myBarChart = new Chart(this.ctx, {
      type: 'bar',
      data: this.modifiedData,
      options: options
    });
  }

  mouseEnter() {
    this.noGridLines = {
      yAxes: [{
        ticks: {
          min: 0,
        }
      }]
    };

    this.myBarChart!=undefined?this.myBarChart.destroy():'';
    this.createChart()
  }

  mouseLeave() {
    this.noGridLines = {
      xAxes: [{
        gridLines: {
          color: "rgba(0, 0, 0, 0)",
        }
      }],
      yAxes: [{
        gridLines: {
          color: "rgba(0, 0, 0, 0)",
        },
        ticks: {
          min: 0,
        }
      }]
    }
    this.myBarChart!=undefined?this.myBarChart.destroy():'';
    this.createChart()
  }
}