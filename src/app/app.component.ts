import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  Router,
  Event,
  NavigationStart,
  NavigationEnd,
  NavigationError,
} from '@angular/router';
import { Observable, Observer, fromEvent, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { CoreService } from './core/core.service';
// Service
import { DynamicLoaderService } from './services/dynamic-loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'bankwire';

  constructor(
    private router: Router,
    private core: CoreService,
    private translateService: TranslateService
  ) {
    this.core.checkIfOnline();
  }

  ngOnInit(): void {}
}
