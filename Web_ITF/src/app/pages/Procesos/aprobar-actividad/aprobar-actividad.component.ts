
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertasService } from '../../../services/alertas/alertas.service';
import { RespuestaServer } from '../../../models/respuestaServer.models';
import { FuncionesglobalesService } from '../../../services/funciones/funcionesglobales.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../../../services/login/login.service';
import Swal from 'sweetalert2';

import { combineLatest } from 'rxjs';
import { ActividadService } from '../../../services/Mantenimientos/actividad.service';
import { IfStmt } from '@angular/compiler';

declare var $:any;

@Component({
  selector: 'app-aprobar-actividad',
  templateUrl: './aprobar-actividad.component.html',
  styleUrls: ['./aprobar-actividad.component.css']
})
 
export class AprobarActividadComponent implements OnInit {

  formParamsFiltro : FormGroup;
  formParams: FormGroup;

  idUserGlobal :number = 0;
  idEstadoGlobal :number = 0;
  descripcionEstadoGlobal :string = '';
  idUsuarioLoggeadoGlobal :string = '';
  flag_modoEdicion :boolean =false;

  actividades :any[]=[]; 
  filtrarMantenimiento = "";

  usuarios :any[]=[]; 
  ciclos :any[]=[]; 
  duracionActividades :any[]=[]; 
  estados :any[]=[]; 

