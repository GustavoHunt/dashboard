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
    list?: string; // required, must be valid email format,
    checkStats?: boolean
}

@Component({
    selector: 'app-buttons',
    templateUrl: './checktechnology.component.html'
})

export class CheckTechnology implements OnInit {
    public tableData1: TableData;
    public tableData2: TableData;
    public tableData3: TableData;
    http: Http;

    constructor(http: Http) {
        this.http = http;
    }

    public website: Website;
    f: NgForm;
    @Input() list: string;
    textareaParsed: any[];
    listWebsite: any[] = [];
    public listTestLocation: any[] = [];

    retryCount: number = 0;

    public difficulty: number = 0;

    public apiUrl = environment.apiUrl;

    public tableRequest: TableData;

    // constructor(private navbarTitleService: NavbarTitleService, private notificationService: NotificationService) { }

    public ngOnInit() {
        this.website = {
            list: '',
            checkStats: false
        }
        this.tableData1 = {
            headerRow: ['Website', 'Technology/Platform'],
            dataRows: []
        }
        this.tableData2 = {
            headerRow: ['Website', 'Tech', 'PSI', 'WPT', 'Difficulty'],
            dataRows: []
        }
        this.tableData3 = {
            headerRow: ['Website', 'Test Location'],
            dataRows: []
        }
        this.retryCount = 0
        this.tableRequest = {
            headerRow: [],
            dataRows: []
        }
        //  Init Bootstrap Select Picker
        if ($(".selectpicker").length != 0) {
            $(".selectpicker").selectpicker();
        }
    }

