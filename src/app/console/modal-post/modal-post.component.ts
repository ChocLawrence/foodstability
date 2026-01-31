import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { CoreService } from '../../core/core.service';
import { UrlsService } from '../../core/urls.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { PostsService } from '../../services/posts.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-modal-post',
  templateUrl: './modal-post.component.html',
  styleUrls: ['./modal-post.component.css'],
})
export class ModalPostComponent implements OnInit {
  @ViewChild('postModal', { static: false }) postModal: any;
  @ViewChild('imageInput', { static: false }) imageInput: any;
  @ViewChild('pdfInput', { static: false }) pdfInput: any;

  public dropdownSettings: any = {
    singleSelection: true,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    closeDropDownOnSelection: true,
  };

  public imageFile: any;
  public imageObjectUrl: string | null = null;
  public pdfObjectUrl: string | null = null;
  public sanitizedImageUrl: any = null;
  public sanitizedPdfUrl: any = null;
  public sanitizedPdfUrlForIframe: any = null;
  public pdfFile: any = null;
  public default = 'assets/images/gallery/chair.jpg';
  public modalTitle = '';
  public modalText = '';
  public loading = false;
  public loadingData = false;
  public maxSize = 1.5 * 1024 * 1024; // 1.5MB in bytes
  modalReference: any;
  closeResult!: string;

  postForm!: FormGroup;

  @Input() post: any;
  @Input() tags: any;
  @Input() categories: any;
  @Input() action: any;
  @Input() origin: any;
  @Output() postModalClosed = new EventEmitter();

  constructor(
    public core: CoreService,
    public sanitizer: DomSanitizer,
    private fb: FormBuilder,
    public _urls: UrlsService,
    private postsService: PostsService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      category_id: ['', Validators.required],
      authors: ['', Validators.required],
      volume: ['', Validators.required],
      issue: ['', Validators.required],
      doi: ['', Validators.required],
      tag: ['', Validators.required],
      practical: ['', Validators.required],
      abstract: ['', Validators.required],
      keywords: ['', Validators.required],
      image: ['', Validators.required],
      pdf: ['', Validators.required],
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.postForm.controls;
  }

  public onCategorySelect(event: any) {
    this.checkCategorySelection(event);
  }

  public onCategoryDeSelect(event: any) {
    this.postForm.patchValue({
      category_id: null,
    });
  }

  public checkCategorySelection(event: any) {
    let value: any = event;
    // get packages and separate with commas
    const selectedCategory = this.postForm.value.category_id;

    if (selectedCategory.length == 1) {
      this.postForm.patchValue({
        category_id: selectedCategory,
      });
    } else {
      this.postForm.patchValue({
        category_id: null,
      });
    }
  }

  public onTagSelect(event: any) {
    this.checkTagSelection(event);
  }

  public onTagDeSelect(event: any) {
    this.postForm.patchValue({
      tag: null,
    });
  }

  public checkTagSelection(event: any) {
    let value: any = event;
    // get packages and separate with commas
    const selectedTag = this.postForm.value.tag;

    if (selectedTag.length == 1) {
      this.postForm.patchValue({
        tag: selectedTag,
      });
    } else {
      this.postForm.patchValue({
        tag: null,
      });
    }
  }

  imageFileChanged($event: any) {
    this.handleImageUpload($event);
  }

  pdfFileChanged($event: any) {
    this.handlePdfUpload($event);
  }

