
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertasService } from '../../../services/alertas/alertas.service';
import { RespuestaServer } from '../../../models/respuestaServer.models';
import { FuncionesglobalesService } from '../../../services/funciones/funcionesglobales.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../../../services/login/login.service';
import Swal from 'sweetalert2';
import { UploadService } from '../../../services/Upload/upload.service';
import { combineLatest } from 'rxjs';
import { CategoriaService } from '../../../services/Mantenimientos/categoria.service';
import { EspecialidadService } from '../../../services/Mantenimientos/especialidad.service';
import { MedicoService } from '../../../services/Mantenimientos/medico.service';
import { InputFileI } from 'src/app/models/inputFile.models';
import { SolicitudMedicoService } from '../../../services/Procesos/solicitud-medico.service';

declare var $:any;

@Component({
  selector: 'app-boticas-farmacias',
  templateUrl: './boticas-farmacias.component.html',
  styleUrls: ['./boticas-farmacias.component.css']
})

export class BoticasFarmaciasComponent implements OnInit {

  formParamsFiltro : FormGroup;
  formParams: FormGroup;
  formParamsFile: FormGroup;
  formParamsDirection: FormGroup;

  idUserGlobal :number = 0;
  id_MedicoGlobal :number = 0;

  flag_modoEdicion :boolean =false;
  flagModo_EdicionDet :boolean =false;

  boticasFarmacias :any[]=[]; 
  filtrarMantenimiento = "";
  categorias :any[]=[]; 
  profesiones :any[]=[]; 
  departamentos :any[]=[]; 
  provincias :any[]=[]; 
  distritos :any[]=[]; 
  direccionDetalle :any[]=[]; 
  tipoVisitas :any[]=[]; 
  // -------importaciones 

