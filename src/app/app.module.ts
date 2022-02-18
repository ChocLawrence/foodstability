import { DatePipe, TitleCasePipe } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { LOCALE_ID, NgModule } from '@angular/core';
import { LanguageTranslationModule } from "./shared/modules/language-translation/language-translation.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminAuthGuard } from './core/admin-auth.guard';
import { AuthGuard } from './core/auth.guard';
import { ErrorInterceptor } from './core/error.interceptor';
import { JwtInterceptor } from './core/jwt.interceptor';
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
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
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ContactComponent } from './components/contact/contact.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { AccountVerificationComponent } from './components/account-verification/account-verification.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { EditorialComponent } from './components/editorial/editorial.component';
import { ArticlesComponent } from './components/articles/articles.component';
import { ReviewComponent } from './components/review/review.component';
import { EthicsComponent } from './components/ethics/ethics.component';
import { OpenaccessComponent } from './components/openaccess/openaccess.component';
import { AbstractComponent } from './components/abstract/abstract.component';
import { ArchivesComponent } from './components/archives/archives.component';
import { ApcComponent } from './components/apc/apc.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AuthorsGuideComponent } from './components/authors-guide/authors-guide.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    PageNotFoundComponent,
    ContactComponent,
    PasswordResetComponent,
    AccountVerificationComponent,
    VerifyEmailComponent,
    EditorialComponent,
    ArticlesComponent,
    ReviewComponent,
    EthicsComponent,
    OpenaccessComponent,
    AbstractComponent,
    ArchivesComponent,
    ApcComponent,
    HeaderComponent,
    FooterComponent,
    AuthorsGuideComponent,
  ],
  imports: [
    BrowserModule,
    LanguageTranslationModule,
    BrowserAnimationsModule,
    FormsModule, 
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
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.wanderingCubes,
      backdropBackgroundColour: 'rgba(0,0,0,0.4)',
      backdropBorderRadius: '4px',
      primaryColour: '#ffffff',
      secondaryColour: '#ffffff',
      tertiaryColour: '#ffffff',
      fullScreenBackdrop: true
    }),
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    HttpClientModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [AuthGuard, AdminAuthGuard, TitleCasePipe, DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: "en-GB" },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
