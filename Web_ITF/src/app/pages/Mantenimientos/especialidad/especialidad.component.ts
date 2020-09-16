
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertasService } from '../../../services/alertas/alertas.service';
import { RespuestaServer } from '../../../models/respuestaServer.models';
import { FuncionesglobalesService } from '../../../services/funciones/funcionesglobales.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../../../services/login/login.service';
import Swal from 'sweetalert2';
import { UploadService } from '../../../services/Upload/upload.service';
import { EspecialidadService } from '../../../services/Mantenimientos/especialidad.service';
 

declare var $:any;

@Component({
  selector: 'app-especialidad',
  templateUrl: './especialidad.component.html',
  styleUrls: ['./especialidad.component.css']
})
 
export class EspecialidadComponent implements OnInit {

  formParamsFiltro : FormGroup;
  formParams: FormGroup;

  idUserGlobal :number = 0;
  flag_modoEdicion :boolean =false;

  especialidades :any[]=[]; 
  filtrarMantenimiento = "";
 
  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService,private funcionGlobalServices : FuncionesglobalesService, private funcionesglobalesService : FuncionesglobalesService, private especialidadService : EspecialidadService , private uploadService : UploadService ) {         
    this.idUserGlobal = this.loginService.get_idUsuario();
  }
 
 ngOnInit(): void {
   this.inicializarFormularioFiltro();
   this.inicializarFormulario(); 
  //  $('.selectFiltros').select2({
  //   dropdownParent: $('#modal_mantenimiento')
  //  }); //initialize 
 }

 inicializarFormularioFiltro(){ 
    this.formParamsFiltro= new FormGroup({
      idEstado : new FormControl('1')
     }) 
 }

 inicializarFormulario(){ 
    this.formParams= new FormGroup({
      id_Especialidad: new FormControl('0'), 
      codigo_especialidad: new FormControl(''),
      descripcion_especialidad: new FormControl(''), 
      estado : new FormControl('1'),   
      usuario_creacion : new FormControl('')
    }) 
 }

 mostrarInformacion(){
 
      this.spinner.show();
      this.especialidadService.get_mostrar_especialidad(this.formParamsFiltro.value.idEstado)
          .subscribe((res:RespuestaServer)=>{  
              this.spinner.hide();
              if (res.ok==true) {        
                  this.especialidades = res.data; 
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
     if (this.formParams.value.id_Especialidad == '' || this.formParams.value.id_Especialidad == 0) {
       this.alertasService.Swal_alert('error','No se cargó el id de la Especialidad, por favor actulize su página');
       return 
     }   
  }

  if (this.formParams.value.codigo_especialidad == '' || this.formParams.value.codigo_especialidad == 0) {
    this.alertasService.Swal_alert('error','Por favor ingrese el codigo de la Especialidad');
    return 
  }

  if (this.formParams.value.descripcion_especialidad == '' || this.formParams.value.descripcion_especialidad == 0) {
    this.alertasService.Swal_alert('error','Por favor ingrese la descripcion de la especialidad');
    return 
  } 
 
  this.formParams.patchValue({ "usuario_creacion" : this.idUserGlobal });


  if ( this.flag_modoEdicion==false) { //// nuevo  

     Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
     Swal.showLoading();

     const  codEsp  = await this.especialidadService.get_verificar_codigoespecialidad(this.formParams.value.codigo_especialidad);
     if (codEsp) {
      Swal.close();
      this.alertasService.Swal_alert('error','El codigo ya se encuentra registrada, verifique..');
      return;
     }    

     const  descEsp  = await this.especialidadService.get_verificar_descripcionespecialidad(this.formParams.value.descripcion_especialidad);
     if (descEsp) {
      Swal.close();
      this.alertasService.Swal_alert('error','La especialidad ya se encuentra registrada, verifique..');
      return;
     }  
 

     this.especialidadService.set_save_especialidad(this.formParams.value).subscribe((res:RespuestaServer)=>{
       Swal.close();    
       if (res.ok ==true) {     
         this.flag_modoEdicion = true;
         this.formParams.patchValue({ "id_Especialidad" : Number(res.data[0].id_Especialidad) });
         console.log(res.data[0])
         this.especialidades.push(res.data[0]);
         this.alertasService.Swal_Success('Se agrego correctamente..');
       }else{
         this.alertasService.Swal_alert('error', JSON.stringify(res.data));
         alert(JSON.stringify(res.data));
       }
     })
     
   }else{ /// editar

     Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Actualizando, espere por favor'  })
     Swal.showLoading();
     this.especialidadService.set_edit_especialidad(this.formParams.value , this.formParams.value.id_Especialidad).subscribe((res:RespuestaServer)=>{
       Swal.close(); 
       if (res.ok ==true) {           

         for (const obj of this.especialidades) {
           if (obj.id_Especialidad == this.formParams.value.id_Especialidad ) { 
              obj.descripcion_especialidad= this.formParams.value.descripcion_especialidad; 
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

 editar({ id_Especialidad, codigo_especialidad, descripcion_especialidad, estado  }){
   this.flag_modoEdicion=true;
   this.formParams.patchValue({ "id_Especialidad" : id_Especialidad,  "codigo_especialidad" : codigo_especialidad ,"descripcion_especialidad" : descripcion_especialidad, "estado" : estado, "usuario_creacion" : this.idUserGlobal });
   setTimeout(()=>{ // 
    $('#txtcodigo').addClass('disabledForm');
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
       this.especialidadService.set_anular_especialidad(objBD.id_Especialidad).subscribe((res:RespuestaServer)=>{
         Swal.close();        
         if (res.ok ==true) { 
           
           for (const user of this.especialidades) {
             if (user.id_Especialidad == objBD.id_Especialidad ) {
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