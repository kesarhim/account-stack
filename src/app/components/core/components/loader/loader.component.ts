import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Loader } from './loader.model';
import { Subscription, interval } from 'rxjs';
import { LoaderService } from './loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit, OnDestroy {
  @Input() id = 'default-loader';
  show = false;
  message = 'Loading, Please wait...';

  loaderSubscription: Subscription;
  loaderSubscriptionProcess: Subscription;

  constructor(private loaderService: LoaderService) { }

  ngOnInit() {
    this.loaderSubscription = this.loaderService.loaderState
      .subscribe((state: Loader) => {
        this.show = state.show || false;
        this.message = state?.message || '';
        if (state.timer) {
          const time = interval(state.timer);
          this.loaderSubscriptionProcess = time.subscribe((t) => {
            this.show = false;
            this.loaderSubscriptionProcess.unsubscribe();
          })
        }
      })
  }

  ngOnDestroy() {
    this.loaderSubscription.unsubscribe();
    this.loaderSubscriptionProcess.unsubscribe();
  }

}
