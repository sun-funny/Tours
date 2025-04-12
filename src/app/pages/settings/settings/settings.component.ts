import { Component, OnDestroy, OnInit} from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PasswordChangeComponent } from '../password-change/password-change/password-change.component';
import { TabsModule } from 'primeng/tabs';
import { StatisticsComponent } from '../statistics/statistics/statistics.component';

@Component({
  selector: 'app-settings',
  imports: [
    PasswordChangeComponent,
    StatisticsComponent,
    TabsModule, 
    ToastModule],
  providers: [MessageService],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit, OnDestroy {

  ngOnInit(): void {
    console.log('init')
  }
  ngOnDestroy(): void {
    console.log('destr')
  }

}