    getTestLocations() {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        this.http.get(this.apiUrl + 'wpt/locations', { headers: headers })
            .subscribe((results) => {
                var res = JSON.parse(results.text());
                this.listTestLocation = res.response.data.location;
                console.log(this.listTestLocation);
                setTimeout(() => {
                    //  Init Bootstrap Select Picker
                    if ($(".selectpicker").length != 0) {
                        $(".selectpicker").selectpicker();
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

    check(model: Website, isValid: boolean, form: NgForm) {
        // call API to save user

        this.website = {
            list: '',
            checkStats: model.checkStats
        }

        console.log(model);

        this.textareaParsed = model.list.split("\n");
        this.tableData1.dataRows = [];
        this.tableData2.dataRows = [];
        this.tableData3.dataRows = [];

        if (model.checkStats) {

            for (let data of this.textareaParsed) {
                this.tableData3.dataRows.push([data, ""]);
            }
            $('#myModal').modal('show');
            this.getTestLocations();
        } else {
            this.tableRequest = {
                headerRow: this.tableData1.headerRow,
                dataRows: []
            }
            for (let data of this.textareaParsed) {
                this.tableRequest.dataRows.push([data, "Waiting...", "0"]);
            }
            this.singleCheck(this.tableRequest.dataRows[0][0], 0, model.checkStats, null);
        }
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
        link.download = "msite-check-technology-" + month + "." + day + "." + year + "-" + hour + "-" + minutes + "-" + secconds + ".xls";
        link.href = uri + base64(format(template, ctx));
        link.click();
    }

    singleCheck(url, index, checkStats, location) {
        console.log(url);
        if (location == undefined) {
            location = null;
        }
        console.log(location);
        console.log(this.tableRequest.dataRows);

        if (checkStats) {
            if (this.retryCount == 0) {
                this.tableRequest.dataRows[index][2] = "Checking..."; // PSI
                this.tableRequest.dataRows[index][3] = "1";
                this.tableRequest.dataRows[index][4] = "Checking..."; //WPT
                this.tableRequest.dataRows[index][5] = "1";
                this.tableRequest.dataRows[index][6] = "Checking..."; //Difficulty
                this.tableRequest.dataRows[index][7] = "1";
                this.tableRequest.dataRows[index][8] = ""; // TestId
                this.checkPSI(url, index);
                this.checkWPT(url, index, location);
            }
            this.tableRequest.dataRows[index][1] = "Checking..."; // Tech
            this.tableRequest.dataRows[index][9] = "1"; //Loading - Tech

        } else {
            this.tableRequest.dataRows[index][1] = "Checking...";
            this.tableRequest.dataRows[index][2] = "1";
        }

        var pattern = /^((http|https|ftp):\/\/)/;

        if (this.retryCount > 3) {
            if (!pattern.test(url)) {
                url = "https://" + url;
            }
        } else {
            if (!pattern.test(url)) {
                url = "http://" + url;
            }
        }

        if (this.retryCount >= 10) {
            this.tableRequest.dataRows[index][1] = "Error: check website for redirects, typos or server down";
            if (checkStats) {
                this.tableRequest.dataRows[index][9] = "0";
            } else {
                this.tableRequest.dataRows[index][2] = "0";
            }

            this.retryCount = 0;
            if ((index + 1) < this.tableRequest.dataRows.length) {
                setTimeout(() => {
                    console.log('Next in queue after 10 tries...');

                    if (checkStats) {
                        this.tableRequest.dataRows[index][1] = "Error"; // Tech
                        this.tableRequest.dataRows[index][2] = "Error"; // PSI
                        this.tableRequest.dataRows[index][3] = "0";
                        this.tableRequest.dataRows[index][4] = "Error"; //WPT
                        this.tableRequest.dataRows[index][5] = "0";
                        this.tableRequest.dataRows[index][6] = "Error"; //Difficulty
                        this.tableRequest.dataRows[index][7] = "0";
                        this.tableRequest.dataRows[index][8] = ""; // TestId
                        this.tableRequest.dataRows[index][9] = "0"; //Loading - Tech
            
                    } else {
                        this.tableRequest.dataRows[index][1] = "Error";
                        this.tableRequest.dataRows[index][2] = "0";
                    }


                    this.singleCheck(this.tableRequest.dataRows[index + 1][0], index + 1, checkStats, this.tableRequest.dataRows[index + 1][10]);
                }, 5000);
            }
            return;
        }

        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        this.http.post(this.apiUrl + 'tools/checktechnology', JSON.stringify({ "url": url }), { headers: headers })
            .subscribe((results) => {
                if (checkStats) {
                    this.tableRequest.dataRows[index][9] = "0";
                } else {
                    this.tableRequest.dataRows[index][2] = "0";
                }
                var res = JSON.parse(results.text());

                if (res.length == 0) {
                    this.retryCount = this.retryCount + 1;
                    setTimeout(() => {
                        console.log('No results, trying again...');
                        this.singleCheck(this.tableRequest.dataRows[index][0], index, checkStats, location);
                    }, 5000);
                    return;
                } else {
                    this.retryCount = 0;
                    for (let data of res) {
                        for (var i in data.categories) {
                            var category = data.categories[i][Object.keys(data.categories[i])[0]];
                            console.log(category + ': ' + data.name);

                            if (category == 'Web Frameworks' && data.name != 'Twitter Bootstrap' && this.tableRequest.dataRows[index][1] == 'Checking...') {
                                this.tableRequest.dataRows[index][1] = 'Page Builder: ' + data.name;
                                if (data.name != "Microsoft ASP.NET") {
                                    this.tableRequest.dataRows[index][6] = "Unfeasible";
                                }
                            }

                            if (category == 'Ecommerce') {
                                this.tableRequest.dataRows[index][1] = data.name;
                            }

                            if (category == 'CMS') {
                                this.tableRequest.dataRows[index][1] = data.name;
                            }
                        }
                    }

                    if (this.tableRequest.dataRows[index][1] == 'Checking...') {
                        this.tableRequest.dataRows[index][1] = 'Custom';
                    }

                    if ((index + 1) < this.tableRequest.dataRows.length) {
                        this.tableRequest.dataRows[index + 1][1] = "Checking...";
                        if (checkStats) {
                            this.tableRequest.dataRows[index + 1][9] = "1";
                        } else {
                            this.tableRequest.dataRows[index + 1][2] = "1";
                        }

                        setTimeout(() => {
                            console.log('Next in queue...');
                            this.singleCheck(this.tableRequest.dataRows[index + 1][0], index + 1, checkStats, this.tableRequest.dataRows[index + 1][10]);
                        }, 5000);
                    }
                }
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


    checkPSI(url, index) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        this.difficulty = 0;
        this.http.post(this.apiUrl + 'psi/run', JSON.stringify({ "url": url }), { headers: headers })
            .subscribe((results) => {
                var res = JSON.parse(results.text());
                this.tableRequest.dataRows[index][3] = "0";
                this.tableRequest.dataRows[index][2] = res.ruleGroups.SPEED.score;

                if (res.pageStats.numberCssResources > 5) {
                    this.difficulty = this.difficulty + 1;
                }
                if (res.pageStats.numberJsResources > 5) {
                    this.difficulty = this.difficulty + 2;
                }
                if (res.pageStats.numberJsResources > 30) {
                    this.difficulty = this.difficulty + 2;
                }
                if (res.pageStats.numberResources > 6) {
                    this.difficulty = this.difficulty + 1;
                }
                if (res.formattedResults.ruleResults.MinimizeRenderBlockingResources.ruleImpact > 60) {
                    this.difficulty = this.difficulty + 3;
                }
                if (this.difficulty >= 1 && this.difficulty <= 4) {
                    this.tableRequest.dataRows[index][6] = "Easy";
                }
                if (this.difficulty >= 5 && this.difficulty <= 8) {
                    this.tableRequest.dataRows[index][6] = "Medium";
                }
                if (this.difficulty >= 9) {
                    this.tableRequest.dataRows[index][6] = "Hard";
                }
                this.tableRequest.dataRows[index][7] = "0";
            }, error => {
                var errors = JSON.parse(error._body);
                this.tableRequest.dataRows[index][2] = "Error"; // PSI
                this.tableRequest.dataRows[index][3] = "0";
                this.tableRequest.dataRows[index][6] = "Error"; //Difficulty
                this.tableRequest.dataRows[index][7] = "0";

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


    checkWPT(url, index, location) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        this.http.post(this.apiUrl + 'wpt/run', JSON.stringify({ "url": url, "location": location }), { headers: headers })
            .subscribe((results) => {
                var res = JSON.parse(results.text());
                this.tableRequest.dataRows[index][5] = "0";
                this.tableRequest.dataRows[index][4] = "<a href='http://www.webpagetest.org/result/" + res.data.id + "/' target='_blank'>" + res.statusText + "</a>";
                this.tableRequest.dataRows[index][8] = res.data.id;

            }, error => {
                var errors = JSON.parse(error._body);
                this.tableRequest.dataRows[index][5] = "0";
                this.tableRequest.dataRows[index][4] = "Error";
                
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

    updateSingleWPT(testId, index) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        this.tableRequest.dataRows[index][5] = "1";
        this.tableRequest.dataRows[index][4] = "";
        console.log(testId);
        this.http.post(this.apiUrl + 'wpt/check', JSON.stringify({ "testId": testId }), { headers: headers })
            .subscribe((results) => {
                var res = JSON.parse(results.text());
                this.tableRequest.dataRows[index][5] = "0";
                this.tableRequest.dataRows[index][8] = res.data.id;

                if (res.statusText == 'Test Complete') {
                    if (res.data.median.firstView.SpeedIndex == undefined) {
                        this.tableRequest.dataRows[index][4] = "<a href='http://www.webpagetest.org/result/" + res.data.id + "/' target='_blank'>Speed Index not avaliable (Load Time: " + res.data.median.firstView.loadTime + ")</a>";
                    } else {
                        this.tableRequest.dataRows[index][4] = "<a href='http://www.webpagetest.org/result/" + res.data.id + "/' target='_blank'>" + res.data.median.firstView.SpeedIndex + "</a>";
                    }
                    
                } else {
                    this.tableRequest.dataRows[index][4] = "<a href='http://www.webpagetest.org/result/" + res.data.id + "/' target='_blank'>" + res.statusText + "</a>";
                }


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

    updateWPT(testId, index) {
        for (var i = 0; i < this.tableRequest.dataRows.length; i++) {
            this.updateSingleWPT(this.tableRequest.dataRows[i][8], i);
        }
    }

    confirmWPT() {
        this.tableRequest = {
            headerRow: this.tableData2.headerRow,
            dataRows: []
        }
        for (var i in this.tableData3.dataRows) {
            this.tableRequest.dataRows.push([ this.tableData3.dataRows[i][0], "Waiting...", "Waiting...", "0", "Waiting...", "0", "Waiting...", "0", "", "0", this.tableData3.dataRows[i][1]] );
        }
        $('#myModal').modal('hide');
        console.log(this.tableRequest.dataRows);
        this.singleCheck(this.tableRequest.dataRows[0][0], 0, true, this.tableRequest.dataRows[0][10]);
    }

    applyToAll(location) {
        for (var i in this.tableData3.dataRows) {
            this.tableData3.dataRows[i][1] = location;
        }
        $("select[name=selValue]").selectpicker("refresh");
        setTimeout(() => {
            for (var i in this.tableData3.dataRows) {
                this.tableData3.dataRows[i][1] = location;
            }
            $("select[name=selValue]").selectpicker("refresh");
        }, 500);
    }


}