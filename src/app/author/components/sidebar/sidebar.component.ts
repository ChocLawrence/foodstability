import { Component, OnInit, Input } from '@angular/core';
import { CoreService } from '../../../core/core.service';
import { TranslateService } from '@ngx-translate/core';
import { UrlsService } from '../../../core/urls.service';
import { UsersService } from '../../../services/users.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { Router, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
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
    public _urls: UrlsService,
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

  redirectToLogin() {
    if (this.menu != '2' && this.menu != '1') {
      this._core.showError('Error', 'Redirecting to login..');
      this.logout();
    }
  }

  redirectToHome(){
    window.location.href = '/';
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
