
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
import { ActivatedRoute } from '@angular/router';

declare var $:any;

@Component({
  selector: 'app-altas-target',
  templateUrl: './altas-target.component.html',
  styleUrls: ['./altas-target.component.css']
})
 
export class AltasTargetComponent implements OnInit {

  formParamsFiltro : FormGroup;
  formParams: FormGroup;
  formParamsFile: FormGroup;

  idUserGlobal :number = 0;
  flag_modoEdicion :boolean =false;

  targetCab :any[]=[]; 
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
 
  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService, private funcionesglobalesService : FuncionesglobalesService, private targetService : TargetService, private uploadService : UploadService, private categoriaService :CategoriaService, private  especialidadService :EspecialidadService, private actividadService :ActividadService, private activatedRoute:ActivatedRoute ) {         
    this.idUserGlobal = this.loginService.get_idUsuario();

    //---obtener el parametro que viene por la url
    this.activatedRoute.params.subscribe(params=>{
      this.opcionTarget = params['opcionTarget'];      
      console.log(this.opcionTarget)  ;   
    })
  }
 
 ngOnInit(): void {
   this.inicializarFormularioFiltro();
   this.inicializarFormulario(); 
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
      fecha_ini : new FormControl(new Date()),
      fecha_fin : new FormControl(new Date()), 
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
    this.spinner.hide(); 
  })
}


 mostrarInformacion(){  

  if (this.opcionTarget == '' || this.opcionTarget == null || this.opcionTarget == undefined) {
    this.alertasService.Swal_alert('error','No se cargo el tipo de Target, Actualice la pagina');
    return 
  }

  if (this.formParamsFiltro.value.idUsuario == '' || this.formParamsFiltro.value.idUsuario == 0) {
    this.alertasService.Swal_alert('error','Por favor seleccione el usuario');
    return 
  } 
  if (this.formParamsFiltro.value.fecha_ini == '' || this.formParamsFiltro.value.fecha_ini == null ) {
    this.alertasService.Swal_alert('error','Por favor seleccione la fecha inicial');
    return 
  } 
  if (this.formParamsFiltro.value.fecha_fin == '' || this.formParamsFiltro.value.fecha_fin == null ) {
    this.alertasService.Swal_alert('error','Por favor seleccione la fecha final');
    return 
  } 

 
 
  this.spinner.show();
  this.targetService.get_mostrar_AltasBajasTarget( this.formParamsFiltro.value, this.opcionTarget)
      .subscribe((res:RespuestaServer)=>{  
          this.spinner.hide();
          if (res.ok==true) {        
              this.targetCab = res.data; 
          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }
  })
 }   
  
 
  
 


}





