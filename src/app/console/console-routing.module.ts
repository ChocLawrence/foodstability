import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "../core/auth.guard";
import { CategoriesComponent } from "./categories/categories.component";
import { ConsoleComponent } from "./console.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { PostsComponent } from "./posts/posts.component";
import { SettingsComponent } from "./settings/settings.component";
import { SubscribersComponent } from "./subscribers/subscribers.component";
import { TagsComponent } from "./tags/tags.component";
import { UsersComponent } from "./users/users.component";

const routes: Routes = [
  {
    path: "",
    component: ConsoleComponent,
    children: [
      { path: "", redirectTo: "dashboard", pathMatch: "prefix" },
      {
        path: "dashboard", component: DashboardComponent
      },
      {
        path: "categories", component: CategoriesComponent
      },
      {
        path: "tags", component: TagsComponent
      },
      {
        path: "posts", component: PostsComponent
      },
      {
        path: "settings", component: SettingsComponent
      },
      {
        path: "users", component: UsersComponent
      },
      {
        path: "subscribers", component: SubscribersComponent
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsoleRoutingModule { }
