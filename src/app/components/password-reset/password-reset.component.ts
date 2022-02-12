import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CoreService } from '../../core/core.service';
import { Router, NavigationEnd } from "@angular/router";
import { ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {

  public loading = false;
  public state: any;
  public resetId: any;
  public verification = false;
  resetForm: FormGroup;
  changePasswordForm: FormGroup;

  constructor(public core: CoreService,
    public router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder, private authenticationservice: AuthenticationService) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.changePasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.processReset();
  }

  onSubmitReset() {

    if (this.resetFormIsValid() && this.core.checkIfOnline()) {
      this.loading = true;
      let values = this.resetForm.value;

      this.authenticationservice.resetPassword(values).then(r => {
        this.core.showSuccess("Success", "Check Email for reset link...");
        //localStorage.setItem("page","menu");
        setTimeout(function () {
          window.location.href = "/login";
        }, 2000);
        this.resetForm.reset();
        this.loading = false;

      }).catch(e => {
        this.loading = false;
        this.core.handleError(e);
      });

    }

    return false;

  }

  onSubmitChangePassword() {
    if (this.changePasswordFormIsValid() && this.core.checkIfOnline()) {
      this.loading = true;
      let values = this.changePasswordForm.value;
      values.resetPasswordToken = this.resetId;

      this.authenticationservice.resetPasswordNow(values).then(r => {
        this.core.showSuccess("Success", "Password reset successfully");
        setTimeout(function () {
          window.location.href = "/login";
        }, 3000);
        this.changePasswordForm.reset();
        this.loading = false;

      }).catch(e => {
        this.loading = false;
        this.core.handleError(e);
      });

    }

    return false;
  }

  async processReset() {

    this.route.queryParams
      .subscribe(params => {
        this.resetId  = params['token'];
        this.state  = params['state'];
      }
    );

    //check current url
    if (!this.core.isEmptyOrNull(this.resetId) && this.state == 'change') {
      this.verification = true;
    }else{
      this.verification = false;
    }



  }

  redirectToLogin() {
    this.core.showSuccess('Success', 'Redirecting to login..')
    this.router.navigate(["/login"]);
  }

  resetFormIsValid() {
    return this.resetForm.controls['email'].valid;
  }

  changePasswordFormIsValid() {
    return this.changePasswordForm.controls['password'].valid
      && this.changePasswordForm.controls['confirmPassword'].valid
      && this.changePasswordForm.controls['email']
      && this.passwordsMatch();
  }

  passwordsMatch() {
    return this.changePasswordForm.controls['password'].value == this.changePasswordForm.controls['confirmPassword'].value;
  }

}

