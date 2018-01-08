import { Component, OnInit } from '@angular/core';
import { TableData } from '../md/md-table/md-table.component';
import { Http, Headers } from "@angular/http";
import 'rxjs/add/operator/map';
import { LocalStorageService } from 'angular-2-local-storage';
import { environment } from 'environments/environment';
import { NgForm } from '@angular/forms';
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

declare interface agentDetailsModel {
    rowKey?: string,
    fullname?: string,
    cognizantId?: string,
    email?: string,
    market?: any,
    language?: any,
    workingHours?: any,
    team?: any,
    enabled?: boolean,
    index?: number
}


export interface TableData2 {
    headerRow: string[];
    dataRows: Table_With_Checkboxes[];
}



@Component({
    moduleId: module.id,
    selector: 'manage-cmp',
    templateUrl: 'manage.html'
})

export class AgentsManageComponent implements OnInit {
    public tableData1: TableData;
    public showLoading: boolean;
    public showLoadingPSI: boolean;
    public showLoadingWPT: boolean;
    public showLoadingDelete: boolean;
   
    public statusWPT: any;
    public statusPSI: any;
    public headers: any;

    public listMarkets: any[] = [];
    public listLanguages: any[] = [];


    public agentDetails: agentDetailsModel;




    f: NgForm;
    http: Http;

    constructor(http: Http, private localStorageService: LocalStorageService) {
        this.http = http;
    }

    public apiUrl = environment.apiUrl;


    ngOnInit() {
        // Init Tooltips
        // $('[rel="tooltip"]').tooltip();
        this.tableData1 = {
            headerRow: ['#', 'Full Name', 'Cognizant ID', 'E-mail', 'Status', 'Actions'],
            dataRows: []
        };


        this.agentDetails = {
            "rowKey": "",
            "fullname": "",
            "cognizantId": "",
            "email": "",
            "market": {},
            "language": {},
            "workingHours": {},
            "team": {},
            "enabled": true,
            "index": 0
        }
        var userModel = <any>{};

        userModel = this.localStorageService.get('user');

        this.showLoading = true;
        this.showLoadingDelete = false;

        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Authorization', 'Bearer ' + userModel.token);

        //  Init Bootstrap Select Picker
        if ($(".selectpicker").length != 0) {
            $(".selectpicker").selectpicker();
        }

        if($(".tagsinput").length != 0){
            $(".tagsinput").tagsinput();
        }

        $('.timepicker').datetimepicker({
                       //format: 'H:mm',    // use this format if you want the 24hours timepicker
                       format: 'h:mm A',    //use this format if you want the 12hours timpiecker with AM/PM toggle
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
                     }).on('changeDate', function(ev){
                         console.log(ev);
                     });

        this.http.get(this.apiUrl + 'users/list/' + userModel.rowKey, { headers: this.headers })
            .subscribe((results) => {

                var res = JSON.parse(results.text());
                console.log(res);
                var counter = 0;
                for (let data of res) {
                    counter = counter + 1;
                    var agentStatus = "Active";
                    if (!data.enabled) {
                        agentStatus = "Inactive";
                    }
                    this.tableData1.dataRows.push([
                        counter.toLocaleString(),
                        data.fullname,
                        data.cognizantId,
                        data.email,
                        agentStatus,
                        '',
                        data
                    ]);
                }
                $('[rel="tooltip"]').tooltip();
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


        this.http.get(this.apiUrl + 'markets/list', { headers: this.headers })
            .subscribe((results) => {
                var res = JSON.parse(results.text());
                this.listMarkets = res;
                console.log(this.listMarkets);
                setTimeout(() => {
                    //  Init Bootstrap Select Picker
                    if ($(".selectpicker").length != 0) {
                        $(".selectpicker").selectpicker();
                        $("select[name=selValue]").selectpicker("refresh");
                    }
                }, 500);
            }, error => {
                var errors = JSON.parse(error._body);
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

        this.http.get(this.apiUrl + 'languages/list', { headers: this.headers })
            .subscribe((results) => {
                var res = JSON.parse(results.text());
                this.listLanguages = res;
                console.log(this.listLanguages);
                setTimeout(() => {
                    //  Init Bootstrap Select Picker
                    if ($(".selectpicker").length != 0) {
                        $(".selectpicker").selectpicker();
                        $("select[name=selValue3]").selectpicker("refresh");
                    }
                }, 500);
            }, error => {
                var errors = JSON.parse(error._body);
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

    ngAfterViewInit() {
        //  Activate the tooltips
        //$('[rel="tooltip"]').tooltip();
    }

    openDetails(value: any, index: any): void {
        console.log(value);
        this.agentDetails = value;
        this.agentDetails.index = index;
    }

    delete(value: any, index: any): void {
        this.agentDetails = value;
        this.agentDetails.index = index;
    }

   save(model, isValid: boolean, form: NgForm) {

        this.showLoading = true;
        this.agentDetails.workingHours.start = $('#start').val();
        this.agentDetails.workingHours.end = $('#end').val();
        console.log(this.agentDetails);

        this.http.post(this.apiUrl + 'users/update', JSON.stringify(this.agentDetails), { headers: this.headers })
            .subscribe((results) => {
                var res = JSON.parse(results.text());
                $.notify({
                    icon: "add_alert",
                    message: "User "+this.agentDetails.fullname+" updated!"
                }, {
                        type: 'success',
                        timer: 4000,
                        placement: {
                            from: 'top',
                            align: 'center'
                        }
                    });
                    this.showLoading = false;

                    var agentStatus = "Active";
                    if (!this.agentDetails.enabled) {
                        agentStatus = "Inactive";
                    }

                    this.tableData1.dataRows[this.agentDetails.index][1] = this.agentDetails.fullname;
                    this.tableData1.dataRows[this.agentDetails.index][2] = this.agentDetails.cognizantId;
                    this.tableData1.dataRows[this.agentDetails.index][3] = this.agentDetails.email;
                    this.tableData1.dataRows[this.agentDetails.index][4] = agentStatus;

                    $('#edit').modal('hide');

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

    confirmDelete(rowKey: any,  index: any): void {
        this.showLoadingDelete = true;

        this.http.post(this.apiUrl + 'users/delete', {
            "rowKey": rowKey
        }, { headers: this.headers })
            .subscribe((results) => {
                var res = JSON.parse(results.text());
                console.log(res);
                this.showLoadingDelete = false;
                $('#delete').modal('hide');
                this.tableData1.dataRows.splice(index, 1);
                $.notify({
                    icon: "add_alert",
                    message: "User deleted!"
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
