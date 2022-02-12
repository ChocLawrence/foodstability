import { Component, OnInit, Input } from '@angular/core';
import { CoreService } from '../../core/core.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from '../../services/authentication.service';
import { UsersService } from '../../services/users.service';
import { Router, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  public unreadNotificationsCount: any = 0;
  public unreadNotifications: any = [];
  public loadingData = false;
  public showSaveButton = false;
  public user: any = null;
  public userProfile: any;
  public file: any;
  public preview: any;
  public default = 'assets/images/profile-thumb-sm.png';
  public menu: any;

  constructor(
    private translate: TranslateService,
    public _core: CoreService,
    public router: Router,
    public usersService: UsersService,
    public authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this._core.getRealOffset();
    this.menu = this._core.pageMenu;
    //this.redirectToLogin();
    this.getCurrentUser();
  }

  changeLang(language: string) {
    this.translate.use(language);
  }

  getCurrentUser() {
    if (this._core.loginUser) {
      this.user = this._core.loginUser.user;
    }

    //console.log('user>>',this._core.loginUser);

    // if (this.user.profile == '1') {
    //   this.getUserProfile();
    // }
  }

  // getUserProfile() {

  //   this.preview = null;
  //   this.loadingData = true;
  //   this.profilesService
  //     .getUserProfile()
  //     .then(user => {
  //       this.userProfile = this._core.normalizeKeys(user);
  //       if (this.userProfile.avatar.contentType && this.userProfile.avatar.data) {
  //         this.preview = "data:" + this.userProfile.avatar.contentType + ";base64," + this.userProfile.avatar.data;
  //       } else {
  //         this.preview = this.default;
  //       }
  //       this.loadingData = false;
  //     })
  //     .catch(e => {
  //       this.loadingData = false;
  //       this._core.handleError(e);
  //     });

  // }

  redirectToLogin() {
    if (this.menu != '2' && this.menu != '1') {
      this._core.showError('Error', 'Redirecting to login..');
      this.logout();
    }
  }

  logout() {
    this.loadingData = false;
    this._core.showSuccess('Success', 'Logging off..');
    this.authenticationService
      .logout()
      .then((r) => {
        localStorage.clear();
        window.location.href = '/';
        this.loadingData = false;
      })
      .catch((e) => {
        this.loadingData = false;
        this._core.handleError(e);
      });
  }
}
