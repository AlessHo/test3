import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';

import { ActivatedRoute } from '@angular/router';
import { isEmptyObject, param } from 'jquery';

import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  totalAngularPackages;

  public name: string = '';
  public from: string = '';
  public to:  string = '';
  public guestsNumber : number = 0;
  public guestID : number = 0 ;
  public stayingDays = 0;
  public sumAcc = 0;

  constructor(private http: HttpClient, private route: ActivatedRoute, private dp: DatePipe) { 

  }
   
       /* some code added by Aless */
        public chartType: string = 'line';

        public chartDatasets: Array<any> = [
          /*{ data: [65, 59, 80, 81, 56, 55, 40], label: 'My First dataset' },*/
          { data: [], label: 'Accumulated Kw of rental' }
        ];
  
        public chartLabels: Array<any> = [];
  
        public chartColors: Array<any> = [
          
          {
            backgroundColor: 'rgba(74, 191, 148, 0.2)',
            borderColor: 'rgba(74, 191, 133, 1)',
            borderWidth: 2,
          },{
            backgroundColor: 'rgba(75, 192, 192, 1)',
            borderColor: 'rgba(200, 99, 132, .7)',
            borderWidth: 2,
          }
        ];
  
        public chartOptions: any = {
          responsive: true
        };
        public chartClicked(e: any): void { }
        public chartHovered(e: any): void { }
  
        
        public barChartType: string = 'bar';

        // public barChartDatasets: Array<any> = [
        //   { data: [10, 11, 8, 12, 9, 17], label: 'Guest Consumption per day' }
        // ];

        // public barChartLabels: Array<any> = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6'];

        public barChartDatasets: Array<any> = [
          { data: [], label: 'Guest Consumption per day' }
        ];

        public barChartLabels: Array<any> = [];


        // public barChartColors: Array<any> = [
        //   {
        //     backgroundColor: [
        //       'rgba(255, 99, 132, 0.2)',
        //       'rgba(54, 162, 235, 0.2)',
        //       'rgba(255, 206, 86, 0.2)',
        //       'rgba(75, 192, 192, 0.2)',
        //       'rgba(153, 102, 255, 0.2)',
        //       'rgba(255, 159, 64, 0.2)'
        //     ],
        //     borderColor: [
        //       'rgba(255,99,132,1)',
        //       'rgba(54, 162, 235, 1)',
        //       'rgba(255, 206, 86, 1)',
        //       'rgba(75, 192, 192, 1)',
        //       'rgba(153, 102, 255, 1)',
        //       'rgba(255, 159, 64, 1)'
        //     ],
        //     borderWidth: 2,
        //   }
        // ];

        public barChartColors: Array<any> = [
          {
            backgroundColor: [
              'rgba(74, 191, 148, 0.2)',
              'rgba(74, 191, 148, 0.2)',
              'rgba(74, 191, 148, 0.2)',
              'rgba(74, 191, 148, 0.2)',
              'rgba(74, 191, 148, 0.2)',
              'rgba(74, 191, 148, 0.2)'
            ],
            borderColor: [
              'rgba(74, 191, 133, 1)',
              'rgba(74, 191, 133, 1)',
              'rgba(74, 191, 133, 1)',
              'rgba(74, 191, 133, 1)',
              'rgba(74, 191, 133, 1)',
              'rgba(74, 191, 133, 1)'
            ],
            borderWidth: 2,
          }
        ];

        public barChartOptions: any = {
          responsive: true,
          scales: {
            yAxes: [{
              ticks: {
                min: 1
              }
            }]
          }
        };
        public barChartClicked(e: any): void { }
        public barChartHovered(e: any): void { }

  startAnimationForLineChart(chart){
      let seq: any, delays: any, durations: any;
      seq = 0;
      delays = 80;
      durations = 500;

      chart.on('draw', function(data) {
        if(data.type === 'line' || data.type === 'area') {
          data.element.animate({
            d: {
              begin: 600,
              dur: 700,
              from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
              to: data.path.clone().stringify(),
              easing: Chartist.Svg.Easing.easeOutQuint
            }
          });
        } else if(data.type === 'point') {
              seq++;
              data.element.animate({
                opacity: {
                  begin: seq * delays,
                  dur: durations,
                  from: 0,
                  to: 1,
                  easing: 'ease'
                }
              });
          }
      });

      seq = 0;
  };
  startAnimationForBarChart(chart){
      let seq2: any, delays2: any, durations2: any;

      seq2 = 0;
      delays2 = 80;
      durations2 = 500;
      chart.on('draw', function(data) {
        if(data.type === 'bar'){
            seq2++;
            data.element.animate({
              opacity: {
                begin: seq2 * delays2,
                dur: durations2,
                from: 0,
                to: 1,
                easing: 'ease'
              }
            });
        }
      });

      seq2 = 0;
  };

  ngOnInit() {

    
      // Simple GET request with response type <any>
      /*this.http.get<any>('https://api.npms.io/v2/search?q=scope:angular').subscribe(data => {
          this.totalAngularPackages = data;
          console.log("Hello from outside for");
          console.log(this.totalAngularPackages);
          if(this.totalAngularPackages.total > 0){
            console.log("Hello");
            console.log(this.totalAngularPackages.results[0]);
          }
      })*/
      /* ----------==========     Daily Sales Chart initialization For Documentation    ==========---------- */

      this.route.queryParams
      .subscribe(params => {
        if(!params.isEmptyObject){
          //console.log(params); 
          // { orderby: "price" }
          //this.orderby = params.orderby;
          //console.log(this.orderby); // price      
          this.guestID = params.guestID;
          this.getGuestInfo();
          this.barChartLabels.length = 0;
          this.getAggregatedRealPerDay();
        }     
      }
    );

    const dataDailySalesChart: any = {
          labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
          series: [
              [12, 17, 7, 17, 23, 18, 38]
          ]
      };

     const optionsDailySalesChart: any = {
          lineSmooth: Chartist.Interpolation.cardinal({
              tension: 0
          }),
          low: 0,
          high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: { top: 0, right: 0, bottom: 0, left: 0},
      }

      var dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);

      this.startAnimationForLineChart(dailySalesChart);


      /* ----------==========     Completed Tasks Chart initialization    ==========---------- */

      const dataCompletedTasksChart: any = {
          labels: ['12p', '3p', '6p', '9p', '12p', '3a', '6a', '9a'],
          series: [
              [230, 750, 450, 300, 280, 240, 200, 190]
          ]
      };

     const optionsCompletedTasksChart: any = {
          lineSmooth: Chartist.Interpolation.cardinal({
              tension: 0
          }),
          low: 0,
          high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: { top: 0, right: 0, bottom: 0, left: 0}
      }

      var completedTasksChart = new Chartist.Line('#completedTasksChart', dataCompletedTasksChart, optionsCompletedTasksChart);

      // start animation for the Completed Tasks Chart - Line Chart
      this.startAnimationForLineChart(completedTasksChart);



      /* ----------==========     Emails Subscription Chart initialization    ==========---------- */

      var datawebsiteViewsChart = {
        labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
        series: [
          [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]

        ]
      };
      var optionswebsiteViewsChart = {
          axisX: {
              showGrid: false
          },
          low: 0,
          high: 1000,
          chartPadding: { top: 0, right: 5, bottom: 0, left: 0}
      };
      var responsiveOptions: any[] = [
        ['screen and (max-width: 640px)', {
          seriesBarDistance: 5,
          axisX: {
            labelInterpolationFnc: function (value) {
              return value[0];
            }
          }
        }]
      ];
      var websiteViewsChart = new Chartist.Bar('#websiteViewsChart', datawebsiteViewsChart, optionswebsiteViewsChart, responsiveOptions);

      //start animation for the Emails Subscription Chart
      this.startAnimationForBarChart(websiteViewsChart);
  }

  getGuestInfo(){
    var url = 'http://localhost:1701/stayID/' + this.guestID;
    this.http.get<any>(url).subscribe(data => {
      var guestData = data;
      //console.log(guestData);

      this.name = guestData.guest;
      this.guestsNumber = guestData.numGuests;
      this.from = guestData.from;
      this.to = guestData.to;
  })
  }

 getAggregatedRealPerDay(){
    var url = 'http://localhost:1701/aggregatedRealPerDay/' + this.guestID;
    this.http.get<any>(url).subscribe(data => {
      var measurements = data.measurements;
       
      this.barChartDatasets = [
        { data: [], label: 'Guest Consumption per day' }
      ];

      this.barChartLabels  = [];

      this.chartDatasets = [ 
        { data: [], label: 'Accumulated Kw of rental' }
      ];

      this.chartLabels = [];


      this.sumAcc = 0;

      for(var i = 0; i < measurements.length; i++){       
        var day = this.dp.transform(measurements[i].timestamp, 'MMM-dd') ;
        var value = (measurements[i].power).toFixed(0)/100000;
        this.barChartDatasets[0].data.push(value);
        this.barChartLabels.push(day); 

        this.stayingDays = this.barChartLabels.length;

        this.sumAcc = this.sumAcc + value;
        this.chartDatasets[0].data.push(this.sumAcc);
        this.chartLabels.push(day); 

      }   
  })
  }
}
