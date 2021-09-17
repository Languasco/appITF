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
 

// // timePiecker Boostrap
import { TimepickerModule } from 'ngx-bootstrap';

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
import { AprobarActividadComponent } from './pages/Procesos/aprobar-actividad/aprobar-actividad.component';
import { SolicitudMedicoComponent } from './pages/Procesos/solicitud-medico/solicitud-medico.component';
import { AprobarSolicitudMedicoComponent } from './pages/Procesos/aprobar-solicitud-medico/aprobar-solicitud-medico.component';
import { AsignacionProductoComponent } from './pages/Procesos/asignacion-producto/asignacion-producto.component';
import { TargetComponent } from './pages/Procesos/target/target.component';
import { AltasTargetComponent } from './pages/Procesos/altas-target/altas-target.component';
import { AprobarAltasBajasTargetComponent } from './pages/Procesos/aprobar-altas-bajas-target/aprobar-altas-bajas-target.component';
import { RejaComponent } from './pages/Procesos/reja/reja.component';
import { ProgramacionComponent } from './pages/Procesos/programacion/programacion.component';
import { SolicitudDireccionComponent } from './pages/Procesos/solicitud-direccion/solicitud-direccion.component';
import { AprobarSolicitudDireccionComponent } from './pages/Procesos/aprobar-solicitud-direccion/aprobar-solicitud-direccion.component';
import { LoginComponent } from './pages/login/login.component';

///------- GRAFICOS CON FUSION CHART

import { FusionChartsModule } from "angular-fusioncharts";

// Import FusionCharts library and chart modules
import * as FusionCharts from "fusioncharts";
import * as charts from "fusioncharts/fusioncharts.charts";
import * as FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import * as Widgets from "fusioncharts/fusioncharts.widgets.js";
import * as Gantt from "fusioncharts/fusioncharts.gantt.js";
import { CumpleaniosComponent } from './pages/Reportes/cumpleanios/cumpleanios.component';
import { VisitasPendientesComponent } from './pages/Reportes/visitas-pendientes/visitas-pendientes.component';
import { BoticasFarmaciasComponent } from './pages/mantenimientos/boticas-farmacias/boticas-farmacias.component';
import { SolicitudBoticasFarmaciasComponent } from './pages/Procesos/solicitud-boticas-farmacias/solicitud-boticas-farmacias.component';
import { AprobarSolicitudBoticasFarmaciasComponent } from './pages/Procesos/aprobar-solicitud-boticas-farmacias/aprobar-solicitud-boticas-farmacias.component';
import { TargetBoticasFarmaciasComponent } from './pages/procesos/target-boticas-farmacias/target-boticas-farmacias.component';
import { AltasTargetBoticasFarmaciasComponent } from './pages/procesos/altas-target-boticas-farmacias/altas-target-boticas-farmacias.component';
import { AprobarABTargetBoticasFarmaciasComponent } from './pages/procesos/aprobar-abtarget-boticas-farmacias/aprobar-abtarget-boticas-farmacias.component';
import { ProgramacionBoticasFarmaciasComponent } from './pages/procesos/programacion-boticas-farmacias/programacion-boticas-farmacias.component';

import { TabsModule } from 'ngx-bootstrap/tabs';
 
 

// Pass the fusioncharts library and chart modules
FusionChartsModule.fcRoot(FusionCharts, charts, FusionTheme, Widgets, Gantt);
  
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
    CicloComponent,
    AprobarActividadComponent,
    SolicitudMedicoComponent,
    AprobarSolicitudMedicoComponent,
    AsignacionProductoComponent,
    TargetComponent,
    AltasTargetComponent,
    AprobarAltasBajasTargetComponent,
    RejaComponent,
    ProgramacionComponent,
    SolicitudDireccionComponent,
    AprobarSolicitudDireccionComponent,
    LoginComponent,
    CumpleaniosComponent,
    VisitasPendientesComponent,
    BoticasFarmaciasComponent,
    SolicitudBoticasFarmaciasComponent,
    AprobarSolicitudBoticasFarmaciasComponent,
    TargetBoticasFarmaciasComponent,
    AltasTargetBoticasFarmaciasComponent,
    AprobarABTargetBoticasFarmaciasComponent,
    ProgramacionBoticasFarmaciasComponent     
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
    TimepickerModule.forRoot(),
    TabsModule.forRoot(),
    FusionChartsModule
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
