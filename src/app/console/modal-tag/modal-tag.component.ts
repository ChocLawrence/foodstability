import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CoreService } from '../../core/core.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { TagsService } from '../../services/tags.service';

@Component({
  selector: 'app-modal-tag',
  templateUrl: './modal-tag.component.html',
  styleUrls: ['./modal-tag.component.css']
})
export class ModalTagComponent implements OnInit {

  @ViewChild('tagModal', { static: false }) tagModal: any;


  public modalTitle = '';
  public modalText = '';
  public loading = false;
  public loadingData = false;
  modalReference: any;
  closeResult!: string;


  tagForm!: FormGroup;


  @Input() tag: any;
  @Input() action: any;
  @Input() origin: any;
  @Output() tagModalClosed = new EventEmitter();


  constructor(
    public core: CoreService,
    private fb: FormBuilder,
    private tagsService: TagsService,
    private modalService: NgbModal) {

  }

  ngOnInit(): void {

    this.tagForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.tagForm.controls; }



  openModal() {
    const timer = setTimeout(() => {
      if (this.action == 'view') {
        this.modalTitle = 'Tag details';
        this.modalReference = this.modalService.open(this.tagModal, this.core.ngbModalOptions);
      } else if (this.action == 'addTag') {
        this.modalTitle = 'Add Tag';
        this.modalReference = this.modalService.open(this.tagModal, this.core.ngbModalOptions);
      } else if (this.action == 'updateTag') {
        this.modalTitle = 'Update Tag details';
        this.populateTagForm();
        this.modalReference = this.modalService.open(this.tagModal, this.core.ngbModalOptions);
      } else if (this.action == 'deleteTag') {
        this.modalTitle = 'Delete Tag' + " | " + `${this.tag.name}`;
        this.modalText = "Are you sure you want to delete ?";
        this.populateTagForm();
        this.modalReference = this.modalService.open(this.tagModal, this.core.ngbModalOptions);
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

  onSubmitTag() {

    if (this.tagFormIsValid()) {
      this.loading = true;
      this.loadingData = true;
      let values = this.tagForm.value;
      if (values.name) values.name = values.name;

      if (this.action == "addTag") {
        this.addTag(values);
      } else if (this.action == "updateTag") {
        this.updateTag(values);
      }

    }

    return false;

  }

  addTag(values: any) {

    this.tagsService.addTag(values).then(r => {
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

  updateTag(values: any) {
    let id = this.tag.id;

    this.tagsService.updateTag(values, id).then(r => {
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

  deleteTag() {
    this.loading = true;
    this.loadingData = true;
    let id = this.tag.id;
    if (!this.core.isEmptyOrNull(id)) {

      this.tagsService.deleteTag(id).then(r => {
        this.core.showSuccess("Success", "Deletion Successful...");
        this.loading = false;
        this.loadingData = false;
        this.resetTagForm();
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

    return this.tag.name;

  }



  populateTagForm() {

    this.tagForm.patchValue({
      name: this.tag.name
    })

  }

  tagFormIsValid() {

    if (this.action == "addTag" || this.action == "updateTag") {
      return this.tagForm.controls['name'].valid;
    } else {
      return false;
    }

  }

  restoreTagForm() {
    this.populateTagForm();
  }

  resetTagForm() {
    this.tagForm?.reset();
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
    this.tagModalClosed.emit();
    if (this.action == 'addTag' || this.action == 'updateTag') {
      this.resetTagForm();
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