  titulo="";
 
  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService, private funcionesglobalesService : FuncionesglobalesService, private actividadService : ActividadService ) {         
    this.idUserGlobal = this.loginService.get_idUsuario();
    this.idUsuarioLoggeadoGlobal = this.loginService.getSessionNombre();
  }
 
 ngOnInit(): void {
   this.inicializarFormularioFiltro();
   this.inicializarFormulario(); 
   this.getCargarCombos();
 }

 inicializarFormularioFiltro(){ 
    this.formParamsFiltro= new FormGroup({
      idUsuario : new FormControl('0'),
      fecha_ini : new FormControl(new Date()),
      fecha_fin : new FormControl(new Date()),
      idEstado : new FormControl('0')
     }) 
 }

 inicializarFormulario(){ 
    this.formParams= new FormGroup({
      id_actividad: new FormControl('0'), 
      ciclo: new FormControl(''),
      solicitante: new FormControl(''),
      duracion: new FormControl(''),
      fechaSolicitud: new FormControl( new Date()), 
      descripcionSolicitud: new FormControl(''),

      usuario_aprobador_actividad: new FormControl(''),
      aprobadorRechazador: new FormControl(''),
      fechaRespuesta: new FormControl( new Date()), 
      descripcionRespuesta: new FormControl(''), 
      descripcionEstado: new FormControl(''), 
    }) 
 }

 getCargarCombos(){ 
  this.spinner.show();
  combineLatest([  this.actividadService.get_usuarios(this.idUserGlobal), this.actividadService.get_ciclos() , this.actividadService.get_duracionActividades(),this.actividadService.get_estados()  ])
  .subscribe( ([ _usuarios, _ciclos, _duracionActividades,_estados ])=>{

    this.usuarios = _usuarios;
    this.ciclos = _ciclos;
    this.duracionActividades = _duracionActividades; 
    this.estados = _estados.filter((estado) => estado.grupo_estado ==='tbl_Actividades'); 

    this.formParamsFiltro.patchValue({ "idUsuario" : _usuarios[0].id_Usuario  });  

    this.spinner.hide(); 
  })
}

 mostrarInformacion(){

    if (this.formParamsFiltro.value.idUsuario == '-1' || this.formParamsFiltro.value.idUsuario == -1) {
    this.alertasService.Swal_alert('error','Por favor seleccione el usuario');
    return 
   }
   if (this.formParamsFiltro.value.fecha_ini == '' || this.formParamsFiltro.value.fecha_ini == null ) {
    this.alertasService.Swal_alert('error','Por favor seleccione la fecha inicial');
    return 
  } 
  if (this.formParamsFiltro.value.fecha_fin == '' || this.formParamsFiltro.value.fecha_fin == null ) {
    this.alertasService.Swal_alert('error','Por favor seleccione la fecha final');
    return 
  } 

  const fechaIni = this.funcionesglobalesService.formatoFecha(this.formParamsFiltro.value.fecha_ini);
  const fechaFin = this.funcionesglobalesService.formatoFecha(this.formParamsFiltro.value.fecha_fin);
 
  this.spinner.show();
  this.actividadService.get_mostrar_actividadAprobar( this.formParamsFiltro.value.idUsuario, fechaIni , fechaFin,  this.formParamsFiltro.value.idEstado)
      .subscribe((res:RespuestaServer)=>{  
          this.spinner.hide();
          if (res.ok==true) {        
              this.actividades = res.data; 
          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }
    })
 }   
  
 cerrarModal(){
    setTimeout(()=>{ // 
      $('#modal_mantenimiento').modal('hide');  
    },0); 
 } 

 async aprobarRechazar(opcion:string){ 

  if (this.formParams.value.id_actividad == '0' || this.formParams.value.id_actividad == null) {
    this.alertasService.Swal_alert('error','No se cargo el ID, por favor actualice la pagina..');
    return 
  }

  if (this.formParams.value.descripcionRespuesta == '' || this.formParams.value.descripcionRespuesta == null) {
    this.alertasService.Swal_alert('error','Por favor ingrese un mensaje de respuesta');
    return 
  }

  let mens = (opcion =='A') ? 'Esta seguro de Aprobar ?' : 'Esta seguro de Rechazar ?';

  this.alertasService.Swal_Question('Sistemas', mens)
  .then((result)=>{
    if(result.value){
      Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Actualizando, espere por favor'  })
      Swal.showLoading();
      this.actividadService.set_aprobarRechazar(this.formParams.value.id_actividad, this.formParams.value.descripcionRespuesta, opcion, this.idUserGlobal ).subscribe((res:RespuestaServer)=>{
        Swal.close(); 
        if (res.ok ==true) {  
          this.mostrarInformacion();
          this.alertasService.Swal_Success('Proceso realizado correctamente..');  
          this.cerrarModal();
        }else{
          this.alertasService.Swal_alert('error', JSON.stringify(res.data));
          alert(JSON.stringify(res.data));
        }
      })
    }
  }) 






 } 

 editar({ id_actividad, ciclo, solicitante, duracion, fechaSolicitud, descripcionSolicitud,usuario_aprobador_actividad, aprobadorRechazador, fechaRespuesta, descripcionRespuesta,id_estado, descripcionEstado }){

   this.flag_modoEdicion=true;   
   this.idEstadoGlobal =id_estado;
   this.descripcionEstadoGlobal = descripcionEstado;

   this.titulo = 'Aprobar o Rechazar';
   if (id_estado ==8) {
     this.titulo = 'Rechazada';
   }
   if (id_estado ==9) {
    this.titulo = 'Aprobada';
   }

   if (id_estado =='6' || id_estado =='7'  ) {  //----abiertas

    this.formParams.patchValue({ "id_actividad" : id_actividad,  "ciclo" : ciclo, "solicitante" : solicitante ,"duracion" : duracion , "fechaSolicitud" :  fechaSolicitud , "descripcionSolicitud" : descripcionSolicitud,  
    "usuario_aprobador_actividad" : this.idUserGlobal, "aprobadorRechazador" : this.idUsuarioLoggeadoGlobal,
    "fechaRespuesta" : new Date (),  "descripcionRespuesta" : '', "descripcionEstado" : descripcionEstado, "usuario_creacion" : this.idUserGlobal });

   } if (id_estado =='8' || id_estado =='9'  ) {  //---- cerradas

    this.formParams.patchValue({ "id_actividad" : id_actividad,  "ciclo" : ciclo, "solicitante" : solicitante ,"duracion" : duracion , "fechaSolicitud" : fechaSolicitud , "descripcionSolicitud" : descripcionSolicitud,  
    "usuario_aprobador_actividad" : usuario_aprobador_actividad,"aprobadorRechazador" : aprobadorRechazador,
    "fechaRespuesta" : fechaRespuesta ,  "descripcionRespuesta" : descripcionRespuesta, "descripcionEstado" : descripcionEstado, "usuario_creacion" : this.idUserGlobal });

   }

   setTimeout(()=>{ // 
    $('#modal_mantenimiento').modal('show');  
  },0);  

 } 

 anular(objBD:any){

   if (objBD.estado ===0 || objBD.estado =='0') {      
     return;      
   }

   this.alertasService.Swal_Question('Sistemas', 'Esta seguro de anular ?')
   .then((result)=>{
     if(result.value){

       Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
       Swal.showLoading();
       this.actividadService.set_anular_actividad(objBD.id_actividad).subscribe((res:RespuestaServer)=>{
         Swal.close();        
         if (res.ok ==true) { 
           
           for (const user of this.actividades) {
             if (user.id_actividad == objBD.id_actividad ) {
                 user.estado = 0;
                 user.descripcion_estado =  "INACTIVO" ;
                 break;
             }
           }
           this.alertasService.Swal_Success('Se anulo correctamente..')  

         }else{
           this.alertasService.Swal_alert('error', JSON.stringify(res.data));
           alert(JSON.stringify(res.data));
         }
       })
        
     }
   }) 

 }


}