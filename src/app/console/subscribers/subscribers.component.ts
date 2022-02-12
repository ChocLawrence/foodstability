import { Component, OnInit, ViewChild } from '@angular/core';
import { CoreService } from '../../core/core.service';
import { SubscribersService } from '../../services/subscribers.service';
import { routerTransition } from '../../router.animations';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl
} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser'
import {
  NgbDateStruct,
  NgbDateParserFormatter
} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-subscribers',
  templateUrl: './subscribers.component.html',
  styleUrls: ['./subscribers.component.css']
})
export class SubscribersComponent implements OnInit {

  @ViewChild('subscriberModals', { static: false }) subscriberModals: any;


  public loadingData = false;
  public subscribers: any[] = [];
  public modes: any[] = [];
  public limit = 10;
  public subscribersCount = 0;
  public animationType = 'wanderingCubes';

  public theSubscriber: any;
  public origin = 'Subscribers';
  public subscriberModalAction = '';

  constructor(public _core: CoreService,
    private datePipe: DatePipe,
    private subscribersService: SubscribersService) { }

  ngOnInit(): void {
    this.getSubscribers();
  }


  getSubscribers() {
    this.loadingData = true;

    this.subscribersService
      .getSubscribers()
      .then(subscribers => {
        this.subscribersCount = subscribers.data.length;
        this.subscribers = this._core.normalizeKeys(subscribers.data);
        this.loadingData = false;
      })
      .catch(e => {
        this.loadingData = false;
        this._core.handleError(e);
      });

  }

  getsubscriberName(value: string) {
    let subscriber = this.subscribers.filter((item) => {
      return item._id == value;
    });
    return subscriber[0].name;
  }


  getModeName(value: string) {
    let mode = this.modes.filter((item) => {
      return item._id == value;
    });
    return mode[0].name;
  }


  openSubscriberModal(action: string, subscriber: any) {
    this.subscriberModalAction = action;
    this.theSubscriber = subscriber;
    this.subscriberModals.openModal();
  }

  onSubscriberModalClosed() {
    this.subscriberModalAction = '';
    this.theSubscriber = null;
    this.getSubscribers();
  }

  onsubscriberUpdated(id: any) {
    //this.getsubscriber(id, 'update');
  }

  formatAmount(cost: any) {
    if (!this._core.isEmptyOrNull(cost) || cost !== "")
      return Number(cost).toFixed(2);
    else return "-";
  }

  getDate(date: string) {
    if (!this._core.isEmptyOrNull(date)) {
      return this._core.formatDate(date);
    } else {
      return "";
    }
  }

  customizeExcelCell = (options: any) => {
    var gridCell = options.gridCell;
    if (!gridCell) {
      return;
    }

    if (gridCell.rowType === "data") {

      if (gridCell.column.dataField === 'createdat') {
        options.value = this.datePipe.transform(gridCell.value, "medium");
      }

    }
  };

}


