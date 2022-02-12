import { Component, OnInit, ViewChild } from '@angular/core';
import { CoreService } from '../../core/core.service';
import { TagsService } from '../../services/tags.service';
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
import { DxDataGridComponent } from "devextreme-angular";

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {

  @ViewChild('tagModals', { static: false }) tagModals: any;
  @ViewChild("tagsContainer", { static: false }) tagsDataGrid: DxDataGridComponent | undefined;


  public loadingData = false;
  public tags: any[] = [];
  public modes: any[] = [];
  public limit = 10;
  public tagsCount = 0;
  public animationType = 'wanderingCubes';

  public theTag: any;
  public origin = 'Tags';
  public tagModalAction = '';

  constructor(public _core: CoreService,
    private datePipe: DatePipe,
    private tagsService: TagsService) { }

  ngOnInit(): void {
    this.getTags();
  }


  getTags() {
    this.loadingData = true;

    this.tagsService
      .getTags()
      .then(tags => {
        this.tagsCount = tags.data.length;
        this.tags = this._core.normalizeKeys(tags.data);
        this.loadingData = false;
      })
      .catch(e => {
        this.loadingData = false;
        this._core.handleError(e);
      });

  }

  getTagName(value: string) {
    let tag = this.tags.filter((item) => {
      return item._id == value;
    });
    return tag[0].name;
  }


  getModeName(value: string) {
    let mode = this.modes.filter((item) => {
      return item._id == value;
    });
    return mode[0].name;
  }


  openTagModal(action: string, Tag: any) {
    this.tagModalAction = action;
    this.theTag = Tag;
    this.tagModals.openModal();
  }

  onTagModalClosed() {
    this.tagModalAction = '';
    this.theTag = null;
    this.getTags();
  }

  onTagUpdated(id: any) {
    //this.getTag(id, 'update');
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


