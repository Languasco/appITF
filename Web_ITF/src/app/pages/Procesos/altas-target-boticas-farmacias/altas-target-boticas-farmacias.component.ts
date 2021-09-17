
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
import { MedicoService } from '../../../services/Mantenimientos/medico.service';

declare var $:any;

@Component({
  selector: 'app-altas-target-boticas-farmacias',
  templateUrl: './altas-target-boticas-farmacias.component.html',
  styleUrls: ['./altas-target-boticas-farmacias.component.css']
})
 

export class AltasTargetBoticasFarmaciasComponent implements OnInit {

  formParamsFiltro : FormGroup;
  formParams: FormGroup; 
  formParamsDirection: FormGroup;

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

 
  medicosDet :any[]=[]; 
  departamentos :any[]=[]; 
  provincias :any[]=[]; 
  distritos :any[]=[];
  datosEmpresa: any;
 
  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService, private funcionesglobalesService : FuncionesglobalesService, private targetService : TargetService, private uploadService : UploadService, private categoriaService :CategoriaService, private  especialidadService :EspecialidadService, private actividadService :ActividadService, private activatedRoute:ActivatedRoute , private medicoService :  MedicoService ) {     

    this.idUserGlobal = this.loginService.get_idUsuario();
    this.UsuarioLoggeadoGlobal = this.loginService.getSessionNombre();
    this.datosEmpresa = this.loginService.get_parametrosEmpresa();
    //---obtener el parametro que viene por la url
    this.activatedRoute.params.subscribe(params=>{
      this.opcionTarget = params['opcionTarget'];      
      if( this.opcionTarget =='A'){
        this.tituloTarget = 'ALTA DE TARGET DE BOTICAS Y FARMACIAS';
      }else{
        this.tituloTarget = 'BAJA DE TARGET DE BOTICAS Y FARMACIAS';
      }
    })
  }
 
 ngOnInit(): void {
   this.inicializarFormularioFiltro();
   this.inicializarFormulario(); 
   this.inicializarFormularioDireccion();
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
 

inicializarFormularioDireccion(){ 
  this.formParamsDirection= new FormGroup({
    rucRazonSocial: new FormControl(''),
    codigo_departamento: new FormControl('0'),
    codigo_provincia: new FormControl('0'),
    codigo_distrito: new FormControl('0'),
   }) 
}

 

 getCargarCombos(){ 
  this.spinner.show();
  combineLatest([ this.actividadService.get_usuarios(this.idUserGlobal)  , this.categoriaService.get_categorias(), this.especialidadService.get_especialidades(), this.actividadService.get_estados(), this.medicoService.get_departamentos()  ])
  .subscribe( ([ _usuarios,  _categorias, _especialidades, _estados, _departamentos ])=>{
    this.usuarios = _usuarios;
    this.categorias = _categorias;
    this.especialidades = _especialidades;
    this.estados = _estados.filter((estado) => estado.grupo_estado =='tbl_Target_Cab');  
    this.departamentos = _departamentos;
    this.formParamsFiltro.patchValue({ "idUsuario" : _usuarios[0].id_Usuario  });  
    this.spinner.hide(); 
  })
 }
 
 mostrarInformacion(){  

  if (this.opcionTarget == '' || this.opcionTarget == null || this.opcionTarget == undefined) {
    this.alertasService.Swal_alert('error','No se cargo el tipo de Target, Actualice la pagina');
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
  const fechaIni = this.funcionesglobalesService.formatoFecha(this.formParamsFiltro.value.fecha_ini);
  const fechaFin = this.funcionesglobalesService.formatoFecha(this.formParamsFiltro.value.fecha_fin);

  this.spinner.show();
  this.targetService.get_mostrar_AltasBajasTarget_boticasFarmacias( this.formParamsFiltro.value, this.opcionTarget, fechaIni, fechaFin)
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
  this.inicializarFormulario();  
  this.formParams.patchValue({ "solicitante" : this.UsuarioLoggeadoGlobal, 'fechaSolicitud' : new Date() });  

  ///---- busqueda ------
  this.inicializarFormularioDireccion();
  this.medicosDet =[];
  this.filtrarMedicos = '';
///---- fin de busqueda ------


  setTimeout(()=>{ // 
    $('#modal_mantenimiento').modal('show');  
  },0); 
} 
  
 
 

get_buscarBoticasFarmacias(){  


  if (this.formParamsDirection.value.codigo_departamento == '' || this.formParamsDirection.value.codigo_departamento == 0 || this.formParamsDirection.value.codigo_departamento == null)  {
    this.alertasService.Swal_alert('error', 'Por favor seleccione el Departamento.');
    return 
  }
  if (this.formParamsDirection.value.codigo_provincia == '' || this.formParamsDirection.value.codigo_provincia == 0 || this.formParamsDirection.value.codigo_provincia == null)  {
    this.alertasService.Swal_alert('error', 'Por favor seleccione la Provincia.');
    return 
  }
  if (this.formParamsDirection.value.codigo_distrito == '' || this.formParamsDirection.value.codigo_distrito == 0 || this.formParamsDirection.value.codigo_distrito == null)  {
    this.alertasService.Swal_alert('error', 'Por favor seleccione el Distrito.');
    return 
  }


  this.spinner.show();
  this.targetService.get_buscarBoticasFarmacias( this.formParamsDirection.value, this.opcionTarget, this.idUserGlobal)
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


 

 keyPress(event: any) {
  this.funcionesglobalesService.verificar_soloNumeros(event)  ;
 }

  editar_target({ id_Target_cab, usuario, fechaSol, idEstado, descripcionEstado}){
  
    this.flag_modoEdicion = true;
    this.id_TargetCab_Global= id_Target_cab;
    this.idEstadoCabGlobal= idEstado;
    this.descripcionEstadoGlobal= descripcionEstado;
  
    this.medicosDet = [];
  
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
    this.targetService.get_altasBajas_detalleTarget_boticasFarmacias(this.id_TargetCab_Global, this.opcionTarget, this.idUserGlobal)
        .subscribe((res:RespuestaServer)=>{  
          Swal.close();    
            if (res.ok==true) {        
                this.medicosDet = res.data; 
            }else{
              this.alertasService.Swal_alert('error', JSON.stringify(res.data));
              alert(JSON.stringify(res.data));
            }
    })
  }  
  

   clearCheckeado(obj : any){ 

    let idMedico = obj.id_Medico;
    let chek = obj.checkeado;

    for (const med of this.medicosDet) {
       med.checkeado=false;
    }

    for (const med of this.medicosDet) {
      if (med.id_Medico ==idMedico ){
        med.checkeado= chek;
        break;
      } 
     }
   }


   async saveUpdate_target(){   

    if (this.medicosDet.length == 0) {
      this.alertasService.Swal_alert('error','Por favor primero busque el médico');
      return;
    }
    if (this.validacionCheckMarcado()==false){
      return;
    }

    const mediMarc = this.medicosDet.filter((med)=> med.checkeado);
    const { nro_contactos_byf } = this.datosEmpresa;
  
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

          if ( Number(med.nro_contactos) > Number(nro_contactos_byf) ) {
            this.alertasService.Swal_alert('error',`El numero de Contacto no puede ser mayor a  ${nro_contactos_byf}` );
            flagCantNull =true;
            break;
          }
      }
  
      if (flagCantNull) {
          return;
      }
    }

    let listMedicos :any =[];
    for (let obj of mediMarc) {
      listMedicos.push(obj.id_Medico + '_' + obj.nro_contactos );
    }   
  
    Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
    Swal.showLoading();   

    this.targetService.set_insert_update_altasBajas_Target_boticasFarmacias( this.id_TargetCab_Global, listMedicos.join(), this.opcionTarget, this.idUserGlobal ).subscribe((res:RespuestaServer)=>{
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


//-----  DIRECCIONES MEDICOS -------

  changeDepartamento(e:any){
    this.get_provincias(this.formParamsDirection.value.codigo_departamento);
  }
  
  changeProvincia(e:any){
    this.get_distritos( this.formParamsDirection.value.codigo_departamento, this.formParamsDirection.value.codigo_provincia);
  }
  
  get_provincias(codigo_departamento:string){
  
    if (codigo_departamento =='0') {
      this.provincias = [];
      this.distritos = [];
      this.formParamsDirection.patchValue({ "codigo_provincia": '0',"codigo_distrito": '0' }); 
    }else{
      Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Cargando Provincias, Espere por favor'  })
      Swal.showLoading();
      this.medicoService.get_provincias( codigo_departamento ).subscribe((res:RespuestaServer)=>{
        Swal.close();      
        if (res.ok==true) {         
          this.provincias = res.data;
        }else{
          this.spinner.hide();
          this.alertasService.Swal_alert('error', JSON.stringify(res.data));
          alert(JSON.stringify(res.data));
        }   
      })
    }
  
  }
  
  get_distritos(codigo_departamento:string,codigo_provincia:string ){
  
    if (codigo_provincia=='0') {
      this.distritos = [];
      this.formParamsDirection.patchValue({ "codigo_distrito": '0' }); 
    }else{
      Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Cargando Distritos, Espere por favor'  })
      Swal.showLoading();
      this.medicoService.get_distritos( codigo_departamento, codigo_provincia ).subscribe((res:RespuestaServer)=>{
        Swal.close();      
        if (res.ok==true) {         
          this.distritos = res.data;
        }else{
          this.spinner.hide();
          this.alertasService.Swal_alert('error', JSON.stringify(res.data));
          alert(JSON.stringify(res.data));
        }   
      })
    }
  
  }

 
}

