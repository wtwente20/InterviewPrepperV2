import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { CreateQuestionComponent } from './create-question/create-question.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { QuestionsComponent } from './questions/questions.component';
import { RegisterComponent } from './register/register.component';
import { EditQuestionComponent } from './edit-question/edit-question.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    RegisterComponent,
    ChangePasswordComponent,
    AccountSettingsComponent,
    ConfirmationDialogComponent,
    QuestionsComponent,
    CreateQuestionComponent,
    EditQuestionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDialogModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatToolbarModule,
    BrowserAnimationsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
