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
import { Router, NavigationEnd } from '@angular/router';
import { PostsService } from '../../services/posts.service';
import { ArchivesService } from '../../services/archives.service';

@Component({
  selector: 'app-archives',
  templateUrl: './archives.component.html',
  styleUrls: ['./archives.component.css'],
})
export class ArchivesComponent implements OnInit, AfterViewInit {
  public title = 'Archives | Journal of Food Stability';
  public animationType = 'wanderingCubes';
  public loadingData = false;
  public activeSection = 'volumes';
  public volume: any;
  public issue: any;
  public viewCount:any;
  public downloadsCount:any;

  public volumes: any[] = [];
  public issues: any[] = [];
  public posts: any[] = [];

  constructor(
    private titleService: Title,
    private metaTagService: Meta,
    public _core: CoreService,
    public _urls: UrlsService,
    public router: Router,
    private postsService: PostsService,
    private archivesService: ArchivesService
  ) {}


  ngAfterViewInit() {
  }


  ngOnInit(): void {
    this.titleService.setTitle(this.title);
    this.metaTagService.updateTag({
      name: 'description',
      content:
        'The Archives for the Journal of Food Stability include an organized shelf where our visitors can easily access publications based on years, volumes and issues. This style of organization helps our visitors to get to articles they are looking for easily.',
    });
    if (this._core.checkIfOnline()) {
      this.processPage();
    }
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

  async processPage() {
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
