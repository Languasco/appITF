
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertasService } from '../../../services/alertas/alertas.service';
import { RespuestaServer } from '../../../models/respuestaServer.models';
import { FuncionesglobalesService } from '../../../services/funciones/funcionesglobales.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../../../services/login/login.service';
import Swal from 'sweetalert2';
import { combineLatest } from 'rxjs';
import { TipoProductoService } from '../../../services/Mantenimientos/tipo-producto.service';
import { ProductoService } from '../../../services/Mantenimientos/producto.service';

declare var $:any;

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
 
export class ProductosComponent implements OnInit {

  formParamsFiltro : FormGroup;
  formParams: FormGroup;

  idUserGlobal :number = 0;
  flag_modoEdicion :boolean =false;

  productos :any[]=[]; 
  tipoProductos :any[]=[]; 
  stocks :any[]=[]; 
  filtrarMantenimiento = "";
 
  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService,private funcionGlobalServices : FuncionesglobalesService,private productoService : ProductoService ,private tipoProductoService : TipoProductoService ) {         
    this.idUserGlobal = this.loginService.get_idUsuario();
  }
 
 ngOnInit(): void {
   this.inicializarFormularioFiltro();
   this.inicializarFormulario(); 
   this.getCargarCombos()
 }

 getCargarCombos(){ 
  this.spinner.show();
  combineLatest([  this.tipoProductoService.get_tipoProducto(), this.productoService.get_controlStock() ]).subscribe( ([ _tipoProductos, _stocks ])=>{
    this.tipoProductos = _tipoProductos;
    this.stocks = _stocks;
    this.spinner.hide(); 
  })
}

 inicializarFormularioFiltro(){ 
    this.formParamsFiltro= new FormGroup({
      Producto : new FormControl(''),
      TipoProducto : new FormControl('0'),
      idEstado : new FormControl('1')
     }) 
 }

 inicializarFormulario(){ 
    this.formParams= new FormGroup({
      id_Producto: new FormControl('0'), 
      codigo_producto: new FormControl(''),
      descripcion_producto: new FormControl(''), 
      id_Tipo_Produto: new FormControl('0'), 
      abreviatura_producto: new FormControl(''), 
      id_Control_Stock : new FormControl('0'), 
      estado : new FormControl('1'),   
      usuario_creacion : new FormControl('')
    }) 
 }

 mostrarInformacion(){ 
      this.spinner.show();
      this.productoService.get_mostrar_producto(this.formParamsFiltro.value)
          .subscribe((res:RespuestaServer)=>{  
              this.spinner.hide();
              if (res.ok==true) {        
                  this.productos = res.data; 
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
     if (this.formParams.value.id_Producto == '' || this.formParams.value.id_Producto == 0) {
       this.alertasService.Swal_alert('error','No se cargó el id Producto, por favor actulize su página');
       return 
     }   
  }

  if (this.formParams.value.codigo_producto == '' || this.formParams.value.codigo_producto == 0) {
    this.alertasService.Swal_alert('error','Por favor ingrese el codigo');
    return 
  }

  if (this.formParams.value.descripcion_producto == '' || this.formParams.value.descripcion_producto == 0) {
    this.alertasService.Swal_alert('error','Por favor ingrese la descripcion');
    return 
  } 

  if (this.formParams.value.id_Tipo_Produto == '' || this.formParams.value.id_Tipo_Produto == 0) {
    this.alertasService.Swal_alert('error','Por favor seleccione el Tipo de Producto');
    return 
  }   
 
  this.formParams.patchValue({ "usuario_creacion" : this.idUserGlobal });


  if ( this.flag_modoEdicion==false) { //// nuevo  

     Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
     Swal.showLoading();

     const  cod  = await this.productoService.get_verificar_codigoProd(this.formParams.value.codigo_producto);
     if (cod) {
      Swal.close();
      this.alertasService.Swal_alert('error','El codigo ya se encuentra registrada, verifique..');
      return;
     }    
     this.productoService.set_save_producto(this.formParams.value).subscribe((res:RespuestaServer)=>{
       Swal.close();    
       if (res.ok ==true) {     
         this.flag_modoEdicion = true;
         this.formParams.patchValue({ "id_Producto" : Number(res.data[0].id_Producto) });
         console.log(res.data[0])
         this.productos.push(res.data[0]);
         this.alertasService.Swal_Success('Se agrego correctamente..');
       }else{
         this.alertasService.Swal_alert('error', JSON.stringify(res.data));
         alert(JSON.stringify(res.data));
       }
     })
     
   }else{ /// editar

     Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Actualizando, espere por favor'  })
     Swal.showLoading();
     this.productoService.set_edit_producto(this.formParams.value , this.formParams.value.id_Producto).subscribe((res:RespuestaServer)=>{
       Swal.close(); 
       if (res.ok ==true) {  
         
        const {codigo_tipo_producto} = this.tipoProductos.find((tipo)=> tipo.id_Tipo_Producto == this.formParams.value.id_Tipo_Produto );

         for (const obj of this.productos) {
           if (obj.id_Producto == this.formParams.value.id_Producto ) {
              obj.descripcion_producto= this.formParams.value.descripcion_producto ; 
              obj.id_Tipo_Produto= this.formParams.value.id_Tipo_Produto ; 
              obj.descripcionTipoProducto= codigo_tipo_producto;
              obj.abreviatura_producto= this.formParams.value.abreviatura_producto ; 
              obj.estado= this.formParams.value.estado ;
              obj.id_Control_Stock= this.formParams.value.id_Control_Stock ;
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

 editar({ id_Producto, codigo_producto, descripcion_producto, id_Tipo_Produto, abreviatura_producto,  estado, id_Control_Stock  }){
   this.flag_modoEdicion=true;
   this.formParams.patchValue({ "id_Producto" : id_Producto,  "codigo_producto" : codigo_producto ,"descripcion_producto" : descripcion_producto,  "id_Tipo_Produto" : id_Tipo_Produto, "abreviatura_producto" : abreviatura_producto, "estado" : estado, "id_Control_Stock" : id_Control_Stock, "usuario_creacion" : this.idUserGlobal });
  
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
       this.productoService.set_anular_producto(objBD.id_Producto).subscribe((res:RespuestaServer)=>{
         Swal.close();        
         if (res.ok ==true) { 
           
           for (const user of this.productos) {
             if (user.id_Producto == objBD.id_Producto ) {
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
