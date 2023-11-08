import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ChatComponent } from './chat/chat.component';
import { CreateQuestionComponent } from './create-question/create-question.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditQuestionComponent } from './edit-question/edit-question.component';
import { ActiveUserGuard } from './guards/active-user.guard';
import { InterviewCalendarComponent } from './interview-calendar/interview-calendar.component';
import { LoginComponent } from './login/login.component';
import { QuestionsComponent } from './questions/questions.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [ActiveUserGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [ActiveUserGuard] },
  { path: 'account-settings', component: AccountSettingsComponent, canActivate: [ActiveUserGuard] },
  { path: 'questions', component: QuestionsComponent, canActivate: [ActiveUserGuard] },
  { path: 'questions/create', component: CreateQuestionComponent },
  { path: 'questions/edit/:id', component: EditQuestionComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'interviews', component: InterviewCalendarComponent},
  // Add other routes as needed
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirect empty path to /login
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
