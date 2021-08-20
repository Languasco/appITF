
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
import { ProgramacionService } from '../../../services/Procesos/programacion.service';

declare var $:any;
@Component({
  selector: 'app-aprobar-altas-bajas-target',
  templateUrl: './aprobar-altas-bajas-target.component.html',
  styleUrls: ['./aprobar-altas-bajas-target.component.css']
})
 
export class AprobarAltasBajasTargetComponent implements OnInit {

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
  detalleInformacion :any[]=[]; 


  filtrarCab = "";
  filtrarDet = "";
  objectoPerfilMedicoCab :any = {};
  perfilMedicoCab :any[]=[]; 
  columnsMedicoCab :any[]=[]; 

  perfilMedicoDet :any[]=[]; 
  columnsMedicoDet :any[]=[]; 
  message = '';

  id_MedicoGlobal = 0;

  totalColumna1 = 0 ; 
  totalColumna2 = 0 ; 
  totalColumna3 = 0 ; 

  totalColumnaDet1 = 0 ; 
  totalColumnaDet2 = 0 ; 
  totalColumnaDet3 = 0 ; 
 
 
  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService, private funcionesglobalesService : FuncionesglobalesService, private targetService : TargetService, private uploadService : UploadService, private categoriaService :CategoriaService, private  especialidadService :EspecialidadService, private actividadService :ActividadService, private activatedRoute:ActivatedRoute , private programacionService : ProgramacionService) {     

    this.idUserGlobal = this.loginService.get_idUsuario();
    this.UsuarioLoggeadoGlobal = this.loginService.getSessionNombre();

    //---obtener el parametro que viene por la url
    this.activatedRoute.params.subscribe(params=>{
      this.opcionTarget = params['opcionTarget'];      
      if( this.opcionTarget =='A'){
        this.tituloTarget = 'APROBAR ALTA DE TARGET ';
      }else{
        this.tituloTarget = 'APROBAR BAJA DE TARGET ';
      }
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
      solicitante: new FormControl(''), 
      fechaSolicitud: new FormControl(new Date()),
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
  this.targetService.get_mostrar_AprobacionAltasBajasTarget( this.formParamsFiltro.value, this.opcionTarget, fechaIni, fechaFin , this.idUserGlobal)
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

 

 

 keyPress(event: any) {
  this.funcionesglobalesService.verificar_soloNumeros(event)  ;
 }


async saveUpdate_target(){   
    if (this.targetDet.length <= 0) {
      this.alertasService.Swal_alert('error','Por favor debe agregar al menos un médico');
      return 
    }   

    for (const med of this.targetDet) {
        if (med.idEstado == 16) {
          this.alertasService.Swal_alert('error', 'El médico ' + med.apellido_paterno_medico + ' ' + med.apellido_materno_medico + ' aun no esta Aprobado o Rechazado , verifique ..');
          return;
        }
    }
 
    this.alertasService.Swal_Question('Sistemas', 'Esta seguro de grabar, una vez enviada no hay marcha atras')
    .then((result)=>{
      if(result.value){

        Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
        Swal.showLoading();
    
        this.targetService.set_finalizar_aprobacionAltasBajas_Target( this.id_TargetCab_Global, this.opcionTarget, this.idUserGlobal ).subscribe((res:RespuestaServer)=>{
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
  this.targetService.get_AprobacionaltasBajas_detalleTarget(this.id_TargetCab_Global, this.opcionTarget, this.idUserGlobal)
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

async aprobarRechazar_altasBajas_target(opcion:string,objTarget:any ){ 

  let nroContact =0;
  if(opcion =='A'){

    if (objTarget.nrovisita == 0 || objTarget.nrovisita == '0') {
      this.alertasService.Swal_alert('error', objTarget.mensajeNrovisita);
      return;
    }
    if (!objTarget.nro_contactos) {
      this.alertasService.Swal_alert('error','Es necesario ingresar un número de contacto');
       return;
    }
    if ( Number(objTarget.nro_contactos) <=0 ) {
      this.alertasService.Swal_alert('error','Tiene que ingresar un valor positivo');
      return;
    }
    nroContact = objTarget.nro_contactos;
  } 

  let mens = (opcion =='A') ? 'Esta seguro de Aprobar ?' : 'Esta seguro de Rechazar ?';
  let mensAlert = (opcion =='A') ? 'Aprobado correctamente ..' : 'Rechazado correctamente ..';

  this.alertasService.Swal_Question('Sistemas', mens)
  .then((result)=>{
    if(result.value){
      Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Actualizando, espere por favor'  })
      Swal.showLoading();
      this.targetService.set_AprobarRechazar_altasBajas_Target(objTarget.id_Target_Det, nroContact, this.opcionTarget, opcion, this.idUserGlobal ).subscribe((res:RespuestaServer)=>{
        Swal.close(); 
        if (res.ok ==true) {   

          this.alertasService.Swal_alert('success',mensAlert);
          
          for (const target of this.targetDet) {
             if (target.id_Target_Det == objTarget.id_Target_Det ) {
                if (opcion =='A') {
                  target.idEstado = 18;
                  target.descripcionEstado = 'Aprobada';
                }else{
                  target.idEstado = 17;
                  target.descripcionEstado = 'Rechazada';
                }             
             }
          }         
        }else{
          this.alertasService.Swal_alert('error', JSON.stringify(res.data));
          alert(JSON.stringify(res.data));
        }
      })
    }
  })

} 

 

  abrir_modalInformacion(objTarget:any){
  
    this.id_MedicoGlobal = objTarget.id_Medico;
  
    Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
    Swal.showLoading();
    this.programacionService.get_informacionMedico_Programacion( objTarget.id_Medico )
        .subscribe((res:RespuestaServer)=>{  
          Swal.close();    
            if (res.ok==true) {   
  
                this.perfilMedicoCab =[];
                this.columnsMedicoCab = [];
              
                this.perfilMedicoCab = res.data; 
  
                if (this.perfilMedicoCab.length > 0){     
  
                  setTimeout(()=>{ // 
                    $('#modal_informacion').modal('show');  
                  },0);         
                  
                  const {nombreMedico, matricula, especialidad, direccion } =   this.perfilMedicoCab[0];
                  
                  this.objectoPerfilMedicoCab = {
                    medico : nombreMedico,
                    matricula : matricula,
                    especialidad : especialidad,
                    direccion : direccion
                  }
                  
                  //---- generando las columnas dinamicas ----
                  let columnsMedico :any [] = [];
                  columnsMedico = Object.keys(this.perfilMedicoCab[0]); 
  
                  for (const key in columnsMedico) {
                       if (Number(key)>3) {
                        this.columnsMedicoCab.push( columnsMedico[key] );
                       }   
                  }   
  
                  this.totalColumna1 = 0;
                  this.totalColumna2 = 0;
                  this.totalColumna3 = 0;
  
                  for (let index = 0; index < this.perfilMedicoCab.length; index++) {
                     this.totalColumna1 += Number(this.perfilMedicoCab[index][this.columnsMedicoCab[1]]);                    
                     this.totalColumna2 += Number(this.perfilMedicoCab[index][this.columnsMedicoCab[2]]);   
                     this.totalColumna3 += Number(this.perfilMedicoCab[index][this.columnsMedicoCab[3]]);   
                  }   
  
                }else{  
                  this.alertasService.Swal_alert('warning', 'No hay informacion para mostrar..');
                  return;
                }
  
            }else{
              this.alertasService.Swal_alert('error', JSON.stringify(res.data));
              alert(JSON.stringify(res.data));
            }
    })
  }

  cerrarModalInfo(){
    setTimeout(()=>{ // 
      $('#modal_informacion').modal('hide');  
    },0); 
  } 
  
  cerrarModalInfo_det(){
    setTimeout(()=>{ // 
      $('#modal_informacion_detalle').modal('hide');  
    },0); 
  }

  
  abrir_modalInformacion_det({mercadoProducto}){
    Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
    Swal.showLoading();
    this.programacionService.get_informacionMedico_ProgramacionDet( this.id_MedicoGlobal , mercadoProducto)
        .subscribe((res:RespuestaServer)=>{  
          Swal.close();    
            if (res.ok==true) {   


              this.perfilMedicoDet =[];
              this.columnsMedicoDet = [];

                this.perfilMedicoDet = res.data; 
                setTimeout(()=>{ // 
                  $('#modal_informacion_detalle').modal('show');  
                },0);    

                if (this.perfilMedicoDet.length > 0){     

                        //---- generando las columnas dinamicas ----
 
                        this.columnsMedicoDet = Object.keys(this.perfilMedicoDet[0]); 
      
                        this.totalColumnaDet1 = 0;
                        this.totalColumnaDet2 = 0;
                        this.totalColumnaDet3 = 0;
      
                        for (let index = 0; index < this.perfilMedicoDet.length; index++) {
                           this.totalColumnaDet1 += Number(this.perfilMedicoDet[index][this.columnsMedicoDet[1]]);                    
                           this.totalColumnaDet2 += Number(this.perfilMedicoDet[index][this.columnsMedicoDet[2]]);   
                           this.totalColumnaDet3 += Number(this.perfilMedicoDet[index][this.columnsMedicoDet[3]]);   
                        }
                }

            }else{
              this.alertasService.Swal_alert('error', JSON.stringify(res.data));
              alert(JSON.stringify(res.data));
            }
    })
  }

  getAlineamiento(valor:any){
    if (valor == 'mercadoProducto') {
      return 'text-left'
    }else{
      return 'text-right'
    }
  }
  
 
  

}
