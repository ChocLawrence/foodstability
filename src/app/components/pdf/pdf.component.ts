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
import { DomSanitizer } from '@angular/platform-browser';

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
  public sanitizedPdfUrlForIframe: any = null;
  public loadingData = false;
  public date = new Date();
  public slug: any;

  constructor(
    private titleService: Title,
    public _core: CoreService,
    public _urls: UrlsService,
    private postsService: PostsService,
    public router: Router,
    private metaTagService: Meta,
    public sanitizer: DomSanitizer
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
    this.sanitizedPdfUrl = null;
    this.sanitizedPdfUrlForIframe = null;

    this.postsService
      .getSinglePostBySlug(slug)
      .then(async (post) => {
        this.post = this._core.normalizeKeys(post.data);

        if (this.post.pdf) {
          const pathWithoutStorage = this.post.pdf.startsWith('storage/')
            ? this.post.pdf.substring(8)
            : this.post.pdf;
          const isFilePath =
            this.post.pdf.startsWith('storage/') ||
            this.post.pdf.includes('/') ||
            /\.pdf$/i.test(this.post.pdf);
          if (isFilePath) {
            const pdfUrl = this._urls.apiStorageUrl() + pathWithoutStorage;
            try {
              await this.loadPdfFromUrl(pdfUrl);
            } catch {
              this.sanitizedPdfUrl = pdfUrl;
              this.sanitizedPdfUrlForIframe = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl);
            }
          }
        }
        this.loadingData = false;
      })
      .catch((e) => {
        this.loadingData = false;
        this._core.handleError(e);
      });
  }

  isPdfUrlString(): boolean {
    return typeof this.sanitizedPdfUrl === 'string';
  }

  async loadPdfFromUrl(url: string): Promise<void> {
    try {
      const response = await fetch(url, { method: 'GET', headers: { Accept: 'application/pdf' } });
      if (!response.ok) throw new Error(`Failed to load PDF: ${response.statusText}`);
      const arrayBuffer = await response.arrayBuffer();
      this.sanitizedPdfUrl = arrayBuffer;
    } catch (error) {
      if (!(error instanceof TypeError && error.message.includes('Failed to fetch'))) {
        console.warn('Error loading PDF via fetch:', error);
      }
      throw error;
    }
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
}
