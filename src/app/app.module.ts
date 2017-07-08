import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './AuthGuard';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { AddComponent } from './bills/add/add.component';
import { EditComponent } from './bills/edit/edit.component';
import { ManageComponent } from './bills/manage/manage.component';
import { PaymentHistoryComponent } from './bills/payment-history/payment-history.component';
import { PayComponent } from './bills/pay/pay.component';
import { MakePaymentComponent } from './bills/pay/make-payment/make-payment.component';
import { SidebarComponent } from './bills/sidebar/sidebar.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { SettingsComponent } from './settings/settings.component';
import { BillsComponent } from './bills/bills.component';
import { GroupsComponent } from './groups/groups.component';

import { AuthService } from './services/auth.service';
import { UserAlertService } from './services/user-alert.service';
import { BillService } from './services/bill.service';
import { NotificationService } from './services/notification.service';
import { PaymentService } from './services/payment.service';
import { UserService } from './services/user.service';
import { GroupService } from './services/group.service';

const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: 'groups', component: GroupsComponent},
  { path: 'bills', component: BillsComponent, canActivate: [AuthGuard]},
  { path: 'bills/pay/make-payment/:id', component: MakePaymentComponent, canActivate: [AuthGuard] },
  { path: 'bills/pay', component: PayComponent, canActivate: [AuthGuard] },
  { path: 'bills/payment-history', component: PaymentHistoryComponent, canActivate: [AuthGuard] },
  { path: 'bills/manage', component: ManageComponent, canActivate: [AuthGuard] },
  { path: 'bills/add', component: AddComponent, canActivate: [AuthGuard] },
  { path: 'bills/edit/:id', component: EditComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  { path: 'notifications', component: NotificationsComponent},
  { path: 'settings', component: SettingsComponent},
  { path: 'login', component: LoginComponent},
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    LoginComponent,
    BillsComponent,
    AddComponent,
    EditComponent,
    ManageComponent,
    PaymentHistoryComponent,
    PayComponent,
    MakePaymentComponent,
    SidebarComponent,
    NotificationsComponent,
    SettingsComponent,
    GroupsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes)
  ],
  providers: [AuthService, GroupService, BillService, PaymentService, UserAlertService, AuthGuard, NotificationService, UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