  handleImageUpload(event: any) {
    this.imageFile = event.target.files[0];

    if (this.imageFile && this.imageFile.size > this.maxSize) {
      this.core.showError('Error', 'Limit file to 1.5 mb');
      return;
    }

    if (this.imageObjectUrl) {
      URL.revokeObjectURL(this.imageObjectUrl);
      this.imageObjectUrl = null;
    }
    if (this.imageFile) {
      this.imageObjectUrl = URL.createObjectURL(this.imageFile);
      this.sanitizedImageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.imageObjectUrl);
    }
  }

  handlePdfUpload(event: any) {
    this.pdfFile = event.target.files[0];

    if (this.pdfFile && this.pdfFile.size > this.maxSize) {
      this.core.showError('Error', 'Limit file to 1.5 mb');
      return;
    }

    if (this.pdfObjectUrl) {
      URL.revokeObjectURL(this.pdfObjectUrl);
      this.pdfObjectUrl = null;
    }
    if (this.pdfFile) {
      this.pdfObjectUrl = URL.createObjectURL(this.pdfFile);
      this.sanitizedPdfUrl = this.pdfObjectUrl;
      this.sanitizedPdfUrlForIframe = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfObjectUrl);
    }
  }

  openModal() {
    // Clear any previous previews first
    this.clearPreviews();
    
    const timer = setTimeout(() => {
      if (this.action == 'view') {
        this.setUrls();
        this.modalTitle = 'Post details';
        this.modalReference = this.modalService.open(
          this.postModal,
          this.core.ngbModalOptionsLg
        );
      } else if (this.action == 'addPost') {
        this.modalTitle = 'Add Post';
        this.modalReference = this.modalService.open(
          this.postModal,
          this.core.ngbModalOptionsLg
        );
      } else if (this.action == 'updatePost') {
        this.modalTitle = 'Update Post details';
        this.setUrls();
        this.populatePostForm();
        this.modalReference = this.modalService.open(
          this.postModal,
          this.core.ngbModalOptionsLg
        );
      } else if (this.action == 'deletePost') {
        this.modalTitle = 'Delete Post' + ' | ' + `${this.post.title}`;
        this.modalText = 'Are you sure you want to delete ?';
        this.populatePostForm();
        this.modalReference = this.modalService.open(
          this.postModal,
          this.core.ngbModalOptions
        );
      }

      if (this.modalReference) {
        this.modalReference.result.then(
          (result: any) => {
            this.closeResult = `Closed with: ${result}`;
            this.clearPreviews();
          },
          (reason: any) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            this.notifyOfModalDismissal();
          }
        );
      }
      clearTimeout(timer);
    }, 10);
  }

  setUrls() {
    if (this.post.image) {
      const imgUrl = this.core.getImageUrl(this.post.image);
      this.sanitizedImageUrl = imgUrl ? this.sanitizer.bypassSecurityTrustResourceUrl(imgUrl) : null;
    }

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
        this.loadPdfFromUrl(pdfUrl).catch(() => {
          this.sanitizedPdfUrl = pdfUrl;
          this.sanitizedPdfUrlForIframe = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl);
        });
      }
    }
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

  triggerSubmit() {
    this.onSubmitPost();
  }

  onSubmitPost() {
    if (this.postFormIsValid()) {
      this.loading = true;
      this.loadingData = true;
      let values = this.postForm.value;
      if (this.imageFile) values.imageFile = this.imageFile;
      if (this.pdfFile) values.pdfFile = this.pdfFile;

      if (this.action == 'addPost') {
        this.addPost(values);
      } else if (this.action == 'updatePost') {
        this.updatePost(values);
      }
    } else {
      this.postForm.markAllAsTouched();
      this.core.showError('Validation', 'Please fill in all required fields and fix any errors.');
    }
  }

  addPost(values: any) {
    this.postsService
      .addPost(values)
      .then((r) => {
        this.core.showSuccess('Success', 'Added Successfully...');
        this.loading = false;
        this.loadingData = false;
        this.closeModal();
      })
      .catch((e) => {
        this.loading = false;
        this.loadingData = false;
        this.core.handleError(e);
      });
  }

  updatePost(values: any) {
    let id = this.post.id;

    this.postsService
      .updatePost(values, id)
      .then((r) => {
        this.core.showSuccess('Success', 'Update Successful...');
        this.loading = false;
        this.loadingData = false;
        this.closeModal();
      })
      .catch((e) => {
        this.loading = false;
        this.loadingData = false;
        this.core.handleError(e);
      });
  }

  deletePost() {
    this.loading = true;
    this.loadingData = true;
    let id = this.post.id;
    if (!this.core.isEmptyOrNull(id)) {
      this.postsService
        .deletePost(id)
        .then((r) => {
          this.core.showSuccess('Success', 'Deletion Successful...');
          this.loading = false;
          this.loadingData = false;
          this.resetpostForm();
          this.closeModal();
        })
        .catch((e) => {
          this.loading = false;
          this.loadingData = false;
          this.core.handleError(e);
        });
    } else {
      this.core.showError('Error', 'Refreshing feed...');
    }
  }

  getLabelName() {
    return this.post.title;
  }

  populatePostForm() {
    let selectedCategory = this.categories.filter((category: { id: any }) => {
      return category.id == this.post.category_id;
    });

    console.log(this.post)

    this.postForm.patchValue({
      title: this.post.title,
      category_id: selectedCategory,
      volume: this.post.volume,
      authors: this.post.author,
      issue: this.post.issue,
      doi: this.post.doi,
      practical: this.post.practical,
      abstract: this.post.abstract,
      keywords: this.post.keywords,
    });
  }

  getCategoryName(value: string) {
    let category = this.categories.filter((item: any) => {
      return item.id == value;
    });
    return category[0].name;
  }

  postFormIsValid() {
    if (this.action == 'addPost') {
      return (
        this.postForm.controls['title'].valid &&
        this.postForm.controls['category_id'].valid &&
        this.postForm.controls['authors'].valid &&
        this.postForm.controls['tag'].valid &&
        this.postForm.controls['volume'].valid &&
        this.postForm.controls['issue'].valid &&
        this.postForm.controls['doi'].valid &&
        this.postForm.controls['practical'].valid &&
        this.postForm.controls['abstract'].valid &&
        this.postForm.controls['keywords'].valid &&
        this.postForm.controls['image'].valid &&
        this.postForm.controls['pdf'].valid
      );
    } else if (this.action == 'updatePost') {
      return (
        this.postForm.controls['title'].valid &&
        this.postForm.controls['category_id'].valid &&
        this.postForm.controls['authors'].valid &&
        this.postForm.controls['volume'].valid &&
        this.postForm.controls['issue'].valid &&
        this.postForm.controls['doi'].valid &&
        this.postForm.controls['practical'].valid &&
        this.postForm.controls['abstract'].valid &&
        this.postForm.controls['keywords'].valid
      );
    }
    {
      return false;
    }
  }

  restorePostForm() {
    this.populatePostForm();
  }

  resetpostForm() {
    this.postForm?.reset();
    // Explicitly reset file controls
    if (this.postForm) {
      this.postForm.patchValue({
        image: null,
        pdf: null
      });
    }
  }

  getDate(date: string) {
    if (!this.core.isEmptyOrNull(date)) {
      return this.core.formatDate(date);
    } else {
      return '';
    }
  }

  closeModal() {
    this.modalReference.close();
    this.notifyOfModalDismissal();
  }

  notifyOfModalDismissal() {
    this.clearPreviews();
    this.postModalClosed.emit();
    if (this.action == 'addPost' || this.action == 'updatePost') {
      this.resetpostForm();
    }
  }

  clearPreviews() {
    if (this.imageObjectUrl) {
      URL.revokeObjectURL(this.imageObjectUrl);
      this.imageObjectUrl = null;
    }
    if (this.pdfObjectUrl) {
      URL.revokeObjectURL(this.pdfObjectUrl);
      this.pdfObjectUrl = null;
    }
    this.sanitizedImageUrl = null;
    this.sanitizedPdfUrl = null;
    this.sanitizedPdfUrlForIframe = null;
    this.imageFile = null;
    this.pdfFile = null;

    setTimeout(() => {
      if (this.imageInput && this.imageInput.nativeElement) {
        this.imageInput.nativeElement.value = '';
      }
      if (this.pdfInput && this.pdfInput.nativeElement) {
        this.pdfInput.nativeElement.value = '';
      }
    }, 0);
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
