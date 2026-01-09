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
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { PostsService } from '../../services/posts.service';
import { ArchivesService } from '../../services/archives.service';
import { MetaService } from '../../services/meta.service';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-archives',
  templateUrl: './archives.component.html',
  styleUrls: ['./archives.component.css'],
})
export class ArchivesComponent implements OnInit, AfterViewInit, OnDestroy {
  public title = 'Archives | Journal of Food Stability';
  public animationType = 'wanderingCubes';
  public loadingData = true;
  public activeSection = 'volumes';
  public volume: any;
  public issue: any;
  public viewCount:any;
  public downloadsCount:any;

  public volumes: any[] = [];
  public issues: any[] = [];
  public posts: any[] = [];

  private destroy$ = new Subject<void>();
  private previousUrl: string = '';

  constructor(
    private titleService: Title,
    private metaTagService: Meta,
    public _core: CoreService,
    public _urls: UrlsService,
    public router: Router,
    private route: ActivatedRoute,
    private metaService: MetaService,
    private postsService: PostsService,
    private archivesService: ArchivesService
  ) {}


  ngAfterViewInit() {
  }


  ngOnInit(): void {
    this.metaService.createCanonicalURL("https://foodstability.com/archives");
    this.titleService.setTitle(this.title);
    this.metaTagService.updateTag({
      name: 'description',
      content:
        'The Archives for the Journal of Food Stability include an organized shelf where our visitors can easily access publications based on years, volumes and issues. This style of organization helps our visitors to get to articles they are looking for easily.',
    });
    
    // Subscribe to router navigation events to handle route changes
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        // Only process if navigating to/within archives routes and URL actually changed
        const currentUrl = this.router.url;
        if (currentUrl.startsWith('/archives') && currentUrl !== this.previousUrl) {
          this.previousUrl = currentUrl;
          this.loadingData = true;
          if (this._core.checkIfOnline()) {
            this.processPage();
          }
        }
      });

    // Set initial URL and load
    this.previousUrl = this.router.url;
    if (this._core.checkIfOnline()) {
      this.processPage();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  async updatePostCount(id: any) {
    // Don't show loader for view count updates - it's a background operation
    await this.postsService
      .updatePostCount(id)
      .then((r) => {
        this.viewCount = document.getElementById('views'+ id);
        if(this.viewCount && this.viewCount.innerHTML) {
          this.viewCount.innerText = Number(1) + Number(this.viewCount.innerHTML);
        }

        this.downloadsCount = document.getElementById('downloads'+ id);
        if(this.downloadsCount && this.downloadsCount.innerHTML) {
          this.downloadsCount.innerHTML = Number(1) + Number(this.downloadsCount.innerHTML);
        }
      })
      .catch((e) => {
        // Silently fail for view count updates - don't interrupt user experience
        console.error('Failed to update post count:', e);
      });
  }

  async processPage() {
    // Reset data when navigating
    this.volumes = [];
    this.issues = [];
    this.posts = [];
    
    // Ensure loader is shown (in case it wasn't set by router subscription)
    this.loadingData = true;
    
    //check current url
    let splitUrl = this.router.url.split('/');
    this.volume = splitUrl[2];
    this.issue = splitUrl[3];

    if (
      !this._core.isEmptyOrNull(this.volume) &&
      !this._core.isEmptyOrNull(this.issue)
    ) {
      this.activeSection = 'issue-details';
      this.getArchivesByVolumeAndIssue(this.volume, this.issue);
    } else if (
      !this._core.isEmptyOrNull(this.volume) &&
      this._core.isEmptyOrNull(this.issue)
    ) {
      this.activeSection = 'issues';
      this.getArchivesByVolume(this.volume);
    } else {
      this.activeSection = 'volumes';
      this.getArchives();
    }
  }

  getArchives() {
    this.loadingData = true;

    this.archivesService
      .getArchives()
      .then((archives) => {
        this.volumes = archives.data;
        this.loadingData = false;
      })
      .catch((e) => {
        this.loadingData = false;
        this._core.handleError(e);
      });
  }

  getArchivesByVolume(volume: any) {
    this.loadingData = true;

    this.archivesService
      .getArchivesByVolume(volume)
      .then((issues) => {
        this.issues = issues.data;
        this.loadingData = false;
      })
      .catch((e) => {
        this.loadingData = false;
        this._core.handleError(e);
      });
  }

  getArchivesByVolumeAndIssue(volume: any, issue: any) {
    this.loadingData = true;

    this.archivesService
      .getArchivesByVolumeAndIssue(volume, issue)
      .then((posts) => {
        this.posts = posts.data;
        this.loadingData = false;
      })
      .catch((e) => {
        this.loadingData = false;
        this._core.handleError(e);
      });
  }
}
