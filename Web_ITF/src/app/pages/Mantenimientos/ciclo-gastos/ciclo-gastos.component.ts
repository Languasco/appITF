
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertasService } from '../../../services/alertas/alertas.service';
import { RespuestaServer } from '../../../models/respuestaServer.models';
import { FuncionesglobalesService } from '../../../services/funciones/funcionesglobales.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../../../services/login/login.service';
import Swal from 'sweetalert2';
import { CicloService } from '../../../services/Mantenimientos/ciclo.service';
import { combineLatest } from 'rxjs';
import { ActividadService } from '../../../services/Mantenimientos/actividad.service';
 

declare var $:any;

@Component({
  selector: 'app-ciclo',
  templateUrl: './ciclo-gastos.component.html',
  styleUrls: ['./ciclo-gastos.component.css']
})
 
export class CicloGastosComponent implements OnInit {

  formParamsFiltro : FormGroup;
  formParams: FormGroup;

  idUserGlobal :number = 0;
  flag_modoEdicion :boolean =false;
  idEstadoGlobal :number = 0;

  ciclos :any[]=[]; 
  estados :any[]=[]; 
  filtrarMantenimiento = "";
 
  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService,private funcionesglobalesService : FuncionesglobalesService, private cicloService :   CicloService, private actividadService : ActividadService ) {         
    this.idUserGlobal = this.loginService.get_idUsuario();
  }
 
 ngOnInit(): void {
   this.getCargarCombos();
   this.inicializarFormularioFiltro();
   this.inicializarFormulario(); 
 }

 inicializarFormularioFiltro(){ 
    this.formParamsFiltro= new FormGroup({
      ciclo : new FormControl(''),
      idEstado : new FormControl('0')
     }) 
 }

 inicializarFormulario(){ 
    this.formParams= new FormGroup({
      id_Ciclo: new FormControl('0'), 
      nombre_ciclo: new FormControl(''), 
      desde_ciclo: new FormControl(new Date()), 
      hasta_ciclo: new FormControl(new Date()), 
      estado : new FormControl('3'),   
      usuario_creacion : new FormControl('')
    }) 
 }

 getCargarCombos(){ 
  this.spinner.show();
  combineLatest([ this.actividadService.get_estados()  ])
  .subscribe( ([ _estados ])=>{
    this.estados = _estados.filter((estado) => estado.grupo_estado ==='tbl_Ciclos'); 
    this.spinner.hide(); 
  })
}

 mostrarInformacion(){ 
      this.spinner.show();
      this.cicloService.get_mostrar_cicloGasto(this.formParamsFiltro.value.idEstado)
          .subscribe((res:RespuestaServer)=>{             
              this.spinner.hide();
              if (res.ok==true) {        
                  this.ciclos = res.data; 
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
      $('#txtcodigo').removeClass('disabledForm');
      $('#modal_mantenimiento').modal('show');  
    },0); 
 } 

 async saveUpdate(){ 
  if ( this.flag_modoEdicion==true) { //// nuevo
     if (this.formParams.value.id_Ciclo == '' || this.formParams.value.id_Ciclo == 0) {
       this.alertasService.Swal_alert('error','No se cargó el id , por favor actulize su página');
       return 
     }   
  }
  if (this.formParams.value.nombre_ciclo == '' || this.formParams.value.nombre_ciclo == 0) {
    this.alertasService.Swal_alert('error','Por favor ingrese la descripcion del rol');
    return 
  } 
  if (this.formParams.value.desde_ciclo == '' || this.formParams.value.desde_ciclo == null) {
    this.alertasService.Swal_alert('error','Por favor ingrese la fecha inicial');
    return 
  } 
  if (this.formParams.value.hasta_ciclo == '' || this.formParams.value.hasta_ciclo == null) {
    this.alertasService.Swal_alert('error','Por favor ingrese la fecha final');
    return 
  } 
 
  this.formParams.patchValue({ "usuario_creacion" : this.idUserGlobal });

  if ( this.flag_modoEdicion==false) { //// nuevo  

     Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
     Swal.showLoading();
     this.cicloService.set_save_cicloGasto(this.formParams.value).subscribe((res:RespuestaServer)=>{
       Swal.close();    
       if (res.ok ==true) {     
         this.flag_modoEdicion = true;
         this.formParams.patchValue({ "id_Ciclo" : Number(res.data[0].id_Ciclo) });
         console.log(res.data[0])
         this.ciclos.push(res.data[0]);
         this.cerrarModal();
         this.alertasService.Swal_Success('Se agrego correctamente..');

       }else{
         this.alertasService.Swal_alert('error', JSON.stringify(res.data));
         alert(JSON.stringify(res.data));
       }
     })
     
   }else{ /// editar

    if (this.idEstadoGlobal != this.formParams.value.estado ) {
      if (this.formParams.value.estado == 4 ){
        const  estadoProc  = await this.cicloService.get_verificar_estadoProcesoGasto(this.formParams.value.estado);
        if (estadoProc) {
         Swal.close();
         this.alertasService.Swal_alert('error','Existe actualmente un ciclo en Proceso, verifique..');
         return;
        }          
     }
    }

     Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Actualizando, espere por favor'  })
     Swal.showLoading();
     this.cicloService.set_edit_cicloGasto(this.formParams.value , this.formParams.value.id_Ciclo).subscribe((res:RespuestaServer)=>{
       Swal.close(); 
       if (res.ok ==true) {  

        const { descripcion_estado } =  this.estados.find((estado)=> estado.id_Estado ==  this.formParams.value.estado );        

         for (const obj of this.ciclos) {
           if (obj.id_Ciclo == this.formParams.value.id_Ciclo ) {
              obj.nombre_ciclo= this.formParams.value.nombre_ciclo ; 
              obj.desde_ciclo= this.formParams.value.desde_ciclo ; 
              obj.hasta_ciclo= this.formParams.value.hasta_ciclo ; 
              obj.estado= this.formParams.value.estado ;
              obj.descripcion_estado = descripcion_estado ;
              break;
           }
         }
         this.cerrarModal();
         this.alertasService.Swal_Success('Se actualizó correctamente..');  
       }else{
         this.alertasService.Swal_alert('error', JSON.stringify(res.data));
         alert(JSON.stringify(res.data));
       }
     })
   }

 } 

 editar({ id_Ciclo, nombre_ciclo, desde_ciclo, hasta_ciclo, estado }){

   this.flag_modoEdicion=true;
   this.idEstadoGlobal=estado;

   this.formParams.patchValue({ "id_Ciclo" : id_Ciclo ,"nombre_ciclo" : nombre_ciclo, "desde_ciclo" : new Date(desde_ciclo), "hasta_ciclo" : new Date(hasta_ciclo) , "estado" : estado, "usuario_creacion" : this.idUserGlobal });

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
       this.cicloService.set_anular_ciclo(objBD.id_Ciclo).subscribe((res:RespuestaServer)=>{
         Swal.close();        
         if (res.ok ==true) { 
           
           for (const user of this.ciclos) {
             if (user.id_Ciclo == objBD.id_Ciclo ) {
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