import {
  Component,
  OnInit,
  ViewChild,
  Injectable,
  AfterViewInit,
  ElementRef,
} from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { CoreService } from '../../core/core.service';
import { UrlsService } from '../../core/urls.service';
import { CategoriesService } from '../../services/categories.service';
import { DatePipe } from '@angular/common';
import { routerTransition } from '../../router.animations';
import { PostsService } from '../../services/posts.service';
import { ArchivesService } from '../../services/archives.service';
import { MetaService } from '../../services/meta.service';
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
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [routerTransition()],
})
export class HomeComponent implements OnInit, AfterViewInit {
  public animationType = 'wanderingCubes';
  public loadingData = false;
  public title = 'Home | Journal of Food Stability';
  public date = new Date();
  public postsCount: any = 0;
  public viewCount: any;
  public downloadsCount: any;
  public categoriesCount: any = 0;
  public posts: any = [];
  public genericPosts: any = [];
  public categories: any[] = [];
  public volumeList: any[] = [];
  public issueList: any[] = [];

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
    private metaService: MetaService,
    private datePipe: DatePipe,
    private postsService: PostsService,
    private archivesService: ArchivesService,
    private categoriesService: CategoriesService
  ) {
    this.searchForm = this._formBuilder.group({
      startd: [this.stdate],
      enddate: [this.endate],
      count: [''],
      volume: [''],
      issue: [''],
    });
  }

  ngAfterViewInit() {
  }

  ngOnInit(): void {
    this.metaService.createCanonicalURL("https://foodstability.com/");
    this.titleService.setTitle(this.title);
    this.metaTagService.addTags([
      {
        name: 'description',
        content:
          'Looking for food stability open access journals,Visit the Journal of Food Stability to read science journals, open access journals,food stability research articles,etc., we have a huge collection of food stability open access journals.',
      },
      {
        name: 'keywords',
        content: 'journal of food stability,food stability,food preservation',
      },
      { name: 'robots', content: 'index, follow' },
      { name: 'author', content: 'Lawrence Elango' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, shrink-to-fit=no',
      },
      { name: 'date', content: this.date.toString(), scheme: 'YYYY-MM-DD' },
      { charset: 'UTF-8' },
    ]);
    this.setDates();
    this.initializeDates();
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
      this.getVolumes();
      this.refresh();
    }
  }

  getVolumes() {
    this.archivesService
      .getArchives()
      .then((res) => {
        this.volumeList = (res.data && Array.isArray(res.data)) ? this._core.normalizeKeys(res.data) : [];
      })
      .catch(() => {
        this.volumeList = [];
      });
  }

  onVolumeChange() {
    const volume = this.searchForm.get('volume')?.value;
    this.searchForm.patchValue({ issue: '' });
    this.issueList = [];
    const issueControl = this.searchForm.get('issue');
    if (volume) {
      issueControl?.enable();
      this.loadIssuesForVolume(volume);
    } else {
      issueControl?.disable();
    }
  }

  private loadIssuesForVolume(volume: string | number) {
    this.archivesService
      .getArchivesByVolume(volume)
      .then((res) => {
        this.issueList = (res.data && Array.isArray(res.data)) ? this._core.normalizeKeys(res.data) : [];
      })
      .catch(() => {
        this.issueList = [];
      });
  }

  initForm() {
    this.searchForm = this._formBuilder.group({
      startd: [this.stdate],
      enddate: [this.endate],
      count: [''],
      volume: [''],
      issue: [{ value: '', disabled: true }],
    });
  }

  async refresh() {
    this.defaultEndDate = `${this.endate.year}-${this.endate.month}-${this.endate.day}`;
    this.defaultStartDate = `${this.stdate.year}-${this.stdate.month}-${this.stdate.day}`;

    this.initForm();
    let data = this.checkSearchStore();
    this.loadForm(data);
    if (data.volume) {
      this.loadIssuesForVolume(data.volume);
    } else {
      this.issueList = [];
    }
    await this.getPosts(data);
  }

  loadForm(formData: any) {
    const issueControl = this.searchForm.get('issue');
    if (formData.volume) {
      issueControl?.enable();
    } else {
      issueControl?.disable();
    }
    this.searchForm.patchValue({
      startd: this.getStringDate(formData.start),
      enddate: this.getStringDate(formData.end),
      volume: formData.volume || '',
      issue: formData.issue || '',
    });
  }

  checkSearchStore() {

    let searchData = JSON.parse(
      localStorage.getItem('home_posts_search_data') as '{}'
    );
    let data: any = {};

    if (this._core.isEmptyOrNull(searchData)) {
      data = {
        start: this.defaultStartDate,
        end: this.defaultEndDate,
        visibility: 0,
      };
    } else {
      data = {
        start: searchData.start,
        end: this.defaultEndDate,
        visibility: 0,
      };
      
      // Include volume and issue if they exist in stored data
      if (searchData.volume) {
        data.volume = searchData.volume;
      }
      if (searchData.issue) {
        data.issue = searchData.issue;
      }
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
    
    // Include volume and issue filters
    if (search['volume'].value) {
      data.volume = search['volume'].value;
    }
    if (search['issue'].value) {
      data.issue = search['issue'].value;
    }

    data.visibility = 0;
    this.getPosts(data);
  }

  async updatePostCount(id: any) {
    this.loadingData = true;
    await this.postsService
      .updatePostCount(id)
      .then((r) => {
        this.loadingData = false;
        this.viewCount = document.getElementById('views'+ id);
        if(this.viewCount.innerHTML) this.viewCount.innerText =  Number(1) + Number(this.viewCount.innerHTML);

        this.downloadsCount = document.getElementById('downloads'+ id);
        if(this.downloadsCount.innerHTML) this.downloadsCount.innerHTML =  Number(1) + Number(this.downloadsCount.innerHTML);
      })
      .catch((e) => {
        this.loadingData = false;
        this._core.handleError(e);
      });
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
    this.issueList = [];
    // Reset form to default dates
    let endDate = new Date();
    let startDate = this._core.getStartDate(endDate);
    this.stdate.year = startDate.getFullYear();
    this.stdate.month = startDate.getMonth() + 1;
    this.stdate.day = startDate.getDate();
    this.endate.year = endDate.getFullYear();
    this.endate.month = endDate.getMonth() + 1;
    this.endate.day = endDate.getDate();
    this.defaultEndDate = `${this.endate.year}-${this.endate.month}-${this.endate.day}`;
    this.defaultStartDate = `${this.stdate.year}-${this.stdate.month}-${this.stdate.day}`;
    
    let data = {
      start: this.defaultStartDate,
      end: this.defaultEndDate,
      visibility: 0,
    };
    this.getPosts(data);
  }

  setDates() {
    this.defaultEndDate = `${this.endate.year}-${this.endate.month}-${this.endate.day}`;
    this.defaultStartDate = `${this.stdate.year}-${this.stdate.month}-${this.stdate.day}`;
  }

  getCategories() {

    this.categoriesService
      .getCategories()
      .then((categories) => {
        this.categoriesCount = categories.data.length;
      })
      .catch((e) => {
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

  onPageChange(page: number) {
    let data = this.checkSearchStore();
    data.page = page;
    this.getPosts(data);
  }

  nextPage(pageData:any) {
    // Deprecated - kept for backward compatibility if needed
    if (pageData && pageData.current_page) {
      this.onPageChange(pageData.current_page);
    }
  }

  async getPosts(data: any) {
    this.loadingData = true;

    let searchDate: any = {
      start: data.start,
      end: data.end,
    };
    
    // Include volume and issue in stored search data
    if (data.volume) {
      searchDate.volume = data.volume;
    }
    if (data.issue) {
      searchDate.issue = data.issue;
    }

    localStorage.setItem('home_posts_search_data', JSON.stringify(searchDate));

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
