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
  public categoriesCount: number = 0;
  public subscribersCount: number = 0;
  public usersCount: number = 0;
  public postsCount: number = 0;
  public tagsCount: number = 0;
  public posts: any[] = [];

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
    this.setDates();
    this.getTags();
    this.getCategories();
    this.getSubscribers();
    this.getPosts();
    this.getUsers();
  }

  setDates(){
    // Initialize dates if not already set
    if (this.endate.year === 0) {
      let endDate = new Date();
      this.endate.year = endDate.getFullYear();
      this.endate.month = endDate.getMonth() + 1;
      this.endate.day = endDate.getDate();
    }
    if (this.stdate.year === 0) {
      let startDate = new Date();
      startDate.setFullYear(2018, 0, 1); // Set to 2018-01-01 as default start
      this.stdate.year = startDate.getFullYear();
      this.stdate.month = startDate.getMonth() + 1;
      this.stdate.day = startDate.getDate();
    }
    this.defaultEndDate = `${this.endate.year}-${this.endate.month}-${this.endate.day}`;
    this.defaultStartDate = `${this.stdate.year}-${this.stdate.month}-${this.stdate.day}`;
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

  getSubscribers() {
    this.loadingData = true;

    this.subscribersService
      .getSubscribers()
      .then(subscribers => {
        this.subscribersCount = subscribers.data.length;
        this.loadingData = false;
      })
      .catch(e => {
        this.loadingData = false;
        this._core.handleError(e);
      });

  }


  getUsers() {
    this.loadingData = true;

    this.usersService
      .getUsers()
      .then(users => {
        this.usersCount = users.data.length;
        this.loadingData = false;
      })
      .catch(e => {
        this.loadingData = false;
        this._core.handleError(e);
      });

  }


  getPosts() {
    this.loadingData = true;
    
    // For dashboard, get all posts to show total count
    // Use a wide date range to get all posts (from 2018 to current date)
    let currentDate = new Date();
    let startDate = new Date(2018, 0, 1); // Start from 2018-01-01
    
    let data: any = {
      start: `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`,
      end: `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`,
      page: 1,
      page_size: 1 // Only need pagination metadata (total count), not the actual posts data
      // Don't set visibility to get all posts for admin dashboard
    }

    this.postsService
      .getPosts(data)
      .then(posts => {
        // Check for paginated response with total count
        if (posts && posts.data) {
          if (posts.data.total !== undefined && posts.data.total !== null) {
            // Paginated response - get total from pagination metadata
            this.postsCount = Number(posts.data.total);
            if (posts.data.data && Array.isArray(posts.data.data) && posts.data.data.length > 0) {
              this.posts = this._core.normalizeKeys(posts.data.data);
            }
          } else if (Array.isArray(posts.data)) {
            // Non-paginated response (array)
            this.postsCount = posts.data.length;
            this.posts = this._core.normalizeKeys(posts.data);
          } else {
            this.postsCount = 0;
            this.posts = [];
          }
        } else {
          this.postsCount = 0;
          this.posts = [];
        }
        this.loadingData = false;
      })
      .catch(e => {
        this.loadingData = false;
        this._core.handleError(e);
        this.postsCount = 0;
        this.posts = [];
      });

  }

}
