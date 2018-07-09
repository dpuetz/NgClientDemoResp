import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from './iuser';
import { IMessage, Message } from '../shared/imessage';
import { LoginService } from './login.service';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {

    model: IUser;
    submitted: boolean = false;
    popup : IMessage;
    self = this;
    hasError:boolean=false;

    constructor( private router: Router,
                 private loginService: LoginService ) { }

    ngOnInit() {
        this.model = {username:'Guest', password:'Password'};
    }

    loginIn(loginForm: NgForm): void {
        this.submitted = true;
        if (!loginForm.valid)
            return;

        this.loginService.doLogin(this.model)
            .subscribe(val =>
                {
                    if (val)
                        this.router.navigate(['/websites']);
                    else
                        this.badLogin();
                },
                error => this.badLogin()
            ); //subscribe
    }//loginIn

    badLogin(): void {
        this.popup = new Message('alert', 'Since this is a demo, I\'ll login for you.', "onComplete", 0);
    }

    onComplete(event:any):void{
        this.router.navigate(['/websites']);
    }

}//class



