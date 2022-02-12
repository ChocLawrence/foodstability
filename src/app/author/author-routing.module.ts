import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "../core/auth.guard";
import { AuthorComponent } from "./author.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { SettingsComponent } from "./settings/settings.component";
import { SubmissionComponent } from "./submission/submission.component";

const routes: Routes = [
  {
    path: "",
    component: AuthorComponent,
    children: [
      { path: "", redirectTo: "dashboard", pathMatch: "prefix" },
      {
        path: "dashboard", component: DashboardComponent
      },
      {
        path: "submission", component: SubmissionComponent
      },
      {
        path: "settings", component: SettingsComponent
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthorRoutingModule { }
