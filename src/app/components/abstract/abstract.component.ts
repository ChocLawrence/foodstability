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
import { DatePipe } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-abstract',
  templateUrl: './abstract.component.html',
  styleUrls: ['./abstract.component.css'],
})
export class AbstractComponent implements OnInit, AfterViewInit  {
  public title = 'Abstract | Journal of Food Stability';
  public categories: any[] = [];
  public post: any = [];
  public animationType = 'wanderingCubes';
  public loadingData = false;
  public date = new Date();
  public slug: any;

  constructor(
    private titleService: Title,
    public _core: CoreService,
    public _urls: UrlsService,
    private postsService: PostsService,
    public router: Router,
    private metaTagService: Meta
  ) {}


  ngAfterViewInit() {
  }


  ngOnInit(): void {
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
    this.processReset();
  }

  stripString(text:string){
    return text.replace(/(<([^>]+)>)/gi, "")
  }

  async processReset() {
    //check current url
    let splitUrl = this.router.url.split('/');
    this.slug = splitUrl[2];

    if (!this._core.isEmptyOrNull(this.slug)) {
      await this.getPost(this.slug);
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
