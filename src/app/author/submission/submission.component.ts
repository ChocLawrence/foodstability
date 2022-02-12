import { Component, OnInit, ViewChild } from '@angular/core';
import { CoreService } from '../../core/core.service';
import { UsersService } from '../../services/users.service';
import { SubmissionService } from '../../services/submission.service';
import { routerTransition } from '../../router.animations';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import {
  NgbDateStruct,
  NgbDateParserFormatter,
} from '@ng-bootstrap/ng-bootstrap';
import { DxDataGridComponent } from 'devextreme-angular';
@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.css'],
})
export class SubmissionComponent implements OnInit {
  submissionForm!: FormGroup;
  public coverFile: any;
  public manuscriptFile: any;
  public supplementaryFile:any;

  public loadingData = false;
  public users: any[] = [];
  public limit = 10;
  public animationType = 'wanderingCubes';
  public user: any = null;
  public origin = 'users';
  public menu: any;

  constructor(
    public _core: CoreService,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private submissionService: SubmissionService,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.menu = this._core.pageMenu;
    //this.redirectToLogin();
    this.initForm();
    this.getCurrentUser();
  }

  initForm() {
    this.submissionForm = this.fb.group({
      full_name: ['', Validators.required],
      email: ['', Validators.required],
      designation: ['', Validators.required],
      contact: ['', Validators.required],
      specialization: ['', Validators.required],
      uni_org: ['', Validators.required],
      article_type: ['', Validators.required],
      article_title: ['', Validators.required],
      cover: ['', Validators.required],
      manuscript: ['', Validators.required],
      confirm: ['', Validators.required],
      supplementary: [''],
    });
  }

  getCurrentUser() {
    if (this._core.loginUser) {
      this.user = this._core.loginUser.user;
    }
  }

  getDate(date: string) {
    if (!this._core.isEmptyOrNull(date)) {
      return this._core.formatDate(date);
    } else {
      return '';
    }
  }

  coverFileChanged($event: any) {
    this.handleCoverUpload($event);
  }

  manuscriptFileChanged($event: any) {
    this.handleManuscriptUpload($event);
  }

  supplementaryFileChanged($event: any) {
    this.handleSupplementaryUpload($event);
  }

  handleCoverUpload(event: any) {
    this.coverFile = event.target.files[0];

    if (this.coverFile && this.coverFile.size > 1000000) {
      this._core.showError('Error', 'Limit file to 1 mb');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(this.coverFile);
  }

  handleManuscriptUpload(event: any) {
    this.manuscriptFile = event.target.files[0];

    if (this.manuscriptFile && this.manuscriptFile.size > 1000000) {
      this._core.showError('Error', 'Limit file to 1 mb');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(this.manuscriptFile);
  }

  handleSupplementaryUpload(event: any) {
    this.supplementaryFile = event.target.files[0];

    if (this.supplementaryFile && this.supplementaryFile.size > 1000000) {
      this._core.showError('Error', 'Limit file to 1 mb');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(this.supplementaryFile);
  }

  onSubmit() {
    if (this.submissionFormIsValid()) {
      this.loadingData = true;
      let values = this.submissionForm.value;
      if (this.manuscriptFile) values.manuscriptFile = this.manuscriptFile;
      if (this.coverFile) values.coverFile = this.coverFile;
      if (this.supplementaryFile)
        values.supplementaryFile = this.supplementaryFile;

      this.addSubmission(values);
    }

    return false;
  }

  addSubmission(values: any) {
    this.submissionService
      .addSubmission(values)
      .then((r) => {
        this._core.showSuccess('Success', 'Added Successfully...');
        this.loadingData = false;
        this.resetSubmissionForm();
      })
      .catch((e) => {
        this.loadingData = false;
        this._core.handleError(e);
      });
  }

  submissionFormIsValid() {
    return (
      this.submissionForm.controls['full_name'].valid &&
      this.submissionForm.controls['email'].valid &&
      this.submissionForm.controls['designation'].valid &&
      this.submissionForm.controls['contact'].valid &&
      this.submissionForm.controls['specialization'].valid &&
      this.submissionForm.controls['uni_org'].valid &&
      this.submissionForm.controls['article_type'].valid &&
      this.submissionForm.controls['article_title'].valid &&
      this.submissionForm.controls['cover'].valid &&
      this.submissionForm.controls['manuscript'].valid &&
      this.submissionForm.controls['confirm'].valid
    );
  }

  resetSubmissionForm() {
    this.submissionForm?.reset();
  }

  customizeExcelCell = (options: any) => {
    var gridCell = options.gridCell;
    if (!gridCell) {
      return;
    }

    if (gridCell.rowType === 'data') {
      if (gridCell.column.dataField === 'created_at') {
        options.value = this.datePipe.transform(gridCell.value, 'medium');
      }
    }
  };
}
