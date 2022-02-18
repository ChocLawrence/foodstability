import { Component, OnInit, ViewChild } from '@angular/core';
import { CoreService } from '../../core/core.service';
import { CategoriesService } from '../../services/categories.service';
import { TagsService } from '../../services/tags.service';
import { UrlsService } from '../../core/urls.service';
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
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  @ViewChild('categoryModals', { static: false }) categoryModals: any;
  @ViewChild("categoriesContainer", { static: false }) categoriesDataGrid: DxDataGridComponent | undefined;


  public loadingData = false;
  public categories: any[] = [];
  public tags: any[] = [];
  public modes: any[] = [];
  public limit = 10;
  public categoriesCount = 0;
  public animationType = 'wanderingCubes';

  public theCategory: any;
  public origin = 'categories';
  public categoryModalAction = '';

  constructor(public _core: CoreService,
    private datePipe: DatePipe,
    private tagsService: TagsService,
    public _urls: UrlsService,
    private categoriesService: CategoriesService) { }

  ngOnInit(): void {
    this.getTags();
    this.getCategories();
  }

  getTags() {
    this.loadingData = true;

    this.tagsService
      .getTags()
      .then(tags => {
        this.tags = this._core.normalizeKeys(tags.tags);
        this.loadingData = false;
      })
      .catch(e => {
        this.loadingData = false;
        this._core.handleError(e);
      });

  }

  getCategories() {
    this.loadingData = true;

    this.categoriesService
      .getCategories()
      .then(categories => {
        this.categoriesCount = categories.data.length;
        this.categories = this._core.normalizeKeys(categories.data);
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


  openCategoryModal(action: string, category: any) {
    this.categoryModalAction = action;
    this.theCategory = category;
    this.categoryModals.openModal();
  }

  onCategoryModalClosed() {
    this.categoryModalAction = '';
    this.theCategory = null;
    this.getCategories();
  }

  onCategoryUpdated(id: any) {
    //this.getCategory(id, 'update');
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

      if (gridCell.column.dataField === 'sex') {
        if (gridCell.value == 'm') {
          options.value = "Male"
        } else {
          options.value = "Female"
        }
      }

    }
  };

}


