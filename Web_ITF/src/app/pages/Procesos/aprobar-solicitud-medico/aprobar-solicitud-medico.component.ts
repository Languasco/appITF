import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertasService } from '../../../services/alertas/alertas.service';
import { RespuestaServer } from '../../../models/respuestaServer.models';
import { FuncionesglobalesService } from '../../../services/funciones/funcionesglobales.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../../../services/login/login.service';
import Swal from 'sweetalert2';
import { combineLatest } from 'rxjs';
import { CategoriaService } from '../../../services/Mantenimientos/categoria.service';
import { EspecialidadService } from '../../../services/Mantenimientos/especialidad.service';
import { MedicoService } from '../../../services/Mantenimientos/medico.service';
import { ActividadService } from '../../../services/Mantenimientos/actividad.service';
import { SolicitudMedicoService } from '../../../services/Procesos/solicitud-medico.service';

declare var $:any;

@Component({
  selector: 'app-aprobar-solicitud-medico',
  templateUrl: './aprobar-solicitud-medico.component.html',
  styleUrls: ['./aprobar-solicitud-medico.component.css']
})

export class AprobarSolicitudMedicoComponent implements OnInit {

  formParamsFiltro : FormGroup;
  formParams: FormGroup;
  formParamsSolCab: FormGroup;
  formParamsSolDet: FormGroup;
  formParamsDirection: FormGroup;

  idUserGlobal :number = 0;
  UsuarioLoggeadoGlobal ="";
  id_MedicoGlobal :number = 0;

  idSol_CabGlobal  :number = 0;
  idEstadoGlobal  :number = 10;

  flag_modoEdicion :boolean =false;
  flagModo_EdicionDet :boolean =false;
  flag_modoEdicionSolicitud :boolean =false;

  medicos :any[]=[]; 
  filtrarMantenimiento = "";

  tabControlDetalle: string[] = ['DATOS GENERALES','DIRECCIONES'  ]; 
  selectedTabControlDetalle :any;


  categorias :any[]=[]; 
  especialidades :any[]=[]; 
  profesiones :any[]=[]; 
  departamentos :any[]=[]; 
  provincias :any[]=[]; 
  distritos :any[]=[]; 

  direccionDetalle :any[]=[];   
  solicitudCab :any[]=[];  
  solicitudDetalle :any[]=[]; 
  usuarios :any[]=[]; 
  estados :any[]=[]; 

  descripcionEstadoGlobal = '';
  titulo = '';

  // -------importaciones 
 
 
  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService,private funcionGlobalServices : FuncionesglobalesService, private medicoService : MedicoService , private categoriaService : CategoriaService, private especialidadService: EspecialidadService,private actividadService : ActividadService, private solicitudMedicoService :SolicitudMedicoService ) {         
    this.idUserGlobal = this.loginService.get_idUsuario();
    this.UsuarioLoggeadoGlobal = this.loginService.getSessionNombre();
  }
 
 ngOnInit(): void {
  this.selectedTabControlDetalle = this.tabControlDetalle[0];
   this.inicializarFormularioFiltro();
   this.inicializarFormularioSolicitud();
   this.inicializarFormularioSolicitud_Det();
   this.inicializarFormulario(); 
   this.inicializarFormularioDireccion();
   this.getCargarCombos();
 }

 inicializarFormularioFiltro(){ 
    this.formParamsFiltro= new FormGroup({
      idUsuario : new FormControl('0'),
      fecha_ini : new FormControl(new Date()),
      fecha_fin : new FormControl(new Date()),
      idEstado : new FormControl('0')
     }) 
 }

 inicializarFormulario(){ 
    this.formParams= new FormGroup({
      id_Medico: new FormControl('0'),
      id_Identificador_Medico: new FormControl('0'),
      cmp_medico: new FormControl(''),
      nombres_medico: new FormControl(''),
      apellido_paterno_medico: new FormControl(''),
      apellido_materno_medico: new FormControl(''),
      id_Categoria: new FormControl('0'),
      id_Especialidad1: new FormControl('0'),
      id_Especialidad2: new FormControl('0'),
      email_medico: new FormControl(''),
      fecha_nacimiento_medico: new FormControl( new Date() ),
      sexo_medico: new FormControl('M'),
      telefono_medico: new FormControl(''),
      estado: new FormControl('10'),
      usuario_creacion: new FormControl('0'),
    }) 
 }
 
 inicializarFormularioSolicitud(){ 
  this.formParamsSolCab= new FormGroup({
    id_Sol_Medico_cab: new FormControl('0'),
    solicitante: new FormControl(''),
    fechaSolicitud: new FormControl(new Date),
    descripcionSolicitud: new FormControl('')
  }) 
}

