import { Component, OnInit, Input } from '@angular/core';
import { Http, Headers } from "@angular/http";
import { NgForm } from '@angular/forms';
import { TableData } from '../../md/md-table/md-table.component';
import 'rxjs/add/operator/map';
import { environment } from 'environments/environment';

import { Angular2Csv } from 'angular2-csv/Angular2-csv';

declare var $: any;
declare var swal: any;
declare interface Website {
    list?: string; // required, must be valid email format
}

@Component({
    selector: 'app-buttons',
    templateUrl: './consult2implement.component.html'
})

export class Consult2Implement implements OnInit {
    public tableData1: TableData;
    http: Http;

    constructor(http: Http) {
        this.http = http;
    }

    public website: Website;
    f: NgForm;
    @Input() list: string;
    textareaParsed: any[];
    listWebsite: any[] = [];

    retryCount: number = 0;

    public apiUrl = environment.apiUrl;

    // constructor(private navbarTitleService: NavbarTitleService, private notificationService: NotificationService) { }

    public ngOnInit() {
        this.website = {
            list: ''
        }
        this.tableData1 = {
            headerRow: ['Website', 'Technology/Platform'],
            dataRows: []
        }
        this.retryCount = 0
    }

    check(model: Website, isValid: boolean, form: NgForm) {
        // call API to save user
        this.textareaParsed = model.list.split("\n");
        this.tableData1.dataRows = [];

        for (let data of this.textareaParsed) {
            this.tableData1.dataRows.push([data, "Waiting...", "0"]);
        }

        console.log(this.tableData1.dataRows.length);
        this.singleCheck(this.tableData1.dataRows[0][0], 0);
    }

    tableToExcel(name) {
        let uri = 'data:application/vnd.ms-excel;base64,'
            , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>'
            , base64 = function (s) { return window.btoa(decodeURIComponent(encodeURIComponent(s))) }
            , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
        var table = document.getElementById('testTable');
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
        link.download = "msite-check-technology-"+ month+ "."+ day+ "."+ year+ "-"+ hour+ "-"+ minutes+ "-"+ secconds +".xls";
        link.href = uri + base64(format(template, ctx));
        link.click();
    }



    singleCheck(url, index) {
        console.log(url);
        console.log(this.retryCount);
        this.tableData1.dataRows[index][1] = "Checking...";
        this.tableData1.dataRows[index][2] = "1";

        var pattern = /^((http|https|ftp):\/\/)/;

        if (this.retryCount > 1) {
            if (!pattern.test(url)) {
                url = "https://" + url;
            }
        } else {
            if (!pattern.test(url)) {
                url = "http://" + url;
            }
        }

        if (this.retryCount >= 10) {
            this.tableData1.dataRows[index][1] = "Error: check website for redirects, typos or server down";
            this.tableData1.dataRows[index][2] = "0";
            this.retryCount = 0;
            if ((index + 1) < this.tableData1.dataRows.length) {
                setTimeout(() => {
                    console.log('Next in queue after 10 tries...');
                    this.singleCheck(this.tableData1.dataRows[index + 1][0], index + 1);
                }, 5000);
            }
            return;
        }

        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        this.http.post(this.apiUrl + 'tools/checktechnology', JSON.stringify({ "url": url }), { headers: headers })
            .subscribe((results) => {
                this.tableData1.dataRows[index][2] = "0";
                var res = JSON.parse(results.text());

                if (res.length == 0) {
                    this.retryCount = this.retryCount + 1;
                    setTimeout(() => {
                        console.log('No results, trying again...');
                        this.singleCheck(this.tableData1.dataRows[index][0], index);
                    }, 5000);

                    return;
                } else {
                    this.retryCount = 0;
                    for (let data of res) {
                        for (var i in data.categories) {
                            var category = data.categories[i][Object.keys(data.categories[i])[0]];
                            console.log(category + ': ' + data.name);

                            if (category == 'Web Frameworks' && data.name != 'Twitter Bootstrap' && this.tableData1.dataRows[index][1] == 'Checking...') {
                                this.tableData1.dataRows[index][1] = 'Page Builder: ' + data.name;
                            }

                            if (category == 'Ecommerce') {
                                this.tableData1.dataRows[index][1] = data.name;
                            }

                            if (category == 'CMS') {
                                this.tableData1.dataRows[index][1] = data.name;
                            }
                        }
                    }

                    if (this.tableData1.dataRows[index][1] == 'Checking...') {
                        this.tableData1.dataRows[index][1] = 'Custom';
                    }

                    if ((index + 1) < this.tableData1.dataRows.length) {
                        this.tableData1.dataRows[index + 1][1] = "Checking...";
                        this.tableData1.dataRows[index + 1][2] = "1";
                        setTimeout(() => {
                            console.log('Next in queue...');
                            this.singleCheck(this.tableData1.dataRows[index + 1][0], index + 1);
                        }, 5000);
                    }
                }
            }, error => {
                console.log(error);
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
}