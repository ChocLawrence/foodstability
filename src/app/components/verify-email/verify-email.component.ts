import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { CoreService } from '../../core/core.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { EmailsService } from '../../services/emails.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css'],
})
export class VerifyEmailComponent implements OnInit {
  public display: any;
  public loading = false;
  public verification = false;
  public state: any;
  public verificationId: any;

  constructor(
    public core: CoreService,
    public router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private emailsService: EmailsService
  ) {}

  ngOnInit(): void {
    this.processVerification();
  }

  async processVerification() {
    //check current url
    this.route.queryParams.subscribe((params) => {
      this.verificationId = params['url'];
    });

    if (!this.core.isEmptyOrNull(this.verificationId)) {
      if (this.core.checkIfOnline()) {
        await this.verifyEmail(this.verificationId);
      }
    } else {
      this.redirectToLogin();
    }
  }

  async verifyEmail(id: string) {
    this.loading = true;

    await this.emailsService
      .verifyEmail(id)
      .then((res) => {
        this.loading = false;
        this.verification = true;
        this.timer(2);
      })
      .catch((e) => {
        this.loading = false;
        this.verification = false;
        this.timer(1);
        this.core.handleError(e);
      });
  }

  timer(minute: any) {
    // let minute = 1;
    let seconds: number = minute * 10;
    let textSec: any = '0';
    let statSec: number = 11;

    const prefix = minute < 10 ? '0' : '';

    const timer = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 10;

      if (statSec < 10) {
        textSec = '0' + statSec;
      } else textSec = statSec;

      this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) {
        this.redirectToLogin();
        clearInterval(timer);
      }
    }, 1000);
  }

  redirectToLogin() {
    this.core.showSuccess('Success', 'Redirecting to login..');
    this.router.navigate(['/login']);
  }
}
