import { Component, OnInit } from '@angular/core';
import { CoreService } from '../../core/core.service';
import { CategoriesService } from '../../services/categories.service';
import { TagsService } from '../../services/tags.service';
import { PostsService } from '../../services/posts.service';
import { SubscribersService } from '../../services/subscribers.service';
import { UsersService } from '../../services/users.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {


  public animationType = 'wanderingCubes';
  public loadingData = false;
  public categoriesCount: any[] = [];
  public postsCount: any[] = [];
  public tagsCount: any[] = [];
  public posts: any[] = [];
  public user: any = null;

  public defaultStartDate = "";
  public defaultEndDate = "";
  public defaultStatus = "all";
  public stdate: any = { year: 0, month: 0, day: 0 };
  public endate: any = { year: 0, month: 0, day: 0 };
  public thisYears = new Date().getFullYear();
  public thisMonth = new Date().getMonth() + 1;
  public thisDay = new Date().getDate();
  public minDate = { year: 1930, month: 1, day: 1 };
  public maxDate = {
    year: this.thisYears,
    month: this.thisMonth,
    day: this.thisDay,
  };

  constructor(public _core: CoreService,
    private datePipe: DatePipe,
    private tagsService: TagsService,
    private usersService: UsersService,
    private postsService: PostsService,
    private subscribersService: SubscribersService,
    private categoriesService: CategoriesService) { }

  ngOnInit(): void {
    this.getCurrentUser();
    this.getTags();
    this.getCategories();
  }

  getCurrentUser() {
    if (this._core.loginUser) {
      this.user = this._core.loginUser.user;
    }

  }


  getTags() {
    this.loadingData = true;

    this.tagsService
      .getTags()
      .then(tags => {
        this.tagsCount = tags.data.length;
        this.loadingData = false;
      })
      .catch(e => {
        this.loadingData = false;
        this._core.handleError(e);
      });

  }

  getCategories() {
    this.loadingData = true;

    this.categoriesService
      .getCategories()
      .then(categories => {
        this.categoriesCount = categories.data.length;
        this.loadingData = false;
      })
      .catch(e => {
        this.loadingData = false;
        this._core.handleError(e);
      });

  }


}
