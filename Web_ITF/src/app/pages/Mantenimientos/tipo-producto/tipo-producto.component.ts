
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertasService } from '../../../services/alertas/alertas.service';
import { RespuestaServer } from '../../../models/respuestaServer.models';
import { FuncionesglobalesService } from '../../../services/funciones/funcionesglobales.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../../../services/login/login.service';
import Swal from 'sweetalert2';
import { TipoProductoService } from '../../../services/Mantenimientos/tipo-producto.service';

declare var $:any;

@Component({
  selector: 'app-tipo-producto',
  templateUrl: './tipo-producto.component.html',
  styleUrls: ['./tipo-producto.component.css']
})
 
export class TipoProductoComponent implements OnInit {

  formParamsFiltro : FormGroup;
  formParams: FormGroup;

  idUserGlobal :number = 0;
  flag_modoEdicion :boolean =false;

  tipoProductos :any[]=[]; 
  filtrarMantenimiento = "";
 
  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService,private funcionGlobalServices : FuncionesglobalesService , private tipoProductoService : TipoProductoService ) {         
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
      id_Tipo_Producto: new FormControl('0'), 
      codigo_tipo_producto: new FormControl(''),
      descripcion_tipo_producto: new FormControl(''), 
      estado : new FormControl('1'),   
      usuario_creacion : new FormControl('')
    }) 
 }

 mostrarInformacion(){ 
      this.spinner.show();
      this.tipoProductoService.get_mostrar_tipoProducto(this.formParamsFiltro.value.idEstado)
          .subscribe((res:RespuestaServer)=>{  
              this.spinner.hide();
              if (res.ok==true) {        
                  this.tipoProductos = res.data; 
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

  // this.formParams.patchValue({ "estado" :  $('#cboEstado').val() });
  // console.log(this.formParams.value) 

  if ( this.flag_modoEdicion==true) { //// nuevo
     if (this.formParams.value.id_Tipo_Producto == '' || this.formParams.value.id_Tipo_Producto == 0) {
       this.alertasService.Swal_alert('error','No se cargó el id tipo Producto, por favor actulize su página');
       return 
     }   
  }

  if (this.formParams.value.codigo_tipo_producto == '' || this.formParams.value.codigo_tipo_producto == 0) {
    this.alertasService.Swal_alert('error','Por favor ingrese el codigo');
    return 
  }

  if (this.formParams.value.descripcion_tipo_producto == '' || this.formParams.value.descripcion_tipo_producto == 0) {
    this.alertasService.Swal_alert('error','Por favor ingrese la descripcion');
    return 
  } 
 
  this.formParams.patchValue({ "usuario_creacion" : this.idUserGlobal });


  if ( this.flag_modoEdicion==false) { //// nuevo  

     Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
     Swal.showLoading();

     const  cod  = await this.tipoProductoService.get_verificar_codigoTipoProducto(this.formParams.value.codigo_tipo_producto);
     if (cod) {
      Swal.close();
      this.alertasService.Swal_alert('error','El codigo ya se encuentra registrada, verifique..');
      return;
     }    

     const  desc  = await this.tipoProductoService.get_verificar_descripcionTipoProducto(this.formParams.value.descripcion_tipo_producto);
     if (desc) {
      Swal.close();
      this.alertasService.Swal_alert('error','El Tipo Producto ya se encuentra registrada, verifique..');
      return;
     }  
 

     this.tipoProductoService.set_save_tipoProducto(this.formParams.value).subscribe((res:RespuestaServer)=>{
       Swal.close();    
       if (res.ok ==true) {     
         this.flag_modoEdicion = true;
         this.formParams.patchValue({ "id_Tipo_Producto" : Number(res.data[0].id_Tipo_Producto) });
         console.log(res.data[0])
         this.tipoProductos.push(res.data[0]);
         this.alertasService.Swal_Success('Se agrego correctamente..');
       }else{
         this.alertasService.Swal_alert('error', JSON.stringify(res.data));
         alert(JSON.stringify(res.data));
       }
     })
     
   }else{ /// editar

     Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Actualizando, espere por favor'  })
     Swal.showLoading();
     this.tipoProductoService.set_edit_tipoProducto(this.formParams.value , this.formParams.value.id_Tipo_Producto).subscribe((res:RespuestaServer)=>{
       Swal.close(); 
       if (res.ok ==true) {  
         
         for (const obj of this.tipoProductos) {
           if (obj.id_Tipo_Producto == this.formParams.value.id_Tipo_Producto ) {
              obj.descripcion_tipo_producto= this.formParams.value.descripcion_tipo_producto ; 
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

 editar({ id_Tipo_Producto, codigo_tipo_producto, descripcion_tipo_producto, estado  }){
   this.flag_modoEdicion=true;
   this.formParams.patchValue({ "id_Tipo_Producto" : id_Tipo_Producto,  "codigo_tipo_producto" : codigo_tipo_producto ,"descripcion_tipo_producto" : descripcion_tipo_producto, "estado" : estado, "usuario_creacion" : this.idUserGlobal });
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
       this.tipoProductoService.set_anular_tipoProducto(objBD.id_Tipo_Producto).subscribe((res:RespuestaServer)=>{
         Swal.close();        
         if (res.ok ==true) { 
           
           for (const user of this.tipoProductos) {
             if (user.id_Tipo_Producto == objBD.id_Tipo_Producto ) {
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