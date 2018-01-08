import { Component, OnInit } from '@angular/core';
import { TableData } from '../md/md-table/md-table.component';
import { Http, Headers } from "@angular/http";
import 'rxjs/add/operator/map';
import { LocalStorageService } from 'angular-2-local-storage';
import { environment } from 'environments/environment';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';

declare var require: any
declare var $: any;
declare interface Table_With_Checkboxes {
    id?: number;
    ischecked?: boolean;
    product_name: string;
    type: string;
    quantity: number;
    price: any;
    amount: string;
}

export interface TableData2 {
    headerRow: string[];
    dataRows: Table_With_Checkboxes[];
}

@Component({
    moduleId: module.id,
    selector: 'workinghours-cmp',
    templateUrl: 'workingHours.html'
})

export class WorkingHoursComponent implements OnInit {

    public tableData1: TableData;
    public showLoading: boolean;
    public showLoadingDelete: boolean;

    public userModel: any;

    public formatDate: any;
    public start_initial: any;
    public end_initial: any;

    public dateRangeLabel: any;
    public headers: any;

    public hoursDetails: any;

    public formatDateUS: any;
    public totalWorkedHours: any;
    public sumWorkedHours: any;
    public workedHours: any;
    public totalHours: any;
    public hoursDiff: any;
    public hoursDiff2: any;
    public hoursDiff_break: any;
    public hoursDiff_final: any;
    public hours: any;
    public hours2: any;
    public hours_break: any;
    public hours_final: any;
    public minutes: any;
    public minutes2: any;
    public minutes_break: any;
    public minutes_final: any;
    public final_time: any;
    public worked_versus_break: any;

    public listUsers: any;

    public initialRange: any;

    f: NgForm;
    http: Http;

    constructor(http: Http, private localStorageService: LocalStorageService) {
        this.http = http;
    }

    public apiUrl = environment.apiUrl;

