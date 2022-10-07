import { NgModule, CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID } from "@angular/core";
import {
  CommonModule,
  LocationStrategy,
  PathLocationStrategy
} from '@angular/common';
import { TranslateModule } from "@ngx-translate/core";
import { DxDataGridModule, DxTooltipModule, DxTemplateModule } from "devextreme-angular";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import {
  NgbDropdownModule,
  NgbButtonsModule,
  NgbAlertModule,
  NgbDatepickerModule,
  NgbModalModule,
  NgbTooltipModule,
  NgbPopoverModule,
  NgbAccordionModule
} from "@ng-bootstrap/ng-bootstrap";
import { NgxLoadingModule, ngxLoadingAnimationTypes } from "ngx-loading";
import { AuthorRoutingModule } from "./author-routing.module";
import { AuthorComponent } from "./author.component";
import localeGb from "@angular/common/locales/en-GB";
import { FormsModule } from "@angular/forms";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { NgbModule, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { registerLocaleData } from "@angular/common";
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { HeaderComponent } from "./components/header/header.component";
import { SettingsComponent } from './settings/settings.component';
import { ModalUserComponent } from './modal-user/modal-user.component';
import { SubmissionComponent } from './submission/submission.component';


registerLocaleData(localeGb);

@NgModule({
  imports: [
    CommonModule,
    AuthorRoutingModule,
    TranslateModule,
    DxDataGridModule,
    DxTooltipModule,
    DxTemplateModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.wanderingCubes,
      backdropBackgroundColour: 'rgba(0,0,0,0.4)',
      backdropBorderRadius: '4px',
      primaryColour: '#ffffff',
      secondaryColour: '#ffffff',
      tertiaryColour: '#ffffff',
      fullScreenBackdrop: true
    }),
    NgbDropdownModule,
    NgbButtonsModule,
    NgbAlertModule,
    NgbDatepickerModule,
    NgbModalModule,
    NgbTooltipModule,
    NgbPopoverModule,
    NgbAccordionModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
  ],
  declarations: [
    AuthorComponent,
    DashboardComponent,
    HeaderComponent,
    SidebarComponent,
    SettingsComponent,
    ModalUserComponent,
    SubmissionComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    NgbActiveModal
  ]
})
export class AuthorModule { }
