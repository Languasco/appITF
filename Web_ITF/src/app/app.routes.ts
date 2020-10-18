import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { UsuariosComponent } from './pages/Accesos/usuarios/usuarios.component';
import { AccesosComponent } from './pages/Accesos/accesos/accesos.component';
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
 
  
const APP_ROUTERS: Routes = [
    //{ path: 'home', component: HomeComponent  ,  canActivate: [AuthGuard]},  
    { path: '', component: HomeComponent},  
    { path: 'seguridad-usuarios', component: UsuariosComponent},  
    { path: 'seguridad-accesos', component: AccesosComponent , canActivate: [ AuthGuard]}, 
    { path: 'seguridad-profile', component: ProfileComponent , canActivate: [ AuthGuard]}, 
        
    { path: 'mant-roles', component: RolesComponent , canActivate: [ AuthGuard]}, 
    { path: 'mant-tipoCambio', component: TipoCambioComponent , canActivate: [ AuthGuard]}, 
    { path: 'mant-moneda', component: MonedaComponent , canActivate: [ AuthGuard]}, 
    { path: 'mant-ubigeo', component: UbigeoComponent , canActivate: [ AuthGuard]}, 
    { path: 'mant-categoria', component: CategoriaComponent , canActivate: [ AuthGuard]}, 
    { path: 'mant-especialidad', component: EspecialidadComponent , canActivate: [ AuthGuard]}, 
    { path: 'mant-tipo-producto', component: TipoProductoComponent , canActivate: [ AuthGuard]},
     
    { path: 'mant-resultado-visita', component: ResultadoVisitaComponent , canActivate: [ AuthGuard]}, 
    { path: 'mant-producto', component: ProductosComponent , canActivate: [ AuthGuard]}, 
    { path: 'proc-actividad', component: ActividadComponent , canActivate: [ AuthGuard]}, 
    { path: 'mant-feriado', component: FeriadoComponent , canActivate: [ AuthGuard]}, 
    { path: 'mant-medico', component: MedicoComponent , canActivate: [ AuthGuard]}, 

    { path: 'mant-ciclos', component: CicloComponent , canActivate: [ AuthGuard]}, 
    { path: 'proc-aprobar-actividad', component: AprobarActividadComponent , canActivate: [ AuthGuard]}, 

    { path: 'proc-solicitud-medico', component: SolicitudMedicoComponent , canActivate: [ AuthGuard]}, 
    { path: 'proc-aprobar-solicitud-medico', component: AprobarSolicitudMedicoComponent , canActivate: [ AuthGuard]}, 
    { path: 'proceso-asignacion-producto', component: AsignacionProductoComponent , canActivate: [ AuthGuard]}, 
    { path: 'proceso-target', component: TargetComponent , canActivate: [ AuthGuard]}, 
    { path: 'proceso-AB-target/:opcionTarget', component: AltasTargetComponent , canActivate: [ AuthGuard]}, 
    { path: 'proceso-aprobar-AB-target/:opcionTarget', component: AprobarAltasBajasTargetComponent , canActivate: [ AuthGuard]}, 
    { path: 'proceso-reja-promocional', component: RejaComponent , canActivate: [ AuthGuard ]}, 

    { path: 'proceso-programacion-visitas', component: ProgramacionComponent , canActivate: [ AuthGuard ]}, 

    { path: '', pathMatch:'full', redirectTo:'inicio' },
    { path: '**', pathMatch:'full', redirectTo:'inicio' },
  ];
  
  export const APP_ROUTING = RouterModule.forRoot(APP_ROUTERS,{useHash:true});  


 