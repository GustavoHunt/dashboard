import { Component, OnInit } from '@angular/core';
import { TableData } from '../md/md-table/md-table.component';
import { Http, Headers } from "@angular/http";
import 'rxjs/add/operator/map';
import { LocalStorageService } from 'angular-2-local-storage';
import { environment } from 'environments/environment';

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
    selector: 'my-websites-cmp',
    templateUrl: 'my-websites.component.html'
})

export class MyWebsitesComponent implements OnInit {
    public tableData1: TableData;
    public showLoading: boolean;
    public showLoadingPSI: boolean;
    public showLoadingWPT: boolean;
    public showLoadingDelete: boolean;
    public showLoadingHistory: boolean;
    public websiteDetails: any;
    public statusWPT: any;
    public statusPSI: any;
    public headers: any;
    public versionHistory: any;

    http: Http;

    constructor(http: Http, private localStorageService: LocalStorageService) {
        this.http = http;
    }

    public apiUrl = environment.apiUrl;

    ngOnInit() {
        // Init Tooltips
        // $('[rel="tooltip"]').tooltip();
        this.tableData1 = {
            headerRow: ['#', 'Website', 'Market', 'Language', 'PSI', 'WPT', 'Status', 'Actions'],
            dataRows: []
        };

        this.versionHistory = [];
        var userModel = <any>{};
        this.websiteDetails = <any>{};
        this.statusWPT = <any>{};
        this.statusPSI = <any>{};
        userModel = this.localStorageService.get('user');

        this.showLoading = true;
        this.showLoadingPSI = false;
        this.showLoadingWPT = false;
        this.showLoadingDelete = false;

        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Authorization', 'Bearer ' + userModel.token);


        this.http.get(this.apiUrl + 'websites/list', { headers: this.headers })
            .subscribe((results) => {

                var res = JSON.parse(results.text());
                console.log(res);
                var counter = 0;
                for (let data of res) {
                    counter = counter + 1;

                    var psiBefore = "";
                    if (data.retest.psiBefore == null) {
                        psiBefore = "?";
                    } else {
                        psiBefore = data.retest.psiBefore;
                    }
                    var psiAfter = "?";
                    if (data.retest.psiAfter == null) {
                        psiAfter = data.retest.psiBefore;
                    } else {
                        psiAfter = data.retest.psiAfter;
                    }

                    var wptBefore = "";
                    if (data.retest.wptBefore == null) {
                        wptBefore = "?";
                    } else {
                        wptBefore = data.retest.wptBefore;
                    }
                    var wptAfter = "?";
                    if (data.retest.wptAfter == null) {
                        wptAfter = data.retest.wptBefore;
                    } else {
                        wptAfter = data.retest.wptAfter;
                    }

                    var win = false;
                    if (data.retest.wptBefore != null && data.retest.wptAfter != null) {

                        if (data.retest.wptBefore >= 15000 && (data.retest.wptAfter <= 9999)) {
                            win = true;
                        }
                        else if (data.retest.wptBefore >= 5000 && (data.retest.wptAfter <= 4999)) {
                            win = true;
                        }
                        else if (data.retest.wptAfter <= (data.retest.wptBefore - 3000)) {
                            win = true;
                        }
                    }

                    data.pageSpeedArray = [];
                    data.pageSpeedArray.push(data.pageSpeed.formattedResults.ruleResults.AvoidLandingPageRedirects);
                    //data.pageSpeedArray.push(data.pageSpeed.formattedResults.ruleResults.AvoidPlugins);
                    //data.pageSpeedArray.push(data.pageSpeed.formattedResults.ruleResults.ConfigureViewport);
                    data.pageSpeedArray.push(data.pageSpeed.formattedResults.ruleResults.EnableGzipCompression);
                    data.pageSpeedArray.push(data.pageSpeed.formattedResults.ruleResults.LeverageBrowserCaching);
                    data.pageSpeedArray.push(data.pageSpeed.formattedResults.ruleResults.MainResourceServerResponseTime);
                    data.pageSpeedArray.push(data.pageSpeed.formattedResults.ruleResults.MinifyCss);
                    data.pageSpeedArray.push(data.pageSpeed.formattedResults.ruleResults.MinifyHTML);
                    data.pageSpeedArray.push(data.pageSpeed.formattedResults.ruleResults.MinifyJavaScript);
                    data.pageSpeedArray.push(data.pageSpeed.formattedResults.ruleResults.MinimizeRenderBlockingResources);
                    data.pageSpeedArray.push(data.pageSpeed.formattedResults.ruleResults.OptimizeImages);
                    data.pageSpeedArray.push(data.pageSpeed.formattedResults.ruleResults.PrioritizeVisibleContent);
                    //data.pageSpeedArray.push(data.pageSpeed.formattedResults.ruleResults.SizeContentToViewport);
                    //data.pageSpeedArray.push(data.pageSpeed.formattedResults.ruleResults.SizeTapTargetsAppropriately);
                    //data.pageSpeedArray.push(data.pageSpeed.formattedResults.ruleResults.UseLegibleFontSizes);


                    this.tableData1.dataRows.push([
                        counter.toLocaleString(),
                        data.url,
                        data.market.description,
                        data.language.description,
                        psiBefore + "/" + psiAfter,
                        wptBefore + "/" + wptAfter,
                        data.status,
                        '',
                        win,
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

    }

    ngAfterViewInit() {
        //  Activate the tooltips
        //$('[rel="tooltip"]').tooltip();
    }

    openDetails(value: any): void {
        console.log(value);
        this.websiteDetails = value;
        this.statusPSI.statusText = "";
        this.statusWPT.statusText = "";
    }

    delete(value: any, index: any): void {
        this.websiteDetails = value;
        this.websiteDetails.index = index;
    }

    runNewWPT(rowKey: any, testId: any): void {

        this.showLoadingWPT = true;

        if (testId == undefined) {
            testId = this.websiteDetails.retest.testId;
        }
        console.log(rowKey);
        console.log(testId);

        this.http.post(this.apiUrl + 'wpt/new', {
            "testId": testId,
            "rowKey": rowKey,
            "runNewAfterTest": false
        }, { headers: this.headers })
            .subscribe((results) => {
                var res = JSON.parse(results.text());
                console.log(res);
                this.showLoadingWPT = false;

                if (res.statusCode == 101) {
                    this.websiteDetails.retest.wptAfterUrl = "http://www.webpagetest.org/results.php?test=" + res.data.testId;
                    this.websiteDetails.retest.wptAfterTestId = res.data.testId;
                }

                if (res.statusCode == 200) {
                    this.websiteDetails.retest.wptAfterUrl = res.data.summary;
                    this.websiteDetails.retest.wptAfterTestId = res.data.id;
                    if (res.data.median.firstView.SpeedIndex < (this.websiteDetails.retest.wptAfter) && res.data.median.firstView.SpeedIndex < (this.websiteDetails.retest.wptBefore)) {
                        this.websiteDetails.retest.wptAfter = res.data.median.firstView.SpeedIndex;
                        this.statusWPT.statusText = "Great! Speed Index is lower than before: " + this.websiteDetails.retest.wptAfter;
                    } else {
                        this.statusWPT.statusText = "Speed Index still greater than before and after: " + res.data.median.firstView.SpeedIndex;
                    }

                    $.notify({
                        icon: "add_alert",
                        message: this.statusWPT.statusText
                    }, {
                            type: 'info',
                            timer: 4000,
                            placement: {
                                from: 'top',
                                align: 'center'
                            }
                        });
                } else {
                    this.statusWPT.statusText = "Speed Index not increase. Waiting for a new test. " + res.statusText;
                    $.notify({
                        icon: "add_alert",
                        message: this.statusWPT.statusText
                    }, {
                            type: 'info',
                            timer: 4000,
                            placement: {
                                from: 'top',
                                align: 'center'
                            }
                        });
                }
                console.log(this.websiteDetails.retest);
            }, error => {
                var errors = JSON.parse(error.text());;
                console.log(errors);
                this.showLoadingWPT = false;
                $.notify({
                    icon: "add_alert",
                    message: errors.statusText
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


    runNewPSI(rowKey: any, url: any): void {
        console.log(rowKey);
        console.log(url);
        this.showLoadingPSI = true;

        this.http.post(this.apiUrl + 'psi/new', {
            "url": url,
            "rowKey": rowKey
        }, { headers: this.headers })
            .subscribe((results) => {
                var res = JSON.parse(results.text());
                console.log(res);
                this.showLoadingPSI = false;
                if (res) {

                    if (res.ruleGroups.SPEED.score > (this.websiteDetails.retest.psiAfter)) {
                        this.websiteDetails.retest.psiAfter = res.ruleGroups.SPEED.score;
                        this.statusPSI.statusText = "Great! Score is greater than before: " + this.websiteDetails.retest.psiAfter;
                    } else {
                        this.statusPSI.statusText = "Score still lower or the same than before: " + res.ruleGroups.SPEED.score;
                    }

                    $.notify({
                        icon: "add_alert",
                        message: this.statusPSI.statusText
                    }, {
                            type: 'info',
                            timer: 4000,
                            placement: {
                                from: 'top',
                                align: 'center'
                            }
                        });
                } else {
                    this.statusPSI = res;
                    $.notify({
                        icon: "add_alert",
                        message: this.statusPSI.statusText
                    }, {
                            type: 'info',
                            timer: 4000,
                            placement: {
                                from: 'top',
                                align: 'center'
                            }
                        });
                }
            }, error => {
                var errors = JSON.parse(error.text());;
                console.log(errors);
                this.showLoadingPSI = false;
                $.notify({
                    icon: "add_alert",
                    message: errors.statusText
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

    confirmDelete(rowKey: any, url: any, index: any): void {
        this.showLoadingDelete = true;

        this.http.post(this.apiUrl + 'websites/delete', {
            "url": url,
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
                    message: "Website deleted!"
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

    tableToExcel(name) {
        let uri = 'data:application/vnd.ms-excel;base64,'
            , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>'
            , base64 = function (s) { return window.btoa(decodeURIComponent(encodeURIComponent(s))) }
            , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
        var table = document.getElementById('mywebsites');
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
        link.download = "msite-my-websites-" + month + "." + day + "." + year + "-" + hour + "-" + minutes + "-" + secconds + ".xls";
        link.href = uri + base64(format(template, ctx));
        link.click();
    }


    getVersionHistory(rowKey) {
        this.showLoadingHistory = true;
        this.versionHistory = [];
        this.http.post(this.apiUrl + 'websites/history', {
            "websiteKey": rowKey
        }, { headers: this.headers })
            .subscribe((results) => {
                var res = JSON.parse(results.text());
                console.log(res);
                this.showLoadingHistory = false;
                this.versionHistory = res;

                for (let data of this.versionHistory) {
                    if (data.category == "PSI") {
                        data.pageSpeedArray = [];
                        data.pageSpeedArray.push(data.pageSpeed.formattedResults.ruleResults.AvoidLandingPageRedirects);
                        data.pageSpeedArray.push(data.pageSpeed.formattedResults.ruleResults.EnableGzipCompression);
                        data.pageSpeedArray.push(data.pageSpeed.formattedResults.ruleResults.LeverageBrowserCaching);
                        data.pageSpeedArray.push(data.pageSpeed.formattedResults.ruleResults.MainResourceServerResponseTime);
                        data.pageSpeedArray.push(data.pageSpeed.formattedResults.ruleResults.MinifyCss);
                        data.pageSpeedArray.push(data.pageSpeed.formattedResults.ruleResults.MinifyHTML);
                        data.pageSpeedArray.push(data.pageSpeed.formattedResults.ruleResults.MinifyJavaScript);
                        data.pageSpeedArray.push(data.pageSpeed.formattedResults.ruleResults.MinimizeRenderBlockingResources);
                        data.pageSpeedArray.push(data.pageSpeed.formattedResults.ruleResults.OptimizeImages);
                        data.pageSpeedArray.push(data.pageSpeed.formattedResults.ruleResults.PrioritizeVisibleContent);
                    }
                }
            }, error => {
                this.showLoadingHistory = false;
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
