import { Component , OnInit} from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { Http, Headers } from "@angular/http";
import 'rxjs/add/operator/map';
import { environment } from 'environments/environment';
import { NgForm } from '@angular/forms';
declare var $: any;
@Component({
    moduleId: module.id,
    selector: 'footer-cmp',
    templateUrl: 'footer.component.html'
})

export class FooterComponent{
    test : Date = new Date();

    f: NgForm;
    http: Http;

    constructor(http: Http, private localStorageService: LocalStorageService) {
        this.http = http;
    }

    public apiUrl = environment.apiUrl;
    public agentDetails: any;
    public showLoading: boolean = false;
    public headers: any;

    ngOnInit() {

        this.agentDetails = this.localStorageService.get('user');
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Authorization', 'Bearer ' + this.agentDetails.token);

    }

    updateProfile(model, isValid: boolean, form: NgForm) {
        
                this.showLoading = true;

                var update_object = {
                    rowKey: this.agentDetails.rowKey,
                    fullname: model.fullname,
                    cognizantId: model.cognizantId,
                    email: model.email,
                    password: model.changePassword
                }
                console.log(update_object);
        
                this.http.post(this.apiUrl + 'users/profile', JSON.stringify(update_object), { headers: this.headers })
                    .subscribe((results) => {
                        
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
                            $('#profile').modal('hide');
        
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