inicializarFormularioSolicitud_Det(){ 
  this.formParamsSolDet= new FormGroup({
    id_Sol_Medico_det: new FormControl('0'),
    aprobadorRechazador: new FormControl(''),
    fechaRespuesta: new FormControl(''),
    descripcionRespuesta: new FormControl(new Date),
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
    estado: new FormControl('1'),
    usuario_creacion: new FormControl('0'),
   }) 
}

 getCargarCombos(){ 

  this.spinner.show();
  combineLatest([  this.actividadService.get_usuarios(this.idUserGlobal),this.actividadService.get_estados(), this.categoriaService.get_categorias()  ])
  .subscribe( ([ _usuarios, _estados , _categorias])=>{
    this.usuarios = _usuarios;
    this.estados = _estados.filter((estado) => estado.grupo_estado ==='tbl_Sol_Medico_Cab'); 
    this.categorias = _categorias;

    this.formParamsFiltro.patchValue({ "idUsuario" : _usuarios[0].id_Usuario  });  

    this.spinner.hide(); 
  })

  combineLatest([ this.especialidadService.get_especialidades() , this.medicoService.get_profesiones() , this.medicoService.get_departamentos()])
  .subscribe( ([_especialidades, _profesiones, _departamentos  ])=>{

    this.especialidades = _especialidades;
    this.profesiones = _profesiones;
    this.departamentos = _departamentos;
  })
}

 mostrarInformacion_solicitudCabecera(){ 
      
      if (this.formParamsFiltro.value.fecha_ini == '' || this.formParamsFiltro.value.fecha_ini == null ) {
        this.alertasService.Swal_alert('error','Por favor seleccione la fecha inicial');
        return 
      } 
      if (this.formParamsFiltro.value.fecha_fin == '' || this.formParamsFiltro.value.fecha_fin == null ) {
        this.alertasService.Swal_alert('error','Por favor seleccione la fecha final');
        return 
      } 
    
      const fechaIni = this.funcionGlobalServices.formatoFecha(this.formParamsFiltro.value.fecha_ini);
      const fechaFin = this.funcionGlobalServices.formatoFecha(this.formParamsFiltro.value.fecha_fin);
    
      
      this.spinner.show();
      this.solicitudMedicoService.get_aprobarMostrar_medicos(this.formParamsFiltro.value, fechaIni, fechaFin)
          .subscribe((res:RespuestaServer)=>{  
              this.spinner.hide();
              if (res.ok==true) {        
                  this.solicitudCab = res.data; 
              }else{
                this.alertasService.Swal_alert('error', JSON.stringify(res.data));
                alert(JSON.stringify(res.data));
              }
      })
 }   
  
 cerrarModal(){
    setTimeout(()=>{ // 
      $('#modal_solicitudDetalle').modal('hide');  
    },0); 
 }

 nuevo(){
    this.selectedTabControlDetalle = this.tabControlDetalle[0];
    this.flag_modoEdicion = false;
    this.id_MedicoGlobal = 0;
    this.inicializarFormulario();  
    this.direccionDetalle =[];
    setTimeout(()=>{ // 
      $('#modal_solicitudDetalle').modal('show');  
    },100); 
 } 

 async saveUpdate(){ 
    
 if ( this.flag_modoEdicion==true) { 
     if (this.formParams.value.id_Medico == '' || this.formParams.value.id_Medico == 0) {
       this.alertasService.Swal_alert('error','No se cargó el id, por favor actulize su página');
       return 
     }   
  }
  if (this.formParams.value.id_Identificador_Medico == '' || this.formParams.value.id_Identificador_Medico == 0) {
    this.alertasService.Swal_alert('error','Por favor seleccione el Identificador Medico');
    return 
  }
  if (this.formParams.value.cmp_medico == '' || this.formParams.value.cmp_medico == null) {
    this.alertasService.Swal_alert('error','Por favor ingrese el Nro de colegio Medico');
    return 
  } 
  if (this.formParams.value.nombres_medico == '' || this.formParams.value.nombres_medico == null) {
    this.alertasService.Swal_alert('error','Por favor ingrese el nombre');
    return 
  } 
  if (this.formParams.value.apellido_paterno_medico == '' || this.formParams.value.apellido_paterno_medico == null) {
    this.alertasService.Swal_alert('error','Por favor ingrese el apellido paterno');
    return 
  } 
  if (this.formParams.value.apellido_materno_medico == '' || this.formParams.value.apellido_materno_medico == null) {
    this.alertasService.Swal_alert('error','Por favor ingrese el apellido materno');
    return 
  } 
  if (this.formParams.value.id_Categoria == '' || this.formParams.value.id_Categoria == 0) {
    this.alertasService.Swal_alert('error','Por favor selecccione la categoria');
    return 
  } 
  if (this.formParams.value.id_Especialidad1 == '' || this.formParams.value.id_Especialidad1 == 0) {
    this.alertasService.Swal_alert('error','Por favor seleccione la especialidad');
    return 
  } 
  if (this.formParams.value.fecha_nacimiento_medico == '' || this.formParams.value.fecha_nacimiento_medico == null) {
    this.alertasService.Swal_alert('error','Por favor seleccione o ingrese la fecha de nacimiento');
    return 
  } 
 
  this.formParams.patchValue({ "usuario_creacion" : this.idUserGlobal });

  if ( this.flag_modoEdicion==false) { //// nuevo  

     Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
     Swal.showLoading();

     this.medicoService.set_save_medico(this.formParams.value).subscribe((res:RespuestaServer)=>{
       Swal.close();    
       if (res.ok ==true) {     
         this.flag_modoEdicion = true;
         this.formParams.patchValue({ "id_Medico" : Number(res.data[0].id_Medico) });
         this.id_MedicoGlobal = res.data[0].id_Medico;

         ///----- insertando el tabla de solicitudes detalle ------
         const solDet = {
          id_Sol_Medico_Det : 0,
          id_Sol_Medico_Cab :  this.idSol_CabGlobal,
          id_Medico : res.data[0].id_Medico,
          usuario_creacion : this.idUserGlobal,
          estado_sol_medico_det : 10
         }

         this.solicitudMedicoService.set_save_solicitudMedicoDet(solDet).subscribe((res:RespuestaServer)=>{
          Swal.close();    
          if (res.ok ==true) {  
            
            this.selectedTabControlDetalle = this.tabControlDetalle[1];
            this.detalleSolicitudMedicos();

            this.alertasService.Swal_Success('Se agrego el medico a la solicitud..');
          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }
        })          
         ///---------- fin insertando el tabla de solicitudes detalle
         
       }else{
         this.alertasService.Swal_alert('error', JSON.stringify(res.data));
         alert(JSON.stringify(res.data));
       }
     })
     
   }else{ /// editar

     Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Actualizando, espere por favor'  })
     Swal.showLoading();
     this.medicoService.set_edit_medico(this.formParams.value , this.formParams.value.id_Medico).subscribe((res:RespuestaServer)=>{
       Swal.close(); 
       if (res.ok ==true) { 
         
        const { descripcion_identificador_medico } = this.profesiones.find((prof)=> prof.id_Identificador_Medico  ==  this.formParams.value.id_Identificador_Medico);
        const { codigo_categoria } = this.categorias.find((cat)=> cat.id_Categoria  ==  this.formParams.value.id_Categoria);
        const { codigo_especialidad } = this.especialidades.find((esp)=> esp.id_Especialidad  ==  this.formParams.value.id_Especialidad1);
         

         for (const obj of this.solicitudDetalle) {
           if (obj.id_Medico == this.formParams.value.id_Medico ) {

              obj.id_Identificador_Medico= this.formParams.value.id_Identificador_Medico ; 
              obj.descripcion_identificador_medico =  descripcion_identificador_medico ; 
              obj.cmp_medico= this.formParams.value.cmp_medico ; 

              obj.nombres_medico= this.formParams.value.nombres_medico ; 
              obj.apellido_paterno_medico= this.formParams.value.apellido_paterno_medico ; 
              obj.apellido_materno_medico= this.formParams.value.apellido_materno_medico ; 

              obj.id_Categoria= this.formParams.value.id_Categoria ; 
              obj.codigo_categoria= codigo_categoria ; 

              obj.id_Especialidad1= this.formParams.value.id_Especialidad1 ; 
              obj.codigo_especialidad= codigo_especialidad ; 

              obj.id_Especialidad2= this.formParams.value.id_Especialidad2 ; 
              obj.email_medico= this.formParams.value.email_medico ; 
              obj.fecha_nacimiento_medico= this.formParams.value.fecha_nacimiento_medico ; 
              obj.sexo_medico= this.formParams.value.sexo_medico ; 
              obj.telefono_medico= this.formParams.value.telefono_medico ; 
              
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

 editar({ id_Medico, id_Identificador_Medico, cmp_medico, nombres_medico, apellido_paterno_medico, apellido_materno_medico, id_Categoria, id_Especialidad1, 
  id_Especialidad2, email_medico, fecha_nacimiento_medico,fechaNacimientoMedico, sexo_medico, telefono_medico, estado }){

  this.flag_modoEdicion=true;
  this.id_MedicoGlobal = id_Medico;

  this.formParams.patchValue({ "id_Medico" : id_Medico,  "id_Identificador_Medico" : id_Identificador_Medico ,"cmp_medico" : cmp_medico, "nombres_medico" : nombres_medico,  "apellido_paterno_medico" : apellido_paterno_medico ,"apellido_materno_medico" : apellido_materno_medico,  "id_Categoria" : id_Categoria,  "id_Especialidad1" : id_Especialidad1 ,"id_Especialidad2" : id_Especialidad2, 
   "email_medico" : email_medico, "fecha_nacimiento_medico" : new Date(fechaNacimientoMedico) , "sexo_medico" : sexo_medico ,"telefono_medico" : telefono_medico,   
   "estado" : estado, "usuario_creacion" : this.idUserGlobal 
  });
   
  //----obteniendo las direcciones ----
  this.getDireccionesDet();

   setTimeout(()=>{ // 
    this.selectedTabControlDetalle = this.tabControlDetalle[0];
    $('#modal_solicitudDetalle').modal('show');  
  },0);  

 } 

 eliminar(objBD:any){

   this.alertasService.Swal_Question('Sistemas', 'Esta seguro de eliminar ?')
   .then((result)=>{
     if(result.value){

       Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
       Swal.showLoading();
       this.medicoService.set_eliminar_medico(objBD.id_Medico, objBD.id_Sol_Medico_Det).subscribe((res:RespuestaServer)=>{
         Swal.close();        
         if (res.ok ==true) { 
           
          var index = this.solicitudDetalle.indexOf( objBD );  
          this.solicitudDetalle.splice( index, 1 );

         }else{
           this.alertasService.Swal_alert('error', JSON.stringify(res.data));
           alert(JSON.stringify(res.data));
         }
       })
        
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

guardarDetalle_direccion(){
  
  if ( this.id_MedicoGlobal == 0 || this.id_MedicoGlobal == null)  {
    this.alertasService.Swal_alert('error', 'Debe de grabar primero el Medico');
    return 
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
 

  Swal.fire({
    icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'
  })
  Swal.showLoading();

  this.formParamsDirection.patchValue({ "id_Medico": this.id_MedicoGlobal ,"usuario_creacion" :this.idUserGlobal }); 

  if (this.flagModo_EdicionDet ==false) { /// nuevo

      if (this.verificarDireccionCargada( this.formParamsDirection.value.direccion_medico_direccion ) ==true) {
        this.alertasService.Swal_alert('error', 'La direccion ya se cargo, verifique ..');
        return;
      }

      this.medicoService.set_save_direccionMedico(this.formParamsDirection.value).subscribe((res:RespuestaServer)=>{  
        Swal.close();
        if (res.ok) {   
          this.formParams.patchValue({"id_Medicos_Direccion": res.data});
          this.getDireccionesDet();
        }else{
          this.alertasService.Swal_alert('error', JSON.stringify(res.data));
          alert(JSON.stringify(res.data));
        }    
      })

  }else{/// editar

      this.medicoService.set_edit_direccionMedico(this.formParamsDirection.value,this.formParamsDirection.value.id_Medicos_Direccion).subscribe((res:RespuestaServer)=>{  
        Swal.close();
        if (res.ok) {   

           for (const objdetalle of this.direccionDetalle) {
             if (objdetalle.id_Medicos_Direccion == this.formParamsDirection.value.id_Medicos_Direccion ) {
                objdetalle.codigo_departamento = this.formParamsDirection.value.codigo_departamento;
                objdetalle.codigo_provincia = this.formParamsDirection.value.codigo_provincia;
                objdetalle.codigo_distrito = this.formParamsDirection.value.codigo_distrito;
                objdetalle.direccion_medico_direccion = this.formParamsDirection.value.direccion_medico_direccion;
                objdetalle.referencia_medico_direccion = this.formParamsDirection.value.referencia_medico_direccion;
                break;
             }
           }
           this.blank_Direccion();

        }else{
          this.alertasService.Swal_alert('error', JSON.stringify(res.data));
          alert(JSON.stringify(res.data));
        }    
      })      
  }
}

verificarDireccionCargada(direccionmedicodireccion: string){  
  var flagRepetida=false;
  for (const obj of this.direccionDetalle) {
    if (  obj.direccion_medico_direccion.toUpperCase() == direccionmedicodireccion.toUpperCase()  ) {
         flagRepetida = true;
         break;
    }
  }
  return flagRepetida;
}

modificarDireccion({id_Medicos_Direccion, id_Medico, codigo_departamento, codigo_provincia, codigo_distrito, direccion_medico_direccion, referencia_medico_direccion, estado,  }){    

  
  if (codigo_departamento =='0') {
    this.provincias = [];
    this.distritos = [];

    setTimeout(() => {
      this.formParamsDirection.patchValue({
        "id_Medicos_Direccion"  : id_Medicos_Direccion ,
        "id_Medico"  : this.id_MedicoGlobal, "codigo_departamento":codigo_departamento, "codigo_provincia":codigo_provincia , "codigo_distrito":codigo_distrito,
        "direccion_medico_direccion"  : direccion_medico_direccion ,"referencia_medico_direccion"  : referencia_medico_direccion , "estado"  : 1 ,
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
              "id_Medico"  : this.id_MedicoGlobal, "codigo_departamento":codigo_departamento, "codigo_provincia":codigo_provincia , "codigo_distrito":codigo_distrito,
              "direccion_medico_direccion"  : direccion_medico_direccion ,"referencia_medico_direccion"  : referencia_medico_direccion ,
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
                "id_Medico"  : this.id_MedicoGlobal, "codigo_departamento":codigo_departamento, "codigo_provincia":codigo_provincia , "codigo_distrito":codigo_distrito,
                "direccion_medico_direccion"  : direccion_medico_direccion ,"referencia_medico_direccion"  : referencia_medico_direccion ,
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
  
  this.flagModo_EdicionDet= true;           
  console.log(  this.formParamsDirection.value)  
}
 
eliminarDireccion(item:any){   
  console.log(item)

  Swal.fire({
    icon: 'info', allowOutsideClick: false,allowEscapeKey: false,text: 'Espere por favor'
  })
  Swal.showLoading();
   this.medicoService.get_delete_direccionMedico(item.id_Medicos_Direccion).subscribe((res:RespuestaServer)=>{
    Swal.close();
    if (res.ok) { 
        var index = this.direccionDetalle.indexOf( item );
        this.direccionDetalle.splice( index, 1 );
        this.blank_Direccion();
    }else{
      this.alertasService.Swal_alert('error', JSON.stringify(res.data));
      alert(JSON.stringify(res.data));
    }
  })

}
  
  getDireccionesDet(){

    this.direccionDetalle =[];
    this.medicoService.get_mostrar_direccionMedicos(this.id_MedicoGlobal).subscribe((res:RespuestaServer)=>{
     if (res.ok) {            
       this.direccionDetalle = res.data; 
       this.blank_Direccion();
     }else{
       this.alertasService.Swal_alert('error', JSON.stringify(res.data));
       alert(JSON.stringify(res.data));
       this.blank_Direccion();
     }   
    })        
  }
  
  blank_Direccion(){
    this.flagModo_EdicionDet= false;
    this.inicializarFormularioDireccion();
    this.provincias = [];
    this.distritos = []
  
  }
 
//-----  SOLICITUD NUEVO MEDICO -------


  cerrarModal_solicitud(){
    setTimeout(()=>{ // 
      $('#modal_solicitud').modal('hide');  
    },0); 
  }
  
  nuevoSolicitud(){
    this.flag_modoEdicionSolicitud = false;
    this.inicializarFormularioSolicitud();      
    this.solicitudDetalle =[];

    this.idSol_CabGlobal = 0;
    this.id_MedicoGlobal = 0;
    this.idEstadoGlobal = 10;
    this.formParamsSolCab.patchValue({ "solicitante" : this.UsuarioLoggeadoGlobal, 'fechaSolicitud' : new Date() });
  
    setTimeout(()=>{ // 
      $('#modal_solicitud').modal('show');  
    },0); 
  } 
    
  async saveUpdate_solicitudCabecera(){ 
      
    if ( this.flag_modoEdicionSolicitud==true) { //// nuevo
        if (this.formParamsSolCab.value.id_Sol_Medico_cab == '' || this.formParamsSolCab.value.id_Sol_Medico_cab == 0) {
          this.alertasService.Swal_alert('error','No se cargó el id, por favor actulize su página');
          return 
        }   
     }
     if (this.formParamsSolCab.value.descripcionSolicitud == '' || this.formParamsSolCab.value.descripcionSolicitud == 0) {
       this.alertasService.Swal_alert('error','Por favor agreguele una descripcion');
       return 
     }  

     const solCab = {
      mensaje_sol_medico_cab : this.formParamsSolCab.value.descripcionSolicitud,
      usuario_creacion : this.idUserGlobal,
      estado_sol_medico_cab : '10'
    }
   
     if ( this.flag_modoEdicionSolicitud==false) { //// nuevo  
   
        Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Creando la cabecera de la solicitud, Espere por favor'  })
        Swal.showLoading();

        this.solicitudMedicoService.set_save_solicitudMedicoCab(solCab).subscribe((res:RespuestaServer)=>{
          Swal.close();    
          if (res.ok ==true) {     

            this.flag_modoEdicionSolicitud = true;
            this.formParamsSolCab.patchValue({ "id_Sol_Medico_cab" : Number(res.data) });
            this.idSol_CabGlobal = Number(res.data);

            //-----enfocando el ingreso del medico ---
            this.nuevo();
            
            this.mostrarInformacion_solicitudCabecera();
            this.alertasService.Swal_Success('Se agrego correctamente la cabecera de la solicitud..');


          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }
        })
        
      }else{ /// editar

        Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Actualizando la Cabecera de la solicitud, espere por favor'  })
        Swal.showLoading();
        this.solicitudMedicoService.set_edit_solicitudMedicoCab(solCab , this.formParamsSolCab.value.id_Sol_Medico_cab).subscribe((res:RespuestaServer)=>{
          Swal.close(); 
          if (res.ok ==true) { 
  
            for (const obj of this.solicitudCab) {
              if (obj.id_Sol_Medico_cab == this.formParamsSolCab.value.id_Sol_Medico_cab ) {   
                obj.mensaje_sol_medico_cab= this.formParamsSolCab.value.descripcionSolicitud ;             
                 break;
              }
            }
   
            this.alertasService.Swal_Success('Se actualizó la cabecera de la solicitud correctamente..');  
          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }
        })
      }
   
  } 
  
  
  detalleSolicitudMedicos(){ 
    this.solicitudMedicoService.get_solicitudMedicoDet(this.idSol_CabGlobal)
        .subscribe((res:RespuestaServer)=>{  
            if (res.ok==true) {        
                this.solicitudDetalle = res.data; 
            }else{
              this.alertasService.Swal_alert('error', JSON.stringify(res.data));
              alert(JSON.stringify(res.data));
            }
    })
  }  
  
  editar_solicitudCab({ id_Sol_Medico_cab, solicitante,fechaSolicitudFormateado, fechaSolicitud, descripcionSolicitud, fechaRespuesta, comentarioRespuesta, id_estado, descripcionEstado }){
  
    this.flag_modoEdicionSolicitud=true;
    this.idSol_CabGlobal = id_Sol_Medico_cab;

    this.idEstadoGlobal =id_estado;
    this.descripcionEstadoGlobal = descripcionEstado;

    this.titulo = 'CREADA';
    if (id_estado == 11) {
      this.titulo = 'Enviada';
    }
    if (id_estado == 12) {
      this.titulo = 'Rechazada';
    }
    if (id_estado == 13) {
     this.titulo = 'Aprobada';
    }
    this.formParamsSolCab.patchValue({ "id_Sol_Medico_cab" : id_Sol_Medico_cab, "solicitante" : solicitante, "fechaSolicitud" : new Date(fechaSolicitud), "descripcionSolicitud" : descripcionSolicitud });  
     
    //----obteniendo los medicos detalle Solicitud ----
    this.detalleSolicitudMedicos();
  
     setTimeout(()=>{ // 
      $('#modal_solicitud').modal('show');  
    },0);  
  
  } 

  open_modalAprobarRechazar(objSolicitudDet){    
    this.formParamsSolDet.patchValue({ "id_Sol_Medico_det" : objSolicitudDet.id_Sol_Medico_Det, "aprobadorRechazador" : this.UsuarioLoggeadoGlobal, "fechaRespuesta" : new Date(), "descripcionRespuesta" : '' });
    setTimeout(()=>{ // 
      $('#modal_aprobacion').modal('show');  
    },0)
  }

  async aprobarRechazarMedico(opcion:string){ 

    if (this.formParamsSolDet.value.id_Sol_Medico_det == '0' || this.formParamsSolDet.value.id_Sol_Medico_det == null) {
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
        this.solicitudMedicoService.set_aprobarRechazar_medicos(this.formParamsSolDet.value.id_Sol_Medico_det, this.formParamsSolDet.value.descripcionRespuesta, opcion, this.idUserGlobal ).subscribe((res:RespuestaServer)=>{
          Swal.close(); 
          if (res.ok ==true) {  
            //this.detalleSolicitudMedicos();

            this.mostrarInformacion_solicitudCabecera();
            this.alertasService.Swal_Success('Proceso realizado correctamente..');  
            this.cerrarModalAprobar();
            this.cerrarModal_solicitud();
          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }
        })
      }
    })  
  } 

    
cerrarModalAprobar(){
  setTimeout(()=>{ // 
    $('#modal_aprobacion').modal('hide');  
  },0); 
}
  
  

}