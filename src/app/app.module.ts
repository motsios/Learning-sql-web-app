import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterpageComponent } from './registerpage/registerpage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientJsonpModule, HttpClient } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MyprofilepageComponent } from './myprofilepage/myprofilepage.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomePageComponent } from './homepage/homepage.component';
import { EditprofileComponent } from './editprofile/editprofile.component';
import { AllstudentsprofilesComponent } from './allstudentsprofiles/allstudentsprofiles.component';
import { SqlQueriesTableComponent } from './sql-queries-table/sql-queries-table.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogSqlQuestionComponent } from './dialog-sql-question/dialog-sql-question.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MyscoreComponent } from './myscore/myscore.component';
import { SqlQuizComponent } from './sql-quiz/sql-quiz.component';
import { MatRadioModule } from '@angular/material/radio';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ToastrModule } from 'ngx-toastr';
import {AccordionModule} from "ngx-accordion";
import { GenerateNewSchemaComponent } from './generate-new-schema/generate-new-schema.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { EditExistingSchemaComponent } from './edit-existing-schema/edit-existing-schema.component';
import { IgxBottomNavModule } from 'igniteui-angular';
import { DialogAddSqlQueryComponent } from './dialog-add-sql-query/dialog-add-sql-query.component';
import { DialogShowQueryResultsComponent } from './dialog-show-query-results/dialog-show-query-results.component';
import { HandleFillFieldQuestionsComponent } from './handle-fill-field-questions/handle-fill-field-questions.component';
import { DialogFillFieldQuestionComponent } from './dialog-fill-field-question/dialog-fill-field-question.component';
import { SqlFillFieldQuestionsComponent } from './sql-fill-field-questions/sql-fill-field-questions.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { RankingScoreComponent } from './ranking-score/ranking-score.component';
import { TheorySqlComponent } from './theory-sql/theory-sql.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { QuestionsToTablesComponent } from './questions-to-tables/questions-to-tables.component';
import { DialogSqlQueryTableComponent } from './dialog-sql-query-table/dialog-sql-query-table.component';


@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    RegisterpageComponent,
    MyprofilepageComponent,
    NavbarComponent,
    EditprofileComponent,
    AllstudentsprofilesComponent,
    SqlQueriesTableComponent,
    DialogSqlQuestionComponent,
    MyscoreComponent,
    SqlQuizComponent,
    GenerateNewSchemaComponent,
    ResetpasswordComponent,
    EditExistingSchemaComponent,
    DialogAddSqlQueryComponent,
    DialogShowQueryResultsComponent,
    HandleFillFieldQuestionsComponent,
    DialogFillFieldQuestionComponent,
    DialogFillFieldQuestionComponent,
    SqlFillFieldQuestionsComponent,
    RankingScoreComponent,
    TheorySqlComponent,
    QuestionsToTablesComponent,
    DialogSqlQueryTableComponent,
  ],
  imports: [
    ModalModule.forRoot(),
    ToastrModule.forRoot(),
    AccordionModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    HttpClientJsonpModule,
    FormsModule,
    MatRadioModule ,
    MatCardModule,
    PdfViewerModule,
    MatIconModule,
    NgbModule,
    MatDialogModule,
    IgxBottomNavModule,
        ReactiveFormsModule,
        NgxSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents:[DialogSqlQuestionComponent,DialogAddSqlQueryComponent,DialogShowQueryResultsComponent,DialogFillFieldQuestionComponent]
})
export class AppModule { }
