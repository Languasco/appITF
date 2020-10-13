
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
import { InputFileI } from '../../../models/inputFile.models';
import { UploadService } from '../../../services/Upload/upload.service';
import { TargetService } from '../../../services/Procesos/target.service';
import { CategoriaService } from '../../../services/Mantenimientos/categoria.service';
import { EspecialidadService } from '../../../services/Mantenimientos/especialidad.service';

declare var $:any;

@Component({
  selector: 'app-target',
  templateUrl: './target.component.html',
  styleUrls: ['./target.component.css']
})
 
export class TargetComponent implements OnInit {

  formParamsFiltro : FormGroup;
  formParams: FormGroup;
  formParamsFile: FormGroup;

  idUserGlobal :number = 0;
  flag_modoEdicion :boolean =false;

  asignacionProductosCab :any[]=[]; 
  filtrarMantenimiento = "";

  usuarios :any[]=[]; 
  categorias :any[]=[]; 
  especialidades :any[]=[]; 
  estados :any[]=[]; 
  // -------importaciones 
  flagImportar=false;
  filesExcel:InputFileI[] = [];
  importacion:any [] = [];
  opcionTarget='';
  tituloTarget='';
 
  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService, private funcionesglobalesService : FuncionesglobalesService, private targetService : TargetService, private uploadService : UploadService, private categoriaService :CategoriaService, private  especialidadService :EspecialidadService, private actividadService :ActividadService ) {         
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
      categoria : new FormControl('0'),
      especialidad : new FormControl('0'),
      medico : new FormControl(''),
      estado : new FormControl('0'),
     }) 
 }

 inicializarFormulario(){ 
    this.formParams= new FormGroup({
      id_Stock: new FormControl('0'), 
      id_Ciclo: new FormControl('0'),
      id_Producto: new FormControl('0'), 
      id_Usuario: new FormControl('0'),
      cantidad_stock: new FormControl('0'), 
      lote_stock: new FormControl(''),
      usuario_creacion :new FormControl('0')
    }) 
 }

 getCargarCombos(){ 
  this.spinner.show();
  combineLatest([ this.actividadService.get_usuarios(this.idUserGlobal)  , this.categoriaService.get_categorias(), this.especialidadService.get_especialidades(), this.actividadService.get_estados()  ])
  .subscribe( ([ _usuarios,  _categorias, _especialidades, _estados ])=>{
    this.usuarios = _usuarios;
    this.categorias = _categorias;
    this.especialidades = _especialidades;
    this.estados = _estados.filter((estado) => estado.grupo_estado =='tbl_Target_Cab');  
    this.formParamsFiltro.patchValue({ "idUsuario" : _usuarios[0].id_Usuario  });  
    this.spinner.hide(); 
  })
}


 mostrarInformacion(){  

  // if (this.formParamsFiltro.value.idUsuario == '' || this.formParamsFiltro.value.idUsuario == 0) {
  //   this.alertasService.Swal_alert('error','Por favor seleccione el usuario');
  //   return 
  // }
 
 
  this.spinner.show();
  this.targetService.get_mostrar_target( this.formParamsFiltro.value)
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
  
 
  
 

 

//-----  CARGA MASIVA ASIGNACION DE USUARIOS  -------


 inicializarFormulario_file(){ 
  this.formParamsFile = new FormGroup({
    file : new FormControl('')
   })
 } 

 cerrarModal_importacion(){
  setTimeout(()=>{ // 
    $('#modal_importacion').modal('hide');  
  },0); 
}

 open_modalImportacion(opcionTarget:any){ 
  this.blank();
  this.flagImportar = true; 
  this.opcionTarget = opcionTarget;

  this.tituloTarget =  (opcionTarget =='A')? 'ALTA MASIVA DE TARGET' : 'BAJA MASIVA DE TARGET';

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
   this.uploadService.upload_Excel_target( this.filesExcel[0].file , this.opcionTarget,   this.idUserGlobal ).subscribe(
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
    window.open('./assets/format/FORMATO_TARGET.xlsx');    
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

  guardar_importacion_target(){
    if (!this.formParamsFile.value.file) {
      this.alertasService.Swal_alert('error', 'Por favor seleccione el archivo excel.');
      return;
    }
    if (this.getVerificaEstado()) {
    this.alertasService.Swal_alert('error', 'Aun no puede grabar, debe de corregir su archivo.');
    return 
    }
  
    this.alertasService.Swal_Question('Sistemas', 'Esta seguro de grabar ?')
    .then((result)=>{
      if(result.value){
  
        this.spinner.show();
        this.uploadService.save_archivoExcel_target( this.opcionTarget, this.idUserGlobal )
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