    ngOnInit() {
        this.userModel = <any>{};
        this.userModel = this.localStorageService.get('user');

        this.formatDate = function func(date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [day, month, year].join('/');
        }

        this.formatDateUS = function func(date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [day, month, year].join('/');
        }

        this.sumWorkedHours = "00:00";
        this.totalWorkedHours = function (hours) {
            var hour;
            var minute;

            var currentSplitTime = this.sumWorkedHours.split(':');

            var time = hours;
            var splitTime = time.split(':');

            hour = parseInt(splitTime[0], 10) + parseInt(currentSplitTime[0], 10);
            minute = parseInt(splitTime[1], 10) + parseInt(currentSplitTime[1], 10);
            if (minute > 60) {
                hour = hour + Math.floor(minute / 60);
                minute = minute % 60;
            }
            
            if (hour < 10) {
                hour = "0"+hour;
            }
            if (minute < 10) {
                minute = "0"+minute;
            }
    
            this.sumWorkedHours = hour + ":" + minute;
        }

        this.workedHours = function (date, start, end, breakStart, breakEnd) {
            var date_iteration = new Date(date);
            if (!start || !end || !breakStart || !breakEnd) {
                return '00:00';
            } else {
                var start_iteration = start.split(':');
                var end_iteration = end.split(':');
                var breakStart_iteration = breakStart.split(':');
                var breakEnd_iteration = breakEnd.split(':');

                var a = moment([date_iteration.getFullYear(), date_iteration.getMonth(), date_iteration.getDate(), start_iteration[0], start_iteration[1]]);
                var b = moment([date_iteration.getFullYear(), date_iteration.getMonth(), date_iteration.getDate(), end_iteration[0], end_iteration[1]]);

                var a2 = moment([date_iteration.getFullYear(), date_iteration.getMonth(), date_iteration.getDate(), breakStart_iteration[0], breakStart_iteration[1]]);
                var b2 = moment([date_iteration.getFullYear(), date_iteration.getMonth(), date_iteration.getDate(), breakEnd_iteration[0], breakEnd_iteration[1]]);

                this.hoursDiff_break = moment.duration(b2.diff(a2));

                this.hours_break = parseInt(this.hoursDiff_break.asHours());
                this.minutes_break = parseInt(this.hoursDiff_break.asMinutes()) - this.hours_break * 60;

                this.hoursDiff = moment.duration(b.diff(a));

                this.hours = parseInt(this.hoursDiff.asHours());
                this.minutes = parseInt(this.hoursDiff.asMinutes()) - this.hours * 60;
                var worked = moment([date_iteration.getFullYear(), date_iteration.getMonth(), date_iteration.getDate(), this.hours, this.minutes]);

                this.worked_versus_break = moment([date_iteration.getFullYear(), date_iteration.getMonth(), date_iteration.getDate(), this.hours, this.minutes]).subtract(this.hours_break, 'hours').subtract(this.minutes_break, 'minutes');

                this.hour_final = this.worked_versus_break.hour();
                this.minutes_final = this.worked_versus_break.minute();

                if (this.hour_final <= 9) {
                    this.hour_final = "0" + this.hour_final;
                }
                if (this.minutes_final <= 9) {
                    this.minutes_final = "0" + this.minutes_final;
                }

                return this.hour_final + ':' + this.minutes_final + '';
            }
        }

        this.totalHours = function (date, start, end, breakStart, breakEnd) {
            if (!start || !end || !breakStart || !breakEnd) {
                return '00:00';
            } else {
                var date_iteration = new Date(date);
                var worked_hours = this.workedHours(date, start, end, breakStart, breakEnd)
                var start_iteration = worked_hours.split(':');

                var a = moment([date_iteration.getFullYear(), date_iteration.getMonth(), date_iteration.getDate(), 8, 0]);

                this.hoursDiff2 = moment([date_iteration.getFullYear(), date_iteration.getMonth(), date_iteration.getDate(), start_iteration[0], start_iteration[1]]);

                this.hoursDiff_final = moment.duration(this.hoursDiff2.diff(a));

                this.hours2 = parseInt(this.hoursDiff_final.asHours());
                this.minutes2 = parseInt(this.hoursDiff_final.asMinutes()) - this.hours2 * 60;

                var addMinus = "+";
                if (this.minutes2 < 0) {
                    this.minutes2 = this.minutes2.toString().replace('-', '');
                    addMinus = "-";
                }

                if (this.minutes2 <= 9) {
                    this.minutes2 = "0" + this.minutes2;
                }

                if (this.hours2 < 0) {
                    this.hours2 = this.hours2.toString().replace('-', '');
                    addMinus = "-";
                }
                if (this.hours2 <= 9) {
                    this.hours2 = "0" + this.hours2;
                }
                if (this.hours2 == 0) {
                    this.hours2 = "00";
                }
                if (this.hours2 == 0 && this.minutes2 == 0) {
                    addMinus = "";
                }

                return addMinus + this.hours2 + ':' + this.minutes2 + '';
            }
        }

        this.hoursDetails = {
            rowKey: null,
            agent: {
                rowKey: null,
                fullname: null,
                email: null,
                team: {
                    project: "msite",
                    managers: []
                }
            },
            workingHours: {
                start: null,
                end: null
            },
            date: null,
            start: null,
            end: null,
            index: 0
        }

        this.start_initial = this.formatDate(new Date());
        this.end_initial = this.formatDate(new Date());

        this.dateRangeLabel = this.start_initial;

        this.tableData1 = {
            headerRow: ['Agent', 'Cognizant ID', 'Date', 'Start', 'Break Start', 'Break End', 'End', 'Worked Hours', 'Total', 'Actions'],
            dataRows: []
        };

        $('.datepicker').datetimepicker({
            format: 'DD/MM/YYYY',
            icons: {
                time: "fa fa-clock-o",
                date: "fa fa-calendar",
                up: "fa fa-chevron-up",
                down: "fa fa-chevron-down",
                previous: 'fa fa-chevron-left',
                next: 'fa fa-chevron-right',
                today: 'fa fa-screenshot',
                clear: 'fa fa-trash',
                close: 'fa fa-remove',
                inline: true
            }
        });

        $('.timepicker').datetimepicker({
            format: 'HH:mm',    // use this format if you want the 24hours timepicker
            //format: 'h:mm A',    //use this format if you want the 12hours timpiecker with AM/PM toggle
            icons: {
                time: "fa fa-clock-o",
                date: "fa fa-calendar",
                up: "fa fa-chevron-up",
                down: "fa fa-chevron-down",
                previous: 'fa fa-chevron-left',
                next: 'fa fa-chevron-right',
                today: 'fa fa-screenshot',
                clear: 'fa fa-trash',
                close: 'fa fa-remove',
                inline: true

            }
        }).on('changeDate', function (ev) {
            console.log(ev);
        });

        this.userModel = this.localStorageService.get('user');

        this.showLoading = true;

        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Authorization', 'Bearer ' + this.userModel.token);

        //  Init Bootstrap Select Picker
        if ($(".selectpicker").length != 0) {
            $(".selectpicker").selectpicker();
        }

        var start_onLoad = this.start_initial.split('/');
        var end_onLoad = this.end_initial.split('/');

        start_onLoad = new Date(start_onLoad[2] + '-' + start_onLoad[1] + '-' + start_onLoad[0] + ' 00:00:00');
        end_onLoad = new Date(end_onLoad[2] + '-' + end_onLoad[1] + '-' + end_onLoad[0] + ' 23:59:00');

        this.initialRange = {
            rowKey: this.userModel.rowKey,
            start: start_onLoad.toISOString(),
            end: end_onLoad.toISOString()
        }

        if (this.userModel.roleLevel == 1) {
            this.initialRange.agent = this.userModel;
        }

        this.http.post(this.apiUrl + 'workinghours/daterange', JSON.stringify(this.initialRange), { headers: this.headers })
            .subscribe((results) => {
                var res = JSON.parse(results.text());
                var counter = 0;

                for (let data of res) {

                    var workedHours = this.workedHours(data.date, data.start, data.end, data.breakStart, data.breakEnd);
                    var totalHours = this.totalHours(data.date, data.start, data.end, data.breakStart, data.breakEnd)
                    this.totalWorkedHours(workedHours);

                    this.tableData1.dataRows.push([
                        data.agent.fullname,
                        data.agent.cognizantId,
                        data.date,
                        data.start,
                        data.breakStart,
                        data.breakEnd,
                        data.end,
                        workedHours,
                        totalHours,
                        '',
                        data
                    ]);
                }
                this.showLoading = false;
            }, error => {
                console.log(error.text());
                var errors = error;
                for (let data of errors) {
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

        this.http.get(this.apiUrl + 'users/list/' + this.userModel.rowKey, { headers: this.headers })
            .subscribe((results) => {
                var res = JSON.parse(results.text());
                this.listUsers = res;
                setTimeout(() => {
                    //  Init Bootstrap Select Picker
                    if ($(".selectpicker").length != 0) {
                        $(".selectpicker").selectpicker();
                        $("select[name=agent]").selectpicker("refresh");
                    }
                }, 500);
            }, error => {
                console.log(error.text());
                var errors = error;
                for (let data of errors) {
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
    }

    ngAfterViewInit() { }

    dateRange() {
        this.sumWorkedHours = "00:00";
        var start_temp = $('#start').val().split('/');
        var end_temp = $('#end').val().split('/');
        this.dateRangeLabel = $('#start').val() + " - " + $('#end').val();

        start_temp = new Date(start_temp[2] + '-' + start_temp[1] + '-' + start_temp[0] + ' 00:00:00');
        end_temp = new Date(end_temp[2] + '-' + end_temp[1] + '-' + end_temp[0] + ' 23:59:00');

        var agentSelect = "All";

        if (this.hoursDetails.agent.rowKey && this.userModel.roleLevel == 0) {
            agentSelect = this.hoursDetails.agent;
        } else if (this.userModel.roleLevel == 1) {
            agentSelect = this.userModel;
        }

        var range = {
            rowKey: this.userModel.rowKey,
            start: start_temp.toISOString(),
            end: end_temp.toISOString(),
            agent: agentSelect
        }

        /* if (this.userModel.roleLevel == 1) {
            range.agent = this.userModel;
        } */

        this.tableData1.dataRows = [];
        this.showLoading = true;

        this.http.post(this.apiUrl + 'workinghours/daterange', JSON.stringify(range), { headers: this.headers })
            .subscribe((results) => {
                var res = JSON.parse(results.text());
                $('#date_range').modal('hide');
                for (let data of res) {

                    var workedHours = this.workedHours(data.date, data.start, data.end, data.breakStart, data.breakEnd);
                    var totalHours = this.totalHours(data.date, data.start, data.end, data.breakStart, data.breakEnd);
                    this.totalWorkedHours(workedHours);

                    this.tableData1.dataRows.push([
                        data.agent.fullname,
                        data.agent.cognizantId,
                        data.date,
                        data.start,
                        data.breakStart,
                        data.breakEnd,
                        data.end,
                        workedHours,
                        totalHours,
                        '',
                        data
                    ]);
                }
                this.showLoading = false;
            }, error => {
                console.log(error.text());
                $('#date_range').modal('hide');
                var errors = error;
                for (let data of errors) {
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
    }

    openDetails(value: any, index: any): void {
        console.log(index);
        this.hoursDetails = value;
        this.hoursDetails.index = index;
    }

    save() {
        console.log(this.hoursDetails.index);
        this.showLoading = true;
        var startEdit = $('#startEdit').val();
        var endEdit = $('#endEdit').val();

        var breakStartEdit = $('#breakStartEdit').val();
        var breakEndEdit = $('#breakEndEdit').val();

        if (!startEdit) {
            startEdit = null;
        }
        if (!endEdit) {
            endEdit = null;
        }
        if (!breakStartEdit) {
            breakStartEdit = null;
        }
        if (!breakEndEdit) {
            breakEndEdit = null;
        }

        var newLog = {
            "rowKey": this.hoursDetails.rowKey,
            "start": startEdit,
            "end": endEdit,
            "breakStart": breakStartEdit,
            "breakEnd": breakEndEdit
        }

        this.http.post(this.apiUrl + 'workinghours/edit', JSON.stringify(newLog), { headers: this.headers })
            .subscribe((results) => {
                var res = JSON.parse(results.text());
                console.log(res);
                $('#edit').modal('hide');
                $.notify({
                    icon: "add_alert",
                    message: "Record updated!"
                }, {
                        type: 'success',
                        timer: 4000,
                        placement: {
                            from: 'top',
                            align: 'center'
                        }
                    });
                this.showLoading = false;

                this.tableData1.dataRows[this.hoursDetails.index][3] = startEdit;
                this.tableData1.dataRows[this.hoursDetails.index][6] = endEdit;

                this.tableData1.dataRows[this.hoursDetails.index][4] = breakStartEdit;
                this.tableData1.dataRows[this.hoursDetails.index][5] = breakEndEdit;

                this.tableData1.dataRows[this.hoursDetails.index][7] = this.workedHours(this.tableData1.dataRows[this.hoursDetails.index][2], startEdit, endEdit, breakStartEdit, breakEndEdit);
                this.tableData1.dataRows[this.hoursDetails.index][8] = this.totalHours(this.tableData1.dataRows[this.hoursDetails.index][2], startEdit, endEdit, breakStartEdit, breakEndEdit);

            }, error => {
                var errors = JSON.parse(error._body);
                this.showLoading = false;
                for (let data of errors) {
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
    }


    tableToExcel(name) {
        let uri = 'data:application/vnd.ms-excel;base64,'
            , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>'
            , base64 = function (s) { return window.btoa(decodeURIComponent(encodeURIComponent(s))) }
            , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
        var table = document.getElementById('workinghours');
        var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }
        //window.location.href = uri + base64(format(template, ctx))
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;      // "+ 1" becouse the 1st month is 0
        var day = date.getDate();
        var hour = date.getHours();
        var minutes = date.getMinutes();
        var secconds = date.getSeconds()

        var link = document.createElement("a");
        link.download = "msite-working-hours-" + month + "." + day + "." + year + "-" + hour + "-" + minutes + "-" + secconds + ".xls";
        link.href = uri + base64(format(template, ctx));
        link.click();
    }


    confirmDelete(rowKey: any, index: any): void {
        this.showLoadingDelete = true;
        console.log(index);

        this.http.post(this.apiUrl + 'workinghours/delete', {
            "rowKey": rowKey
        }, { headers: this.headers })
            .subscribe((results) => {
                var res = JSON.parse(results.text());
                console.log(res);
                this.showLoadingDelete = false;
                $('#delete').modal('hide');
                $('#edit').modal('hide');
                this.tableData1.dataRows.splice(index, 1);
                $.notify({
                    icon: "add_alert",
                    message: "Record deleted!"
                }, {
                        type: 'info',
                        timer: 4000,
                        placement: {
                            from: 'top',
                            align: 'center'
                        }
                    });
            }, error => {
                this.showLoadingDelete = false;
                console.log(error.text());
                var errors = error;
                for (let data of errors) {
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

    }


}
