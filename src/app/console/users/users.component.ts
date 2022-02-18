import { Component, OnInit, ViewChild } from '@angular/core';
import { CoreService } from '../../core/core.service';
import { UsersService } from '../../services/users.service';
import { UrlsService } from '../../core/urls.service';
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
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  @ViewChild('userModals', { static: false }) userModals: any;
  @ViewChild("usersContainer", { static: false }) usersDataGrid: DxDataGridComponent | undefined;


  public loadingData = false;
  public users: any[] = [];
  public tags: any[] = [];
  public modes: any[] = [];
  public limit = 10;
  public usersCount = 0;
  public animationType = 'wanderingCubes';

  public theUser: any;
  public origin = 'users';
  public userModalAction = '';

  constructor(public _core: CoreService,
    private datePipe: DatePipe,
    public _urls: UrlsService,
    private usersService: UsersService) { }

  ngOnInit(): void {
    this.getUsers();
  }


  getUsers() {
    this.loadingData = true;

    this.usersService
      .getUsers()
      .then(users => {
        this.usersCount = users.data.length;
        this.users = this._core.normalizeKeys(users.data);
        this.loadingData = false;
      })
      .catch(e => {
        this.loadingData = false;
        this._core.handleError(e);
      });

  }


  getModeName(value: string) {
    let mode = this.modes.filter((item) => {
      return item._id == value;
    });
    return mode[0].name;
  }


  openUserModal(action: string, category: any) {
    this.userModalAction = action;
    this.theUser = category;
    this.userModals.openModal();
  }

  onUserModalClosed() {
    this.userModalAction = '';
    this.theUser = null;
    this.getUsers();
  }

  onUserUpdated(id: any) {
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

      if (gridCell.column.dataField === 'created_at') {
        options.value = this.datePipe.transform(gridCell.value, "medium");
      }


    }
  };

}


