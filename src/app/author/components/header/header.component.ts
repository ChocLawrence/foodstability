import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CoreService } from '../../../core/core.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public pushRightClass: any;
  public loadingData = false;

  constructor(
    private translate: TranslateService,
    public router: Router,
    private authenticationService: AuthenticationService,
    public _core: CoreService
  ) {}

  ngOnInit() {}

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
