import {
  Component,
  OnInit,
  ViewChild,
  Injectable,
  AfterViewInit,
  ElementRef,
} from '@angular/core';import { Title, Meta } from '@angular/platform-browser';
import { CoreService } from '../../core/core.service';
import { UrlsService } from '../../core/urls.service';
import { CategoriesService } from '../../services/categories.service';
import { DatePipe } from '@angular/common';
import { routerTransition } from '../../router.animations';
import { PostsService } from '../../services/posts.service';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';
import {
  NgbModal,
  ModalDismissReasons,
  NgbDateParserFormatter,
  NgbDateStruct,
  NgbTabset,
} from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
  readonly DELIMITER = '-';

  parse(value: string): NgbDateStruct {
    let result: any = null;
    if (value) {
      let date = value.split(this.DELIMITER);
      result = {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10),
      };
    }
    return result;
  }

  format(date: NgbDateStruct): string {
    let result: any = null;
    if (date) {
      result =
        date.day + this.DELIMITER + date.month + this.DELIMITER + date.year;
    }
    return result;
  }
}

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css'],
  animations: [routerTransition()],
})
export class ArticlesComponent implements OnInit, AfterViewInit {
  public animationType = 'wanderingCubes';
  public loadingData = false;
  public title = 'Articles | Journal of Food Stability';
  public date = new Date();
  public postsCount:any = 0;
  public categoriesCount:any = 0;
  public posts: any = [];
  public genericPosts: any = [];
  public categories: any[] = [];
  public viewCount:any;
  public downloadsCount:any;
  public searchForm: FormGroup;
  public defaultStartDate = '';
  public defaultEndDate = '';
  public defaultStatus = 'all';
  public stdate: any = { year: 0, month: 0, day: 0 };
  public endate: any = { year: 0, month: 0, day: 0 };
  public thisYears = new Date().getFullYear();
  public thisMonth = new Date().getMonth() + 1;
  public thisDay = new Date().getDate();
  public minDate = { year: 2018, month: 1, day: 1 };
  public maxDate = {
    year: this.thisYears,
    month: this.thisMonth,
    day: this.thisDay,
  };
  public data = {
    start: this.defaultStartDate,
    end: this.defaultEndDate,
  };

  constructor(
    private titleService: Title,
    public _core: CoreService,
    public _urls: UrlsService,
    private metaTagService: Meta,
    private _formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private postsService: PostsService,
    private categoriesService: CategoriesService
  ) {
    this.searchForm = this._formBuilder.group({
      startd: [this.stdate],
      enddate: [this.endate],
      count: [''],
    });
  }


  ngAfterViewInit() {
  }

  ngOnInit(): void {
    this.titleService.setTitle(this.title);
    this.metaTagService.updateTag({
      name: 'description',
      content:
        'In the Journal of Food Stability, articles are taken three times in a year and worked on by the panel. A successful research article is published at the end of every trimester',
    });
    this.initializeDates();
    this.setDates();
  }

  initializeDates() {
    let endDate = new Date();
    let startDate = this._core.getStartDate(endDate);
    // startDate.setDate(1);
    // startDate.setMonth(0);
    this.stdate.year = startDate.getFullYear();
    this.stdate.month = startDate.getMonth() + 1;
    this.stdate.day = startDate.getDate();
    this.endate.year = endDate.getFullYear();
    this.endate.month = endDate.getMonth() + 1;
    this.endate.day = endDate.getDate();
    if (this._core.checkIfOnline()) {
      this.getCategories();
      this.refresh();
    }
  }

  async updatePostCount(id: any) {
    this.loadingData = true;
    let obj = {
      view_count: 1,
    };

    await this.postsService
      .updatePostCount(obj,id)
      .then((r) => {
        this.loadingData = false;
        this.viewCount = document.getElementById('views'+ id);
        if(this.viewCount.innerHTML) this.viewCount.innerText =  Number(obj.view_count) + Number(this.viewCount.innerHTML);

        this.downloadsCount = document.getElementById('downloads'+ id);
        if(this.downloadsCount.innerHTML) this.downloadsCount.innerHTML =  Number(obj.view_count) + Number(this.downloadsCount.innerHTML);
      })
      .catch((e) => {
        this.loadingData = false;
        this._core.handleError(e);
      });
  }
  
  initForm() {
    this.searchForm = this._formBuilder.group({
      startd: [this.stdate],
      enddate: [this.endate],
      count: [''],
    });
  }

