import { Component, OnInit } from '@angular/core';
import { Http, Headers } from "@angular/http";
import { NgForm } from '@angular/forms';
import {
    CanActivate, Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import 'rxjs/add/operator/map';
import { LocalStorageService } from 'angular-2-local-storage';
import { environment } from 'environments/environment';

declare var $: any;
declare var swal: any;
declare interface Login {
    email?: string; // required, must be valid email format
    password?: string; // required, value must be equal to confirm password.
}


@Component({
    moduleId: module.id,
    selector: 'login-cmp',
    templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {

    test: Date = new Date();

    http: Http;

    constructor(http: Http, private router: Router, private localStorageService: LocalStorageService) {
        this.http = http;
    }

    public login: Login;
    f: NgForm;

    public apiUrl = environment.apiUrl;
    public userModel: any;
    public forgotPassword: boolean = false;
    public subdomain: any;
    public siteName: string;
    public backgroundImage: string;

    checkFullPageBackgroundImage() {
        var $page = $('.full-page');
        var image_src = $page.data('image');

        if (image_src !== undefined) {
            var image_container = '<div class="full-page-background" style="background-image: url(' + image_src + ') "/>'
            $page.append(image_container);
        }
    };

    getSubdomain() {
        const domain = window.location.hostname;
        if (domain.indexOf('.') < 0 ||
            domain.split('.')[0] === 'msiteproject' || domain.split('.')[0] === 'lvh' || domain.split('.')[0] === 'www') {
            this.subdomain = '';
        } else {
            this.subdomain = domain.split('.')[0];
        }

        if (this.subdomain == "lcs") {
            this.siteName = "LCS Project";
            this.backgroundImage = "lock";
            $('.full-page-background').css('background-image', 'url("../../../assets/img/lock.jpeg")');
            $('.card-login .card-header').attr('data-background-color', 'blue');
        }  else if (this.subdomain == "overhead") {
            this.siteName = "OverHead Project";
            $('.full-page-background').css('background-image', 'url("../../../assets/img/register.jpeg")');
            $('.card-login .card-header').attr('data-background-color', 'purple');
        } else {
            this.siteName = "Msite Project";
            this.backgroundImage = "login";
        }
    }


    ngOnInit() {
        this.checkFullPageBackgroundImage();
        this.login = {
            email: '',
            password: '',
        }
        setTimeout(function () {
            // after 1000 ms we add the class animated to the login/register card
            $('.card').removeClass('card-hidden');
        }, 700)

        this.userModel = this.localStorageService.get('user');

        if (this.userModel != null && this.userModel.token) {
            this.router.navigate(['/dashboard']);
        }

        this.getSubdomain();
    }

    access(model: Login, isValid: boolean, form: NgForm) {
        // call API to save user
        console.log(model);
        var showLoading = true;

        var headers = new Headers();
        headers.append('Content-Type', 'application/json');

        if (this.forgotPassword) {
            this.http.post(this.apiUrl + 'users/forgotpassword', JSON.stringify(model), { headers: headers })
                .subscribe((res) => {
                    this.forgotPassword = false;
                    $.notify({
                        icon: "add_alert",
                        message: "A new password was sent to your email"
                    }, {
                            type: 'success',
                            timer: 4000,
                            placement: {
                                from: 'top',
                                align: 'center'
                            }
                        });
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
                    showLoading = false;
                });
        } else {
            this.http.post(this.apiUrl + 'users/login', JSON.stringify(model), { headers: headers })
                .subscribe((res) => {
                    console.log('User ' + model.email + ' logged!');
                    this.localStorageService.set('user', JSON.parse(res.text()));
                    showLoading = false;
                    this.router.navigate(['/dashboard']);
                    return false;
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
                    showLoading = false;
                });
        }
    }





}
