import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CoreService } from '../../core/core.service';
import { Router, NavigationEnd } from "@angular/router";
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { SubscribersService } from '../../services/subscribers.service';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {


  public loading = false;
  public destination = "";
  subscriberForm: FormGroup;

  constructor(public core: CoreService,
    public router: Router,
    private fb: FormBuilder, private subscribersService: SubscribersService) {
    this.subscriberForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
  }

  onSubmitSubscriber() {

    if (this.subscriberFormIsValid() &&  this.core.checkIfOnline()) {
      this.loading = true;
      let values = this.subscriberForm.value;
      values.email = values.email.toLowerCase();

      this.subscribersService.addSubscriber(values).then(r => {
        this.core.showSuccess("Success", "Subscribed successfully...");
        this.loading = false;
        this.subscriberForm.reset();

      }).catch(e => {
        this.loading = false;
        this.subscriberForm.reset();
        this.core.handleError(e);
      });

    }

    return false;

  }

  subscriberFormIsValid() {
    return this.subscriberForm.controls['email'].valid;
  }

}
