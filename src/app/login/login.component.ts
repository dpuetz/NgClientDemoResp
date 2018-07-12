import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from './iuser';
import { IMessage, Message } from '../shared/imessage';
import { LoginService } from './login.service';
import { FormGroup, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit, OnDestroy  {

    model: IUser;
    popup : IMessage;
    private validationMessages: { [key: string]: { [key: string]: string } };
    usernameMsg: string;
    passwordMsg: string;
    loginForm: FormGroup;
    private subUsername: Subscription;
    private subPassword: Subscription;

    constructor( private router: Router,
                 private loginService: LoginService,
                 private fb: FormBuilder ) {

        this.validationMessages = {
            username: {
                required: 'Please enter your user name.'
            },
            password: {
                required: 'Please enter your password.'
            }
        }//validationMessages

    };  //constructor

    ngOnInit() {
        this.model = {username:'Guest', password:'Password'};
        this.loginForm = this.fb.group({
            username: ['Guest', [Validators.required]],
            password: ['Password', [Validators.required]]
        });

        const usernameControl = this.loginForm.get('username');
        this.subUsername = usernameControl.valueChanges
                .pipe(debounceTime(100))
                .subscribe(value => {
                            this.setMessage(usernameControl, 'username');
                        }
        );
        const passwordControl = this.loginForm.get('password');
        this.subPassword = passwordControl.valueChanges
                .pipe(debounceTime(100))
                .subscribe(value => {
                            this.setMessage(passwordControl, 'password');
                        }
        );


    } //ngOnInit

    setMessage(c: AbstractControl, name: string): void {
        switch (name)   {
            case 'username':
                this.usernameMsg = '';
                if ((c.touched || c.dirty) && c.errors) {
                    this.usernameMsg = Object.keys(c.errors).map(key =>
                                this.validationMessages.username[key]).join(' ');
                }
                break;
            case 'password':
                this.passwordMsg = '';
                if ((c.touched || c.dirty) && c.errors) {
                    this.passwordMsg = Object.keys(c.errors).map(key =>
                                this.validationMessages.password[key]).join(' ');
                }
                break;
        } //switch
    } //setMessage

    loginIn(): void {

        let log = Object.assign({}, this.model, this.loginForm.value);

        this.loginService.doLogin(log)
            .subscribe(val =>
                {
                    if (val)
                        this.router.navigate(['/websites']);
                    else
                        this.badLogin();
                }
            ); //subscribe
    }//loginIn

    badLogin(): void {
        this.popup = new Message('alert', 'Since this is a demo, I\'ll login for you.', "onComplete", 0);
    }

    onComplete(event:any):void{
        this.router.navigate(['/websites']);
    }

     ngOnDestroy() {
            if (this.subUsername) {
                this.subUsername.unsubscribe();
            }
            if (this.subPassword) {
                this.subPassword.unsubscribe();
            }
     } //ngOnDestroy

}//class



