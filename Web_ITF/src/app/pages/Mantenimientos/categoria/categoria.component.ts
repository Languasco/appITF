
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertasService } from '../../../services/alertas/alertas.service';
import { RespuestaServer } from '../../../models/respuestaServer.models';
import { FuncionesglobalesService } from '../../../services/funciones/funcionesglobales.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../../../services/login/login.service';
import Swal from 'sweetalert2';
import { UploadService } from '../../../services/Upload/upload.service';
import { CategoriaService } from '../../../services/Mantenimientos/categoria.service';

declare var $:any;

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
}) 

export class CategoriaComponent implements OnInit {

  formParamsFiltro : FormGroup;
  formParams: FormGroup;

  idUserGlobal :number = 0;
  flag_modoEdicion :boolean =false;

  categorias :any[]=[]; 
  filtrarMantenimiento = "";
 
  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService,private funcionGlobalServices : FuncionesglobalesService, private funcionesglobalesService : FuncionesglobalesService, private categoriaService : CategoriaService , private uploadService : UploadService ) {         
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
      id_Categoria: new FormControl('0'), 
      codigo_categoria: new FormControl(''),
      descripcion_categoria: new FormControl(''), 
      estado : new FormControl('1'),   
      usuario_creacion : new FormControl('')
    }) 
 }

 mostrarInformacion(){ 
      this.spinner.show();
      this.categoriaService.get_mostrar_categoria(this.formParamsFiltro.value.idEstado)
          .subscribe((res:RespuestaServer)=>{  
              this.spinner.hide();
              if (res.ok==true) {        
                  this.categorias = res.data; 
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
     if (this.formParams.value.id_Categoria == '' || this.formParams.value.id_Categoria == 0) {
       this.alertasService.Swal_alert('error','No se cargó el id de la categoria, por favor actulize su página');
       return 
     }   
  }

  if (this.formParams.value.codigo_categoria == '' || this.formParams.value.codigo_categoria == 0) {
    this.alertasService.Swal_alert('error','Por favor ingrese el codigo de la categoria');
    return 
  }

  if (this.formParams.value.descripcion_categoria == '' || this.formParams.value.descripcion_categoria == 0) {
    this.alertasService.Swal_alert('error','Por favor ingrese la descripcion de la categoria');
    return 
  } 
 
  this.formParams.patchValue({ "usuario_creacion" : this.idUserGlobal });


  if ( this.flag_modoEdicion==false) { //// nuevo  

     Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
     Swal.showLoading();

     const  codCat  = await this.categoriaService.get_verificar_codigoCategoria(this.formParams.value.codigo_categoria);
     if (codCat) {
      Swal.close();
      this.alertasService.Swal_alert('error','El codigo ya se encuentra registrada, verifique..');
      return;
     }    

     const  descCat  = await this.categoriaService.get_verificar_descripcionCategoria(this.formParams.value.descripcion_categoria);
     if (descCat) {
      Swal.close();
      this.alertasService.Swal_alert('error','La categoria ya se encuentra registrada, verifique..');
      return;
     }   

     this.categoriaService.set_save_categoria(this.formParams.value).subscribe((res:RespuestaServer)=>{
       Swal.close();    
       if (res.ok ==true) {     
         this.flag_modoEdicion = true;
         this.formParams.patchValue({ "id_Categoria" : Number(res.data[0].id_Categoria) });
         console.log(res.data[0])
         this.categorias.push(res.data[0]);
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
     this.categoriaService.set_edit_categoria(this.formParams.value , this.formParams.value.id_Categoria).subscribe((res:RespuestaServer)=>{
       Swal.close(); 
       if (res.ok ==true) {  
         

         for (const obj of this.categorias) {
           if (obj.id_Categoria == this.formParams.value.id_Categoria ) {
              obj.codigo_categoria= this.formParams.value.codigo_categoria ; 
              obj.descripcion_categoria= this.formParams.value.descripcion_categoria ; 
              obj.estado= this.formParams.value.estado ;
              obj.descripcion_estado = this.formParams.value.estado == 0 ? "INACTIVO" : "ACTIVO";  
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

 editar({ id_Categoria, codigo_categoria, descripcion_categoria, estado  }){
   this.flag_modoEdicion=true;
   this.formParams.patchValue({ "id_Categoria" : id_Categoria,  "codigo_categoria" : codigo_categoria ,"descripcion_categoria" : descripcion_categoria, "estado" : estado, "usuario_creacion" : this.idUserGlobal });
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
       this.categoriaService.set_anular_categoria(objBD.id_Categoria).subscribe((res:RespuestaServer)=>{
         Swal.close();        
         if (res.ok ==true) { 
           
           for (const user of this.categorias) {
             if (user.id_Categoria == objBD.id_Categoria ) {
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
