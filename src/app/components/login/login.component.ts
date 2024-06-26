import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CoreService } from '../../core/core.service';
import { Router, NavigationEnd } from "@angular/router";
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  public loading = false;
  public destination: any;
  loginForm: FormGroup;

  constructor(public core: CoreService,
    public router: Router,
    private fb: FormBuilder, private authenticationservice: AuthenticationService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  onSubmitLogin() {

    if (this.loginFormIsValid() &&  this.core.checkIfOnline()) {
      this.loading = true;
      let values = this.loginForm.value;
      values.email = values.email;

      this.authenticationservice.login(values).then(r => {
        this.core.encryptToLocalStorage(
          "currentUser",
          JSON.stringify(r.data)
        );
        this.core.encryptToLocalStorage(
          "menu",
          JSON.stringify(r.data.user.role_id)
        );

        this.core.goToConsole();
        this.loading = false;

      }).catch(e => {
        this.loading = false;
        this.core.handleError(e);
      });

    }

    return false;

  }


  loginFormIsValid() {
    return this.loginForm.controls['email'].valid
      && this.loginForm.controls['password'].valid;
  }

  redirectToDashboard(destination: string) {
    let timer = setTimeout(() => {
      window.location.href = destination;
      clearTimeout(timer);
    }, 2000);
  }

}
