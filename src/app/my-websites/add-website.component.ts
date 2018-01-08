import { Component, OnInit } from '@angular/core';
import { TableData } from '../md/md-table/md-table.component';
import { Http, Headers } from "@angular/http";
import 'rxjs/add/operator/map';
import {
    CanActivate, Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
  }                           from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { environment } from 'environments/environment';
import { NgForm } from '@angular/forms';
declare var $: any;
declare interface Website {
    url?: string; // required, must be valid email format,
    title?: string,
    market?: any,
    agentName?: string,
    agentEmail?: string,
    salesName?: string,
    salesEmail?: string,
    rate?: string,
    actionAfter?: string,
    location?: string,
    overwrite?: any
    language: any
}

@Component({
    moduleId: module.id,
    selector: 'add-website-cmp',
    templateUrl: 'add-website.component.html'
})

export class AddWebsiteComponent implements OnInit {

    public showLoading: boolean;
    public hideOverwrite: boolean;
    
    public headers: any;
    public listMarkets: any[] = [];
    public listLanguages: any[] = [];
    public listTestLocation: any[] = [];

    public websiteDetails: Website;

    public list_json: any[] = [];
    public index_json: any = 0;


    f: NgForm;
    http: Http;

    constructor(http: Http, private localStorageService: LocalStorageService,  private router: Router) {
        this.http = http;
    }

    public apiUrl = environment.apiUrl;


