import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { PasswordValidation } from '../../forms/validationforms/password-validator.component';
import { Http, Headers } from "@angular/http";
import { NgForm } from '@angular/forms';
import 'rxjs/add/operator/map';
import { environment } from 'environments/environment';
declare var $:any;
declare var swal:any;
declare  interface User {
    fullname?: string; // required, must be 5-8 characters
    email?: string; // required, must be valid email format
    password?: string; // required, value must be equal to confirm password.
    confirmPassword?: string; // required, value must be equal to password.
}

@Component({
    moduleId: module.id,
    selector: 'register-cmp',
    templateUrl: './register.component.html'
})

export class RegisterComponent implements OnInit {

    http: Http;

    constructor(http: Http) {
        this.http = http;
    }

    public user: User;
    public typeValidation: User;
    test: Date = new Date();
    f: NgForm;
    public apiUrl = environment.apiUrl;
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
       
        this.user = {
            fullname: '',
            email: '',
            password: '',
            confirmPassword: ''
          }
          this.typeValidation = {
              fullname: '',
              email: '',
              password: '',
              confirmPassword: ''
          }

          this.getSubdomain();
    }
    
    save(model: User, isValid: boolean, form: NgForm) {
        // call API to save user
        console.log(model);
        var showLoading = true;

        var headers = new Headers();
        var errorMsg = '';
        headers.append('Content-Type', 'application/json');

        this.http.post(this.apiUrl+'users/create', JSON.stringify(model), { headers: headers })
            .subscribe(() => {
                console.log('User '+model.fullname+' created!');
                showLoading = false;
            
                swal({
                    type: "success",
                    title: 'User '+model.fullname+' created! ',
                    text: 'Your account needs to be approved first. You will receive an email when your account is ready.',
                    buttonsStyling: false,
                    confirmButtonClass: "btn btn-success"
                });
                form.reset();
        }, error =>  {
            console.log(error);
            var errors = JSON.parse(error._body);
            for(let data of errors) {
                $.notify({
                    icon: "add_alert",
                    message: data.msg
                },{
                    type: 'danger',
                    timer: 4000,
                    placement: {
                        from: 'top',
                        align: 'center'
                    }
                });
              }
            showLoading = false;
        }) ;
    }
    
    onSubmit(value: any):void{
        console.log(value);
        value.reset();
    }
}