import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CoreService } from '../../core/core.service';
import { Router, NavigationEnd } from "@angular/router";
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public loading = false;
  signupForm: FormGroup;

  constructor(public core: CoreService,
    public router: Router,
    private fb: FormBuilder, private authenticationservice: AuthenticationService) {
    this.signupForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      terms: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.signupFormIsValid() &&  this.core.checkIfOnline()) {
      this.loading = true;
      let values = this.signupForm.value;
      this.authenticationservice.signup(values).then(r => {
        this.core.encryptToLocalStorage('currentUser', JSON.stringify(r.data));
        this.core.showSuccess("Yaay", "Account created.Verify email and login.");
        setTimeout(() => {
          this.redirectToLogin();
        }, 1000);
        this.loading = false;
      }).catch(e => {
        this.loading = false;
        this.core.handleError(e);
      });

    }
  }

  redirectToLogin() {
    this.router.navigate(["/login"]);
  }


  signupFormIsValid() {
    return this.signupForm.controls['firstname'].valid
      && this.signupForm.controls['lastname'].valid
      && this.signupForm.controls['gender'].valid
      && this.signupForm.controls['email'].valid
      && this.signupForm.controls['password'].valid
      && this.signupForm.controls['confirmPassword'].valid
      && this.signupForm.controls['terms'].valid
      && this.passwordsMatch();
  }

  passwordsMatch() {
    return this.signupForm.controls['password'].value == this.signupForm.controls['confirmPassword'].value;
  }

}
