
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
import { SolicitudDireccionService } from '../../../services/Procesos/solicitud-direccion.service';
import { CategoriaService } from '../../../services/Mantenimientos/categoria.service';
import { EspecialidadService } from '../../../services/Mantenimientos/especialidad.service';
import { MedicoService } from '../../../services/Mantenimientos/medico.service';

declare var $:any;

@Component({
  selector: 'app-aprobar-solicitud-direccion',
  templateUrl: './aprobar-solicitud-direccion.component.html',
  styleUrls: ['./aprobar-solicitud-direccion.component.css']
})
 
export class AprobarSolicitudDireccionComponent implements OnInit {

  formParamsFiltro : FormGroup;
  formParams: FormGroup;
  formParamsMedico: FormGroup;
  formParamsDirection: FormGroup;

  formParamsSolDet: FormGroup;

  idUserGlobal :number = 0;
  UsuarioLoggeadoGlobal ="";
  flag_modoEdicion :boolean =false;

  solicitudesDireccionesCab :any[]=[]; 
  filtrarMantenimiento = "";

  usuarios :any[]=[]; 
  ciclos :any[]=[]; 
  ciclosM :any[]=[]; 

  duracionActividades :any[]=[]; 
  estados :any[]=[]; 

  
  categorias :any[]=[]; 
  especialidades :any[]=[]; 
  medicosDet:any[]=[]; 

  departamentos :any[]=[]; 
  provincias :any[]=[]; 
  distritos :any[]=[]; 
  idMedicosDireccion_Global  :number = 0;
  idSolMedico_Direccion_Global :number = 0;
  idEstado_Global :number = 0;
  descripcionEstadoGlobal = '';
  titulo = '';
  
  solicitante= '';
  fechaSolicitud= '';

