
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertasService } from '../../../services/alertas/alertas.service';
import { RespuestaServer } from '../../../models/respuestaServer.models';
import { FuncionesglobalesService } from '../../../services/funciones/funcionesglobales.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../../../services/login/login.service';
import Swal from 'sweetalert2';

import { combineLatest } from 'rxjs'; 
import { AsignacionProductosService } from '../../../services/Procesos/asignacion-productos.service';
import { ActividadService } from '../../../services/Mantenimientos/actividad.service';
import { InputFileI } from '../../../models/inputFile.models';
import { UploadService } from '../../../services/Upload/upload.service';

declare var $:any;

@Component({
  selector: 'app-asignacion-producto',
  templateUrl: './asignacion-producto.component.html',
  styleUrls: ['./asignacion-producto.component.css']
})
 
export class AsignacionProductoComponent implements OnInit {

  formParamsFiltro : FormGroup;
  formParams: FormGroup;
  formParamsFile: FormGroup;

  idUserGlobal :number = 0;
  flag_modoEdicion :boolean =false;

  asignacionProductosCab :any[]=[]; 
  filtrarMantenimiento = "";

  usuarios :any[]=[]; 
  ciclos :any[]=[]; 
  ciclosM :any[]=[]; 
  productos:any[]=[]; 
  bloquearEditar =false;
 
 
    // -------importaciones 
    flagImportar=false;
    filesExcel:InputFileI[] = [];
    importacion:any [] = [];
 
  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService, private funcionesglobalesService : FuncionesglobalesService, private asignacionProductosService : AsignacionProductosService, private actividadService :ActividadService,  private uploadService : UploadService ) {         
    this.idUserGlobal = this.loginService.get_idUsuario();
  }
 
 ngOnInit(): void {
   this.inicializarFormularioFiltro();
   this.inicializarFormulario(); 
   this.inicializarFormulario_file();
   this.getCargarCombos();
 //initialize 
  // 

  setTimeout(()=>{ // 
    $('.selectSearch').select2({
      dropdownParent: $('#modal_mantenimiento')
     });
     $('.selectFilter').select2();
     $('#cboUsuario_filtro').val(0).trigger('change.select2');
  },0);  

 }

 inicializarFormularioFiltro(){ 
    this.formParamsFiltro= new FormGroup({
      idUsuario : new FormControl('0'),
      idCiclo : new FormControl('0'),
      producto : new FormControl('')
     }) 
 }

 inicializarFormulario(){ 
    this.formParams= new FormGroup({
      id_Stock: new FormControl('0'), 
      id_Ciclo: new FormControl('0'),
      id_Producto: new FormControl('0'), 
      id_Usuario: new FormControl('0'),
      cantidad_stock: new FormControl('1'), 
      lote_stock: new FormControl(''),
      usuario_creacion :new FormControl('0')
    }) 
 }

 getCargarCombos(){ 
  this.spinner.show();
  combineLatest([ this.actividadService.get_usuarios(this.idUserGlobal) , this.actividadService.get_ciclos(), this.asignacionProductosService.get_productosGeneral() ])
  .subscribe( ([ _usuarios, _ciclos, _productos ])=>{
    this.usuarios = _usuarios;
    this.ciclos = _ciclos;
    this.ciclosM = _ciclos.filter((c) => (c.estado != '5'  ) ); 
    this.productos = _productos;
 
    this.formParamsFiltro.patchValue({ "idUsuario" : _usuarios[0].id_Usuario  });  
    this.formParamsFiltro.patchValue({ "idCiclo" :  this.ciclosM[0].id_Ciclo });
    this.spinner.hide(); 
  })
}


 mostrarInformacion(){
  
  //------enlazando al formulario el combo search----
  this.formParamsFiltro.patchValue({ "idUsuario" :  $('#cboUsuarioFiltro').val() });

 
  // if (this.formParamsFiltro.value.idCiclo == '' || this.formParamsFiltro.value.idCiclo == 0) {
  //   this.alertasService.Swal_alert('error','Por favor seleccione el ciclo');
  //   return 
  // }
 
    this.spinner.show();
    this.asignacionProductosService.get_mostrar_asignacionProducto( this.formParamsFiltro.value.idUsuario, this.formParamsFiltro.value.idCiclo,  this.formParamsFiltro.value.producto)
        .subscribe((res:RespuestaServer)=>{  
            this.spinner.hide();
            if (res.ok==true) {        
 
                this.asignacionProductosCab = res.data; 
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
      $('#cboProducto').val(0).trigger('change.select2');
      $('#cboUsuario').val(0).trigger('change.select2');

      $(".selectSearch").prop("disabled", false);
      $('#cboCiclo').removeClass('disabledForm');     
      $('#txtLote').removeClass('disabledForm');   

    },0); 
    this.formParams.patchValue({ "id_Ciclo" :  this.ciclosM[0].id_Ciclo });
 } 

 async saveUpdate(){ 

  //------enlazando al formulario el combo search----
  this.formParams.patchValue({ "id_Producto" :  $('#cboProducto').val() });
  this.formParams.patchValue({ "id_Usuario" :  $('#cboUsuario').val() });

  if ( this.flag_modoEdicion==true) { //// nuevo
     if (this.formParams.value.id_Stock == '' || this.formParams.value.id_Stock == 0) {
       this.alertasService.Swal_alert('error','No se cargó el id, por favor actulize su página');
       return 
     }   
  }
  if (this.formParams.value.id_Ciclo == '' || this.formParams.value.id_Ciclo == 0) {
    this.alertasService.Swal_alert('error','Por favor seleccione el ciclo');
    return 
  }
  if (this.formParams.value.id_Producto == '' || this.formParams.value.id_Producto == 0) {
    this.alertasService.Swal_alert('error','Por favor seleccione el Producto');
    return 
  } 
  
  if (this.formParams.value.id_Usuario == '' || this.formParams.value.id_Usuario == 0) {
    this.alertasService.Swal_alert('error','Por favor seleccione el Usuario a asignar');
    return 
  }

  if (this.formParams.value.cantidad_stock == '' || this.formParams.value.cantidad_stock == 0) {
    this.alertasService.Swal_alert('error','Por favor ingrese una cantidad');
    return 
  }
  if (this.formParams.value.cantidad_stock <= 0) {
    this.alertasService.Swal_alert('error','Por favor ingrese una cantidad positiva');
    return 
  }
  if (this.formParams.value.lote_stock == '' || this.formParams.value.lote_stock == null) {
    this.alertasService.Swal_alert('error','Por favor ingrese el Lote');
    return 
  }
 
  this.formParams.patchValue({ "usuario_creacion" : this.idUserGlobal });


  if ( this.flag_modoEdicion==false) { //// nuevo  

     Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
     Swal.showLoading();

     this.asignacionProductosService.set_save_asignacionProducto(this.formParams.value).subscribe((res:RespuestaServer)=>{
       Swal.close();    
       if (res.ok ==true) {     

         this.flag_modoEdicion = true;
         this.formParams.patchValue({ "id_Stock" : Number(res.data[0].id_Stock) });
         console.log(res.data[0]);
         this.asignacionProductosCab.push(res.data[0]);
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
     this.asignacionProductosService.set_edit_asignacionProducto(this.formParams.value , this.formParams.value.id_Stock).subscribe((res:RespuestaServer)=>{
       Swal.close(); 
       if (res.ok ==true) {  
         
         const { nombre_ciclo } =  this.ciclosM.find((c)=> c.id_Ciclo ==  this.formParams.value.id_Ciclo );
         const { codigo_producto, descripcion_producto } =  this.productos.find((p)=> p.id_Producto ==  this.formParams.value.id_Producto );
         const { id_Usuario, descripcionUsuario } =  this.usuarios.find((u)=> u.id_Usuario ==  this.formParams.value.id_Usuario );

          for (const obj of this.asignacionProductosCab) {
           if (obj.id_Stock == this.formParams.value.id_Stock ) {

              obj.id_Ciclo = this.formParams.value.id_Ciclo ; 
              obj.descripcionCiclo = nombre_ciclo;  

              obj.id_Producto = this.formParams.value.id_Producto ; 
              obj.codigoProducto = codigo_producto ; 
              obj.descripcionProducto = descripcion_producto; 

              obj.id_Usuario = this.formParams.value.id_Usuario ; 
              obj.codigoUsuario = id_Usuario ; 
              obj.descripcionUsuario = descripcionUsuario ; 

              obj.cantidad_stock = this.formParams.value.cantidad_stock ;
              obj.lote_stock = this.formParams.value.lote_stock ;

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

 editar({id_Stock, id_Ciclo, id_Producto, id_Usuario, cantidad_stock, lote_stock, fecha_stock  }){

   this.flag_modoEdicion=true;   
   this.formParams.patchValue({ "id_Stock" : id_Stock,  "id_Ciclo" : id_Ciclo ,"id_Producto" : id_Producto  , "id_Usuario" : id_Usuario,"cantidad_stock" : Number(cantidad_stock), "lote_stock" : lote_stock, "fecha_stock" : fecha_stock });

   setTimeout(()=>{ // 

    $('#cboProducto').val(id_Producto).trigger('change.select2');
    $('#cboUsuario').val(id_Usuario).trigger('change.select2');
 
    $(".selectSearch").prop("disabled", true);
    $('#cboCiclo').addClass('disabledForm');     
    $('#txtLote').addClass('disabledForm');   
    $('#modal_mantenimiento').modal('show');  
 
  },0);  

 } 


 keyPress(event: any) {
  const pattern = /[0-9\+\-\ ]/;
  let inputChar = String.fromCharCode(event.charCode);
  if (event.keyCode != 8 && !pattern.test(inputChar)) {
    event.preventDefault();
  }
}

//-----  CARGA MASIVA ASIGNACION DE USUARIOS  -------


 inicializarFormulario_file(){ 
  this.formParamsFile = new FormGroup({
    id_Ciclo: new FormControl('0'),
    fecha_asignacion: new FormControl(new Date()),
    file : new FormControl('')
   })
 } 

 cerrarModal_importacion(){
  setTimeout(()=>{ // 
    $('#modal_importacion').modal('hide');  
  },0); 
}

 open_modalImportacion(){ 
  this.blank();
  this.flagImportar = true; 
  setTimeout(() => { 
    //// quitando una clase la que desabilita---
     $('#btnVer').removeClass('disabledForm');
     $('#modal_importacion').modal('show');  
   }, 100);
  }  

  blank(){
    this.filesExcel = [];
    this.importacion = [];
    this.inicializarFormulario_file();

    setTimeout(() => {
     $('#btnGrabar').addClass('disabledForm');
     $('#btnVer').removeClass('disabledForm');
    }, 100);

    this.formParamsFile.patchValue({ "id_Ciclo" :  this.ciclosM[0].id_Ciclo });
  
  }

  onFileChange(event:any) {   
    var filesTemporal = event.target.files; //FileList object       
      var fileE:InputFileI [] = []; 
      for (var i = 0; i < event.target.files.length; i++) { //for multiple files          
        fileE.push({
            'file': filesTemporal[i],
            'namefile': filesTemporal[i].name,
            'status': '',
            'message': ''
        })  
      }
       this.filesExcel = fileE;
   }
   
  subirArchivo(){ 
    if (!this.formParamsFile.value.file) {
      this.alertasService.Swal_alert('error', 'Por favor seleccione el archivo excel.');
      return;
    }
     
    Swal.fire({
      icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'
    })
    Swal.showLoading();
   this.uploadService.upload_Excel_stock( this.filesExcel[0].file ,this.formParamsFile.value.id_Ciclo,   this.idUserGlobal ).subscribe(
     (res:RespuestaServer) =>{
      Swal.close();
       if (res.ok==true) { 
           this.importacion = res.data;
           this.filesExcel = [];
           setTimeout(() => {
            //// quitando una clase la que desabilita---
             $('#btnGrabar').removeClass('disabledForm');
             $('#btnVer').addClass('disabledForm');
           }, 100);
       }else{
           this.filesExcel[0].message = String(res.data);
           this.filesExcel[0].status = 'error';   
       }
       },(err) => {
         this.spinner.hide();
         this.filesExcel[0].message = JSON.stringify(err);
         this.filesExcel[0].status = 'error';   
       }
   );
  
  } 
  
  downloadFormat(){
    window.open('./assets/format/FORMATO_ALTA_STOCK.xlsx');    
  }
  
  getColorEstado(estado:number){ 
    switch (estado) {
      case 1:
        return 'black';
      default:
        return 'red';
    } 
  }
  
  getVerificaEstado(){
    let flagBloquear=false;
  
    if ( this.importacion.length > 0){ 
      for (const item of this.importacion) {
          if (item.estado_importacion) {
            if (item.estado_importacion > 1) {
              flagBloquear=true;
              break;
            }            
          }else{
            alert('No se cargó el dato del estado correctamente desde BD.')
            flagBloquear=true;
            break;
          }
      }  
      return flagBloquear;
    }else{
      flagBloquear=true; 
      return flagBloquear;
    } 
  }

  guardar_importacionAsignacionProducto(){

    if (!this.formParamsFile.value.file) {
      this.alertasService.Swal_alert('error', 'Por favor seleccione el archivo excel.');
      return;
    }
    if (this.getVerificaEstado()) {
      this.alertasService.Swal_alert('error', 'Aun no puede grabar, debe de corregir su archivo.');
      return 
    }
    if (this.formParamsFile.value.fecha_asignacion == '' ||  this.formParamsFile.value.fecha_asignacion == null ) {
      this.alertasService.Swal_alert('error', 'Por favor seleccione la fecha de asignacion');
      return 
    }

    const fechaAsignacion = this.funcionesglobalesService.formatoFecha(this.formParamsFile.value.fecha_asignacion);
  
    this.alertasService.Swal_Question('Sistemas', 'Esta seguro de grabar ?')
    .then((result)=>{
      if(result.value){
  
        this.spinner.show();
        this.uploadService.save_archivoExcel_stock(this.idUserGlobal, fechaAsignacion )
        .subscribe((res:RespuestaServer) =>{  
            this.spinner.hide();   
            if (res.ok==true) { 
               this.alertasService.Swal_Success('Se grabó correctamente la información..');
  
               setTimeout(() => {
                $('#btnGrabar').addClass('disabledForm');
               }, 100);

               this.cerrarModal_importacion();
  
            }else{
              this.alertasService.Swal_alert('error', JSON.stringify(res.data));
              alert(JSON.stringify(res.data));
            }
            },(err) => {
              this.spinner.hide();
              this.filesExcel[0].message = JSON.stringify(err);
              this.filesExcel[0].status = 'error';   
            }
        );  
        
      }
    })       
  }



}

