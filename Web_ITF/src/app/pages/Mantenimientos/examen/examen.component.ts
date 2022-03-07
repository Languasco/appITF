import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertasService } from '../../../services/alertas/alertas.service';
import { RespuestaServer } from '../../../models/respuestaServer.models';
import { FuncionesglobalesService } from '../../../services/funciones/funcionesglobales.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../../../services/login/login.service';
import Swal from 'sweetalert2';
import { UploadService } from '../../../services/Upload/upload.service';
import { ExamenService } from '../../../services/Mantenimientos/examen.service';

declare var $:any;

@Component({
  selector: 'app-examen',
  templateUrl: './examen.component.html',
  styleUrls: ['./examen.component.css']
})
 

export class ExamenComponent implements OnInit {

  formParamsFiltro : FormGroup;
  formParams: FormGroup;
  formParamsPreguntas: FormGroup;

  idUserGlobal :number = 0;
  flag_modoEdicion :boolean =false;

  usuarios :any[]=[]; 
  examenes :any[]=[]; 
  filtrarMantenimiento = "";
  alternativas :any[]=[]; 
  id_ExamenCab_global = 0;
  itemPregunta_global = 0;

  idEstadoGlobal = 32;
  descripcionEstadoGlobal = 'Activo';

  examenes_usuarios :any[]=[]; 
  examenes_preguntas :any[]=[]; 
  flag_modoEdicion_pregunta :boolean =false;
  flag_cerrar=false;
  tipo_pregunta_global = 0;
 
  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService,private funcionGlobalServices : FuncionesglobalesService, 
    private funcionesglobalesService : FuncionesglobalesService, private examenService : ExamenService , private uploadService : UploadService ) {         
    this.idUserGlobal = this.loginService.get_idUsuario();
  }
 
 ngOnInit(): void {
   this.inicializarFormularioFiltro();
   this.inicializarFormulario(); 
   this.inicializarFormulario_Preguntas();
   this.cargarUsuarios();
   setTimeout(()=>{ //
    $('.select2FiltroN').select2();
  },0);
 }

 inicializarFormularioFiltro(){ 
    this.formParamsFiltro= new FormGroup({
      fecha_ini : new FormControl(new Date()),
      fecha_fin : new FormControl(new Date()),
      idEstado : new FormControl('0')
     }) 
 }

 inicializarFormulario(){ 

  const fechaHora =  this.funcionGlobalServices.formatoFechaHoraSistema( new Date());

  this.formParams= new FormGroup({
      id_Examen_Rm_Cab: new FormControl('0'), 
      nombre_examen_rm_cab: new FormControl(''),
      fecha_examen: new FormControl(new Date()),
      tiempo_examen_rm: new FormControl(''), 
      estado : new FormControl('32'),   
      usuario_creacion : new FormControl(''),
      fecha_hora_inicio: new FormControl(fechaHora),
  }) 
 }

 inicializarFormulario_Preguntas(){ 
  this.formParamsPreguntas = new FormGroup({
    pregunta: new FormControl(''), 
    puntaje: new FormControl(''), 
    alternativa: new FormControl(''),
    es_correcta : new FormControl(false),
    tipo_pregunta: new FormControl(1),
  }) 
}

  cargarUsuarios(){
    this.spinner.show();
    this.examenService.get_mostrar_usuarios()
        .subscribe((res:RespuestaServer)=>{  
            this.spinner.hide();
           if (res.ok==true) {        
                this.usuarios = res.data; 
            }else{
              this.alertasService.Swal_alert('error', JSON.stringify(res.data));
              alert(JSON.stringify(res.data));
            }
    })
  }

 mostrarInformacion(){ 

  const fechaInicio  = this.funcionGlobalServices.formatoFecha(this.formParamsFiltro.value.fecha_ini);
  const fechaFin  = this.funcionGlobalServices.formatoFecha(this.formParamsFiltro.value.fecha_fin);

    this.spinner.show();
    this.examenService.get_mostrar_examenes(fechaInicio, fechaFin, this.formParamsFiltro.value.idEstado)
        .subscribe((res:RespuestaServer)=>{  
            this.spinner.hide();
            if (res.ok==true) {        
                this.examenes = res.data; 
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

    this.id_ExamenCab_global = 0;
    this.flag_modoEdicion = false;
    this.inicializarFormulario();  

    this.examenes_usuarios = [];
    this.examenes_preguntas = []; 

    this.itemPregunta_global = 0;
    this.flag_modoEdicion_pregunta = false;
    this.flag_cerrar = false; 

    setTimeout(()=>{ // 
      // $('#contenedorExamen').removeClass('disabledForm');
      $('#modal_mantenimiento').modal('show');  
    },0); 
 } 

 async saveUpdate(){ 

  if ( this.flag_modoEdicion==true) { //// nuevo
     if (this.formParams.value.id_Examen_Rm_Cab == '' || this.formParams.value.id_Examen_Rm_Cab == 0) {
       this.alertasService.Swal_alert('error','No se cargó el id, por favor actulize su página');
       return 
     }   
  }

  if (this.formParams.value.nombre_examen_rm_cab == '' || this.formParams.value.nombre_examen_rm_cab == 0) {
    this.alertasService.Swal_alert('error','Por favor ingrese el nombre del Examen');
    return 
  }

  if (this.formParams.value.tiempo_examen_rm == '' || this.formParams.value.tiempo_examen_rm == 0) {
    this.alertasService.Swal_alert('error','Por favor ingrese el Tiempo del Examen');
    return 
  } 

  if (this.formParams.value.fecha_hora_inicio == null || this.formParams.value.fecha_hora_inicio == '') {
    this.alertasService.Swal_alert('error','Por favor ingrese la fecha y hora de inicio del examen');
    return 
  }  
  this.formParams.patchValue({ "usuario_creacion" : this.idUserGlobal });
 


  if ( this.flag_modoEdicion==false) { //// nuevo  

     Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
     Swal.showLoading();

    //  const  codRol  = await this.examenService.get_verificar_codigoRol(this.formParams.value.codigo_perfil);
    //  if (codRol) {
    //   Swal.close();
    //   this.alertasService.Swal_alert('error','El codigo ya se encuentra registrada, verifique..');
    //   return;
    //  }    

     this.examenService.set_save_examenCab(this.formParams.value).subscribe((res:RespuestaServer)=>{
       Swal.close();    
       if (res.ok ==true) {     
         this.flag_modoEdicion = true;
         this.formParams.patchValue({ "id_Examen_Rm_Cab" : Number(res.data) });
         this.id_ExamenCab_global = Number(res.data);
       }else{
         this.alertasService.Swal_alert('error', JSON.stringify(res.data));
         alert(JSON.stringify(res.data));
       }
     })
     
   }else{ /// editar

     Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Actualizando, espere por favor'  })
     Swal.showLoading();
     this.examenService.set_edit_examenCab(this.formParams.value , this.formParams.value.id_Examen_Rm_Cab).subscribe((res:RespuestaServer)=>{
       Swal.close(); 
       if (res.ok ==true) {           

        //  for (const obj of this.examenes) {
        //    if (obj.id_Examen_Rm_Cab == this.formParams.value.id_Examen_Rm_Cab ) { 
        //       obj.descripcion = this.formParams.value.nombre_examen_rm_cab;
        //       obj.tiempo_examen_rm = this.formParams.value.tiempo_examen_rm              
        //       break;
        //    }
        //  }

        this.mostrarInformacion();

         this.alertasService.Swal_Success('Se actualizó correctamente..');  
       }else{
         this.alertasService.Swal_alert('error', JSON.stringify(res.data));
         alert(JSON.stringify(res.data));
       }
     })
   }

 } 

 keyPress(event: any) {
  this.funcionGlobalServices.verificar_soloNumerosSinPunto(event)  ;
 }
 
 abrirModal_preguntas(){
  this.generarNuevaPregunta();

   setTimeout(() => {
     $('#modal_preguntas').modal('show');
   }, 100);
   
 }

 generarNuevaPregunta(){

  this.inicializarFormulario_Preguntas();
  const itemMax = this.generadorCorrelativoExamen();

  this.itemPregunta_global = itemMax;
  this.alternativas = [];
  this.flag_modoEdicion_pregunta = false;

  setTimeout(() => {
    $('#contenedorAlternativa').removeClass('disabledForm');
    $("#rbMarcar").prop("checked", true);
  }, 0);

 }

 generadorCorrelativoExamen(){
  let itemMax = 0;
  if (this.examenes_preguntas.length == 0) {
    itemMax = 1;
  }else{
   const items = this.examenes_preguntas.map((item)=>{
      return item.item_pregunta;
   })  
   itemMax = Math.max(...items);
   itemMax +=1;
  }
   return itemMax;
 }
   
  agregarUsuariosExamen(){

    const cboUsuarioExamen = $("#cboUsuarioExamen").val();

    if (cboUsuarioExamen == '' || cboUsuarioExamen == 0) {
      this.alertasService.Swal_alert('error','Por favor seleccione un Usuario ');
      return 
    }  

    const usuario = this.examenes_usuarios.find((user) => user.id_Usuario == cboUsuarioExamen);

    if (usuario) {
      this.alertasService.Swal_alert('error','Ya se agrego ese usuario, verifique .. ');
      return 
    }

    const objusuarioExamen = {
      id_Examen_RM_Det_Usuarios : 0, 
      id_Examen_Rm_Cab : this.id_ExamenCab_global, 
      id_Usuario : cboUsuarioExamen
    }

    this.spinner.show();
    this.examenService.set_save_examenUsuario( objusuarioExamen )
        .subscribe((res:RespuestaServer)=>{  
            this.spinner.hide();
           if (res.ok==true) {        
                this.listarUsuariosExamen();

                setTimeout(()=>{ // 
                   $('#cboUsuarioExamen').val('0').trigger('change.select2');
                },0); 

            }else{
              this.alertasService.Swal_alert('error', JSON.stringify(res.data));
              alert(JSON.stringify(res.data));
            }
    })
  }

  listarUsuariosExamen(){
    this.spinner.show();
    this.examenService.get_listarUsuariosExamen( this.id_ExamenCab_global )
        .subscribe((res:RespuestaServer)=>{  
            this.spinner.hide();
           if (res.ok==true) {        
                this.examenes_usuarios = res.data;
          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }
    })
  }

  eliminarUsuariosExamen(objBD:any){
      this.alertasService.Swal_Question('Sistemas', 'Esta seguro de eliminar ?')
      .then((result)=>{
        if(result.value){
    
          Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
          Swal.showLoading();
          this.examenService.set_eliminar_UsuariosExamen(objBD.id_Examen_RM_Det_Usuarios).subscribe((res:RespuestaServer)=>{
            Swal.close();        
            if (res.ok ==true) { 
    
              var index = this.examenes_usuarios.indexOf( objBD );
              this.examenes_usuarios.splice( index, 1 );          
              this.alertasService.Swal_Success('Se eliminó correctamente..')  
    
            }else{
              this.alertasService.Swal_alert('error', JSON.stringify(res.data));
              alert(JSON.stringify(res.data));
            }

          })
           
        }
      }) 
  
  
  } 

  listarPreguntasExamen(){
    this.spinner.show();
    this.examenService.get_listarPreguntasExamen( this.id_ExamenCab_global )
        .subscribe((res:RespuestaServer)=>{  
            this.spinner.hide();
           if (res.ok==true) {        
                this.examenes_preguntas = res.data;
          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }
    })
  }

  eliminarPreguntaExamen(objBD:any){
    this.alertasService.Swal_Question('Sistemas', 'Esta seguro de eliminar la Pregunta ?')
    .then((result)=>{
      if(result.value){
  
        Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
        Swal.showLoading();
        this.examenService.set_eliminar_PreguntaExamen(objBD.id_Examen_Rm_Cab, objBD.item_pregunta ).subscribe((res:RespuestaServer)=>{
          Swal.close();        
          if (res.ok ==true) { 
  
            var index = this.examenes_preguntas.indexOf( objBD );
            this.examenes_preguntas.splice( index, 1 );          
            this.alertasService.Swal_Success('Se eliminó correctamente..')  
  
          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }

        })
         
      }
    }) 


  } 
  
  editarPreguntaExamen({id_Examen_Rm_Cab, item_pregunta, descripcion_pregunta, puntaje_pregunta, tipo_pregunta}){

    this.generarNuevaPregunta();
    this.spinner.show();

    setTimeout(() => {   

      $('#contenedorAlternativa').addClass('disabledForm');

      this.itemPregunta_global = item_pregunta;
      this.flag_modoEdicion_pregunta = true;
      this.tipo_pregunta_global = tipo_pregunta;

      this.formParamsPreguntas.patchValue({ "pregunta" : descripcion_pregunta , "puntaje" : puntaje_pregunta, "tipo_pregunta" :  tipo_pregunta  }); 
      if (tipo_pregunta == 1) {
        this.listandoPreguntasAlternativasExamen(this.id_ExamenCab_global, this.itemPregunta_global, true);
      } 

      if (tipo_pregunta == 1) {
        $("#rbMarcar").prop("checked", true);
      }else{
        this.spinner.hide();
        $("#rbEscribir").prop("checked", true);
        $('#modal_preguntas').modal('show');
      }
    }, 300);

  }
  
  listandoPreguntasAlternativasExamen(id_Examen_Rm_Cab:number, item_pregunta :number, mostrarModal:boolean){
    this.spinner.show();
    this.examenService.get_EditarPreguntasExamen( id_Examen_Rm_Cab, item_pregunta  )
    .subscribe((res:RespuestaServer)=>{  
        this.spinner.hide();
       if (res.ok==true) {    

           this.alternativas  = res.data;            
           if (mostrarModal) {
            $('#modal_preguntas').modal('show');
           }      

      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
})
  }

  eliminarAlternativa(objBD:any){
  
    this.alertasService.Swal_Question('Sistemas', 'Esta seguro de eliminar ?')
    .then((result)=>{
      if(result.value){
  
        Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
        Swal.showLoading();
        this.examenService.set_eliminar_AlternativaPreguntaExamen(objBD.id_Examen_RM_Det_Preguntas ).subscribe((res:RespuestaServer)=>{
          Swal.close();        
          if (res.ok ==true) { 
  
            var index = this.alternativas.indexOf( objBD );
            this.alternativas.splice( index, 1 );          
            this.alertasService.Swal_Success('Se eliminó correctamente..')  
  
          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }
        })
         
      }
    }) 
  
  }

  agregarPreguntaAlternativa(){

    if (this.formParamsPreguntas.value.pregunta == undefined || this.formParamsPreguntas.value.pregunta == '') {
      this.alertasService.Swal_alert('error','Por favor escribir la pregunta..');
      return 
    }   
    if (this.formParamsPreguntas.value.puntaje == '' || this.formParamsPreguntas.value.puntaje == 0) {
      this.alertasService.Swal_alert('error','Por favor ingrese el puntaje de la pregunta');
      return 
    }    
    
    if (this.formParamsPreguntas.value.alternativa == '' ) {
      this.alertasService.Swal_alert('error','Por favor ingresar una alternativa');
      return 
    } 
    
    let flagEncontro;  

    if (this.formParamsPreguntas.value.es_correcta) {
      flagEncontro = this.alternativas.find((alt)=> alt.es_respuesta ==1);
      if (flagEncontro) {
        this.alertasService.Swal_alert('error','Ya marco una alternativa como correcta previamente, verifique ..');
        return 
      }
    }
     
    let cant :number = this.alternativas.length + 1;
    const objPreguntaAlternativa ={
        id_Examen_RM_Det_Preguntas : '0' , 
        id_Examen_Rm_Cab : this.id_ExamenCab_global , 
        item_pregunta : this.itemPregunta_global , 
        descripcion_pregunta : this.formParamsPreguntas.value.pregunta.trim(), 
        puntaje_pregunta : this.formParamsPreguntas.value.puntaje , 
        item_alternativa : cant , 
        descripcion_alternativa : this.formParamsPreguntas.value.alternativa.trim(), 
        es_respuesta : (this.formParamsPreguntas.value.es_correcta)? 1: 0,
        tipo_pregunta : 1
    }

    Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
    Swal.showLoading();
    this.examenService.set_save_examenPregunta( objPreguntaAlternativa ).subscribe((res:RespuestaServer)=>{  
      Swal.close();
       if (res.ok==true) {     
        
        setTimeout(()=>{ // 
          this.formParamsPreguntas.patchValue({ "alternativa" : '', 'es_correcta': false});
        },0);  

        this.listandoPreguntasAlternativasExamen(this.id_ExamenCab_global, this.itemPregunta_global, false);
        if ( this.flag_modoEdicion_pregunta == false) {
             this.listarPreguntasExamen();
        }

        setTimeout(() => {   
          if ( this.alternativas.length > 0) {
            if (this.flag_modoEdicion_pregunta == false) {
              $('#contenedorAlternativa').addClass('disabledForm');  
            }
          }
        }, 2000);

      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
})




  }


  
  agregarPreguntaAlternativaEscribir(){

    if (this.formParamsPreguntas.value.pregunta == undefined || this.formParamsPreguntas.value.pregunta == '') {
      this.alertasService.Swal_alert('error','Por favor escribir la pregunta..');
      return 
    }   
    if (this.formParamsPreguntas.value.puntaje == '' || this.formParamsPreguntas.value.puntaje == 0) {
      this.alertasService.Swal_alert('error','Por favor ingrese el puntaje de la pregunta');
      return 
    }        
 
    const objPreguntaAlternativa ={
        id_Examen_RM_Det_Preguntas : '0' , 
        id_Examen_Rm_Cab : this.id_ExamenCab_global , 
        item_pregunta : this.itemPregunta_global , 
        descripcion_pregunta : this.formParamsPreguntas.value.pregunta.trim(), 
        puntaje_pregunta : this.formParamsPreguntas.value.puntaje , 
        item_alternativa : 1 , 
        descripcion_alternativa : '', 
        es_respuesta : 0,
        tipo_pregunta : 2
    }

    Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
    Swal.showLoading();
    this.examenService.set_save_examenPregunta( objPreguntaAlternativa ).subscribe((res:RespuestaServer)=>{  
      Swal.close();
       if (res.ok==true) {   

        this.listarPreguntasExamen();
        setTimeout(() => {    
            $('#contenedorAlternativa').addClass('disabledForm');  
        }, 100);
        
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
})




  }



  editar({ descripcion, descripcionEstado, fecha, idEstado, id_Examen_Rm_Cab, tiempo_examen_rm, fecha_hora_inicio  }){

   const fechaHora = fecha_hora_inicio.split(" ");
   const fechaHoraInicio = this.funcionGlobalServices.formatoFechaIngles(fechaHora[0]);

    this.flag_modoEdicion=true;
    this.formParams.patchValue({  "id_Examen_Rm_Cab" : id_Examen_Rm_Cab,  "nombre_examen_rm_cab" : descripcion , "fecha_examen" : (fecha) , "tiempo_examen_rm" : tiempo_examen_rm,   
                                   "estado" : idEstado, "usuario_creacion" : this.idUserGlobal, "fecha_hora_inicio" : fechaHoraInicio});
    this.id_ExamenCab_global = id_Examen_Rm_Cab;
    this.idEstadoGlobal = idEstado;
    this.descripcionEstadoGlobal = descripcionEstado;
    this.flag_cerrar = false;
    
    setTimeout(()=>{ // 
      $('#modal_mantenimiento').modal('show');  
    },0);  

    this.listarUsuariosExamen();
    this.listarPreguntasExamen();

  } 


  cerrarModal_preguntas(){

    const alternativas = this.alternativas.filter((alt)=> alt.es_respuesta == 1);

    if (  this.flag_modoEdicion_pregunta == true ) {

      if ( this.tipo_pregunta_global == 1) {
        if (this.alternativas.length > 0) {
          if ( alternativas.length == 0 ) {
            this.alertasService.Swal_alert('error','Tiene que marcar una Alternativa como correcta..');
            return;
          }
        }   
      }

      setTimeout(()=>{ //   
        $('#modal_preguntas').modal('hide');  
      },0);

    }else {

      if ( this.tipo_pregunta_global == 1) {
        if (this.alternativas.length > 0) {     
          if ( alternativas.length == 0 ) {
            this.alertasService.Swal_alert('error','Tiene que marcar una Alternativa como correcta..');
            return;
          } 
        } 
      }  

      setTimeout(()=>{ //   
        $('#modal_preguntas').modal('hide');  
      },0);
    }
    if ( this.tipo_pregunta_global == 1) {
      this.listarPreguntasExamen();
    }

  }
  

  cerrarExamen({ descripcion, descripcionEstado, fecha, idEstado, id_Examen_Rm_Cab, tiempo_examen_rm  }){
        
      this.flag_modoEdicion=true;
      this.formParams.patchValue({ "id_Examen_Rm_Cab" : id_Examen_Rm_Cab,  "nombre_examen_rm_cab" : descripcion , "fecha_examen" : (fecha) , "tiempo_examen_rm" : tiempo_examen_rm,   "estado" : idEstado, "usuario_creacion" : this.idUserGlobal });
      this.id_ExamenCab_global = id_Examen_Rm_Cab;
      this.idEstadoGlobal = idEstado;
      this.descripcionEstadoGlobal = descripcionEstado;
      this.flag_cerrar = true;
      
      setTimeout(()=>{ // 
        $('#modal_mantenimiento').modal('show');  
      },0);  
    
      this.listarUsuariosExamen();
      this.listarPreguntasExamen();
    
  } 
    
 cerrandoExamen(){

  if (this.examenes_usuarios.length == 0 ) {
    this.alertasService.Swal_alert('error','Por favor agregue usuarios para el Examen');
    return;
  }
  if (this.examenes_preguntas.length == 0 ) {
    this.alertasService.Swal_alert('error','Por favor agregue preguntas para el Examen');
    return;
  }

  this.alertasService.Swal_Question('Sistemas', 'Esta seguro de  cerrar ?')
  .then((result)=>{
    if(result.value){

      Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
      Swal.showLoading();
      this.examenService.set_cerrandoExamen( this.id_ExamenCab_global , this.idUserGlobal).subscribe((res:RespuestaServer)=>{
        Swal.close();        
        if (res.ok ==true) { 
          this.alertasService.Swal_Success('Se cerró correctamente..');  
          this.mostrarInformacion();
          this.cerrarModal();
        }else{
          this.alertasService.Swal_alert('error', JSON.stringify(res.data));
          alert(JSON.stringify(res.data));
        }
      })
       
    }
  }) 

 }

 activarExamen(objBD:any){
  
  
    this.alertasService.Swal_Question('Sistemas', 'Esta seguro de Activar ?')
    .then((result)=>{
      if(result.value){
  
        Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
        Swal.showLoading();
        this.examenService.set_activandoExamen(objBD.id_Examen_Rm_Cab, this.idUserGlobal).subscribe((res:RespuestaServer)=>{
          Swal.close();        
          if (res.ok ==true) { 
            
            this.mostrarInformacion();
            this.alertasService.Swal_Success('Se activo correctamente..')  
  
          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }
        })
         
      }
    }) 
  
 }

 changeTipoPregunta(tipo:number) {
  this.formParamsPreguntas.patchValue({ "tipo_pregunta" : tipo });
 }


}