import { Component, OnInit, ViewChild } from '@angular/core';
import { CoreService } from '../../core/core.service';
import { UsersService } from '../../services/users.service';
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
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

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
  public user:any = null;
  public origin = 'users';
  public userModalAction = '';
  public menu: any;

  constructor(public _core: CoreService,
    private datePipe: DatePipe,
    private usersService: UsersService) { }

  ngOnInit(): void {
    this.menu = this._core.pageMenu;
    //this.redirectToLogin();
    this.getCurrentUser();
  }

  getCurrentUser() {

    if(this._core.loginUser){
      this.user = this._core.loginUser.user;
    }

  }

  getUserProfile() {
    this.loadingData = true;

    this.usersService
      .getSingleUser(this.user.id)
      .then(users => {
        this.usersCount = users.data.length;
        this.users = this._core.normalizeKeys(users.data);
        let data = this._core.loginUser;
        data.user = this.users;
        this._core.encryptToLocalStorage('currentUser', JSON.stringify(data));
        this.getCurrentUser();
        this.loadingData = false;
      })
      .catch(e => {
        this.loadingData = false;
        this._core.handleError(e);
      });

  }


  openUserModal(action: string, user: any) {
    this.userModalAction = action;
    this.theUser = user;
    this.userModals.openModal();
  }

  onUserModalClosed() {
    this.userModalAction = '';
    this.theUser = null;
    this.getUserProfile();
  }

  onUserUpdated(id: any) {
    this.getUserProfile();
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


