import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';  //https://fontawesome.com/how-to-use/svg-with-js
import { SharedModule } from './shared/shared.module';
import { RouterModule, PreloadAllModules } from '@angular/router';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    SharedModule,
    AngularFontAwesomeModule,
    HttpClientModule,
    RouterModule.forRoot([
        { path: 'login', component: LoginComponent },
        {
            path: 'websites',
            //data: { preload: false },  //this is for custom-built preloader services only, relates to lazy loading
            loadChildren: './websites/websites.module#WebsitesModule'
        },        
        { path: '', redirectTo: '/login', pathMatch: 'full'},
        { path: '**', component: LoginComponent }
    ]     
    , {preloadingStrategy: PreloadAllModules} )   //prod
    // , {preloadingStrategy: PreloadAllModules, enableTracing: true} ) //dev ONLY, view routing events in console.
  ],
  declarations: [
    AppComponent,
    LoginComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
