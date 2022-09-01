import { NgModule } from '@angular/core';
import { AuthGuard } from './core/auth.guard';
import { AdminAuthGuard } from './core/admin-auth.guard';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ContactComponent } from './components/contact/contact.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { AccountVerificationComponent } from './components/account-verification/account-verification.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AuthorModule } from './author/author.module';
import { ConsoleModule } from './console/console.module';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { EditorialComponent } from './components/editorial/editorial.component';
import { ArticlesComponent } from './components/articles/articles.component';
import { ReviewComponent } from './components/review/review.component';
import { EthicsComponent } from './components/ethics/ethics.component';
import { AbstractComponent } from './components/abstract/abstract.component';
import { ArchivesComponent } from './components/archives/archives.component';
import { ApcComponent } from './components/apc/apc.component';
import { OpenaccessComponent } from './components/openaccess/openaccess.component';
import { AuthorsGuideComponent } from './components/authors-guide/authors-guide.component';

const routes: Routes = [
  // { path: 'author', loadChildren: () => { return AuthorModule; }, canActivate: [AuthGuard] },
  // { path: 'console', loadChildren: () => { return ConsoleModule; }, canActivate: [AdminAuthGuard] },
  {
    "path": "",
    children: [
      { path: '', component: PageNotFoundComponent },
    ]
  },
  // {
  //   "path": "editorial",
  //   children: [
  //     { path: '', component: EditorialComponent },
  //   ]
  // },
  // {
  //   "path": "articles",
  //   children: [
  //     { path: '', component: ArticlesComponent },
  //   ]
  // },
  // {
  //   "path": "review",
  //   children: [
  //     { path: '', component: ReviewComponent },
  //   ]
  // },
  // {
  //   "path": "ethics",
  //   children: [
  //     { path: '', component: EthicsComponent },
  //   ]
  // },
  // {
  //   "path": "abstract",
  //   children: [
  //     { path: ':slug', component: AbstractComponent },
  //   ]
  // },
  // {
  //   "path": "archives",
  //   children: [
  //     { path: '', component: ArchivesComponent },
  //     { path: ':volume', component: ArchivesComponent },
  //     { path: ':volume/:issue', component: ArchivesComponent },
  //   ]
  // },
  // {
  //   "path": "apc",
  //   children: [
  //     { path: '', component: ApcComponent },
  //   ]
  // },
  // {
  //   "path": "authors-guide",
  //   children: [
  //     { path: '', component: AuthorsGuideComponent },
  //   ]
  // },
  // {
  //   "path": "openaccess",
  //   children: [
  //     { path: '', component: OpenaccessComponent },
  //   ]
  // },
  // {
  //   "path": "contact",
  //   children: [
  //     { path: '', component: ContactComponent },
  //   ]
  // },
  // {
  //   path: 'login',
  //   children: [
  //     { path: '', component: LoginComponent },
  //   ]
  // },
  // {
  //   path: 'signup',
  //   children: [
  //     { path: '', component: SignupComponent },
  //   ]
  // },
  // {
  //   path: "password-reset",
  //   children: [
  //     { path: "", component: PasswordResetComponent },
  //     { path: "change/:id", component: PasswordResetComponent },
  //   ],
  // },
  // {
  //   path: "verification",
  //   children: [
  //     { path: ":id", component: AccountVerificationComponent },
  //   ],
  // },
  // {
  //   path: "verify-email",
  //   children: [
  //     { path: "", component: VerifyEmailComponent },
  //   ],
  // },
  { path: "404", component: PageNotFoundComponent },
  { path: '**', redirectTo: '404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