    ngOnInit() {

        var userModel = <any>{};
        userModel = this.localStorageService.get('user');

        this.websiteDetails = <any>{};

        this.websiteDetails.rate = "day";
        this.websiteDetails.actionAfter = "email";

        this.websiteDetails.overwrite = <any>{};
        this.websiteDetails.overwrite.enabled = false;
        this.websiteDetails.overwrite.psiBefore = null;
        this.websiteDetails.overwrite.psiAfter = null;
        this.websiteDetails.overwrite.wptBefore = null;
        this.websiteDetails.overwrite.wptAfter = null;

        this.websiteDetails.agentName = userModel.fullname;
        this.websiteDetails.agentEmail = userModel.email;

        this.showLoading = false;
        this.hideOverwrite = true;

        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Authorization', 'Bearer ' + userModel.token);

        //  Init Bootstrap Select Picker
        if ($(".selectpicker").length != 0) {
            $(".selectpicker").selectpicker();
        }

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


        this.http.get(this.apiUrl + 'wpt/locations', { headers: this.headers })
        .subscribe((results) => {
            var res = JSON.parse(results.text());
            this.listTestLocation = res.response.data.location;
            console.log(this.listTestLocation);
            setTimeout(() => {
                //  Init Bootstrap Select Picker
                if ($(".selectpicker").length != 0) {
                    $(".selectpicker").selectpicker();
                    $(".selectpicker").selectpicker("refresh");     
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


        this.list_json =  [
              
              {
                "Case Number": 501436,
                "owner": "Aline Macellone",
                "region": "Americas",
                "Language": "Portuguese",
                "URL": "http://promo.impersinos.com.br/pr/impermeabilizacao-quadra?i=Impermeabilizar&c=%20&l=Playground",
                "Customer ID": "407-211-0919",
                "Appointment Date/Time": "23/11/2017 11:00",
                "Status": "Consultation",
                "Sub Status": "CC - Just an educational call",
                "Follow-up Date": "2017-04-12T07:00:00.000Z",
                "PSIbefore": 47,
                "PSIafter": 47,
                "WPTbefore": 4553,
                "WPTafter": 4553,
                "Team": "Small Business Sales",
                "POD Name": "icanazza",
                "Google Sales Rep": "Isabella Canazza",
                "gCases ID": "3-1502000020065"
              },
              {
                "Case Number": 510034,
                "owner": "Aline Macellone",
                "region": "Americas",
                "Language": "Portuguese",
                "URL": "www.softensistemas.com.br",
                "Customer ID": "247-769-3672",
                "Appointment Date/Time": "27/11/2017 10:00",
                "Status": "Consultation",
                "Sub Status": "CC - Consultation Completed",
                "Confirmation Call": "Yes",
                "Follow-up Date": "2017-04-12T07:00:00.000Z",
                "PSIbefore": 66,
                "PSIafter": 66,
                "WPTbefore": 7073,
                "WPTafter": 7073,
                "Team": "MMS Two",
                "POD Name": "SAO1",
                "Google Sales Rep": "Guilherme Leonello Duarte",
                "gCases ID": "7-8721000019924"
              },
              {
                "Case Number": 507302,
                "owner": "Felipe Guarnieri",
                "region": "Americas",
                "Language": "Spanish",
                "URL": "http://www.cantodeaves.com/",
                "Customer ID": "796-881-9575",
                "Appointment Date/Time": "27/11/2017 15:00",
                "Status": "Consultation",
                "Sub Status": "CC - Consultation Completed",
                "Confirmation Call": "No",
                "PSIbefore": 50,
                "PSIafter": 50,
                "WPTbefore": 28649,
                "WPTafter": 28649,
                "Team": "Small Business Sales",
                "POD Name": "SMB-Training-MX-monicajimenez",
                "Google Sales Rep": "Mónica Jiménez",
                "gCases ID": "8-7829000020198"
              },
              {
                "Case Number": 500548,
                "owner": "Aline Macellone",
                "region": "Americas",
                "Language": "Portuguese",
                "URL": "www.lojaiplace.com.br",
                "Customer ID": "161-334-4463",
                "Appointment Date/Time": "28/11/2017 14:00",
                "Rescheduled Appointment Date(Advertiser)": "2017-05-12T07:00:00.000Z",
                "Status": "Consultation",
                "Sub Status": "CC - Just an educational call",
                "Confirmation Call": "Yes",
                "Follow-up Date": "2018-12-01T08:00:00.000Z",
                "PSIbefore": 54,
                "PSIafter": 54,
                "WPTbefore": 19216,
                "WPTafter": 19216,
                "Team": "Unassigned",
                "POD Name": "cconsolmagno",
                "Google Sales Rep": "Caio Consolmagno",
                "gCases ID": "8-2941000019919",
                "Additional Notes (if any)": "gForms"
              },
              {
                "Case Number": 510102,
                "owner": "Danilo Araujo Luiz",
                "region": "Americas",
                "Language": "Spanish",
                "URL": "http://cotizador.peugeot.cl/cl/cotizador/VP/",
                "Customer ID": "339-717-6478",
                "Appointment Date/Time": "28/11/2017 14:00",
                "Status": "Consultation",
                "Sub Status": "CC - Consultation Completed",
                "Confirmation Call": "No",
                "Date of installation": "2017-04-12T07:00:00.000Z",
                "PSIbefore": 46,
                "PSIafter": 46,
                "WPTbefore": 9532,
                "WPTafter": 9532,
                "Team": "Traditional Agency AS",
                "POD Name": "SMB-Traditional Agency AS-CL-HC1a",
                "Google Sales Rep": "Eliel Frydman",
                "gCases ID": "3-5927000020081",
                "Additional Notes (if any)": "Original URL: http://cotizador.peugeot.cl/cl/cotizador/VP/?utm_source=google-search&utm_medium=SEA_SCT&utm_campaign=2017_07_range-all_vn_cuotafamosa_promo_time-limited_ap_cl_local_sea_sct_tf&utm_content=search We don't really need the analytics parameters."
              },
              {
                "Case Number": 511042,
                "owner": "Aline Macellone",
                "region": "Americas",
                "Language": "Portuguese",
                "URL": "https://www.bconsorcios.com.br/lp-servopa/",
                "Customer ID": "540-024-9655",
                "Appointment Date/Time": "29/11/2017 10:00",
                "Rescheduled Appointment Date(Advertiser)": "15/12/2017",
                "Status": "Consultation",
                "Sub Status": "CC - Just an educational call",
                "Confirmation Call": "Yes",
                "PSIbefore": 73,
                "PSIafter": 73,
                "WPTbefore": 11390,
                "WPTafter": 11390,
                "Team": "Small Business Sales",
                "POD Name": "smb-small business-br-bzocolaro",
                "Google Sales Rep": "Bruna Zocolaro",
                "gCases ID": "6-9858000020125"
              },
              {
                "Case Number": 509568,
                "owner": "Felipe Guarnieri",
                "region": "Americas",
                "Language": "Spanish",
                "URL": "http://www.centrologisticopanama.com/dos-caminos/",
                "Customer ID": "912-818-9604",
                "Appointment Date/Time": "29/11/2017 13:00",
                "Rescheduled Appointment Date(Advertiser)": "2017-04-12T07:00:00.000Z",
                "Status": "Consultation",
                "Sub Status": "CC - Consultation Completed",
                "Confirmation Call": "No",
                "Before/After Sent": "No",
                "PSIbefore": 57,
                "PSIafter": 57,
                "WPTbefore": 4825,
                "WPTafter": 4825,
                "Team": "GEM",
                "POD Name": "SMB-GEM-CR-MX1",
                "Google Sales Rep": "Juancho Ciszek Flores",
                "gCases ID": "4-2992000020205"
              },
              {
                "Case Number": 511227,
                "owner": "Felipe Guarnieri",
                "region": "EMEA",
                "Language": "Spanish",
                "URL": "www.animalcity.es",
                "Customer ID": "857-645-4702",
                "Appointment Date/Time": "29/11/2017 13:00",
                "Status": "Consultation",
                "Sub Status": "CC - Consultation Completed",
                "Confirmation Call": "No",
                "PSIbefore": 41,
                "PSIafter": 41,
                "WPTbefore": 12326,
                "WPTafter": 12326,
                "Team": "Small Business Sales",
                "POD Name": "SMB-Small Business-ES-aesteve",
                "Google Sales Rep": "Angela Esteve",
                "gCases ID": "1-4597000019841"
              },
              {
                "Case Number": 507225,
                "owner": "Felipe Guarnieri",
                "region": "Americas",
                "Language": "Portuguese",
                "URL": "https://dialogo.com.br/",
                "Customer ID": "507-795-6806",
                "Appointment Date/Time": "29/11/2017 15:00",
                "Status": "Consultation",
                "Sub Status": "CC - Consultation Completed",
                "Confirmation Call": "No",
                "PSIbefore": 56,
                "PSIafter": 56,
                "WPTbefore": 13549,
                "WPTafter": 13549,
                "Team": "MMS One",
                "POD Name": "SMB-MMS One-BR-SAO1",
                "Google Sales Rep": "Marcela Goya",
                "gCases ID": "6-8853000020125"
              },
              {
                "Case Number": 510905,
                "owner": "Felipe Guarnieri",
                "region": "Americas",
                "Language": "Portuguese",
                "URL": "www.profissionalbeleza.com.br",
                "Customer ID": "349-528-1532",
                "Appointment Date/Time": "30/11/2017 08:00",
                "Status": "Consultation",
                "Sub Status": "CC - Consultation Completed",
                "Confirmation Call": "No",
                "PSIbefore": 64,
                "PSIafter": 64,
                "WPTbefore": 7860,
                "WPTafter": 7860,
                "Team": "Unassigned",
                "POD Name": "cconsolmagno",
                "Google Sales Rep": "Caio Consolmagno",
                "gCases ID": "3-0691000020161",
                "Additional Notes (if any)": "BTC"
              },
              {
                "Case Number": 512597,
                "owner": "Daniel Moura",
                "region": "Americas",
                "Language": "Portuguese",
                "URL": "https://comtele.com.br/",
                "Customer ID": "774-237-0782",
                "Appointment Date/Time": "2017-01-12T19:00:00.000Z",
                "Status": "Consultation",
                "Sub Status": "CC - Advertiser implemented changes in pre-production phase",
                "Follow-up Date": "2017-04-12T07:00:00.000Z",
                "PSIbefore": 51,
                "PSIafter": 51,
                "WPTbefore": 16228,
                "WPTafter": 16228,
                "Team": "Small Business Sales",
                "POD Name": "smb-small business-br-bzocolaro",
                "Google Sales Rep": "Bruna Zocolaro",
                "gCases ID": "3-0229000020217"
              },
              {
                "Case Number": 518887,
                "owner": "Daniel Moura",
                "region": "Americas",
                "Language": "Portuguese",
                "URL": "www.carinhodebicho.com.br",
                "Customer ID": "922-702-2873",
                "Appointment Date/Time": "2017-12-12T18:00:00.000Z",
                "Status": "Consultation",
                "Sub Status": "CC - Consultation Completed",
                "Confirmation Call": "Yes",
                "Follow-up Date": "19/12/2017",
                "PSIbefore": 32,
                "PSIafter": 32,
                "WPTbefore": 40076,
                "WPTafter": 40076,
                "Team": "Unassigned",
                "POD Name": "cconsolmagno",
                "Google Sales Rep": "Caio Consolmagno",
                "gCases ID": "1-9692000020272",
                "Additional Notes (if any)": "BTC"
              },
              {
                "Case Number": 518927,
                "owner": "Danilo Araujo Luiz",
                "region": "Americas",
                "Language": "Portuguese",
                "URL": "https://internet-satelite-rural.com.br/",
                "Customer ID": "878-510-0590",
                "Appointment Date/Time": "2017-12-12T22:00:00.000Z",
                "Status": "Consultation",
                "Sub Status": "CC - Consultation Completed",
                "Confirmation Call": "Yes",
                "Date of installation": "2017-12-12T08:00:00.000Z",
                "PSIbefore": 96,
                "PSIafter": 96,
                "WPTbefore": 6922,
                "WPTafter": 6922,
                "Team": "Small Business Sales",
                "POD Name": "rcernesto",
                "Google Sales Rep": "Rodrigo Ernesto",
                "gCases ID": "3-6145000020392",
                "Additional Notes (if any)": "13h BR"
              },
              {
                "Case Number": 518725,
                "owner": "Danilo Araujo Luiz",
                "region": "Americas",
                "Language": "Portuguese",
                "URL": "www.caramelloidiomas.com.br",
                "Customer ID": "570-408-3267",
                "Appointment Date/Time": "13/12/2017 10:00",
                "Status": "Consultation",
                "Sub Status": "CC - Consultation Completed",
                "Confirmation Call": "Yes",
                "Date of installation": "13/12/2017",
                "PSIbefore": 58,
                "PSIafter": 58,
                "WPTbefore": 4879,
                "WPTafter": 4879,
                "Team": "Unassigned",
                "POD Name": "cconsolmagno",
                "Google Sales Rep": "Caio Consolmagno",
                "gCases ID": "0-3837000020036",
                "Additional Notes (if any)": "BTC"
              },
              {
                "Case Number": 518731,
                "owner": "Danilo Araujo Luiz",
                "region": "Americas",
                "Language": "Portuguese",
                "URL": "https://www.operand.com.br",
                "Customer ID": "511-875-6382",
                "Appointment Date/Time": "14/12/2017 09:00",
                "Status": "Consultation",
                "Sub Status": "CC - Consultation Completed",
                "Confirmation Call": "Yes",
                "Date of installation": "14/12/2017",
                "PSIbefore": 56,
                "PSIafter": 56,
                "WPTbefore": 5808,
                "WPTafter": 5808,
                "Team": "Unassigned",
                "POD Name": "cconsolmagno",
                "Google Sales Rep": "Caio Consolmagno",
                "gCases ID": "5-7186000020217",
                "Additional Notes (if any)": [
                  "BTC Very good call. It was a consultation call only",
                  "however it's very likely the client is going to implement the changes very soon."
                ]
              },
              {
                "Case Number": 520627,
                "owner": "Felipe Guarnieri",
                "region": "EMEA",
                "Language": "Spanish",
                "URL": "www.mundodelmovil.com",
                "Customer ID": "520-882-5610",
                "Appointment Date/Time": "14/12/2017 09:00",
                "Status": "Consultation",
                "Sub Status": "CC - Consultation Completed",
                "Confirmation Call": "No",
                "PSIbefore": 57,
                "PSIafter": 57,
                "WPTbefore": 11314,
                "WPTafter": 11314,
                "Team": "Small Business Sales",
                "POD Name": "SMB-Small Business-ES-aesteve",
                "Google Sales Rep": "Angela Esteve",
                "gCases ID": "3-9267000020330"
              },
              {
                "Case Number": 519535,
                "owner": "Danilo Araujo Luiz",
                "region": "Americas",
                "Language": "Portuguese",
                "URL": "https://www.webcontinental.com.br",
                "Customer ID": "939-303-2286",
                "Appointment Date/Time": "14/12/2017 11:00",
                "Status": "Consultation",
                "Sub Status": "CC - Consultation Completed",
                "Confirmation Call": "No",
                "Date of installation": "14/12/2017",
                "PSIbefore": 33,
                "PSIafter": 33,
                "WPTbefore": 14818,
                "WPTafter": 14818,
                "Team": "Unassigned",
                "POD Name": "cconsolmagno",
                "Google Sales Rep": "Caio Consolmagno",
                "gCases ID": "8-3027000020304",
                "Additional Notes (if any)": "gForms Originally this case was not mine (Danilo) and the call was made via Hangouts."
              },
              {
                "Case Number": 520079,
                "owner": "Daniel Moura",
                "region": "EMEA",
                "Language": "Portuguese",
                "URL": "http://proalliance.pt",
                "Customer ID": "735-153-3043",
                "Appointment Date/Time": "14/12/2017 13:00",
                "Status": "Consultation",
                "Sub Status": "CC - Consultation Completed",
                "Confirmation Call": "Yes",
                "Follow-up Date": "15/01/2018",
                "PSIbefore": 32,
                "PSIafter": 32,
                "WPTbefore": 8946,
                "WPTafter": 8946,
                "Team": "Small Business Sales",
                "POD Name": "SMB-SBS Scaled-PT-ascardoso",
                "Google Sales Rep": "Sofia Cardoso",
                "gCases ID": "5-5786000020260",
                "Additional Notes (if any)": "Conf. Call - no answer. Customer will redesign the website."
              },
              {
                "Case Number": 518214,
                "owner": "André Victorino",
                "region": "EMEA",
                "Language": "Portuguese",
                "URL": "sothebysrealty.com",
                "Customer ID": "381-945-4195",
                "Appointment Date/Time": "14/12/2017 14:00",
                "Status": "Consultation",
                "Sub Status": "CC - Consultation Completed",
                "PSIbefore": 49,
                "PSIafter": 49,
                "WPTbefore": 20144,
                "WPTafter": 20144,
                "Team": "Managed Agency Two AS",
                "POD Name": "SMB-Managed Agency Two AS-PT-DUB1b",
                "Google Sales Rep": "Marina Faria",
                "gCases ID": "7-0405000020331"
              },
              {
                "Case Number": 520421,
                "owner": "Daniel Moura",
                "region": "Americas",
                "Language": "Portuguese",
                "URL": "www.querobolsa.com.br",
                "Customer ID": "361-708-1161",
                "Appointment Date/Time": "15/12/2017 14:00",
                "Status": "Consultation",
                "Sub Status": "CC - Consultation Completed",
                "Confirmation Call": "Yes",
                "Follow-up Date": "2018-05-01T07:00:00.000Z",
                "PSIbefore": 45,
                "PSIafter": 45,
                "WPTbefore": 8841,
                "WPTafter": 8841,
                "Team": "MMS One",
                "POD Name": "SMB-MMS One-BR-SAO1",
                "Google Sales Rep": "Marcela Goya",
                "gCases ID": "8-2146000020228",
                "Additional Notes (if any)": "Conf. call: no answer."
              },
              {
                "Case Number": 521631,
                "owner": "Aline Macellone",
                "region": "Americas",
                "Language": "Portuguese",
                "URL": "www.zetaflex.com.br",
                "Customer ID": "733-918-1785",
                "Appointment Date/Time": "18/12/2017 10:00",
                "Status": "Consultation",
                "Sub Status": "CC - Advertiser implemented changes in pre-production phase",
                "Confirmation Call": "Yes",
                "Follow-up Date": "22/12/2017",
                "PSIbefore": 36,
                "PSIafter": 36,
                "WPTbefore": 11750,
                "WPTafter": 11750,
                "Team": "Small Business Sales",
                "POD Name": "robsonrs",
                "Google Sales Rep": "Robson Silva",
                "gCases ID": "4-3948000020463"
              }
          ];
          

           //this.insertByJSON(this.list_json[0], 0);


       

    }

    ngAfterViewInit() {
        //  Activate the tooltips
        //$('[rel="tooltip"]').tooltip();
    }

    openDetails(value: any): void {
        console.log(value);
        this.websiteDetails = value;
    }


    checkOverwrite() {
        console.log(this.websiteDetails.overwrite.enabled);
        if (!this.websiteDetails.overwrite.enabled) {
            this.hideOverwrite = false;
        } else {
            this.hideOverwrite = true;
        }
    }

    save(model: Website, isValid: boolean, form: NgForm) {

        this.showLoading = true;
        console.log(this.websiteDetails);

        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        this.http.post(this.apiUrl + 'dashboard/addwebsite', JSON.stringify(this.websiteDetails), { headers: headers })
            .subscribe((results) => {
                var res = JSON.parse(results.text());

                $.notify({
                    icon: "add_alert",
                    message: "Website added!"
                }, {
                        type: 'success',
                        timer: 4000,
                        placement: {
                            from: 'top',
                            align: 'center'
                        }
                    });
                    this.showLoading = false;
                    this.router.navigate(['/my-websites/list']);

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

    insertByJSON(model, index) {
        
               this.index_json = index;
                console.log(model);

                this.websiteDetails.url = model.URL;
                this.websiteDetails.title = model.URL;

                if (model.region == "Americas") {
                    this.websiteDetails.market = {
                       
                        "rowKey": "fb3d0280-b28a-11e7-a260-17b45e8856ab",
                        "description": "LATAM"
                    }
                } else {
                    this.websiteDetails.market = {
                      
                        "rowKey": "092027b0-b28b-11e7-a260-17b45e8856ab",
                        "description": "EMEA"
                    }
                }

                if (model.Language == "Portuguese") {
                    this.websiteDetails.language = {
                        
                        "rowKey": "0a580c40-b4cc-11e7-896a-b58caeafad9f",
                        "description": "Portuguese"
                    }
                } else {
                    this.websiteDetails.language = {
                       
                        "rowKey": "0df99d00-b4cc-11e7-896a-b58caeafad9f",
                        "description": "Spanish"
                    }
                }

                if (model.PSIbefore != "" || model.PSIafter != "" || model.WPTbefore != "" || model.WPTafter != "") {
                    this.websiteDetails.overwrite.enabled = true;
                }
                if (model.PSIbefore != "") {
                    this.websiteDetails.overwrite.psiBefore = model.PSIbefore;
                }
                if (model.PSIafter != "") {
                    this.websiteDetails.overwrite.psiAfter = model.PSIafter;
                }
                if (model.WPTbefore != "") {
                    this.websiteDetails.overwrite.wptBefore = model.WPTbefore;
                }
                if (model.WPTafter != "") {
                    this.websiteDetails.overwrite.wptAfter = model.WPTafter;
                }

                this.websiteDetails.salesEmail = "coelhog@google.com";
                this.websiteDetails.salesName = "Gustavo";

                if (model.owner == "Felipe Guarnieri") {
                    this.websiteDetails.agentEmail = "fguarnieri@google.com";
                    this.websiteDetails.agentName = "Felipe Guarnieri";
                }
                if (model.owner == "Aline Macellone") {
                    this.websiteDetails.agentEmail = "amacellone@google.com";
                    this.websiteDetails.agentName = "Aline Macellone";
                }
                if (model.owner == "Daniel Moura") {
                    this.websiteDetails.agentEmail = "danielmoura@google.com";
                    this.websiteDetails.agentName = "Daniel Moura";
                }
                if (model.owner == "André Victorino") {
                    this.websiteDetails.agentEmail = "avictorino@google.com";
                    this.websiteDetails.agentName = "André Victorino";
                }
                if (model.owner == "Danilo Araujo Luiz") {
                    this.websiteDetails.agentEmail = "daniloaraujo@google.com";
                    this.websiteDetails.agentName = "Danilo Araujo Luiz";
                }
                if (model.owner == "Valmir da Silva") {
                    this.websiteDetails.agentEmail = "valmirs@google.com";
                    this.websiteDetails.agentName = "Valmir da Silva";
                }

                if (model.Language == "Portuguese" && model.region == "Americas") {
                    this.websiteDetails.location = "SaoPaulo_BR";
                }

                if (model.Language == "Spanish" && model.region == "EMEA") {
                    this.websiteDetails.location = "Paris";
                }

                if (model.Language == "Spanish" && model.region == "Americas") {
                    this.websiteDetails.location = "Texas2";
                }

                if (model.Language == "Portuguese" && model.region == "EMEA") {
                    this.websiteDetails.location = "Paris";
                }

                
        
                var headers = new Headers();
                headers.append('Content-Type', 'application/json');
        
                this.http.post(this.apiUrl + 'dashboard/addwebsite', JSON.stringify(this.websiteDetails), { headers: headers })
                    .subscribe((results) => {
                        var res = JSON.parse(results.text());
                        console.log(this.list_json.length);
                        console.log(this.index_json + 1);
                        if (this.list_json.length >= this.index_json + 1) {
                            this.insertByJSON(this.list_json[this.index_json + 1], this.index_json + 1);
                        }
                        
                        $.notify({
                            icon: "add_alert",
                            message: model.URL+" added!"
                        }, {
                                type: 'success',
                                timer: 4000,
                                placement: {
                                    from: 'top',
                                    align: 'center'
                                }
                            });
                            
        
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

          

    
}
