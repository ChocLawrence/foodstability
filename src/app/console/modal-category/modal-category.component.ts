import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CoreService } from '../../core/core.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { CategoriesService } from '../../services/categories.service';
import { UrlsService } from '../../core/urls.service';

@Component({
  selector: 'app-modal-category',
  templateUrl: './modal-category.component.html',
  styleUrls: ['./modal-category.component.css']
})
export class ModalCategoryComponent implements OnInit {

  @ViewChild('categoryModal', { static: false }) categoryModal: any;


  public file: any;
  public preview: any;
  public default = 'assets/images/gallery/chair.jpg';
  public modalTitle = '';
  public modalText = '';
  public loading = false;
  public loadingData = false;
  modalReference: any;
  closeResult!: string;


  categoryForm!: FormGroup;


  @Input() category: any;
  @Input() action: any;
  @Input() origin: any;
  @Output() categoryModalClosed = new EventEmitter();


  constructor(
    public core: CoreService,
    private fb: FormBuilder,
    public _urls: UrlsService,
    private categoriesService: CategoriesService,
    private modalService: NgbModal) {

  }

  ngOnInit(): void {

    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      image: ['', Validators.required],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.categoryForm.controls; }


  fileChanged($event: any) {
    this.handleUpload($event);
  }
  

  handleUpload(event: any) {
    this.file = event.target.files[0];

    if (this.file && this.file.size > 1000000) {
      this.core.showError("Error", "Limit file to 1 mb");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = () => {
      this.preview = reader.result;
    };

  }



  openModal() {
    const timer = setTimeout(() => {
      if (this.action == 'view') {
        this.modalTitle = 'category details';
        this.modalReference = this.modalService.open(this.categoryModal, this.core.ngbModalOptions);
      } else if (this.action == 'addCategory') {
        this.modalTitle = 'Add category';
        this.modalReference = this.modalService.open(this.categoryModal, this.core.ngbModalOptions);
      } else if (this.action == 'updateCategory') {
        this.modalTitle = 'Update category details';
        this.populateCategoryForm();
        this.modalReference = this.modalService.open(this.categoryModal, this.core.ngbModalOptions);
      } else if (this.action == 'deleteCategory') {
        this.modalTitle = 'Delete category' + " | " + `${this.category.full_name}`;
        this.modalText = "Are you sure you want to delete ?";
        this.populateCategoryForm();
        this.modalReference = this.modalService.open(this.categoryModal, this.core.ngbModalOptions);
      }

      if (this.modalReference) {
        this.modalReference.result.then((result: any) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason: any) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          this.notifyOfModalDismissal();
        });
      }
      clearTimeout(timer);
    }, 10);
  }

  onSubmitCategory() {

    if (this.categoryFormIsValid()) {
      this.loading = true;
      this.loadingData = true;
      let values = this.categoryForm.value;
      if (values.name) values.name = values.name;
      if (this.file) values.file = this.file;

      if (this.action == "addCategory") {
        this.addCategory(values);
      } else if (this.action == "updateCategory") {
        this.updateCategory(values);
      }

    }

    return false;

  }

  addCategory(values: any) {

    this.categoriesService.addCategory(values).then(r => {
      this.core.showSuccess("Success", "Added Successfully...");
      this.loading = false;
      this.loadingData = false;
      this.closeModal();
    }).catch(e => {
      this.loading = false;
      this.loadingData = false;
      this.core.handleError(e);
    });

  }

  updateCategory(values: any) {
    let id = this.category.id;

    this.categoriesService.updateCategory(values, id).then(r => {
      this.core.showSuccess("Success", "Update Successful...");
      this.loading = false;
      this.loadingData = false;
      this.closeModal();
    }).catch(e => {
      this.loading = false;
      this.loadingData = false;
      this.core.handleError(e);
    });
  }

  deleteCategory() {
    this.loading = true;
    this.loadingData = true;
    let id = this.category.id;
    if (!this.core.isEmptyOrNull(id)) {

      this.categoriesService.deleteCategory(id).then(r => {
        this.core.showSuccess("Success", "Deletion Successful...");
        this.loading = false;
        this.loadingData = false;
        this.resetCategoryForm();
        this.closeModal();
      }).catch(e => {
        this.loading = false;
        this.loadingData = false;
        this.core.handleError(e);
      });
    } else {
      this.core.showError("Error", "Refreshing feed...");
    }
  }

  getLabelName() {

    return this.category.name;

  }

 

  populateCategoryForm() {

    if(this.category.image){
      this.preview = this._urls.apiStorageUrl() + 'category/' + this.category.image;
    }

    this.categoryForm.patchValue({
      name: this.category.name
    })

  }

  categoryFormIsValid() {

    if (this.action == "addCategory" || this.action == "updateCategory") {
      return this.categoryForm.controls['name'].valid
          && this.categoryForm.controls['image'].valid;
    } else {
      return false;
    }

  }

  restoreCategoryForm() {
    this.populateCategoryForm();
  }

  resetCategoryForm() {
    this.categoryForm?.reset();
  }

  getDate(date: string) {
    if (!this.core.isEmptyOrNull(date)) {
      return this.core.formatDate(date);
    } else {
      return "";
    }
  }

  closeModal() {
    this.modalReference.close();
    this.notifyOfModalDismissal();
  }

  notifyOfModalDismissal() {
    this.categoryModalClosed.emit();
    if (this.action == 'addCategory' || this.action == 'updateCategory') {
      this.resetCategoryForm();
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


