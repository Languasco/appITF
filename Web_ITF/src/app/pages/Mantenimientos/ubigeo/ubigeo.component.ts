
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertasService } from '../../../services/alertas/alertas.service';
import { RespuestaServer } from '../../../models/respuestaServer.models';
import { FuncionesglobalesService } from '../../../services/funciones/funcionesglobales.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../../../services/login/login.service';
import Swal from 'sweetalert2';
import { UploadService } from '../../../services/Upload/upload.service';
import { ProfileService } from '../../../services/Mantenimientos/profile.service';

declare var $:any;
@Component({
  selector: 'app-ubigeo',
  templateUrl: './ubigeo.component.html',
  styleUrls: ['./ubigeo.component.css']
})
 
export class UbigeoComponent implements OnInit {

  formParamsFiltro : FormGroup;
  formParams: FormGroup;

  idUserGlobal :number = 0;
  flag_modoEdicion :boolean =false;

  roles :any[]=[]; 
  filtrarMantenimiento = "";

  tabControlDetalle: string[] = ['DEPARTAMENTO','PROVINCIA','DISTRITO' ]; 
  selectedTabControlDetalle :any;

  idDepartamento_Global = 1;
  idProvincia_Global = 1;
 
  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService,private funcionGlobalServices : FuncionesglobalesService, private funcionesglobalesService : FuncionesglobalesService, private profileService : ProfileService , private uploadService : UploadService ) {         
    this.idUserGlobal = this.loginService.get_idUsuario();
  }
 
 ngOnInit(): void {
  this.selectedTabControlDetalle = this.tabControlDetalle[0];
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
      id_perfil: new FormControl('0'), 
      codigo_perfil: new FormControl(''),
      descripcion_perfil: new FormControl(''), 
      estado : new FormControl('1'),   
      usuario_creacion : new FormControl('')
    }) 
 }

 mostrarInformacion(){
 
      this.spinner.show();
      this.profileService.get_mostrar_roles(this.formParamsFiltro.value.idEstado)
          .subscribe((res:RespuestaServer)=>{  
              this.spinner.hide();
              if (res.ok==true) {        
                  this.roles = res.data; 
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
      // $('#cboEstado').val(0).trigger('change.select2');
    },0); 
 } 

 async saveUpdate(){ 

  if ( this.flag_modoEdicion==true) { //// nuevo
     if (this.formParams.value.id_perfil == '' || this.formParams.value.id_perfil == 0) {
       this.alertasService.Swal_alert('error','No se cargó el id rol, por favor actulize su página');
       return 
     }   
  }

  if (this.formParams.value.codigo_perfil == '' || this.formParams.value.codigo_perfil == 0) {
    this.alertasService.Swal_alert('error','Por favor ingrese el codigo del rol');
    return 
  }

  if (this.formParams.value.descripcion_perfil == '' || this.formParams.value.descripcion_perfil == 0) {
    this.alertasService.Swal_alert('error','Por favor ingrese la descripcion del rol');
    return 
  } 
 
  this.formParams.patchValue({ "usuario_creacion" : this.idUserGlobal });


  if ( this.flag_modoEdicion==false) { //// nuevo  

     Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
     Swal.showLoading();

     const  codRol  = await this.profileService.get_verificar_codigoRol(this.formParams.value.codigo_perfil);
     if (codRol) {
      Swal.close();
      this.alertasService.Swal_alert('error','El codigo ya se encuentra registrada, verifique..');
      return;
     }    

     const  descRol  = await this.profileService.get_verificar_descripcionRol(this.formParams.value.descripcion_perfil);
     if (descRol) {
      Swal.close();
      this.alertasService.Swal_alert('error','El Rol ya se encuentra registrada, verifique..');
      return;
     }  
 

     this.profileService.set_save_roles(this.formParams.value).subscribe((res:RespuestaServer)=>{
       Swal.close();    
       if (res.ok ==true) {     
         this.flag_modoEdicion = true;
         this.formParams.patchValue({ "id_perfil" : Number(res.data[0].id_perfil) });
         console.log(res.data[0])
         this.roles.push(res.data[0]);
         this.alertasService.Swal_Success('Se agrego correctamente..');
       }else{
         this.alertasService.Swal_alert('error', JSON.stringify(res.data));
         alert(JSON.stringify(res.data));
       }
     })
     
   }else{ /// editar

     Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Actualizando, espere por favor'  })
     Swal.showLoading();
     this.profileService.set_edit_roles(this.formParams.value , this.formParams.value.id_perfil).subscribe((res:RespuestaServer)=>{
       Swal.close(); 
       if (res.ok ==true) {  
         

         for (const obj of this.roles) {
           if (obj.id_perfil == this.formParams.value.id_perfil ) {
              obj.descripcion_perfil= this.formParams.value.descripcion_perfil ; 
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

 editar({ id_perfil, codigo_perfil, descripcion_perfil, estado  }){
   this.flag_modoEdicion=true;
   this.formParams.patchValue({ "id_perfil" : id_perfil,  "codigo_perfil" : codigo_perfil ,"descripcion_perfil" : descripcion_perfil, "estado" : estado, "usuario_creacion" : this.idUserGlobal });
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
       this.profileService.set_anular_roles(objBD.id_perfil).subscribe((res:RespuestaServer)=>{
         Swal.close();        
         if (res.ok ==true) { 
           
           for (const user of this.roles) {
             if (user.id_perfil == objBD.id_perfil ) {
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


//  -----  PROVINCIA

cerrarModal_provincia(){
  setTimeout(()=>{ // 
    $('#modal_provincia').modal('hide');  
  },0); 
}







//  -----  DISTRITO

cerrarModal_distrito(){
  setTimeout(()=>{ // 
    $('#modal_distrito').modal('hide');  
  },0); 
}



}