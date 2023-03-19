import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpEvent, HttpHeaders, HttpParams } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { UrlsService } from './urls.service';
//import { AuthenticationService } from '../services/authentication.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { timeout } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root',
})
export class CoreService {
  public loginUser: any;
  public userPermissions = [];
  public userId: any;
  public currency = 'XAF';
  public pageMenu: any;
  public timing = 2000;
  public httpTimeout = 30 * 1000;
  public httpLongTimeout = 90000;
  public maxRemoteEntries = 500;
  public locale = 'en-CA'; // Canadian locale
  public maximumFractionDigits = 0;
  public style = 'decimal'; // or 'currency', then currency must be given:
  public past1Year = new Date().getFullYear() - 1;
  public past2Years = new Date().getFullYear() - 2;
  public defaultDateDuration = this.daysInYear(this.past1Year) + this.daysInYear(this.past2Years);
  public loadingIndicator = false;
  public reorderable = true;
  public sortable = true;
  public pageSize = 5;
  public footerHeight = 30;
  public headerHeight = 40;
  // For Encryption/Decryption
  public encryptDecryptValuePassword = 'FoodStability.2022!';
  public encryptDecryptKeyPassword = 'FoodStability.2022!';
  get salt() {
    return CryptoJS.enc.Hex.parse('4acfedc7dc72a9003a0dd721d7642bde');
  }
  get iv() {
    return CryptoJS.enc.Hex.parse('69135769514102d0eded589ff874cacd');
  }

  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
  };

  public ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
  };

  public ngbModalOptionsSm: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'sm',
  };

  public ngbModalOptionsLg: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'lg',
  };

  public ngbModalOptionsXl: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'xl',
  };

  public ngbModalOptionsNested: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
  };

  public languageObject = [
    { name: 'English', code: 'en' },
    { name: 'Français', code: 'fr' },
  ];

  public continent = [
    { code: 'AF', name: 'Africa' },
    { code: 'AN', name: 'Antarctic' },
    { code: 'AS', name: 'Asia' },
    { code: 'EU', name: 'Europe' },
    { code: 'NA', name: 'North America' },
    { code: 'OC', name: 'Oceania' },
    { code: 'SA', name: 'South America' },
  ];

  public apiUrl: string;

  public serverTime: any;
  public serverOffset = 0;
  public localOffset = 0;
  public insurerBgImage = null;
  public tzOffset: string = '+0100'; //should be +0100, but that doesn't work for unknown reasons
  public momentOffset: string = '+0000';

  public localFmKey =
    'Z7CI-115659-5Z476R-0S1A64-0I0C5Q-1H0J4O-48475D-3M5Z2C-351B5L-4V3H5G-726G5T-0G0N47-4T3G29-0T57';
  public devFmKey =
    'Z7GE-11D53Q-3Q5T18-14676S-186F0H-1D1J5D-4X5H27-0C3N6D-385U6J-014G3H-4Q5E3E-6D5R2Q-4R5G0U-3Y';
  public testingFmKey =
    'Z7MK-11JC0T-3S6X2N-3M6D4B-15412W-5T532C-0T0G68-0C4O0V-4U4B2C-5S0P56-1O026T-1I1351-5M5B0P-4D3M12-6D2R';
  public stagingFmKey =
    'Z7IV-11325O-6A372I-0R0A2K-1M5G54-0E1X0C-0Z1G6N-0L226Q-6B6Z4R-1N096Q-026N58-0X410V-3S3B13-593T3R-0T5Z';
  public productionFmKey =
    'Z7S1-118A1N-335B72-316L4Q-63235H-5M3R45-066A4S-5O6Y49-4W4K0J-064Z2U-6W054K-1731';

  moment: any = moment;
  public isOnline = navigator.onLine;

  constructor(
    private router: Router,
    private http: HttpClient,
    private datePipe: DatePipe,
    private modalService: NgbModal,
    private toastr: ToastrService,
    //private authenticationService: AuthenticationService,
    private urlService: UrlsService
  ) {
    this.apiUrl = urlService.apiUrl();
    if (!this.isEmptyOrNull(this.decryptFromLocalStorage('menu'))) {
      this.pageMenu = this.decryptFromLocalStorage('menu');
    }

    if (!this.isEmptyOrNull(this.decryptFromLocalStorage('currentUser'))) {
      this.loginUser = this.decryptFromLocalStorage('currentUser');
    }
  }

  ngOnInit() {}

  daysInYear(year: any) {
    year = parseInt(year);
    return (year % 4 === 0 && year % 100 > 0) || year % 400 == 0 ? 366 : 365;
  }

  checkIfOnline() {
    if (!this.isOnline) {
      this.showError('Error', 'You are currently offline!');
      return false;
    }
    if (this.isOnline) {
      return true;
    }
    return false;
  }

  showSuccess(title: string, message: string) {
    this.toastr.success(title, message);
  }

  showError(title: string, message: string) {
    this.toastr.error(title, message);
  }

  getStartDate(endDateString: any, duration = this.defaultDateDuration): Date {
    let endDate = new Date(endDateString);
    let startDate = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate() - duration
    );
    return startDate;
  }

  handleError(error: any) {
    let messageString = '';

    if (error && error.error && error.error.status && error.error.status == 0) {
      this.showError('Oops', 'Could not reach server.Retry');
    } else if (error.error && error.error.message && error.error.status == 'error') {
      if (
        typeof error.error.message === 'object' &&
        error.error.message !== null
      ) {
        for (const [key, value] of Object.entries(error.error.message)) {
          messageString = messageString.concat(`${key} : ${value}`, ' , ');
        }
      } else {
        messageString = error.error.message;
      }
      this.showError('Oops', messageString);
    } else {
      console.log('error', error);
      this.showError('Oops', error.message);
      //this.redirectToLogin();
    }
  }

  getRealOffset() {
    //in theory, client time should be server time - server timezone + client timezone
    //at least that's what I think
    this.localOffset = -new Date().getTimezoneOffset();
    let offset = this.localOffset - this.serverOffset;
    let absoluteOffset = Math.abs(offset);
    this.tzOffset =
      (offset < 0 ? '-' : '+') +
      ('00' + Math.floor(absoluteOffset / 60)).slice(-2) +
      ('00' + (absoluteOffset % 60)).slice(-2);

    this.momentOffset =
      (offset < 0 ? '-' : '+') +
      ('00' + Math.floor(absoluteOffset / 60)).slice(-2) +
      ('00' + (absoluteOffset % 60)).slice(-2);
  }

  onFileSaving(event: any, fileName: any) {
    let date = new Date();
    let year = date.getFullYear();
    let month =
      date.getMonth() < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    let hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    let minutes =
      date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    let seconds =
      date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();

    event.fileName = `${fileName} ${day}-${month}-${year} ${hours}-${minutes}-${seconds}`;
  }

  // test if a string value is null, undefined or empty
  isEmptyOrNull(value: any) {
    if (
      value == '' ||
      value == null ||
      value == undefined ||
      value == 'undefined'
    ) {
      return true;
    }
    return false;
  }

  getGenderDesc(id: any) {
    if (id) {
      if (id.toLowerCase() == 'm') {
        return 'Male';
      } else {
        return 'Female';
      }
    } else {
      return '';
    }
  }

  getDate(date: string) {
    if (!this.isEmptyOrNull(date)) {
      return this.datePipe.transform(date, 'medium', this.tzOffset);
    } else {
      return '';
    }
  }

  getDateInMoment(date: string) {
    if (!this.isEmptyOrNull(date)) {
      return this.formatDate(date);
    } else {
      return '';
    }
  }

  getShortDate(date: string) {
    if (!this.isEmptyOrNull(date)) {
      return this.datePipe.transform(date, 'mediumDate', this.tzOffset);
    } else {
      return '';
    }
  }

  formatDate(date: any) {
    if (date) {
      if (this.moment(date).isValid()) {
        return this.moment(date).utcOffset(this.momentOffset).fromNow();
      } else {
        console.error(`"${date}" is not a valid date`);
        return '';
      }
    } else {
      return '';
    }
  }

  keysToLowerCase(obj: any) {
    Object.keys(obj).forEach(function (key) {
      let k = key.toLowerCase();

      if (k !== key) {
        obj[k] = obj[key];
        delete obj[key];
      }
    });
    return obj;
  }

  normalizeKeys(input: any) {
    if (input && typeof input == 'object') {
      if (input.hasOwnProperty('length')) {
        // input is an array
        if (input.length > 0) {
          for (let i = 0; i < input.length; i++) {
            input[i] = this.keysToLowerCase(input[i]);
          }
        }
      } else {
        // input is an object
        input = this.keysToLowerCase(input);
      }
    } else {
      //console.error("This is neither an object nor an array");
    }
    return input;
  }

  addThouSep(num: any, maxFractionDigits = 2) {
    let formattedNum = '';
    let numb = Number(num);
    if (!Number.isNaN(numb)) {
      try {
        formattedNum = numb.toLocaleString(this.locale, {
          maximumFractionDigits: maxFractionDigits,
          currency: this.currency,
          style: this.style,
        });
      } catch (e) {
        console.warn(`Oops, Something went wrong! Using safe values... ${e}`);
        formattedNum = numb.toLocaleString(this.locale);
      }
      return formattedNum;
    } else {
      return '';
    }
  }

  encryptData(data: any, password: string) {
    let key128Bits100Iterations = CryptoJS.PBKDF2(password, this.salt, {
      keySize: 128 / 32,
      iterations: 100,
    });
    let encryptOutput = CryptoJS.AES.encrypt(data, key128Bits100Iterations, {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString();

    return encryptOutput;
  }

  decryptData(data: any, password: string) {
    let key128Bits100Iterations = CryptoJS.PBKDF2(password, this.salt, {
      keySize: 128 / 32,
      iterations: 100,
    });
    let decryptOutput = CryptoJS.AES.decrypt(data, key128Bits100Iterations, {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }).toString(CryptoJS.enc.Utf8);

    return decryptOutput;
  }

  encryptToLocalStorage(key: any, data: any) {
    localStorage.setItem(
      this.encryptData(key, this.encryptDecryptKeyPassword),
      this.encryptData(data, this.encryptDecryptValuePassword)
    );
  }

  decryptFromLocalStorage(key: any, json = true) {
    let encryptedKey = this.encryptData(key, this.encryptDecryptKeyPassword);
    if (!this.isEmptyOrNull(localStorage.getItem(encryptedKey))) {
      if (json == true)
        return JSON.parse(
          this.decryptData(
            localStorage.getItem(encryptedKey),
            this.encryptDecryptValuePassword
          )
        );
      else
        return this.decryptData(
          localStorage.getItem(encryptedKey),
          this.encryptDecryptValuePassword
        );
    } else {
      return '';
    }
  }

  redirectToLogin() {
    localStorage.clear();
    localStorage.setItem('page', 'login');
    //this.authenticationService.logout();
    this.showError('Error', 'Redirecting to login..');
    if (this.modalService.hasOpenModals()) {
      this.modalService.dismissAll();
    }
    window.location.href = '/';
  }

  makeRemoteRequest(url: string, method: string, params: any, options: any) {
    if (method.toLowerCase() == 'get') {
      return new Promise((resolve, reject) => {
        this.http
          .get<any>(url)
          .pipe(timeout(this.httpTimeout))
          .subscribe({
            next: (data: any) => {
              if (data) {
                resolve(data);
              } else {
                reject(data);
              }
            },
            error: (error: any) => {
              reject(error);
            },
          });
      });
    } else if (method.toLowerCase() == 'post') {
      return new Promise((resolve, reject) => {
        this.http
          .post<any>(url, params)
          .pipe(timeout(this.httpTimeout))
          .subscribe({
            next: (data: any) => {
              if (data) {
                resolve(data);
              } else {
                reject(data);
              }
            },
            error: (error: any) => {
              reject(error);
            },
          });
      });
    } else if (method.toLowerCase() == 'put') {
      return new Promise((resolve, reject) => {
        this.http
          .put<any>(url, params)
          .pipe(timeout(this.httpTimeout))
          .subscribe({
            next: (data: any) => {
              if (data) {
                resolve(data);
              } else {
                reject(data);
              }
            },
            error: (error: any) => {
              reject(error);
            },
          });
      });
    } else if (method.toLowerCase() == 'delete') {
      return new Promise((resolve, reject) => {
        this.http
          .delete<any>(url, options)
          .pipe(timeout(this.httpTimeout))
          .subscribe({
            next: (data: any) => {
              if (data) {
                resolve(data);
              } else {
                reject(data);
              }
            },
            error: (error: any) => {
              reject(error);
            },
          });
      });
    } else {
      console.log(`method ${method} is not implemented`);
      return Promise.reject('Error');
    }
  }
}
