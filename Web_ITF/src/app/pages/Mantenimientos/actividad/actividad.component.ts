
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

declare var $:any;

@Component({
  selector: 'app-actividad',
  templateUrl: './actividad.component.html',
  styleUrls: ['./actividad.component.css']
})
 

export class ActividadComponent implements OnInit {

  formParamsFiltro : FormGroup;
  formParams: FormGroup;

  idUserGlobal :number = 0;
  flag_modoEdicion :boolean =false;

  actividades :any[]=[]; 
  filtrarMantenimiento = "";

  usuarios :any[]=[]; 
  ciclos :any[]=[]; 
  ciclosM :any[]=[]; 

  duracionActividades :any[]=[]; 
  estados :any[]=[]; 
  estadosMant :any[]=[]; 
 
  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService, private funcionesglobalesService : FuncionesglobalesService, private actividadService : ActividadService ) {         
    this.idUserGlobal = this.loginService.get_idUsuario();
  }
 
 ngOnInit(): void {
   this.inicializarFormularioFiltro();
   this.inicializarFormulario(); 
   this.getCargarCombos();
 }

 inicializarFormularioFiltro(){ 
    this.formParamsFiltro= new FormGroup({
      idUsuario : new FormControl('0'),
      idCiclo : new FormControl('0'),
      idEstado : new FormControl('0')
     }) 
 }

 inicializarFormulario(){ 
    this.formParams= new FormGroup({
      id_actividad: new FormControl('0'), 
      id_Ciclo: new FormControl('0'),
      fecha_actividad: new FormControl( new Date()), 
      id_Duracion: new FormControl('0'), 
      detalle_actividad: new FormControl(''), 
      estado : new FormControl('7'),   
      usuario_creacion : new FormControl('')
    }) 
 }

 getCargarCombos(){ 
  this.spinner.show();
  combineLatest([  this.actividadService.get_usuarios(this.idUserGlobal), this.actividadService.get_ciclos() , this.actividadService.get_duracionActividades(),this.actividadService.get_estados()  ])
  .subscribe( ([ _usuarios, _ciclos, _duracionActividades,_estados ])=>{

    this.usuarios = _usuarios;
    this.ciclos = _ciclos;
    this.ciclosM = _ciclos.filter((c) => c.estado == '4' ) ;

    this.duracionActividades = _duracionActividades; 
    this.estados = _estados.filter((estado) => estado.grupo_estado =='tbl_Actividades');  
    this.estadosMant =  this.estados.filter((estado) => (estado.id_Estado =='6' || estado.id_Estado =='7') ); 
    this.spinner.hide(); 
  })
}


 mostrarInformacion(){

  if (this.formParamsFiltro.value.idUsuario == '' || this.formParamsFiltro.value.idUsuario == 0) {
    this.alertasService.Swal_alert('error','Por favor seleccione el usuario');
    return 
  }
  if (this.formParamsFiltro.value.idCiclo == '' || this.formParamsFiltro.value.idCiclo == 0) {
    this.alertasService.Swal_alert('error','Por favor seleccione el ciclo');
    return 
  }
 
    this.spinner.show();
    this.actividadService.get_mostrar_actividad( this.formParamsFiltro.value.idUsuario, this.formParamsFiltro.value.idCiclo,  this.formParamsFiltro.value.idEstado)
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

 nuevo(){
    this.flag_modoEdicion = false;
    this.inicializarFormulario();  
    setTimeout(()=>{ // 
      $('#modal_mantenimiento').modal('show');  
    },0); 
 } 

 async saveUpdate(){ 

  if ( this.flag_modoEdicion==true) { //// nuevo
     if (this.formParams.value.id_actividad == '' || this.formParams.value.id_actividad == 0) {
       this.alertasService.Swal_alert('error','No se cargó el id, por favor actulize su página');
       return 
     }   
  }

  if (this.formParams.value.id_Ciclo == '' || this.formParams.value.id_Ciclo == 0) {
    this.alertasService.Swal_alert('error','Por favor seleccione el ciclo');
    return 

  }

  if (this.formParams.value.fecha_actividad == '' || this.formParams.value.fecha_actividad == 0) {
    this.alertasService.Swal_alert('error','Por favor ingrese o seleccione la fecha');
    return 
  } 

  
  if (this.formParams.value.id_Duracion == '' || this.formParams.value.id_Duracion == 0) {
    this.alertasService.Swal_alert('error','Por favor seleccione la duración');
    return 
  }
 
  this.formParams.patchValue({ "usuario_creacion" : this.idUserGlobal });


  if ( this.flag_modoEdicion==false) { //// nuevo  

     Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
     Swal.showLoading();

     this.actividadService.set_save_actividad(this.formParams.value).subscribe((res:RespuestaServer)=>{
       Swal.close();    
       if (res.ok ==true) {     
         this.flag_modoEdicion = true;
         this.formParams.patchValue({ "id_actividad" : Number(res.data) });

         this.mostrarInformacion();
         this.cerrarModal();
         this.alertasService.Swal_Success('Se agrego correctamente..');

       }else{
         this.alertasService.Swal_alert('error', JSON.stringify(res.data));
         alert(JSON.stringify(res.data));
       }
     })
     
   }else{ /// editar

     Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Actualizando, espere por favor'  })
     Swal.showLoading();
     this.actividadService.set_edit_actividad(this.formParams.value , this.formParams.value.id_actividad).subscribe((res:RespuestaServer)=>{
       Swal.close(); 
       if (res.ok ==true) {  
         
          const { descripcion_estado } =  this.estados.find((estado)=> estado.id_Estado ==  this.formParams.value.estado );

          for (const obj of this.actividades) {
           if (obj.id_actividad == this.formParams.value.id_actividad ) {

              obj.id_Ciclo= this.formParams.value.id_Ciclo ; 
              obj.fecha_actividad= this.formParams.value.fecha_actividad ; 
              obj.id_Duracion= this.formParams.value.id_Duracion ; 
              obj.detalle_actividad= this.formParams.value.detalle_actividad ; 
              obj.estado= this.formParams.value.estado ;
              obj.descripcion_estado = descripcion_estado;
              break;
           }
         }

         this.alertasService.Swal_Success('Se actualizó correctamente..');  

         this.cerrarModal();

       }else{
         this.alertasService.Swal_alert('error', JSON.stringify(res.data));
         alert(JSON.stringify(res.data));
       }
     })
   }

 } 

 editar({ id_actividad, id_Ciclo, fecha_actividad, id_Duracion, detalle_actividad, estado  }){

   this.flag_modoEdicion=true;   
   this.formParams.patchValue({ "id_actividad" : id_actividad,  "id_Ciclo" : id_Ciclo ,"fecha_actividad" : new Date (fecha_actividad), "id_Duracion" : id_Duracion,"detalle_actividad" : detalle_actividad, "estado" : estado, "usuario_creacion" : this.idUserGlobal });

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
