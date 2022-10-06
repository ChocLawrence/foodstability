import { NgModule, CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID } from "@angular/core";
import {
  CommonModule,
  LocationStrategy,
  PathLocationStrategy
} from '@angular/common';
import { TranslateModule } from "@ngx-translate/core";
import { DxDataGridModule, DxTooltipModule, DxTemplateModule } from "devextreme-angular";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { PdfViewerModule } from 'ng2-pdf-viewer';
import {
  NgbDropdownModule,
  NgbTabsetModule,
  NgbButtonsModule,
  NgbAlertModule,
  NgbDatepickerModule,
  NgbModalModule,
  NgbTooltipModule,
  NgbPopoverModule,
  NgbAccordionModule
} from "@ng-bootstrap/ng-bootstrap";
import { NgxLoadingModule, ngxLoadingAnimationTypes } from "ngx-loading";
import { ConsoleRoutingModule } from "./console-routing.module";
import { ConsoleComponent } from "./console.component";
import localeGb from "@angular/common/locales/en-GB";
import { FormsModule } from "@angular/forms";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { NgbModule, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { registerLocaleData } from "@angular/common";
import { UsersComponent } from './users/users.component';
import { SubscribersComponent } from './subscribers/subscribers.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CategoriesComponent } from './categories/categories.component';
import { TagsComponent } from './tags/tags.component';
import { PostsComponent } from './posts/posts.component';
import { SettingsComponent } from './settings/settings.component';
import { ModalCategoryComponent } from './modal-category/modal-category.component';
import { ModalTagComponent } from './modal-tag/modal-tag.component';
import { ModalSubscriberComponent } from './modal-subscriber/modal-subscriber.component';
import { ModalUserComponent } from './modal-user/modal-user.component';
import { ModalPostComponent } from './modal-post/modal-post.component';


registerLocaleData(localeGb);

@NgModule({
  imports: [
    CommonModule,
    ConsoleRoutingModule,
    TranslateModule,
    DxDataGridModule,
    PdfViewerModule,
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
    NgbTabsetModule,
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
    ConsoleComponent,
    UsersComponent,
    SubscribersComponent,
    DashboardComponent,
    HeaderComponent,
    SidebarComponent,
    CategoriesComponent,
    TagsComponent,
    PostsComponent,
    SettingsComponent,
    ModalCategoryComponent,
    ModalTagComponent,
    ModalSubscriberComponent,
    ModalUserComponent,
    ModalPostComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    NgbActiveModal
  ]
})
export class ConsoleModule { }