  refresh() {
    this.defaultEndDate = `${this.endate.year}-${this.endate.month}-${this.endate.day}`;
    this.defaultStartDate = `${this.stdate.year}-${this.stdate.month}-${this.stdate.day}`;

    this.initForm();

    let searchData = JSON.parse(
      localStorage.getItem('posts_search_data') as '{}'
    );
    let data: any = {};
    if (this._core.isEmptyOrNull(searchData)) {
      data = {
        start: this.defaultStartDate,
        end: this.defaultEndDate,
      };
    } else {
      data = {
        start: searchData.start,
        end: this.defaultEndDate,

        //status: searchData.status
      };
    }

    data.page_size = 20;
    this.loadForm(data);
    this.getPosts(data);
  }

  loadForm(formData: any) {
    this.searchForm.patchValue({
      start: this.getStringDate(formData.start),
      end: formData.end,
    });
  }

  checkSearchStore(){
    let searchData = JSON.parse(
      localStorage.getItem('posts_search_data') as '{}'
    );
    let data: any = {};
    if (this._core.isEmptyOrNull(searchData)) {
      data = {
        start: this.defaultStartDate,
        end: this.defaultEndDate,
      };
    } else {
      data = {
        start: searchData.start,
        end: this.defaultEndDate,
        //status: searchData.status
      };
    }

    return data;
  }

  onSubmit() {
    const search = this.searchForm.controls;
    let startDate = '';
    let endDate = '';
    if (search['startd'].value && search['enddate'].value) {
      startDate = `${search['startd'].value.year}-${search['startd'].value.month}-${search['startd'].value.day}`;
      endDate = `${search['enddate'].value.year}-${search['enddate'].value.month}-${search['enddate'].value.day}`;
    }

    let data: any = {};
    if (startDate) data.start = startDate;
    if (endDate) data.end = endDate;

    this.getPosts(data);
  }

  onSearch() {
    const search = this.searchForm.controls;
    if (search['startd'].status === 'VALID') {
      this.onSubmit();
    }
    // else if (search.value.status == "pending" || search.value.status == "success") {
    //   this.onSubmit();
    // }
  }

  refreshDataSource() {
    this.initForm();
    this.getPosts(this.data);
  }

  setDates() {
    this.defaultEndDate = `${this.endate.year}-${this.endate.month}-${this.endate.day}`;
    this.defaultStartDate = `${this.stdate.year}-${this.stdate.month}-${this.stdate.day}`;
  }

  getCategories() {
    this.loadingData = true;

    this.categoriesService
      .getCategories()
      .then((categories) => {
        this.categoriesCount = categories.data.length;
        this.loadingData = false;
      })
      .catch((e) => {
        this.loadingData = false;
        this._core.handleError(e);
      });
  }

  getStringDate(dateValue: any) {
    if (!this._core.isEmptyOrNull(dateValue)) {
      let newDate = new Date(dateValue);
      let outDate = { year: 0, month: 0, day: 0 };
      outDate.year = newDate.getFullYear();
      outDate.month = newDate.getMonth() + 1;
      outDate.day = newDate.getDate();
      return outDate;
    } else {
      return '';
    }
  }

  prevPage() {
    let data = this.checkSearchStore();
    this.postsService
      .getPostsAtUrl(this.genericPosts.prev_page_url,data)
      .then((posts) => {
        this.genericPosts = posts.data;
        this.posts = posts.data.data;
      });
  }

  nextPage() {
    let data = this.checkSearchStore();
    this.postsService
      .getPostsAtUrl(this.genericPosts.next_page_url,data)
      .then((posts) => {
        this.genericPosts = posts.data;
        this.posts = posts.data.data;
      });
  }

  getPosts(data: any) {
    this.loadingData = true;

    let searchDate = {
      start: data.start,
      end: data.end,
      page_size: 20,
    };

    localStorage.setItem('posts_search_data', JSON.stringify(searchDate));

    this.postsService
      .getPosts(data)
      .then((posts) => {
        if (posts.data.data) {
          this.postsCount = posts.data.data.length;
          this.posts = this._core.normalizeKeys(posts.data.data);
        } else {
          this.postsCount = posts.data.length;
          this.posts = this._core.normalizeKeys(posts.data);
        }

        this.genericPosts = posts.data;
        this.loadingData = false;
      })
      .catch((e) => {
        this.loadingData = false;
        this._core.handleError(e);
      });
  }
}
