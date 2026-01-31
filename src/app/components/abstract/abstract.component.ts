import {
  Component,
  OnInit,
  ViewChild,
  Injectable,
  AfterViewInit,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { CoreService } from '../../core/core.service';
import { UrlsService } from '../../core/urls.service';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { PostsService } from '../../services/posts.service';
import { MetaService } from '../../services/meta.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-abstract',
  templateUrl: './abstract.component.html',
  styleUrls: ['./abstract.component.css'],
})
export class AbstractComponent implements OnInit, AfterViewInit, OnDestroy  {
  public title = 'Abstract | Journal of Food Stability';
  public categories: any[] = [];
  public post: any = null;
  public animationType = 'wanderingCubes';
  public loadingData = true;
  public date = new Date();
  public slug: any;

  private destroy$ = new Subject<void>();

  constructor(
    private titleService: Title,
    public _core: CoreService,
    public _urls: UrlsService,
    private postsService: PostsService,
    private metaService: MetaService,
    public router: Router,
    private route: ActivatedRoute,
    private metaTagService: Meta
  ) {}


  ngAfterViewInit() {
  }


  ngOnInit(): void {
    this.metaService.createCanonicalURL("https://foodstability.com/abstract");
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

    // Subscribe to route parameter changes for navigation between different abstract pages
    // This also handles the initial load
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        const newSlug = params['slug'];
        // Process if we have a slug (either initial load or navigation)
        if (newSlug) {
          // Only reload if slug actually changed (for navigation between different abstracts)
          if (!this.slug || newSlug !== this.slug) {
            this.loadingData = true;
            if (this._core.checkIfOnline()) {
              this.processReset();
            }
          }
        } else {
          this.loadingData = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  downloadPdf() {
    if (!this.post?.pdf) return;
    const pdf = this.post.pdf;
    const isFilePath = pdf.startsWith('storage/') || pdf.includes('/') || /\.pdf$/i.test(pdf);
    if (isFilePath) {
      const downloadUrl = this._urls.apiUrl() + 'posts/download-pdf/' + encodeURIComponent(this.post.slug);
      window.location.href = downloadUrl;
    }
  }

  stripString(text:string){
    return text.replace(/(<([^>]+)>)/gi, "")
  }

  async processReset() {
    // Reset post data when navigating
    this.post = null;
    
    // Ensure loader is shown (in case it wasn't set by router subscription)
    this.loadingData = true;
    
    //check current url
    let splitUrl = this.router.url.split('/');
    this.slug = splitUrl[2];

    if (!this._core.isEmptyOrNull(this.slug)) {
      await this.getPost(this.slug);
    } else {
      this.loadingData = false;
    }
  }

  getPost(slug: any) {
    this.loadingData = true;

    this.postsService
      .getSinglePostBySlug(slug)
      .then((post) => {
        this.post = this._core.normalizeKeys(post.data);
        console.log('post',this.post);
        this.loadingData = false;
      })
      .catch((e) => {
        this.loadingData = false;
        this._core.handleError(e);
      });
  }
}
