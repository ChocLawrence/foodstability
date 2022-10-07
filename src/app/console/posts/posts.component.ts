import { Component, OnInit, ViewChild, Injectable } from '@angular/core';
import { CoreService } from '../../core/core.service';
import { UrlsService } from '../../core/urls.service';
import { PostsService } from '../../services/posts.service';
import { TagsService } from '../../services/tags.service';
import { CategoriesService } from '../../services/categories.service';
import { routerTransition } from '../../router.animations';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import {
  NgbModal,
  ModalDismissReasons,
  NgbDateParserFormatter,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridComponent } from 'devextreme-angular';

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
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
  animations: [routerTransition()],
})
export class PostsComponent implements OnInit {
  @ViewChild('postModals', { static: false }) postModals: any;
  @ViewChild('postsContainer', { static: false }) postsDataGrid:
    | DxDataGridComponent
    | undefined;

  public loadingData = false;
  public posts: any[] = [];
  public tags: any[] = [];
  public categories: any[] = [];
  public limit = 10;
  public postsCount = 0;
  public animationType = 'wanderingCubes';
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

  public genericPosts: any = [];
  public thePost: any;
  public origin = 'posts';
  public postModalAction = '';

  constructor(
    public _core: CoreService,
    public _urls: UrlsService,
    private datePipe: DatePipe,
    private _formBuilder: FormBuilder,
    private tagsService: TagsService,
    private categoriesService: CategoriesService,
    private postsService: PostsService
  ) {
    this.searchForm = this._formBuilder.group({
      startd: [this.stdate],
      enddate: [this.endate],
      count: [''],
    });
  }

  ngOnInit(): void {
    this.initializeDates();
    this.getCategories();
    this.getTags();
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
    this.refresh();
  }

  initForm() {
    this.searchForm = this._formBuilder.group({
      startd: [this.stdate],
      enddate: [this.endate],
      count: [''],
    });
  }

  getCategories() {
    this.loadingData = true;

    this.categoriesService
      .getCategories()
      .then((categories) => {
        this.categories = this._core.normalizeKeys(categories.data);
        this.loadingData = false;
      })
      .catch((e) => {
        this.loadingData = false;
        this._core.handleError(e);
      });
  }

  getTags() {
    this.loadingData = true;

    this.tagsService
      .getTags()
      .then((tags) => {
        this.tags = this._core.normalizeKeys(tags.data);
        this.loadingData = false;
      })
      .catch((e) => {
        this.loadingData = false;
        this._core.handleError(e);
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

    this.loadForm(data);
    this.getPosts(data);
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

  loadForm(formData: any) {
    this.searchForm.patchValue({
      start: this.getStringDate(formData.start),
      end: formData.end,
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

  getPosts(data: any) {
    this.loadingData = true;

    let searchDate = {
      start: data.start,
      end: data.end,
    };

    localStorage.setItem('posts_search_data', JSON.stringify(searchDate));

    this.postsService
      .getPosts(data)
      .then((posts) => {
        if (posts.data.data) {
          this.postsCount = posts.data.data.length;
          this.posts = this._core.normalizeKeys(posts.data.data);
        }else{
          this.postsCount = posts.data.length;
          this.posts = this._core.normalizeKeys(posts.data);
        }

        console.log(posts);

        this.genericPosts = posts.data;
        this.loadingData = false;
      })
      .catch((e) => {
        this.loadingData = false;
        this._core.handleError(e);
      });
  }

  getTagName(value: string) {
    let tag = this.tags.filter((item) => {
      return item.id == value;
    });
    return tag[0].name;
  }

  openPostModal(action: string, Post: any) {
    this.postModalAction = action;
    this.thePost = Post;
    this.postModals.openModal();
  }

  onPostModalClosed() {
    this.postModalAction = '';
    this.thePost = null;
    this.refresh();
  }

  onPostUpdated(id: any) {
    //this.getPost(id, 'update');
  }

  formatAmount(cost: any) {
    if (!this._core.isEmptyOrNull(cost) || cost !== '')
      return Number(cost).toFixed(2);
    else return '-';
  }

  getDate(date: string) {
    if (!this._core.isEmptyOrNull(date)) {
      return this._core.formatDate(date);
    } else {
      return '';
    }
  }

  checkSearchStore() {
    let data = {
      start: this.defaultStartDate,
      end: this.defaultEndDate,
    };

    return data;
  }


  prevPage() {
    this.loadingData = true;
    let data = this.checkSearchStore();
    this.postsService
      .getPostsAtUrl(this.genericPosts.prev_page_url, data)
      .then((posts) => {
        this.genericPosts = posts.data;
        this.posts = posts.data.data;
        this.loadingData = false;
      });
  }

  nextPage() {
    this.loadingData = true;
    let data = this.checkSearchStore();
    this.postsService
      .getPostsAtUrl(this.genericPosts.next_page_url, data)
      .then((posts) => {
        this.genericPosts = posts.data;
        this.posts = posts.data.data;
        this.loadingData = false;
      });
  }

  customizeExcelCell = (options: any) => {
    var gridCell = options.gridCell;
    if (!gridCell) {
      return;
    }

    if (gridCell.rowType === 'data') {
      if (gridCell.column.dataField === 'created_at') {
        options.value = this.datePipe.transform(gridCell.value, 'medium');
      }
    }
  };
}