  flagImportar=false;
  filesExcel:InputFileI[] = [];
  importacion:any [] = [];
 
  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService,private funcionGlobalServices : FuncionesglobalesService, private medicoService : MedicoService , private uploadService : UploadService, private categoriaService : CategoriaService, private especialidadService: EspecialidadService , private solicitudMedicoService : SolicitudMedicoService) {         
    this.idUserGlobal = this.loginService.get_idUsuario();
  }
 
 ngOnInit(): void {
 
   this.inicializarFormularioFiltro();
   this.inicializarFormulario(); 
   this.inicializarFormularioDireccion()
   this.getCargarCombos()
 }

 inicializarFormularioFiltro(){ 
    this.formParamsFiltro= new FormGroup({
      cmp: new FormControl(''),
      medico: new FormControl(''),
      email: new FormControl(''),
      categoria: new FormControl('0'),
      especialidad: new FormControl('0'),
      profesional: new FormControl('5'),
      idEstado : new FormControl('1')
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
      fecha_nacimiento_medico: new FormControl( null ),
      sexo_medico: new FormControl('M'),
      telefono_medico: new FormControl(''),
      estado: new FormControl('1'),
      id_tipo_visita: new FormControl('0'),
      usuario_creacion: new FormControl('0'),
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
    estado: new FormControl('1'),
    usuario_creacion: new FormControl('0'),
   }) 
}

 getCargarCombos(){ 
  this.spinner.show();
  combineLatest([  this.categoriaService.get_categorias(),  this.medicoService.get_profesiones() , this.medicoService.get_departamentos(), this.medicoService.get_tipoVisitas() ])
  .subscribe( ([ _categorias,  _profesiones, _departamentos, _tipoVisitas  ])=>{
    this.categorias = _categorias;
    this.profesiones = _profesiones.filter((p)=>(p.id_Identificador_Medico ==5 ||p.id_Identificador_Medico ==6 )  );
    this.departamentos = _departamentos;
    this.tipoVisitas = _tipoVisitas;
    this.spinner.hide(); 
  })
}

 mostrarInformacion(){ 
      this.spinner.show();
      this.medicoService.get_mostrar_boticasFarmacias(this.formParamsFiltro.value)
          .subscribe((res:RespuestaServer)=>{  
              this.spinner.hide();
              if (res.ok==true) {        
                  this.boticasFarmacias = res.data; 
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
    this.direccionDetalle =[];
    this.blank_Direccion();
    
    setTimeout(()=>{ // 
      $('#txtcodigo').removeClass('disabledForm');
      $('#modal_mantenimiento').modal('show');  
    },0); 
 } 

 async saveUpdate_boticasFarmacias(){ 
    
 if ( this.flag_modoEdicion==true) { //// nuevo
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

  if (this.formParams.value.id_Categoria == '' || this.formParams.value.id_Categoria == 0) {
    this.alertasService.Swal_alert('error','Por favor selecccione la categoria');
    return 
  }  

  if (this.formParams.value.id_tipo_visita == '' || this.formParams.value.id_tipo_visita == null ||  this.formParams.value.id_tipo_visita == '0' ) {
    this.alertasService.Swal_alert('error','Por favor seleccione el Tipo de visita');
    return 
  } 

  //----- validacion de direcciones
 
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
 
    
  const cmpMedico = this.formParams.value.cmp_medico ;  
  this.formParams.patchValue({ "usuario_creacion" : this.idUserGlobal, "cmp_medico" :cmpMedico  });
      
  Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
  Swal.showLoading();

  this.medicoService.set_save_medico_direccion(this.formParams.value, this.formParamsDirection.value).subscribe((res:RespuestaServer)=>{
    Swal.close();    
    if (res.ok ==true) {   
      this.mostrarInformacion();  
      if( this.flag_modoEdicion==false) { //// nuevo  
        this.alertasService.Swal_Success('Se agregó correctamente..');
      }else{
        this.alertasService.Swal_Success('Se actualizó correctamente..');  
      }
      this.cerrarModal();
    }else{
      this.alertasService.Swal_alert('error', JSON.stringify(res.data));
      alert(JSON.stringify(res.data));
    }
  })

 } 

 editar({ id_Medico, id_Identificador_Medico, cmp_medico, nombres_medico, id_Categoria, email_medico,telefono_medico, estado, id_tipo_visita  }){

  this.flag_modoEdicion=true;
  this.id_MedicoGlobal = id_Medico;

  this.formParams.patchValue({ "id_Medico" : id_Medico,  "id_Identificador_Medico" : String(id_Identificador_Medico) ,"cmp_medico" : cmp_medico, "nombres_medico" : nombres_medico,  
   "id_Categoria" : id_Categoria, "email_medico" : email_medico ,"telefono_medico" : telefono_medico,  "estado" : estado, "usuario_creacion" : this.idUserGlobal , "id_tipo_visita" :  (id_tipo_visita == null )? 0 : id_tipo_visita  
  });
   
  this.blank_Direccion();
  //----obteniendo las direcciones ----
  this.getDireccionesDet();

   setTimeout(()=>{ // 
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
       this.medicoService.set_anular_medico(objBD.id_Medico).subscribe((res:RespuestaServer)=>{
         Swal.close();        
         if (res.ok ==true) { 
           
           for (const user of this.boticasFarmacias) {
             if (user.id_Medico == objBD.id_Medico ) {
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
  

  modificarDireccion({id_Medicos_Direccion, id_Medico, codigo_departamento, codigo_provincia, codigo_distrito, direccion_medico_direccion, referencia_medico_direccion, nombre_institucion_direccion, estado,  }){    
  
    
    if (codigo_departamento =='0') {
      this.provincias = [];
      this.distritos = [];
  
      setTimeout(() => {
        this.formParamsDirection.patchValue({
          "id_Medicos_Direccion"  : id_Medicos_Direccion ,
          "id_Medico"  : this.id_MedicoGlobal, "codigo_departamento":codigo_departamento, "codigo_provincia":codigo_provincia , "codigo_distrito":codigo_distrito,
          "direccion_medico_direccion"  : direccion_medico_direccion ,"referencia_medico_direccion"  : referencia_medico_direccion , "estado"  : 1 , "nombre_institucion_direccion"  : nombre_institucion_direccion 
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
                "direccion_medico_direccion"  : direccion_medico_direccion ,"referencia_medico_direccion"  : referencia_medico_direccion , "nombre_institucion_direccion"  : nombre_institucion_direccion,
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
                  "direccion_medico_direccion"  : direccion_medico_direccion ,"referencia_medico_direccion"  : referencia_medico_direccion , "nombre_institucion_direccion"  : nombre_institucion_direccion,
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
   
  getDireccionesDet(){
    this.direccionDetalle =[];
    this.medicoService.get_mostrar_direccionMedicos(this.id_MedicoGlobal).subscribe((res:RespuestaServer)=>{
     if (res.ok) {          
      //  this.direccionDetalle = res.data; 
       setTimeout(()=>{ // 
        this.modificarDireccion(res.data[0])
      },0); 
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
 
//-----  CARGA MASIVA MEDICOS -------

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
    this.inicializarFormulario_file()
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
   this.uploadService.upload_Excel_boticasFarmacias( this.filesExcel[0].file , this.idUserGlobal ).subscribe(
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
    window.open('./assets/format/FORMATO_ALTA_BYF.xlsx');    
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
  

  guardar_importacionBoticasFarmacias(){
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
        this.uploadService.save_archivoExcel_boticasFarmacias(this.idUserGlobal )
        .subscribe((res:RespuestaServer) =>{  
            this.spinner.hide();   
            if (res.ok==true) { 
               this.alertasService.Swal_Success('Se grabó correctamente la información..');
  
               this.cerrarModal_importacion();
  
               setTimeout(() => {
                $('#btnGrabar').addClass('disabledForm');
               }, 100);
  
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
  
  keyPress(event: any) {
    this.funcionGlobalServices.verificar_soloNumeros(event)  ;
  }

  // BOTICAS Y FARMACIAS

  buscarRuc(){ 

   const nroRuc =  this.formParams.value.cmp_medico;
    Swal.fire({
      icon: 'info', allowOutsideClick: false,allowEscapeKey: false,text: 'Espere por favor'
    })
    Swal.showLoading();
     this.medicoService.get_consultandoRuc(nroRuc).subscribe((res:RespuestaServer)=>{
      Swal.close();
      if (res.ok) { 

        if (res.data.length > 0) {
          const { cmp_medico, nombres_medico, id_Categoria, email_medico, telefono_medico, id_tipo_visita }  = res.data[0];
          this.formParams.patchValue({
            "nombres_medico"  : nombres_medico ,
            "id_Categoria"  : id_Categoria ,
            "email_medico"  : email_medico ,
            "telefono_medico"  : telefono_medico ,
            "id_tipo_visita"  : id_tipo_visita ,
          });
        }else{
          this.formParams.patchValue({
            "nombres_medico"  : '' ,
            "id_Categoria"  : '0' ,
            "email_medico"  : '' ,
            "telefono_medico"  : '' ,
            "id_tipo_visita"  : '0' ,
          });
        }

      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
    })
  }

  changeDistritos(e:any){
    this.get_localesBoticasFarmacias( this.formParamsDirection.value.codigo_departamento, this.formParamsDirection.value.codigo_provincia, this.formParamsDirection.value.codigo_distrito );
  }

  get_localesBoticasFarmacias(codigo_departamento:string, codigo_provincia:string, codigo_distrito:string  ){
  
    if (codigo_distrito=='0') {
      this.direccionDetalle = [];
    }else{
      Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Cargando Locales, Espere por favor'  })
      Swal.showLoading();
      this.medicoService.get_localesBoticasFarmacias( codigo_departamento, codigo_provincia, codigo_distrito ).subscribe((res:RespuestaServer)=>{
        Swal.close();      
        if (res.ok==true) {         
          this.direccionDetalle = res.data;
        }else{
          this.spinner.hide();
          this.alertasService.Swal_alert('error', JSON.stringify(res.data));
          alert(JSON.stringify(res.data));
        }   
      })
    }
  
  }


}