  flagBloquearMedico = true;
 
  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService, private funcionesglobalesService : FuncionesglobalesService, private actividadService : ActividadService, private solicitudDireccionService :SolicitudDireccionService, private categoriaService :CategoriaService,   private  especialidadService : EspecialidadService, private medicoService : MedicoService ) {         
    this.idUserGlobal = this.loginService.get_idUsuario();
    this.UsuarioLoggeadoGlobal = this.loginService.getSessionNombre();
  }
 
   ngOnInit(): void {
     this.inicializarFormularioFiltro();
     this.inicializarFormularioMedico(); 
     this.inicializarFormularioDireccion();
     this.inicializarFormularioSolicitud_Det();
     this.getCargarCombos();
   }
  
   inicializarFormularioFiltro(){ 
      this.formParamsFiltro= new FormGroup({
        idUsuario : new FormControl('0'),
        idEstado : new FormControl('0')
       }) 
   }
   
   inicializarFormularioMedico(){ 
    this.formParamsMedico= new FormGroup({
      medico: new FormControl(''), 
      categoria: new FormControl(0),
      especialidad: new FormControl(0), 
      idMedico: new FormControl('0'), 
    }) 
  }

  inicializarFormularioDireccion(){ 
    this.formParamsDirection= new FormGroup({
      id_Medicos_Direccion: new FormControl('0'),
      id_Medico: new FormControl('0'),
      codigo_departamento: new FormControl('0'),
      codigo_provincia: new FormControl('0'),
      codigo_distrito: new FormControl('0'),
      direccion_medico_direccion: new FormControl(''),
      referencia_medico_direccion: new FormControl(''),
      nombre_institucion_direccion: new FormControl(''),
      estado: new FormControl('26'),
      usuario_creacion: new FormControl('0'),
     }) 
  }
  inicializarFormularioSolicitud_Det(){ 
    this.formParamsSolDet= new FormGroup({
      aprobadorRechazador: new FormControl(''),
      fechaRespuesta: new FormControl(''),
      descripcionRespuesta: new FormControl(new Date),
    }) 
  }
  

 getCargarCombos(){ 
  this.spinner.show();
  combineLatest([  this.actividadService.get_usuarios(this.idUserGlobal) , this.actividadService.get_estados() , this.categoriaService.get_categorias(), this.especialidadService.get_especialidades() , this.medicoService.get_departamentos() ])
  .subscribe( ([ _usuarios,_estados, _categorias , _especialidades, _departamentos])=>{

    this.usuarios = _usuarios;
    this.estados = _estados.filter((estado) => estado.grupo_estado =='tbl_Actividades');  

    this.categorias = _categorias;
    this.especialidades = _especialidades;
    this.departamentos = _departamentos;
 
    this.formParamsFiltro.patchValue({ "idUsuario" : _usuarios[0].id_Usuario  });  
    this.spinner.hide(); 
  })
}


 mostrarInformacion(){
 
    this.spinner.show();
    this.solicitudDireccionService.get_mostrarSolicitudesDireccionesCab( this.formParamsFiltro.value.idUsuario,  this.formParamsFiltro.value.idEstado)
        .subscribe((res:RespuestaServer)=>{  
            this.spinner.hide();
            if (res.ok==true) {        
                this.solicitudesDireccionesCab = res.data; 
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
    this.flagBloquearMedico = true ;

    this.idSolMedico_Direccion_Global = 0;
    this.idMedicosDireccion_Global = 0;
    this.idEstado_Global = 26;
    this.descripcionEstadoGlobal  = '';

    this.inicializarFormularioMedico(); 
    this.inicializarFormularioDireccion();
    setTimeout(()=>{ // 
      $('#modal_mantenimiento').modal('show');  
    },0); 
 }  



 async saveUpdate(){ 

  if (this.formParamsMedico.value.idMedico == '' || this.formParamsMedico.value.idMedico == 0) {
    this.alertasService.Swal_alert('error','por favor seleccione el Médico del Combo');
    return ;
  }   

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
  if (this.formParamsDirection.value.direccion_medico_direccion == '' || this.formParamsDirection.value.direccion_medico_direccion == 0 || this.formParamsDirection.value.direccion_medico_direccion == null)  {
    this.alertasService.Swal_alert('error', 'Por favor ingrese la direccion.');
    return 
  }
  if (this.formParamsDirection.value.nombre_institucion_direccion == '' || this.formParamsDirection.value.nombre_institucion_direccion == 0 || this.formParamsDirection.value.nombre_institucion_direccion == null)  {
    this.alertasService.Swal_alert('error', 'Por favor ingrese el nombre de la institución.');
    return 
  }

  this.formParamsDirection.patchValue({ "id_Medico": this.formParamsMedico.value.idMedico  ,"usuario_creacion" :this.idUserGlobal }); 


  if ( this.flag_modoEdicion==false) { //// nuevo  

     Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
     Swal.showLoading();

     this.medicoService.set_save_direccionMedico(this.formParamsDirection.value).subscribe((res:RespuestaServer)=>{  
       Swal.close();    
       if (res.ok ==true) {     
         this.flag_modoEdicion = true;
         this.idMedicosDireccion_Global = Number(res.data) 

        ///----- insertando el tabla de solicitudes direcciones ------ 
        const solDet = {
          id_Sol_Medico_Direccion : 0,
          id_Medicos_Direccion :  this.idMedicosDireccion_Global,
          id_Medico : this.formParamsMedico.value.idMedico,
          estado : 26,
          usuario_creacion : this.idUserGlobal,
          }

          this.spinner.show();
          this.solicitudDireccionService.set_save_solicitudDireccionCab(solDet).subscribe((res:RespuestaServer)=>{
            this.spinner.hide();
            if (res.ok==true) {      
              this.mostrarInformacion();
              this.cerrarModal();
              this.alertasService.Swal_Success('Se generó correctamente la solicitud de direccion del medico..');
            }else{
              this.alertasService.Swal_alert('error', JSON.stringify(res.data));
              alert(JSON.stringify(res.data));
            }
        })


       }else{
         this.alertasService.Swal_alert('error', JSON.stringify(res.data));
         alert(JSON.stringify(res.data));
       }
     })
     
   }else{ /// editar

     Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Actualizando, espere por favor'  })
     Swal.showLoading();
     this.medicoService.set_edit_direccionMedico(this.formParamsDirection.value,this.formParamsDirection.value.id_Medicos_Direccion).subscribe((res:RespuestaServer)=>{  
       Swal.close(); 
       if (res.ok ==true) {  


          ///----- insertando el tabla de solicitudes direcciones ------ 
          const solDet = {
              id_Sol_Medico_Direccion :  this.idSolMedico_Direccion_Global ,
              id_Medicos_Direccion :  this.idMedicosDireccion_Global,
              id_Medico : this.formParamsMedico.value.idMedico,
              estado : this.idEstado_Global,
              usuario_creacion : this.idUserGlobal,
            }
  
            this.spinner.show();
            this.solicitudDireccionService.set_edit_solicitudDireccionCab(solDet, this.idSolMedico_Direccion_Global ).subscribe((res:RespuestaServer)=>{
              this.spinner.hide();
              if (res.ok==true) {      
                this.mostrarInformacion();
                this.cerrarModal();
                this.alertasService.Swal_Success('Se generó correctamente la solicitud de direccion del medico..');
              }else{
                this.alertasService.Swal_alert('error', JSON.stringify(res.data));
                alert(JSON.stringify(res.data));
              }
          })
        


         


       }else{
         this.alertasService.Swal_alert('error', JSON.stringify(res.data));
         alert(JSON.stringify(res.data));
       }
     })
   }

 } 

 editar({ id_Sol_Medico_Direccion,id_Medicos_Direccion, id_Medico, idEstado,descripcionEstado, solicitante,fechaSolicitud }){

   this.flag_modoEdicion = true;   

   this.idSolMedico_Direccion_Global = id_Sol_Medico_Direccion;
   this.idMedicosDireccion_Global = id_Medicos_Direccion;
   this.idEstado_Global = idEstado;
   this.descripcionEstadoGlobal  = descripcionEstado;

   this.solicitante = solicitante;
   this.fechaSolicitud = fechaSolicitud;


   this.titulo = 'CREADA';
   if (idEstado == 26) {
     this.titulo = 'Enviada';
   }
   if (idEstado == 27) {
     this.titulo = 'Rechazada';
   }
   if (idEstado == 28) {
    this.titulo = 'Aprobada';
   }


   setTimeout(()=>{ // 
    $('#modal_mantenimiento').modal('show');  
  },0); 

   this.buscarMedico(id_Medico);
   this.buscarDireccion(id_Medicos_Direccion); 

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
         this.actividadService.set_anular_actividad(objBD.id_actividad).subscribe((res:RespuestaServer)=>{
           Swal.close();        
           if (res.ok ==true) { 
             
             for (const user of this.solicitudesDireccionesCab) {
               if (user.id_actividad == objBD.id_actividad ) {
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
  
   buscarMedico(idMedico:number){  
    this.spinner.show();
    this.solicitudDireccionService.get_buscarMedicos( this.formParamsMedico.value, idMedico, this.idUserGlobal)
        .subscribe((res:RespuestaServer)=>{  
            this.spinner.hide();
            if (res.ok==true) {   
                this.medicosDet = res.data; 
                if (idMedico == 0) {
                  this.alertasService.Swal_alert('success','Se encontro '  + this.medicosDet.length + ' medicos en la busqueda, verifique el combo de médicos');
                  if (this.medicosDet.length > 0) {

                    if (this.medicosDet.length ==1) {
                      setTimeout(()=>{ // 
                        this.formParamsMedico.patchValue({ "idMedico" : String(this.medicosDet[0].id_Medico) });
                      },0);   
                    }                    
                    this.flagBloquearMedico =false;
                  }else{
                    this.flagBloquearMedico = true;
                  }

                }else{
                  setTimeout(()=>{ // 
                    this.formParamsMedico.patchValue({ "medico" : '' , "categoria" : '0', "especialidad" : '0', "idMedico" : String(idMedico) });
                  },0);    
                  this.flagBloquearMedico =false;          
                }
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

  buscarDireccion(idDireccion:number){ 

    Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Cargando Dirección, Espere por favor'  })
    Swal.showLoading();
    this.medicoService.get_buscarDireccionMedico_id(idDireccion).subscribe((res:RespuestaServer)=>{

    Swal.close();   
     if (res.ok) {   
       
      let listDireccion = [];
      listDireccion = res.data;

     const {id_Medicos_Direccion, id_Medico, codigo_departamento, codigo_provincia, codigo_distrito, direccion_medico_direccion, referencia_medico_direccion, nombre_institucion_direccion, estado }  = listDireccion[0];
 

      if (codigo_departamento =='0') {
        this.provincias = [];
        this.distritos = [];
    
        setTimeout(() => {
          this.formParamsDirection.patchValue({
            "id_Medicos_Direccion"  : id_Medicos_Direccion ,
            "id_Medico"  : id_Medico, "codigo_departamento":codigo_departamento, "codigo_provincia":codigo_provincia , "codigo_distrito":codigo_distrito,
            "direccion_medico_direccion"  : direccion_medico_direccion ,"referencia_medico_direccion"  : referencia_medico_direccion  ,"nombre_institucion_direccion"  : nombre_institucion_direccion  , "estado"  : 1 ,
          }); 
        }, 0); 
    
      }else{
        this.medicoService.get_provincias( codigo_departamento ).subscribe((res:RespuestaServer)=>{
          Swal.close();      
          if (res.ok==true) {         
            this.provincias = res.data;
    
            if (codigo_provincia=='0') {
              
              this.distritos = [];
              setTimeout(() => {
                this.formParamsDirection.patchValue({
                  "id_Medicos_Direccion"  : id_Medicos_Direccion ,
                  "id_Medico"  : id_Medico, "codigo_departamento":codigo_departamento, "codigo_provincia":codigo_provincia , "codigo_distrito":codigo_distrito,
                  "direccion_medico_direccion"  : direccion_medico_direccion ,"referencia_medico_direccion"  : referencia_medico_direccion , "nombre_institucion_direccion"  : nombre_institucion_direccion ,
                  "estado"  : 1 ,
                }); 
              }, 0);  
    
            }else{
              this.medicoService.get_distritos( codigo_departamento, codigo_provincia ).subscribe((res:RespuestaServer)=>{
                Swal.close();      
                if (res.ok==true) {         
                  this.distritos = res.data;
                }else{
                  this.spinner.hide();
                  this.alertasService.Swal_alert('error', JSON.stringify(res.data));
                  alert(JSON.stringify(res.data));
                } 
    
                setTimeout(() => {
                  this.formParamsDirection.patchValue({
                    "id_Medicos_Direccion"  : id_Medicos_Direccion ,
                    "id_Medico"  : id_Medico, "codigo_departamento":codigo_departamento, "codigo_provincia":codigo_provincia , "codigo_distrito":codigo_distrito,
                    "direccion_medico_direccion"  : direccion_medico_direccion ,"referencia_medico_direccion"  : referencia_medico_direccion , "nombre_institucion_direccion"  : nombre_institucion_direccion ,
                    "estado"  : 1 ,
                  }); 
                }, 0);          
    
              })
            }
    
          }else{
            this.spinner.hide();
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }   
        })
      }
     }else{
       this.alertasService.Swal_alert('error', JSON.stringify(res.data));
       alert(JSON.stringify(res.data));
       Swal.close();   
     }   
    })        
  }

  cerrarModalAprobar(){
    setTimeout(()=>{ // 
      $('#modal_aprobacion').modal('hide');  
    },0); 
  }

  open_modalAprobarRechazar(){    
    this.formParamsSolDet.patchValue({ "aprobadorRechazador" : this.UsuarioLoggeadoGlobal, "fechaRespuesta" : new Date(), "descripcionRespuesta" : '' });
    setTimeout(()=>{ // 
      $('#modal_aprobacion').modal('show');  
    },0)
  }

  async aprobarRechazarDireccion(opcion:string){ 

    if (this.idSolMedico_Direccion_Global == null || this.idSolMedico_Direccion_Global == 0) {
      this.alertasService.Swal_alert('error','No se cargo el ID, por favor actualice la pagina..');
      return 
    }
  
    if (this.formParamsSolDet.value.descripcionRespuesta == '' || this.formParamsSolDet.value.descripcionRespuesta == null) {
      this.alertasService.Swal_alert('error','Por favor ingrese un mensaje de respuesta');
      return 
    }

    let mens = (opcion =='A') ? 'Esta seguro de Aprobar ?' : 'Esta seguro de Rechazar ?';

    if (opcion =='A') {
      mens = 'Esta seguro de Aprobar ?';
    }
    if (opcion =='R') {
      mens = 'Esta seguro de Rechazar ?';
    }
    if (opcion =='O') {
      mens = 'Esta seguro de Observar ?';
    }
   
    this.alertasService.Swal_Question('Sistemas', mens)
    .then((result)=>{
      if(result.value){
        Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Actualizando, espere por favor'  })
        Swal.showLoading();
        this.solicitudDireccionService.set_aprobarRechazar_direcciones(this.idSolMedico_Direccion_Global , this.formParamsSolDet.value.descripcionRespuesta, opcion, this.idUserGlobal ).subscribe((res:RespuestaServer)=>{
          Swal.close(); 
          if (res.ok ==true) {  
             this.mostrarInformacion();
            this.alertasService.Swal_Success('Proceso realizado correctamente..');  
            this.cerrarModalAprobar();
            this.cerrarModal();
          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }
        })
      }
    })  

  } 





}
