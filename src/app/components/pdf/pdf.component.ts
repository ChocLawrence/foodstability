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
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.css'],
})
export class PdfComponent implements OnInit, AfterViewInit {
  public title = 'PDF | Journal of Food Stability';
  public categories: any[] = [];
  public post: any = [];
  public animationType = 'wanderingCubes';
  public sanitizedPdfUrl: any = null;
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

  ngAfterViewInit() {}

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
    this.process();
  }

  stripString(text: string) {
    return text.replace(/(<([^>]+)>)/gi, '');
  }

  async process() {
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

        if (this.post.pdf) {
          this.sanitizedPdfUrl = this._base64ToArrayBuffer(this.post.pdf);
        }
        this.loadingData = false;
      })
      .catch((e) => {
        this.loadingData = false;
        this._core.handleError(e);
      });
  }

  downloadPdf() {
    const linkSource = `data:application/pdf;base64,${this.post.pdf}`;
    const downloadLink = document.createElement('a');
    const fileName = this.post.slug + '.pdf';
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  _base64ToArrayBuffer(base64: any) {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }
}
