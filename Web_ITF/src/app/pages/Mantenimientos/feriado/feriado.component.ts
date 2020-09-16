
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertasService } from '../../../services/alertas/alertas.service';
import { RespuestaServer } from '../../../models/respuestaServer.models';
import { FuncionesglobalesService } from '../../../services/funciones/funcionesglobales.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../../../services/login/login.service';
import Swal from 'sweetalert2';
import { UploadService } from '../../../services/Upload/upload.service';
import { FeriadoService } from '../../../services/Mantenimientos/feriado.service';

declare var $:any;
@Component({
  selector: 'app-feriado',
  templateUrl: './feriado.component.html',
  styleUrls: ['./feriado.component.css']
})

export class FeriadoComponent implements OnInit {

  formParamsFiltro : FormGroup;
  formParams: FormGroup;

  idUserGlobal :number = 0;
  flag_modoEdicion :boolean =false;

  feriados :any[]=[]; 
  filtrarMantenimiento = "";
 
  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService,private funcionGlobalServices : FuncionesglobalesService, private funcionesglobalesService : FuncionesglobalesService, private feriadoService : FeriadoService , private uploadService : UploadService ) {         
    this.idUserGlobal = this.loginService.get_idUsuario();
  }
 
 ngOnInit(): void {
   this.inicializarFormularioFiltro();
   this.inicializarFormulario(); 
 }

 inicializarFormularioFiltro(){ 
    this.formParamsFiltro= new FormGroup({
      idEstado : new FormControl('1')
     }) 
 }

 inicializarFormulario(){ 
    this.formParams= new FormGroup({
      id_Feriado: new FormControl('0'), 
      fecha_feriado: new FormControl(new Date()),
      descripcion_feriado: new FormControl(''), 
      estado : new FormControl('1'),   
      usuario_creacion : new FormControl('')
    }) 
 }

 mostrarInformacion(){
 
      this.spinner.show();
      this.feriadoService.get_mostrar_feriado(this.formParamsFiltro.value.idEstado)
          .subscribe((res:RespuestaServer)=>{  
              this.spinner.hide();
              if (res.ok==true) {        
                  this.feriados = res.data; 
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
      $('#dtp_feriado').removeClass('disabledForm');
      $('#modal_mantenimiento').modal('show');  
    },0); 
 } 

 async saveUpdate(){ 
  if ( this.flag_modoEdicion==true) { //// nuevo
     if (this.formParams.value.id_Feriado == '' || this.formParams.value.id_Feriado == 0) {
       this.alertasService.Swal_alert('error','No se cargó el id rol, por favor actulize su página');
       return 
     }   
  }

  if (this.formParams.value.fecha_feriado == '' || this.formParams.value.fecha_feriado == 0) {
    this.alertasService.Swal_alert('error','Por favor seleccione la fecha del feriado');
    return 
  }

  if (this.formParams.value.descripcion_feriado == '' || this.formParams.value.descripcion_feriado == 0) {
    this.alertasService.Swal_alert('error','Por favor ingrese la descripcion del Feriado');
    return 
  } 
 
  this.formParams.patchValue({ "usuario_creacion" : this.idUserGlobal });


  if ( this.flag_modoEdicion==false) { //// nuevo  

     Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
     Swal.showLoading();

     const  descFeriado  = await this.feriadoService.get_verificar_feriado(this.formParams.value.descripcion_feriado);
     if (descFeriado) {
      Swal.close();
      this.alertasService.Swal_alert('error','El la descripcion del Feriado ya se encuentra registrada, verifique..');
      return;
     }   

     this.feriadoService.set_save_feriado(this.formParams.value).subscribe((res:RespuestaServer)=>{
       Swal.close();    
       if (res.ok ==true) {     
         this.flag_modoEdicion = true;
         this.formParams.patchValue({ "id_Feriado" : Number(res.data[0]) });
         this.mostrarInformacion();
         this.alertasService.Swal_Success('Se agrego correctamente..');
       }else{
         this.alertasService.Swal_alert('error', JSON.stringify(res.data));
         alert(JSON.stringify(res.data));
       }
     })
     
   }else{ /// editar

     Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Actualizando, espere por favor'  })
     Swal.showLoading();
     this.feriadoService.set_edit_feriado(this.formParams.value , this.formParams.value.id_Feriado).subscribe((res:RespuestaServer)=>{
       Swal.close(); 
       if (res.ok ==true) {           

         for (const obj of this.feriados) {
           if (obj.id_Feriado == this.formParams.value.id_Feriado ) {
              obj.descripcion_feriado= this.formParams.value.descripcion_feriado ; 
              obj.estado= this.formParams.value.estado ;
              obj.descripcion_estado = this.formParams.value.estado == 0 ? "INACTIVO" : "ACTIVO";  
              break;
           }
         }

         this.alertasService.Swal_Success('Se actualizó correctamente..');  
       }else{
         this.alertasService.Swal_alert('error', JSON.stringify(res.data));
         alert(JSON.stringify(res.data));
       }
     })
   }

 } 

 editar({  id_Feriado, fecha_feriado, descripcion_feriado, estado }){
   this.flag_modoEdicion=true;
   this.formParams.patchValue({ "id_Feriado" : id_Feriado,  "fecha_feriado" : new Date(fecha_feriado) ,"descripcion_feriado" : descripcion_feriado, "estado" : estado, "usuario_creacion" : this.idUserGlobal });
   setTimeout(()=>{ // 
    $('#dtp_feriado').addClass('disabledForm');
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
       this.feriadoService.set_anular_feriado(objBD.id_Feriado).subscribe((res:RespuestaServer)=>{
         Swal.close();        
         if (res.ok ==true) { 
           
           for (const user of this.feriados) {
             if (user.id_Feriado == objBD.id_Feriado ) {
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