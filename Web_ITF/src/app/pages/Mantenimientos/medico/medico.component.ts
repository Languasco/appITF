
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
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.css']
})

export class MedicoComponent implements OnInit {

  formParamsFiltro : FormGroup;
  formParams: FormGroup;
  formParamsFile: FormGroup;
  formParamsDirection: FormGroup;

  idUserGlobal :number = 0;
  id_MedicoGlobal :number = 0;

  flag_modoEdicion :boolean =false;
  flagModo_EdicionDet :boolean =false;

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


  // -------importaciones 

  flagImportar=false;
  filesExcel:InputFileI[] = [];
  importacion:any [] = [];
 
  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService,private funcionGlobalServices : FuncionesglobalesService, private medicoService : MedicoService , private uploadService : UploadService, private categoriaService : CategoriaService, private especialidadService: EspecialidadService , private solicitudMedicoService : SolicitudMedicoService) {         
    this.idUserGlobal = this.loginService.get_idUsuario();
  }
 
 ngOnInit(): void {
  this.selectedTabControlDetalle = this.tabControlDetalle[0];
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
      profesional: new FormControl('0'),
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
      fecha_nacimiento_medico: new FormControl( new Date() ),
      sexo_medico: new FormControl('M'),
      telefono_medico: new FormControl(''),
      estado: new FormControl('1'),
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
  combineLatest([  this.categoriaService.get_categorias(), this.especialidadService.get_especialidades() , this.medicoService.get_profesiones() , this.medicoService.get_departamentos()])
  .subscribe( ([ _categorias, _especialidades, _profesiones, _departamentos  ])=>{
    this.categorias = _categorias;
    this.especialidades = _especialidades;
    this.profesiones = _profesiones;
    this.departamentos = _departamentos;
    this.spinner.hide(); 
  })
}

 mostrarInformacion(){ 
      this.spinner.show();
      this.medicoService.get_mostrar_medicos(this.formParamsFiltro.value)
          .subscribe((res:RespuestaServer)=>{  
              this.spinner.hide();
              if (res.ok==true) {        
                  this.medicos = res.data; 
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
    this.selectedTabControlDetalle = this.tabControlDetalle[0];
    setTimeout(()=>{ // 
      $('#txtcodigo').removeClass('disabledForm');
      $('#modal_mantenimiento').modal('show');  
    },0); 
 } 

 async saveUpdate(){ 
    
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
      
    const codMed  = await this.solicitudMedicoService.get_verificar_nuevoMedico(this.formParams.value.id_Identificador_Medico + '_' + this.formParams.value.cmp_medico );
    if (codMed) {
     Swal.close();
     this.alertasService.Swal_alert('error','El médico se encuentra registrado, verifique..');
     return;
    } 

     Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
     Swal.showLoading();

     this.medicoService.set_save_medico(this.formParams.value).subscribe((res:RespuestaServer)=>{
       Swal.close();    
       if (res.ok ==true) {     
         this.flag_modoEdicion = true;
         this.formParams.patchValue({ "id_Medico" : Number(res.data[0].id_Medico) });
         console.log(res.data[0])

         this.id_MedicoGlobal = res.data[0].id_Medico;
         this.medicos.push(res.data[0]);
         this.alertasService.Swal_Success('Se agrego correctamente..');
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
         

         for (const obj of this.medicos) {
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
              // obj.fecha_nacimiento_medico= new Date( this.formParams.value.fecha_nacimiento_medico) ; 
              obj.fechaNacimientoMedico=  this.formParams.value.fecha_nacimiento_medico ;             
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

  this.formParams.patchValue({ "id_Medico" : id_Medico,  "id_Identificador_Medico" : String(id_Identificador_Medico) ,"cmp_medico" : cmp_medico, "nombres_medico" : nombres_medico,  "apellido_paterno_medico" : apellido_paterno_medico ,"apellido_materno_medico" : apellido_materno_medico,  "id_Categoria" : id_Categoria,  "id_Especialidad1" : id_Especialidad1 ,"id_Especialidad2" : id_Especialidad2, 
   "email_medico" : email_medico, "fecha_nacimiento_medico" :  (fechaNacimientoMedico == '1900-01-01T00:00:00' ) ? null : new Date(fechaNacimientoMedico) , "sexo_medico" : sexo_medico ,"telefono_medico" : telefono_medico,   
   "estado" : estado, "usuario_creacion" : this.idUserGlobal 
  });
   
  //----obteniendo las direcciones ----
  this.getDireccionesDet();

  this.selectedTabControlDetalle = this.tabControlDetalle[0];

   setTimeout(()=>{ // 
    // $('#txtcodigo').addClass('disabledForm');
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
           
           for (const user of this.medicos) {
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

  if (this.formParamsDirection.value.nombre_institucion_direccion == '' || this.formParamsDirection.value.nombre_institucion_direccion == 0 || this.formParamsDirection.value.nombre_institucion_direccion == null)  {
    this.alertasService.Swal_alert('error', 'Por favor ingrese el nombre de la institución.');
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
                objdetalle.nombre_institucion_direccion = this.formParamsDirection.value.nombre_institucion_direccion;
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
; 
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
 this.uploadService.upload_Excel_medicos( this.filesExcel[0].file , this.idUserGlobal ).subscribe(
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
  window.open('./assets/format/FORMATO_ALTA_MEDICOS.xlsx');    
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


guardar_importacionMedicos(){
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
      this.uploadService.save_archivoExcel_medicos(this.idUserGlobal )
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


}