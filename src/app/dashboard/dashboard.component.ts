import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TableData } from '../md/md-table/md-table.component';
import { Http, Headers, Jsonp } from "@angular/http";
import 'rxjs/add/operator/map';
import {
    CanActivate, Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { environment } from 'environments/environment';
import * as Chartist from 'chartist';

declare var $: any;

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, AfterViewInit {
    // constructor(private navbarTitleService: NavbarTitleService, private notificationService: NotificationService) { }
    public tableData: TableData;
    public date;

    http: Http;

    jsonp:Jsonp;


    

    constructor(http: Http, jsonp:Jsonp, private localStorageService: LocalStorageService, private router: Router) {
        this.http = http;
        this.jsonp = jsonp;
    }

    public apiUrl = environment.apiUrl;
    public headers: any;
    public workingHours: any;
    public userModel: any;
    public formatDate: any;
    public logStart: boolean;
    public logEnd: boolean;
    public logBreakStart: boolean;
    public logBreakEnd: boolean;
    public startLogged: any;
    public endLogged: any;
    public breakStartLogged: any;
    public breakEndLogged: any;
    public logRowKey: any;
    public showLoadingStart: boolean;
    public showLoadingEnd: boolean;
    public showLoadingBreakStart: boolean;
    public showLoadingBreakEnd: boolean;

    public showLoadingDashboard: boolean = true;

    public remoteIpAddress: string;

    public startDate: any;
    public displayTime: any;
    public hours: any;
    public minutes: any;
    public seconds: any;
    public counter: any;

    public randomString: any;


    public ngOnInit() {
        this.userModel = <any>{};
        this.userModel = this.localStorageService.get('user');

        this.showLoadingEnd = false;
        this.showLoadingStart = false;
        //this.endLogged = "--:--:--";
        this.endLogged = "--:--";
        this.breakEndLogged = "--:--";
        this.breakStartLogged = "--:--";
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Authorization', 'Bearer ' + this.userModel.token);

        this.counter = 0;

        this.formatDate = function func(date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [year, month, day].join('-');
        }

        this.displayTime = function func(startDate) {

            var currentTime = new Date(startDate);
            currentTime.setSeconds(currentTime.getSeconds() + 1);
            this.startDate = currentTime;
            this.hours = currentTime.getHours();
            this.minutes = currentTime.getMinutes();
            this.seconds = currentTime.getSeconds();

            var meridiem = "am";  // Default is AM

            // if (this.hours > 12) {
            //   this.hours = this.hours - 12; // Convert to 12-hour format
            // meridiem = "PM"; // Keep track of the meridiem
            // }

            if (this.hours === 0) {
                this.hours = 12;
            }

            if (this.hours < 10) {
                this.hours = "0" + this.hours;
            }

            if (this.minutes < 10) {
                this.minutes = "0" + this.minutes;
            }
            if (this.seconds < 10) {
                this.seconds = "0" + this.seconds;
            }

            this.date = this.hours + ":" + this.minutes;
        }
        this.randomString = function func(length, chars) {
            var result = '';
            for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
            return result;
        }



        this.http.get('/servertime.php?v=' + this.randomString(64, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'))
            .subscribe((results) => {
                this.startDate = new Date(results.headers.get('Date'));
                this.displayTime(this.startDate);

            });

        setInterval(() => {
            this.http.get('/servertime.php?v=' + this.randomString(64, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'))
                .subscribe((results) => {
                    this.startDate = new Date(results.headers.get('Date'));
                    this.displayTime(this.startDate);
                });
        }, 2000);

        var start_temp = new Date();
        var end_temp = new Date();
        start_temp.setHours(0, 0, 0, 0);
        end_temp.setHours(23, 59, 0, 0);
        this.workingHours = {
            "rowKey": this.userModel.rowKey,
            "start": start_temp.toISOString(),
            "end": end_temp.toISOString()
        }
        this.logStart = true;




        this.http.post(this.apiUrl + 'workinghours', JSON.stringify(this.workingHours), { headers: this.headers })
            .subscribe((results) => {
                var res = JSON.parse(results.text());
                this.showLoadingDashboard = false;
                if (res) {
                    if (res.start != null) {
                        this.logStart = false;
                        this.startLogged = res.start;
                        this.logBreakStart = true;
                    }
                    if (res.breakStart != null) {
                        this.logBreakStart = false;
                        this.breakStartLogged = res.breakStart;
                        this.logBreakEnd = true;
                    }
                    if (res.breakEnd != null) {
                        this.logBreakEnd = false;
                        this.breakEndLogged = res.breakEnd;
                        this.logEnd = true;
                    }
                    if (res.end != null) {
                        this.logEnd = false;
                        this.endLogged = res.end;
                    }

                    this.logRowKey = res.rowKey;
                }
            }, error => {
                this.showLoadingDashboard = false;
                var errors = JSON.parse(error._body);

                for (let data of errors) {
                    console.log(data);
                    $.notify({
                        icon: "add_alert",
                        message: data.msg
                    }, {
                            type: 'danger',
                            timer: 4000,
                            placement: {
                                from: 'top',
                                align: 'center'
                            }
                        });
                }
            });

        this.tableData = {
            headerRow: ['ID', 'Name', 'Salary', 'Country', 'City'],
            dataRows: [
                ['US', 'USA', '2.920	', '53.23%'],
                ['DE', 'Germany', '1.300', '20.43%'],
                ['AU', 'Australia', '760', '10.35%'],
                ['GB', 'United Kingdom	', '690', '7.87%'],
                ['RO', 'Romania', '600', '5.94%'],
                ['BR', 'Brasil', '550', '4.34%']
            ]
        };
       
    }
    ngAfterViewInit() {
        var breakCards = true;
        if (breakCards == true) {
            // We break the cards headers if there is too much stress on them :-)
            $('[data-header-animation="true"]').each(function () {
                var $fix_button = $(this);
                var $card = $(this).parent('.card');
                $card.find('.fix-broken-card').click(function () {
                    console.log(this);
                    var $header = $(this).parent().parent().siblings('.card-header, .card-image');
                    $header.removeClass('hinge').addClass('fadeInDown');

                    $card.attr('data-count', 0);

                    setTimeout(function () {
                        $header.removeClass('fadeInDown animate');
                    }, 480);
                });

                $card.mouseenter(function () {
                    var $this = $(this);
                    var hover_count = parseInt($this.attr('data-count'), 10) + 1 || 0;
                    $this.attr("data-count", hover_count);
                    if (hover_count >= 20) {
                        $(this).children('.card-header, .card-image').addClass('hinge animated');
                    }
                });
            });
        }
        //  Activate the tooltips
        $('[rel="tooltip"]').tooltip();
    }

    LogUpdate(hour, slot) {
        var newLog = {
            "rowKey": null,
            "agent": {
                "rowKey": this.userModel.rowKey,
                "fullname": this.userModel.fullname,
                "email": this.userModel.email,
                "cognizantId": this.userModel.cognizantId,
                "team": this.userModel.team
            },
            "workingHours": {
                "start": this.userModel.workingHours.start,
                "end": this.userModel.workingHours.end
            },
            "date": new Date(),
            "start": null,
            "breakStart": null,
            "breakEnd": null,
            "end": null,
            "remoteIpAddress": null
        }

        if (slot == 0) {
            this.showLoadingStart = true;
            newLog.start = hour;
        } else if (slot == 1) {
            this.showLoadingBreakStart = true;
            newLog.rowKey = this.logRowKey;
            newLog.breakStart = hour;
        } else if (slot == 2) {
            this.showLoadingBreakEnd = true;
            newLog.rowKey = this.logRowKey;
            newLog.breakEnd = hour;
        } else if (slot == 3) {
            this.showLoadingEnd = true;
            newLog.rowKey = this.logRowKey;
            newLog.end = hour;
        } else if (slot == 4) {
            this.showLoadingStart = true;
            this.showLoadingBreakEnd = true;
            newLog.start = hour;
            newLog.breakStart = hour;
            newLog.rowKey = this.logRowKey;
            newLog.breakEnd = hour;
        }

        console.log(newLog);

        this.jsonp.get('//api.ipify.org/?format=jsonp&callback=JSONP_CALLBACK')
        .subscribe((response) => {
            var res = JSON.parse(response.text());
            this.remoteIpAddress = res.ip;

            newLog.remoteIpAddress = this.remoteIpAddress;

            this.http.post(this.apiUrl + 'workinghours/log', JSON.stringify(newLog), { headers: this.headers })
            .subscribe((results) => {
                var res = JSON.parse(results.text());
                this.logRowKey = res.rowKey;

                if (slot == 0) {
                    this.showLoadingStart = false;
                    this.logStart = false;
                    this.startLogged = res.start;
                    this.logBreakStart = true;
                    $.notify({
                        icon: "add_alert",
                        message: "Welcome, " + this.userModel.fullname + "!"
                    }, {
                            type: 'success',
                            timer: 4000,
                            placement: {
                                from: 'top',
                                align: 'center'
                            }
                        });

                } else if (slot == 1) {
                    this.showLoadingBreakStart = false;
                    this.logBreakStart = false;
                    this.breakStartLogged = res.breakStart;

                    this.logBreakEnd = true;
                    $.notify({
                        icon: "add_alert",
                        message: "See you soon, " + this.userModel.fullname + "..."
                    }, {
                            type: 'success',
                            timer: 4000,
                            placement: {
                                from: 'top',
                                align: 'center'
                            }
                        });

                } else if (slot == 2) {
                    this.showLoadingBreakEnd = false;
                    this.logBreakEnd = false;
                    this.breakEndLogged = res.breakEnd;

                    this.logEnd = true;

                    $.notify({
                        icon: "add_alert",
                        message: "Welcome back, " + this.userModel.fullname + "!"
                    }, {
                            type: 'success',
                            timer: 4000,
                            placement: {
                                from: 'top',
                                align: 'center'
                            }
                        });

                } else if (slot == 3) {
                    this.showLoadingEnd = false;
                    this.logEnd = false;
                    this.endLogged = res.end;


                    $.notify({
                        icon: "add_alert",
                        message: "Good-bye, " + this.userModel.fullname + "! Go home now..."
                    }, {
                            type: 'success',
                            timer: 4000,
                            placement: {
                                from: 'top',
                                align: 'center'
                            }
                        });

                    this.localStorageService.remove('user');
                    this.router.navigate(['/pages/login']);

                } else if (slot == 4) {
                    
                    this.showLoadingStart = false;
                    this.logStart = false;
                    this.startLogged = res.start;
                    this.logBreakStart = true;

                    this.showLoadingBreakEnd = false;
                    this.logBreakEnd = false;
                    this.breakEndLogged = res.breakEnd;

                    this.logEnd = true;
                    
                    $.notify({
                        icon: "add_alert",
                        message: "Welcome, " + this.userModel.fullname + "!"
                    }, {
                            type: 'success',
                            timer: 4000,
                            placement: {
                                from: 'top',
                                align: 'center'
                            }
                        });

                }
            }, error => {
                var errors = JSON.parse(error._body);
                this.showLoadingStart = false;
                this.showLoadingBreakStart = false;
                this.showLoadingBreakEnd = false;
                this.showLoadingEnd = false;
                $.notify({
                    icon: "add_alert",
                    message: errors.error
                }, {
                        type: 'danger',
                        timer: 4000,
                        placement: {
                            from: 'top',
                            align: 'center'
                        }
                    });

            });



        }
        );


       /*   */
    }
}
