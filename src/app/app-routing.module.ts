import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllstudentsprofilesComponent } from './allstudentsprofiles/allstudentsprofiles.component';
import { EditExistingSchemaComponent } from './edit-existing-schema/edit-existing-schema.component';
import { EditprofileComponent } from './editprofile/editprofile.component';
import { GenerateNewSchemaComponent } from './generate-new-schema/generate-new-schema.component';
import { HandleFillFieldQuestionsComponent } from './handle-fill-field-questions/handle-fill-field-questions.component';
import { HomePageComponent } from './homepage/homepage.component';
import { MyprofilepageComponent } from './myprofilepage/myprofilepage.component';
import { MyscoreComponent } from './myscore/myscore.component';
import { QuestionsToTablesTrueOrFalseComponent } from './questions-to-tables-true-or-false/questions-to-tables-true-or-false.component';
import { QuestionsToTablesComponent } from './questions-to-tables/questions-to-tables.component';
import { RankingScoreComponent } from './ranking-score/ranking-score.component';
import { RegisterpageComponent } from './registerpage/registerpage.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { SqlFillFieldQuestionsComponent } from './sql-fill-field-questions/sql-fill-field-questions.component';
import { SqlQueriesTableComponent } from './sql-queries-table/sql-queries-table.component';
import { SqlQuizComponent } from './sql-quiz/sql-quiz.component';
import { TheorySqlComponent } from './theory-sql/theory-sql.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'register', component: RegisterpageComponent },
  { path: 'myprofile', component: MyprofilepageComponent },
  { path: 'editprofile', component: EditprofileComponent },
  { path: 'allstudentsprofile', component: AllstudentsprofilesComponent },
  { path: 'sqlquestionstable', component: SqlQueriesTableComponent },
  { path: 'myscores', component: MyscoreComponent },
  { path: 'sqlquiz', component: SqlQuizComponent },
  { path: 'generateNewSchema', component: GenerateNewSchemaComponent },
  { path: 'editExistingSchema', component: EditExistingSchemaComponent },
  { path: 'resetpassword/:id/:code', component: ResetpasswordComponent },
  {
    path: 'handlefillfieldquestions',
    component: HandleFillFieldQuestionsComponent,
  },
  {
    path: 'fillfieldsqlquestions/:id',
    component: SqlFillFieldQuestionsComponent,
  },
  { path: 'ranking', component: RankingScoreComponent },
  { path: 'theorySql', component: TheorySqlComponent },
  { path: 'questionsToTables/:id', component: QuestionsToTablesComponent },
  {
    path: 'questionsToTablesTrueOrFalse/:id',
    component: QuestionsToTablesTrueOrFalseComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
