
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
  formParamsMedico: FormGroup;

  idUserGlobal :number = 0;
  UsuarioLoggeadoGlobal ="";

  id_TargetCab_Global :number = 0;

  idEstadoCabGlobal:number = 0;
  descripcionEstadoGlobal= "";

  flag_modoEdicion :boolean =false;

  targetCab :any[]=[]; 
  filtrarMantenimiento = "";
  filtrarMedicos = "";


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

  targetDet :any[]=[]; 
  medicosDet :any[]=[]; 
 
  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService, private funcionesglobalesService : FuncionesglobalesService, private targetService : TargetService, private uploadService : UploadService, private categoriaService :CategoriaService, private  especialidadService :EspecialidadService, private actividadService :ActividadService, private activatedRoute:ActivatedRoute ) {     

    this.idUserGlobal = this.loginService.get_idUsuario();
    this.UsuarioLoggeadoGlobal = this.loginService.getSessionNombre();

    //---obtener el parametro que viene por la url
    this.activatedRoute.params.subscribe(params=>{
      this.opcionTarget = params['opcionTarget'];      
      if( this.opcionTarget =='A'){
        this.tituloTarget = 'ALTA DE TARGET DE MEDICOS';
      }else{
        this.tituloTarget = 'BAJA DE TARGET DE MEDICOS';
      }
    })
  }
 
 ngOnInit(): void {
   this.inicializarFormularioFiltro();
   this.inicializarFormulario(); 
   this.inicializarFormularioMedico();
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
      solicitante: new FormControl(''), 
      fechaSolicitud: new FormControl(new Date()),
    }) 
 }

 inicializarFormularioMedico(){ 
  this.formParamsMedico= new FormGroup({
    medico: new FormControl(''), 
    categoria: new FormControl(0),
    especialidad: new FormControl(0), 
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

  if (this.opcionTarget == '' || this.opcionTarget == null || this.opcionTarget == undefined) {
    this.alertasService.Swal_alert('error','No se cargo el tipo de Target, Actualice la pagina');
    return 
  }

  // if (this.formParamsFiltro.value.idUsuario == '' || this.formParamsFiltro.value.idUsuario == 0) {
  //   this.alertasService.Swal_alert('error','Por favor seleccione el usuario');
  //   return 
  // } 

  if (this.formParamsFiltro.value.fecha_ini == '' || this.formParamsFiltro.value.fecha_ini == null ) {
    this.alertasService.Swal_alert('error','Por favor seleccione la fecha inicial');
    return 
  } 
  if (this.formParamsFiltro.value.fecha_fin == '' || this.formParamsFiltro.value.fecha_fin == null ) {
    this.alertasService.Swal_alert('error','Por favor seleccione la fecha final');
    return 
  } 
  const fechaIni = this.funcionesglobalesService.formatoFecha(this.formParamsFiltro.value.fecha_ini);
  const fechaFin = this.funcionesglobalesService.formatoFecha(this.formParamsFiltro.value.fecha_fin);

  this.spinner.show();
  this.targetService.get_mostrar_AltasBajasTarget( this.formParamsFiltro.value, this.opcionTarget, fechaIni, fechaFin)
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

 cerrarModal(){
  setTimeout(()=>{ // 
    $('#modal_mantenimiento').modal('hide');  
  },0); 
 }

nuevo(){
  this.flag_modoEdicion = false;
  this.id_TargetCab_Global= 0;
  this.idEstadoCabGlobal= 15;
  this.descripcionEstadoGlobal= 'Creada';

  this.targetDet = [];

  this.inicializarFormulario();  
  this.formParams.patchValue({ "solicitante" : this.UsuarioLoggeadoGlobal, 'fechaSolicitud' : new Date() });  

  setTimeout(()=>{ // 
    $('#modal_mantenimiento').modal('show');  
  },0); 
} 
  
cerrarModal_medico(){
  setTimeout(()=>{ // 
    $('#modal_medico').modal('hide');  
  },0); 
}
 
nuevo_medico(){
  this.inicializarFormularioMedico();
  this.medicosDet =[];
  this.filtrarMedicos = '';

   setTimeout(()=>{ // 
    $('#modal_medico').modal('show');  
  },0); 
} 

buscarMedico(){  
  this.spinner.show();
  this.targetService.get_buscarMedicos( this.formParamsMedico.value, this.opcionTarget, this.idUserGlobal)
      .subscribe((res:RespuestaServer)=>{  
          this.spinner.hide();
          if (res.ok==true) {        
              this.medicosDet = res.data; 
          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }
  })
}  

validacionCheckMarcado(){    
  let CheckMarcado = false;
  CheckMarcado = this.funcionesglobalesService.verificarCheck_marcado(this.medicosDet);

  if (CheckMarcado ==false) {
    this.alertasService.Swal_alert('error','Por favor debe marcar un Medico de la Tabla');
    return false;
  }else{
    return true;
  }
}

 anadirMedico(){   

  if (this.medicosDet.length == 0) {
    this.alertasService.Swal_alert('error','No hay medicos para añadir');
    return;
  }

  if (this.validacionCheckMarcado()==false){
    return;
  }

  const mediMarc = this.medicosDet.filter((med)=> med.checkeado);

  if (!mediMarc) {
    return;
  }else{    
    let flagCantNull =false;
    for (const med of mediMarc) {
        if (!med.nro_contactos) {
          this.alertasService.Swal_alert('error','Es necesario ingresar un numero de contacto');
          flagCantNull =true;
          break;
        }
        if ( Number(med.nro_contactos) <=0 ) {
          this.alertasService.Swal_alert('error','Tiene que ingresar un valor positivo');
          flagCantNull =true;
          break;
        }
    }

    if (flagCantNull) {
        return;
    }
  }

  for (const med of mediMarc) {
      //---- verificando que no este agregado ----
    if (this.verificarMedicoCargado( med.id_Medico ) ==true) {
      // this.alertasService.Swal_alert('error', 'El ' + med.apellido_paterno_medico + ' ' + med.apellido_materno_medico + ' ya esta cargado , verifique ..');
    }else{
      this.targetDet.push(med);
      this.alertasService.Swal_alert('success','Se añadieron los médicos');
    }
  }
  this.cerrarModal_medico();   
  
 }

 eliminarMedico(item:any){    

  var index = this.targetDet.indexOf( item );
  this.targetDet.splice( index, 1 );
}

 keyPress(event: any) {
  this.funcionesglobalesService.verificar_soloNumeros(event)  ;
 }

 verificarMedicoCargado(id_Medico: number){  
  var flagRepetida=false;
  for (const obj of this.targetDet) {
    if (  obj.id_Medico == id_Medico ) {
         flagRepetida = true;
         break;
    }
  }
  return flagRepetida;
}

async saveUpdate_target(){   
    if (this.targetDet.length <= 0) {
      this.alertasService.Swal_alert('error','Por favor debe agregar al menos un medico');
      return 
    }   
 
    // const listMedicos = this.targetDet.map( (medico) =>{
    //    return { id_Medico : medico.id_Medico, nro_contactos : medico.nro_contactos }
    // }) 

    let listMedicos :any =[];
    for (let obj of this.targetDet) {
      listMedicos.push(obj.id_Medico + '_' + obj.nro_contactos );
    }   
  
    Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
    Swal.showLoading();   

    this.targetService.set_insert_update_altasBajas_Target( this.id_TargetCab_Global, listMedicos.join(), this.opcionTarget, this.idUserGlobal ).subscribe((res:RespuestaServer)=>{
      Swal.close();    
      if (res.ok ==true) { 
        this.mostrarInformacion();
        this.alertasService.Swal_Success('Proceso realizado correctamente..');  
        this.cerrarModal();
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
    })    
} 

editar_target({ id_Target_cab, usuario, fechaSol, idEstado, descripcionEstado}){

  this.flag_modoEdicion = true;
  this.id_TargetCab_Global= id_Target_cab;
  this.idEstadoCabGlobal= idEstado;
  this.descripcionEstadoGlobal= descripcionEstado;

  this.targetDet = [];

  this.inicializarFormulario();  
  this.formParams.patchValue({ "solicitante" : usuario, 'fechaSolicitud' : fechaSol });  
   
  //----obteniendo los medicos detalle Solicitud ----
   this.detalleSolicitudTarget();

   setTimeout(()=>{ // 
    $('#modal_mantenimiento').modal('show');  
  },0);  

} 

detalleSolicitudTarget(){ 
  Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
  Swal.showLoading();
  this.targetService.get_altasBajas_detalleTarget(this.id_TargetCab_Global, this.opcionTarget, this.idUserGlobal)
      .subscribe((res:RespuestaServer)=>{  
        Swal.close();    
          if (res.ok==true) {        
              this.targetDet = res.data; 
          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }
  })
}  

 
  


  
 


}





