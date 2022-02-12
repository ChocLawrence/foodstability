import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SelfRegisterComponent } from "../../../components/self-register/self-register.component";
import { LoginAlertComponent } from "../../../components/login-alert/login-alert.component";
import { LoginComponent } from "../../../components/login/login.component";
import { ModalChoiceComponent } from "../../../components/modal-choice/modal-choice.component";
import { RegisterComponent } from "../../../components/register/register.component";
import { PasswordRecoveryComponent } from "../../../components/password-recovery/password-recovery.component";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {
  NgbDatepickerModule,
  NgbModalModule,
  NgbTooltipModule,
  NgbPopoverModule,
  NgbModule,
} from "@ng-bootstrap/ng-bootstrap";
import { RouterModule } from "@angular/router";
import { NgxLoadingModule } from "ngx-loading";

@NgModule({
  declarations: [
    SelfRegisterComponent,
    LoginAlertComponent,
    LoginComponent,
    ModalChoiceComponent,
    RegisterComponent,
    PasswordRecoveryComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    NgbModalModule,
    NgbTooltipModule,
    NgbPopoverModule,
    NgbModule,
    RouterModule,
    NgMultiSelectDropDownModule,
    NgxLoadingModule.forRoot({
      primaryColour: "#ffffff",
      secondaryColour: "#f06105",
    }),
  ],
  exports: [
    SelfRegisterComponent,
    LoginAlertComponent,
    LoginComponent,
    ModalChoiceComponent,
    RegisterComponent,
    PasswordRecoveryComponent,
  ],
})
export class GeneralModule {}
