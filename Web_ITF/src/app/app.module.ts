import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// para poder utilizar en ng-model
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// loading
import { NgxSpinnerModule } from "ngx-spinner";

// importar rutas
///---- RUTAS
import { APP_ROUTING } from './app.routes';
////------ peticiones http
import { HttpClientModule } from '@angular/common/http' ;

// infinito Scroll
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

// pipe
import { NoimagePipe } from './pipes/noimage.pipe';


//filtar cualquier tabla
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import * as locales from 'ngx-bootstrap/locale';
import { defineLocale } from 'ngx-bootstrap/chronos';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SpinnerloadingComponent } from './components/spinnerloading/spinnerloading.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule, BsLocaleService, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
 
import { LightboxModule } from 'ngx-lightbox'; 
import { UsuariosComponent } from './pages/Accesos/usuarios/usuarios.component';
import { AccesosComponent } from './pages/Accesos/accesos/accesos.component'; 
import { TreeviewModule } from 'ngx-treeview'; 
 
import { ProfileComponent } from './pages/Mantenimientos/profile/profile.component';
import { RolesComponent } from './pages/Mantenimientos/roles/roles.component';
import { TipoCambioComponent } from './pages/Mantenimientos/tipo-cambio/tipo-cambio.component';
import { MonedaComponent } from './pages/Mantenimientos/moneda/moneda.component';
import { UbigeoComponent } from './pages/Mantenimientos/ubigeo/ubigeo.component';
import { CategoriaComponent } from './pages/Mantenimientos/categoria/categoria.component';
import { EspecialidadComponent } from './pages/Mantenimientos/especialidad/especialidad.component';
import { TipoProductoComponent } from './pages/Mantenimientos/tipo-producto/tipo-producto.component';
import { ResultadoVisitaComponent } from './pages/Mantenimientos/resultado-visita/resultado-visita.component';
import { ProductosComponent } from './pages/Mantenimientos/productos/productos.component';
import { ActividadComponent } from './pages/Mantenimientos/actividad/actividad.component';
import { FeriadoComponent } from './pages/Mantenimientos/feriado/feriado.component';
import { MedicoComponent } from './pages/Mantenimientos/medico/medico.component';
import { CicloComponent } from './pages/Mantenimientos/ciclo/ciclo.component';
 
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    SpinnerloadingComponent,
    NoimagePipe,
    UsuariosComponent,
    AccesosComponent,   
    ProfileComponent,
    RolesComponent,
    TipoCambioComponent,
    MonedaComponent,
    UbigeoComponent,
    CategoriaComponent,
    EspecialidadComponent,
    TipoProductoComponent,
    ResultadoVisitaComponent,
    ProductosComponent,
    ActividadComponent,
    FeriadoComponent,
    MedicoComponent,
    CicloComponent
  ],
  imports: [
    BrowserModule,
    APP_ROUTING,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    InfiniteScrollModule,
    LightboxModule,
    Ng2SearchPipeModule,
    TreeviewModule.forRoot(),
 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

  datepiekerConfig:Partial<BsDatepickerConfig>

  ///---definiendo la fecha Español global --
 constructor(private localeService: BsLocaleService){  
  this.defineLocales();
  this.localeService.use('es'); 
 }

  defineLocales() {
    for (const locale in locales) {
        defineLocale(locales[locale].abbr, locales[locale]);
    }
  }
 
 }
