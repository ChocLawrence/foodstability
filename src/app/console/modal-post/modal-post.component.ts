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
  public sanitizedImageUrl: any = null;
  public sanitizedPdfUrl: any = null;
  public pdfFile: any = null;
  public default = 'assets/images/gallery/chair.jpg';
  public modalTitle = '';
  public modalText = '';
  public loading = false;
  public loadingData = false;
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

    if (this.imageFile && this.imageFile.size > 1000000) {
      this.core.showError('Error', 'Limit file to 1 mb');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(this.imageFile);
  }

  handlePdfUpload(event: any) {
    this.pdfFile = event.target.files[0];

    if (this.pdfFile && this.pdfFile.size > 1000000) {
      this.core.showError('Error', 'Limit file to 1 mb');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(this.pdfFile);
  }

  openModal() {
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
      this.sanitizedImageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        'data:image/png;base64,' + this.post.image
      );
    }

    if (this.post.pdf) {
      this.sanitizedPdfUrl = this._base64ToArrayBuffer(this.post.pdf);
    }
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
    }

    return false;
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
    this.postModalClosed.emit();
    if (this.action == 'addPost' || this.action == 'updatePost') {
      this.resetpostForm();
    }
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
