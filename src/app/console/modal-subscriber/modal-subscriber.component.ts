import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CoreService } from '../../core/core.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { SubscribersService } from '../../services/subscribers.service';

@Component({
  selector: 'app-modal-subscriber',
  templateUrl: './modal-subscriber.component.html',
  styleUrls: ['./modal-subscriber.component.css']
})
export class ModalSubscriberComponent implements OnInit {


  @ViewChild('subscriberModal', { static: false }) subscriberModal: any;


  public modalTitle = '';
  public modalText = '';
  public loading = false;
  public loadingData = false;
  modalReference: any;
  closeResult!: string;


  subscriberForm!: FormGroup;


  @Input() subscriber: any;

  @Input() action: any;
  @Input() origin: any;
  @Output() subscriberModalClosed = new EventEmitter();


  constructor(
    public core: CoreService,
    private fb: FormBuilder,
    private subscribersService: SubscribersService,
    private modalService: NgbModal) {

  }

  ngOnInit(): void {
    this.subscriberForm = this.fb.group({
      email: ['', Validators.required],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.subscriberForm.controls; }


  openModal() {
    const timer = setTimeout(() => {
      if (this.action == 'addSubscriber') {
        this.modalTitle = 'Add Subscriber';
        this.modalReference = this.modalService.open(this.subscriberModal, this.core.ngbModalOptions);
      }  else if (this.action == 'updateSubscriber') {
        this.modalTitle = 'Update subscriber details';
        this.populateSubscriberForm();
        this.modalReference = this.modalService.open(this.subscriberModal, this.core.ngbModalOptions);
      } else if (this.action == 'deleteSubscriber') {
        this.modalTitle = 'Delete Subscriber' + " | " + `${this.subscriber.email}`;
        this.modalText = "Are you sure you want to delete ?";
        this.modalReference = this.modalService.open(this.subscriberModal, this.core.ngbModalOptions);
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

  populateSubscriberForm() {

    this.subscriberForm.patchValue({
      email: this.subscriber.email
    })

  }

  onSubmitSubscriber() {

    if (this.subscriberFormIsValid()) {
      this.loading = true;
      this.loadingData = true;
      let values = this.subscriberForm.value;

      if (this.action == "addSubscriber") {
        this.addSubscriber(values);
      } else if (this.action == "updateSubscriber") {
        this.updateSubscriber(values);
      }

    }

    return false;

  }

  addSubscriber(values: any) {

    this.subscribersService.addSubscriber(values).then(r => {
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


  updateSubscriber(values: any) {
    let id = this.subscriber.id;

    this.subscribersService.updateSubscriber(values, id).then(r => {
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


  deleteSubscriber() {
    this.loading = true;
    this.loadingData = true;
    let id = this.subscriber.id;
    if (!this.core.isEmptyOrNull(id)) {

      this.subscribersService.deleteSubscriber(id).then(r => {
        this.core.showSuccess("Success", "Deletion Successful...");
        this.loading = false;
        this.loadingData = false;
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

  subscriberFormIsValid() {
    return this.subscriberForm.controls['email'].valid;
  }


  resetSubscriberForm() {
    this.subscriberForm?.reset();
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
    this.subscriberModalClosed.emit();
    if (this.action == 'addSubscriber') {
      this.resetSubscriberForm();
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



