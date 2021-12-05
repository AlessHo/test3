
import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';

import { ActivatedRoute } from '@angular/router';
import { isEmptyObject, param } from 'jquery';

import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.scss']
})
export class GuestComponent implements OnInit {

  totalAngularPackages;

  public name: string = '';
  public from: string = '';
  public to:  string = '';
  public guestsNumber : number = 0;
  public guestID : number = 0 ;

  public arrayDevices: Array<any> = [];

  constructor(private http: HttpClient, private route: ActivatedRoute, private dp: DatePipe) { 

  }
   
  
  public chartType: string = 'horizontalBar';

  public chartDatasets: Array<any> = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'My First dataset' }
  ];

  public chartLabels: Array<any> = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'];

  public chartColors: Array<any> = [
    {
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 2,
    }
  ];

  public chartOptions: any = {
    responsive: true
  };
  public chartClicked(e: any): void { }
  public chartHovered(e: any): void { }


  
  public pieChartType: string = 'pie';

  public pieChartDatasets: Array<any> = [
    { data: [], label: 'Total consumption per week' }
  ];

  public pieChartLabels: Array<any> = [];

  public pieChartColors: Array<any> = [
    {
      backgroundColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
        ],
      hoverBackgroundColor: [
        'rgba(255, 99, 132, 0.7)',
      'rgba(54, 162, 235, 0.7)',
      'rgba(255, 206, 86, 0.7)',
      'rgba(75, 192, 192, 0.7)',
      'rgba(153, 102, 255, 0.7)',
      'rgba(255, 159, 64, 0.7)'
      ],
      borderWidth: 2,
    }
  ];

  public pieChartOptions: any = {
    responsive: true
  };
  
  public pieChartClicked({ event, active }: { event: MouseEvent, active: any[] }): void { 
    var index = active[0]._index;
    //alert(this.pieChartLabels[index]);
    //alert(active[0]._index + 1);
    this.getConsumptionPerDay(active[0]._index + 1);
  }

  public pieChartHovered(e: any): void { }


  /* some code added by Aless */
  public lineChartType: string = 'line';

  public lineChartDatasets: Array<any> = [
    /*{ data: [65, 59, 80, 81, 56, 55, 40], label: 'My First dataset' },*/
    { data: [], label: 'Consumption per day' }
  ];

  public lineChartLabels: Array<any> = [];

  public lineChartColors: Array<any> = [   
    {
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 2,
    }
  ];

  public lineChartOptions: any = {
    responsive: true
  };
  public lineChartClicked(e: any): void { }
  public lineChartHovered(e: any): void { }


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

      this.route.queryParams
      .subscribe(params => {
        if(!params.isEmptyObject){
          //console.log(params); 
          // { orderby: "price" }
          //this.orderby = params.orderby;
          //console.log(this.orderby); // price      
          this.guestID = params.guestID;
          //this.getGuestInfo();
        }     
      }
    );

      this.getDevicesConsumption();




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

 /* getGuestInfo(){
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
*/
  getDevicesConsumption(){
    var useAI = 0;
    var devices = 3;
    if (this.guestID > 2) {
      useAI = 1;
      devices = 5
    }
 
    this.pieChartDatasets = [
      { data: [], label: 'Total consumption per week' }
    ];

    this.pieChartLabels  = [];

    var listdevices: Array<any> = []; 
    var totalDevice = [];

    for(var i = 1; i <= devices; i++){       
         
      var url = 'http://localhost:1701/dissagregatedRealPerDay/stayID/' + this.guestID+ '/deviceID/'+i+'/useAI/' + useAI;
 
      this.http.get<any>(url).subscribe(data => {
        var guestDevicesConsumption = data;
        var totalConsDevice = 0;
        listdevices.push(guestDevicesConsumption.device);

        for(var i = 0; i < guestDevicesConsumption.measurements.length; i++){       
           
          var value = (guestDevicesConsumption.measurements[i].power).toFixed(0)/100000;
          totalConsDevice = totalConsDevice + value;
        }   

        totalDevice.push(totalConsDevice);
      })
    }
     
    this.pieChartDatasets[0].data = totalDevice;
    this.pieChartLabels = listdevices;
  }



  getConsumptionPerDay(deviceID){

    var useAI = 0;
    var devices = 3;
    if (this.guestID > 2) {
      useAI = 1;
      devices = 5
    }

    this.lineChartDatasets  = [
      { data: [], label: 'Device Consumption per day' }
    ];
  
    this.lineChartLabels = []; //'Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6'
  

    var url = 'http://localhost:1701/dissagregatedRealPerHour/stayID/' + this.guestID+ '/deviceID/'+deviceID+'/useAI/' + useAI;
 
    this.http.get<any>(url).subscribe(data => {
    var conspDevice = data;

    var lineChartDatasetssss = [];
    var lineChartLabelsssss = [];

    for(var i = 0; i < conspDevice.measurements.length; i++){   

      var day = this.dp.transform(conspDevice.measurements[i].timestamp, 'hh:mm') ;
      var value = (conspDevice.measurements[i].power).toFixed(0)/100000;
      //var value = conspDevice.measurements[i].power;
      //this.lineChartDatasets[0].data.push(value);
      //this.lineChartLabels.push(day); 
      
      lineChartDatasetssss.push(value);
      lineChartLabelsssss.push(day); 
    
    }
    
    this.lineChartDatasets[0].data = lineChartDatasetssss;
    this.lineChartLabels = lineChartLabelsssss; 

      //console.log(guestData);
    })
  }

  getMaxValueOf(myArray) {
    return Math.max(...myArray);
  }
  
  getMinValueOf(myArray) {
    return Math.min(...myArray);
  }


}
