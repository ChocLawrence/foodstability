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
  public postsChartData: { year: string; count: number }[] = [];
  public recentPosts: any[] = [];
  public volumeIssueStats: { volume: string; issues: { issue: string; count: number }[]; totalArticles: number }[] = [];

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
      page_size: 500,
      sortBy: 'created_at',
      sortOrder: 'desc'
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
            } else {
              this.posts = [];
            }
            this.buildChartAndStats();
          } else if (Array.isArray(posts.data)) {
            this.postsCount = posts.data.length;
            this.posts = this._core.normalizeKeys(posts.data);
            this.buildChartAndStats();
          } else {
            this.postsCount = 0;
            this.posts = [];
            this.postsChartData = [];
            this.recentPosts = [];
            this.volumeIssueStats = [];
          }
        } else {
          this.postsCount = 0;
          this.posts = [];
          this.postsChartData = [];
          this.recentPosts = [];
          this.volumeIssueStats = [];
        }
        this.loadingData = false;
      })
      .catch(e => {
        this.loadingData = false;
        this._core.handleError(e);
        this.postsCount = 0;
        this.posts = [];
        this.postsChartData = [];
        this.recentPosts = [];
        this.volumeIssueStats = [];
      });

  }

  buildChartAndStats(): void {
    const list = this.posts || [];
    const byYear: Record<string, number> = {};
    list.forEach((p: any) => {
      const d = p.created_at ? new Date(p.created_at) : null;
      if (d && !isNaN(d.getTime())) {
        const key = String(d.getFullYear());
        byYear[key] = (byYear[key] || 0) + 1;
      }
    });
    this.postsChartData = Object.keys(byYear)
      .sort((a, b) => Number(a) - Number(b))
      .map(year => ({ year, count: byYear[year] }));

    this.recentPosts = list.slice(0, 5);

    const volMap: Record<string, Record<string, number>> = {};
    list.forEach((p: any) => {
      const v = p.volume != null ? String(p.volume) : '—';
      const i = p.issue != null ? String(p.issue) : '—';
      if (!volMap[v]) volMap[v] = {};
      volMap[v][i] = (volMap[v][i] || 0) + 1;
    });
    this.volumeIssueStats = Object.keys(volMap)
      .sort((a, b) => (a === '—' ? 1 : b === '—' ? -1 : Number(b) - Number(a)))
      .map(volume => {
        const issues = Object.entries(volMap[volume]).map(([issue, count]) => ({ issue, count }));
        issues.sort((x, y) => (x.issue === '—' ? 1 : y.issue === '—' ? -1 : Number(y.issue) - Number(x.issue)));
        const totalArticles = issues.reduce((s, i) => s + i.count, 0);
        return { volume, issues, totalArticles };
      });
  }

  getDate(date: string): string {
    if (!date) return '—';
    return this._core.formatDate(date) || '—';
  }
}
