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
import { ProgramacionService } from '../../../services/Procesos/programacion.service';
import { CategoriaService } from '../../../services/Mantenimientos/categoria.service';
import { EspecialidadService } from '../../../services/Mantenimientos/especialidad.service';
import { InputFileI } from '../../../models/inputFile.models';
import { UploadService } from '../../../services/Upload/upload.service';

declare var $:any;

@Component({
  selector: 'app-programacion',
  templateUrl: './programacion.component.html',
  styleUrls: ['./programacion.component.css']
})


export class ProgramacionComponent implements OnInit {

  formParamsFiltro : FormGroup;
  formParams: FormGroup;
  formParamsProd: FormGroup;

  idUserGlobal :number = 0;
  idUsuarioElegido_Global :number = 0;
  idProgramacionCab_Global :number = 0;
  idEstado_Global :number = 0;
  idCiclo_Global :number = 0;
  idVisitador_Global :number = 0;
  idMedico_Global:number = 0;

  flag_modoEdicion :boolean =false;

  programacionCab :any[]=[]; 
  filtrarMantenimiento = "";
  filtrarCab = "";
  filtrarDet = "";

  usuarios :any[]=[]; 
  ciclos :any[]=[]; 
 
  estados :any[]=[]; 
  categorias :any[]=[]; 
  especialidades :any[]=[]; 
  resultadosVisitas :any[]=[]; 

  direccionesMedicos :any[]=[]; 
  programacionDet :any[]=[]; 
  ismeridian: boolean = false;

  productos :any[]=[]; 
  stocks :any[]=[]; 
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

  rejaPromocional :any[]=[]; 

  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService, private funcionesglobalesService : FuncionesglobalesService, private actividadService : ActividadService, private categoriaService : CategoriaService, private programacionService : ProgramacionService, private especialidadService : EspecialidadService, private uploadService : UploadService) {         
    this.idUserGlobal = this.loginService.get_idUsuario();
  }
 
 ngOnInit(): void {
   this.inicializarFormularioFiltro();
   this.inicializarFormulario(); 
   this.inicializarFormularioProducto();
   this.getCargarCombos();
 }

 inicializarFormularioFiltro(){ 
    this.formParamsFiltro= new FormGroup({
      idUsuario : new FormControl('0'),
      idCiclo : new FormControl('0'),
      medico: new FormControl(''),
      categoria : new FormControl('0'),
      especialidad : new FormControl('0'),

      resultado : new FormControl('0'),
      idEstado : new FormControl('0')
     }) 
 }

 inicializarFormulario(){ 

  let timeProg= this.horalFormat(24,0);
  let timeReport = this.horalFormat(23,59);


    this.formParams= new FormGroup({

      id_Programacion_cab: new FormControl('0'),
      ciclo: new FormControl(''),
      visita: new FormControl(''),
      visitador: new FormControl(''),

      cmp: new FormControl(''),
      medico: new FormControl(''),
      categoria: new FormControl(''),

      especialidad: new FormControl(''),
      id_Medicos_Direccion : new FormControl('0'),
      fecha_programacion_programacion_cab : new FormControl(null),
      hora_programacion_programacion_cab : new FormControl(null),

      fecha_reporte_programacion_cab : new FormControl(null),
      hora_reporte_programacion_cab : new FormControl(null),
      id_resultado_visita : new FormControl('13'),
      visita_acompaniada_programacion_cab : new FormControl('NO'),
      datos_acompaniante_programacion_cab : new FormControl(''),
      estado_programacion_cab : new FormControl('22'),
      usuario_creacion: new FormControl('0'),
    }) 
 }
 
 inicializarFormularioProducto(){ 
  this.formParamsProd= new FormGroup({
    idProducto : new FormControl('0'),
    lote : new FormControl('0'),
    stock : new FormControl('0'),
    cantidad : new FormControl('0'),
    orden : new FormControl(''),
   }) 
}

 horalFormat(ini:number, fin:number){
  const timeIni = new Date();
  timeIni.setHours(ini);
  timeIni.setMinutes(fin);
  return timeIni;
 } 

 getCargarCombos(){ 
  this.spinner.show();
  combineLatest([  this.actividadService.get_usuarios_programacion(this.idUserGlobal), this.actividadService.get_ciclos() , this.actividadService.get_duracionActividades(),this.actividadService.get_estados(),
    this.categoriaService.get_categorias(), this.especialidadService.get_especialidades(),  this.programacionService.get_resultadosVisitas()])
  .subscribe( ([ _usuarios, _ciclos, _duracionActividades,_estados, _categorias, _especialidades, _resultadosVisitas ])=>{

    this.usuarios = _usuarios;
    this.ciclos = _ciclos;
    this.estados = _estados.filter((estado) => estado.grupo_estado =='tbl_Programacion_Cab');  
    this.categorias = _categorias;
    this.especialidades = _especialidades;
    this.resultadosVisitas = _resultadosVisitas;

    this.formParamsFiltro.patchValue({ "idUsuario" : _usuarios[0].id_Usuario });  
    this.spinner.hide(); 
  })
}


 mostrarInformacion(){
    if (this.formParamsFiltro.value.idCiclo == '' || this.formParamsFiltro.value.idCiclo == 0) {
      this.alertasService.Swal_alert('error','Por favor seleccione el ciclo');
      return 
    }
    if (this.formParamsFiltro.value.idUsuario == '' || this.formParamsFiltro.value.idUsuario == 0) {
      this.alertasService.Swal_alert('error','Por favor seleccione el usuario');
      return 
    }
 
    this.spinner.show();
    this.programacionService.get_mostrarProgramaciones( this.formParamsFiltro.value)
        .subscribe((res:RespuestaServer)=>{  
            this.spinner.hide();
            if (res.ok==true) {        
                this.programacionCab = res.data; 
            }else{
              this.alertasService.Swal_alert('error', JSON.stringify(res.data));
              alert(JSON.stringify(res.data));
            }
    })
 }   

 abrir_modalProgramacion(objProgramacion:any){
  this.flag_modoEdicion = false;
  this.idProgramacionCab_Global = objProgramacion.id_Programacion_cab;
  this.idEstado_Global = objProgramacion.idEstado;
  
  this.filtrarCab = '';
  this.filtrarDet = '';

  this.obteniendoDatosProgramacionCab();
  this.obteniendoDatosProgramacionDet();
 }

 cerrarModal(){
  setTimeout(()=>{ // 
    $('#modal_mantenimiento').modal('hide');  
  },0); 
 }

 obteniendoDatosProgramacionCab( ){ 
  this.spinner.show();
  this.programacionService.get_datosProgramacionCab( this.idProgramacionCab_Global )
      .subscribe((res:RespuestaServer)=>{  
          this.spinner.hide();
 

          if (res.ok==true) {                

            let datosCab : any  = res.data[0];
            const { id_Ciclo, ciclo, visita, idVisitador, visitador, cmp, id_Medico, medico, categoria, especialidad, id_Medicos_Direccion, fecha_programacion_programacion_cab, hora_programacion_programacion_cab, fecha_reporte_programacion_cab, hora_reporte_programacion_cab, id_resultado_visita, visita_acompaniada_programacion_cab, datos_acompaniante_programacion_cab } = datosCab;

            this.idCiclo_Global = id_Ciclo;
            this.idVisitador_Global = idVisitador;
            this.idMedico_Global = id_Medico;

            this.formParams.patchValue({ 
              "id_Programacion_cab" : this.idProgramacionCab_Global ,
              "ciclo" : ciclo  ,
              "visita" : visita  ,
              "visitador" : visitador  ,
        
              "cmp" : cmp  ,
              "medico" : medico ,
              "categoria" : categoria ,
        
              "especialidad" : especialidad ,
              "id_Medicos_Direccion" : id_Medicos_Direccion ,
              "fecha_programacion_programacion_cab" : (fecha_programacion_programacion_cab == '1900-01-01T00:00:00' || fecha_programacion_programacion_cab == null ) ? null :new Date(fecha_programacion_programacion_cab) ,
              "hora_programacion_programacion_cab" :  (hora_programacion_programacion_cab == '1900-01-01T00:00:00' || hora_programacion_programacion_cab == null ) ? null :new Date(hora_programacion_programacion_cab) ,
        
              "fecha_reporte_programacion_cab" :  (fecha_reporte_programacion_cab == '1900-01-01T00:00:00' || fecha_reporte_programacion_cab == null ) ? null :  new Date(fecha_reporte_programacion_cab) ,
              "hora_reporte_programacion_cab" : (hora_reporte_programacion_cab == '1900-01-01T00:00:00'  || hora_reporte_programacion_cab == null) ? null : new Date(hora_reporte_programacion_cab) ,
              "id_resultado_visita" : (id_resultado_visita == '0') ? 13 : id_resultado_visita  ,
              "visita_acompaniada_programacion_cab" : (visita_acompaniada_programacion_cab == '') ? 'NO' : 'SI'  ,
              "datos_acompaniante_programacion_cab" : datos_acompaniante_programacion_cab            
            });

            this.obteniendoDireccionesMedico( id_Medico );
            this.obteniendoDatosProductos();
            
            setTimeout(()=>{ // 
              $('#modal_mantenimiento').modal('show');  
            },0); 
 
          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }
  })
 }   

 obteniendoDatosProgramacionDet(){ 
  this.spinner.show();
  this.programacionService.get_datosProgramacionDet(  this.idProgramacionCab_Global )
      .subscribe((res:RespuestaServer)=>{  
          this.spinner.hide();
          console.log(res)
          if (res.ok==true) {         
              this.programacionDet = res.data;
          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }
  })
 } 

 obteniendoDireccionesMedico(idMedico:number){ 
    this.spinner.show();
    this.programacionService.get_direccionesMedicos(idMedico )
        .subscribe((res:RespuestaServer)=>{  
            this.spinner.hide();
            if (res.ok==true) {         
                this.direccionesMedicos = res.data; 
            }else{
              this.alertasService.Swal_alert('error', JSON.stringify(res.data));
              alert(JSON.stringify(res.data));
            }
    })
 }   

 onChange_visita(e:any){
  if (this.formParams.value.visita_acompaniada_programacion_cab == 'SI' ) {
    setTimeout(()=>{ // 
      $('#txtAcompaniante').removeClass('disabledForm');    
    },0); 
  }else{
    this.formParams.patchValue({ "datos_acompaniante_programacion_cab" : ''}); 
    setTimeout(()=>{ // 
      $('#txtAcompaniante').addClass('disabledForm');     
    },0); 
  }
 }

 async saveUpdate_programacion(){   

  let estadoProgramacion = 0;
 
  if (this.formParams.value.id_Medicos_Direccion == null || this.formParams.value.id_Medicos_Direccion == undefined || this.formParams.value.id_Medicos_Direccion =='0' ) {
    this.alertasService.Swal_alert('error', 'Por favor seleccione una Direccion');
   return;
  } 

  if (this.formParams.value.fecha_programacion_programacion_cab == null || this.formParams.value.fecha_programacion_programacion_cab == undefined || this.formParams.value.fecha_programacion_programacion_cab =='' ) {
    this.alertasService.Swal_alert('error', 'FECHA PROGRAMACION : seleccione la fecha de programacion ');
   return;
  }    
  if (this.formParams.value.hora_programacion_programacion_cab == null || this.formParams.value.hora_programacion_programacion_cab == undefined || this.formParams.value.hora_programacion_programacion_cab =='' ) {
    this.alertasService.Swal_alert('error', 'HORA PROGRAMACION : ingrese correctamente las Hora de programacion ( 0-24 )  y Minutos ( 0-60 )  ');
   return;
  } 

  if ( this.formParams.value.id_resultado_visita != '0' ) { 
    if (this.formParams.value.fecha_reporte_programacion_cab == null || this.formParams.value.fecha_reporte_programacion_cab == undefined || this.formParams.value.fecha_reporte_programacion_cab =='' ) {
      this.alertasService.Swal_alert('error', 'FECHA REPORTE : seleccione la fecha de reporte ');
     return;
    }   
    if (this.formParams.value.hora_reporte_programacion_cab == null || this.formParams.value.hora_reporte_programacion_cab == undefined || this.formParams.value.hora_reporte_programacion_cab =='' ) {
      this.alertasService.Swal_alert('error', 'HORA REPORTE : ingrese correctamente la Hora de reporte ( 0-24 )  y Minutos ( 0-60 ) ');
     return;
    } 
  }

  if ( this.formParams.value.id_resultado_visita == '13' || this.formParams.value.id_resultado_visita == 13 ) {
       if (this.programacionDet.length ==0   ) {
        this.alertasService.Swal_alert('error', 'Por favor ingrese al menos un producto');
        return;
       }
  }

  if ( this.formParams.value.id_resultado_visita == '0' || this.formParams.value.id_resultado_visita == 0 ) {
     this.formParams.patchValue({ "fecha_reporte_programacion_cab" : null,  "hora_reporte_programacion_cab" : null }); 
     estadoProgramacion = 23;
  }else{
     estadoProgramacion = 24;
  }

  const fechaIni = this.funcionesglobalesService.formatoFechaI(this.formParams.value.fecha_programacion_programacion_cab);
  const fechaFin = this.funcionesglobalesService.formatoFechaI(this.formParams.value.fecha_reporte_programacion_cab);

  // let fechaformatoStart = this.funcionesglobalesService.formatoFechaIngles(fechaIni);
  let fechaformatoStart = fechaIni;
  fechaformatoStart = fechaformatoStart + ' '+ this.funcionesglobalesService.formatoSoloHoras(this.formParams.value.hora_programacion_programacion_cab);
  
  let fechaformatoEnd = '';
  if (this.formParams.value.id_resultado_visita == '0') {
    fechaformatoEnd = null;
  }else{
    // fechaformatoEnd = this.funcionesglobalesService.formatoFechaIngles(fechaFin);  
    fechaformatoEnd =  fechaFin;
    fechaformatoEnd = fechaformatoEnd + ' '+ this.funcionesglobalesService.formatoSoloHoras(this.formParams.value.hora_reporte_programacion_cab);  
  }
 
  this.formParams.patchValue({"id_Programacion_cab" : this.idProgramacionCab_Global ,  "hora_programacion_programacion_cab" : fechaformatoStart, "hora_reporte_programacion_cab" : fechaformatoEnd, "usuario_creacion" : this.idUserGlobal , "estado_programacion_cab"  : estadoProgramacion});  
  
  if ( this.formParams.value.id_resultado_visita != '0') {     
    const fechaValida =  this.funcionesglobalesService.formatoFecha(this.formParams.value.fecha_reporte_programacion_cab);
    const resVerifica : any = await this.programacionService.get_verificar_visitaMedico(  this.idMedico_Global, fechaValida);
 
    if (resVerifica.ok ==true) { 
      if (resVerifica.data.length > 0 ) {
        Swal.close();
        this.alertasService.Swal_alert('error','Medico ya fue visitado en la fecha de reporte');
      }
    } 
  }

  this.alertasService.Swal_Question('Sistemas', 'Esta seguro de Grabar la informacion de la Visita ?')
  .then((result)=>{
    if(result.value){

      Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
      Swal.showLoading();   
    
      this.programacionService.set_update_programacionCab( this.formParams.value, this.idProgramacionCab_Global , fechaformatoStart, fechaformatoEnd ).subscribe((res:RespuestaServer)=>{
        Swal.close();    
        if (res.ok ==true) { 
 

          if (this.programacionDet.length > 0 ) {

            ///------- grabando el detalle ----

            let listProgramacionDet = [];

            for (const prog of this.programacionDet) {
              listProgramacionDet.push({
                id_Programacion_cab : this.idProgramacionCab_Global , 
                id_Producto : prog.idProducto , 
                lote_programacion_det : prog.lote, 
                cantidad_programacion_det : prog.cantidad, 
                orden_programacion_det : prog.orden,
                usuario_creacion : this.idUserGlobal
              })
            }
            
            Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Guardando el detalle, Espere por favor'  })
            Swal.showLoading();             
            this.programacionService.set_save_programacionDet( listProgramacionDet, this.idUserGlobal ).subscribe((res:RespuestaServer)=>{
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

          }else{
                this.mostrarInformacion();
                this.alertasService.Swal_Success('Proceso realizado correctamente..');  
                this.cerrarModal();
          }

        }else{
          this.alertasService.Swal_alert('error', JSON.stringify(res.data));
          alert(JSON.stringify(res.data));
        }
      }) 
       
    }
  }) 



 } 


 obteniendoDatosProductos(){ 
  this.spinner.show();
  this.programacionService.get_datosProductos( this.idCiclo_Global, this.idVisitador_Global )
      .subscribe((res:RespuestaServer)=>{  
          this.spinner.hide();
          if (res.ok==true) {         
              this.productos = res.data;
          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }
  })
 } 

//  ---- AGREGAR PRODUCTOS A LAS VISITAS

  cerrarModal_producto(){
    setTimeout(()=>{ // 
      $('#modal_producto').modal('hide');  
    },0); 
   }

   abrir_modalProducto(){

    setTimeout(()=>{ // 
      $('#modal_producto').modal('show');  
      this.inicializarFormularioProducto()
    },0); 
   }

   change_productos(idProducto:number){

    if (idProducto == 0 ) {
      this.stocks= [];
      this.formParamsProd.patchValue({ "lote" : '0', "stock" : '0', "cantidad" : '0', "orden" : '' }); 
      return ;
    }
    if (this.formParamsFiltro.value.idUsuario == '' || this.formParamsFiltro.value.idUsuario == 0) {
      this.alertasService.Swal_alert('error','No eligio el usuario, no puede ver el stock, verifique ..');
      return 
    }
 


    this.spinner.show();
    this.programacionService.get_datosStock( this.idCiclo_Global, this.formParamsFiltro.value.idUsuario , idProducto)
        .subscribe((res:RespuestaServer)=>{  
            this.spinner.hide();
            if (res.ok==true) {         
                this.stocks = res.data;
            }else{
              this.alertasService.Swal_alert('error', JSON.stringify(res.data));
              alert(JSON.stringify(res.data));
            }
    })
   }

   change_lote(stock:number){
     for (const lote of this.stocks  ) { 
        if (lote.codigoLote == stock ) {            
          this.formParamsProd.patchValue({ "stock" : lote.stock }); 
        }
     }


   }  

   
  keyPress(event: any) {
    this.funcionesglobalesService.verificar_soloNumeros(event)  ;
  }

  anadirProducto(){   

    const {codigo_producto , descripcion_producto} =  this.productos.find((pro)=> pro.id_Producto  ==  Number(this.formParamsProd.value.idProducto) );   

    if (this.verificarProductoCargado( this.formParamsProd.value.idProducto + '_' +  this.formParamsProd.value.lote) == true) {
      this.alertasService.Swal_alert('error', 'El ' + descripcion_producto + '  ya esta cargado , verifique ..');
      return;
    }else{

      if ( Number(this.formParamsProd.value.cantidad)  > Number(this.formParamsProd.value.stock)  ) {
        this.alertasService.Swal_alert('error', 'La cantidad a entregar debe ser menor al Stock , verifique ..');
        return;
      }

      if ( this.formParamsProd.value.orden == '' || this.formParamsProd.value.orden == null ) {
        this.alertasService.Swal_alert('error', 'Por favor ingrese un orden');
        return;
      }

      if ( this.formParamsProd.value.orden == '' || this.formParamsProd.value.orden == null ) {
        this.alertasService.Swal_alert('error', 'Por favor ingrese un orden');
        return;
      }

      if (this.verificarOrdenProductoCargado( this.formParamsProd.value.orden) == true) {
        this.alertasService.Swal_alert('error', 'El orden ' + this.formParamsProd.value.orden + '  ya esta cargado , verifique ..');
        return;
      }

      const product = {
        idProducto :  this.formParamsProd.value.idProducto , 
        codigoProducto : codigo_producto,
        producto : descripcion_producto,
        lote : this.formParamsProd.value.lote , 
        cantidad : this.formParamsProd.value.cantidad , 
        orden : this.formParamsProd.value.orden , 
      }
     this.programacionDet.push(product);

     //-----generando el ordenamiento ----
     this.programacionDet.sort((a, b)=> {
      if (a.orden > b.orden) {
        return 1;
      }
      if (a.orden < b.orden) {
        return -1;
      }
      return 0;
    });
 
     this.inicializarFormularioProducto();
 
    }


 

    
   }

   eliminarProducto(item:any){    
    const index = this.programacionDet.indexOf( item );
    this.programacionDet.splice( index, 1 );
  }


  verificarProductoCargado(idProductoLote: string){  
    var flagRepetida=false;
    for (const obj of this.programacionDet) {
      if (  obj.idProducto + '_' + obj.lote  == idProductoLote ) {
           flagRepetida = true;
           break;
      }
    }
    return flagRepetida;
  }

  verificarOrdenProductoCargado(orden: number){  
    var flagRepetida=false;
    for (const obj of this.programacionDet) {
      if (  Number(obj.orden) == Number(orden) ) {
           flagRepetida = true;
           break;
      }
    }
    return flagRepetida;
  }

  abrir_modalInformacion(objProgramacion:any){

    this.id_MedicoGlobal = objProgramacion.id_Medico;

    Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
    Swal.showLoading();
    this.programacionService.get_informacionMedico_Programacion( objProgramacion.id_Medico )
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

  abrir_modalRejaPromocional(objProgramacion:any){

    Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
    Swal.showLoading();
    this.programacionService.get_informacion_rejaPromocional( objProgramacion.idEspecialidad )
        .subscribe((res:RespuestaServer)=>{  
          Swal.close();    
          if (res.ok==true) {   
            
            this.rejaPromocional = res.data;
            setTimeout(()=>{ // 
              $('#modal_reja').modal('show');  
            },0);       

          }else{
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }
    })
  }

  cerrarModalReja(){
    setTimeout(()=>{ // 
      $('#modal_reja').modal('hide');  
    },0); 
  }
  
  cerrarModalInfo(){
    setTimeout(()=>{ // 
      $('#modal_informacion').modal('hide');  
    },0); 
  }


  open_modalImportacion(){ 
    setTimeout(() => { 
       $('#modal_importacion').modal('show');  
       $('#btnGrabarFormato1').removeClass('disabledForm');
       $('#btnGrabarFormato2').removeClass('disabledForm');
     }, 100);
  } 

  cerrarModal_importacion(){
    setTimeout(()=>{ // 
      $('#modal_importacion').modal('hide');  
    },0); 
  }

    
  downloadFormat(formato : number){
    if (formato == 1) {
      window.open('./assets/format/FORMATO_DATA1.xlsx');    
    }
    else if (formato == 2) {
      window.open('./assets/format/FORMATO_DATA2.xlsx');    
    }

  }

  subir_primerFormato(){

    this.alertasService.Swal_Question('Sistemas', 'Esta seguro de cargar el primer Formato ?')
    .then((result)=>{
      if(result.value){
 
        this.spinner.show();
        this.message = '';
        this.uploadService.upload_Excel_formato1()
        .subscribe((res:RespuestaServer) =>{  
            this.spinner.hide();   
            if (res.ok==true) { 
    
              this.alertasService.Swal_Success('Se cargó el Formato 1 correctamente..');
              //  setTimeout(() => {
              //   $('#btnGrabarFormato1').addClass('disabledForm');
              //  }, 100);     
    
            }else{
              this.alertasService.Swal_alert('error', JSON.stringify(res.data));
              this.message = JSON.stringify(res.data);
            }
            },(err) => {
              this.spinner.hide();
              this.message =  JSON.stringify(err);
            }
        );  
         
      }
    }) 



  }

  subir_segundoFormato(){

    this.alertasService.Swal_Question('Sistemas', 'Esta seguro de cargar el segundo Formato ?')
    .then((result)=>{
      if(result.value){
 
        this.spinner.show();
        this.message = '';
        this.uploadService.upload_Excel_formato2()
        .subscribe((res:RespuestaServer) =>{  
            this.spinner.hide();   
            if (res.ok==true) { 
               this.alertasService.Swal_Success('Se cargó el Formato 2 correctamente..');
    
              //  setTimeout(() => {
              //   $('#btnGrabarFormato2').addClass('disabledForm');
              //  }, 100);
    
            }else{
              this.alertasService.Swal_alert('error', JSON.stringify(res.data));   
              this.message = JSON.stringify(res.data);
            }
            },(err) => {
              this.spinner.hide();
              this.message =  JSON.stringify(err);
            }
        ); 
         
      }
    }) 


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

  
  limpiarFormato(opcionModal : number){

    this.alertasService.Swal_Question('Sistemas', 'Esta seguro de Eliminar la informacion, luego no hay marcha atrás ?')
    .then((result)=>{
      if(result.value){
 
          Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
          Swal.showLoading();
          this.programacionService.set_eliminarInformacionTemporal( opcionModal )
              .subscribe((res:RespuestaServer)=>{  
                Swal.close();    
                if (res.ok==true) {   
                   if (opcionModal == 1) {
                    this.alertasService.Swal_Success('Proceso de eliminación del Formato perfil 1 realizado correctamente..');  
                   }else{
                    this.alertasService.Swal_Success('Proceso de eliminación del Formato perfil 2 realizado correctamente..');  
                   }
         
                }else{
                  this.alertasService.Swal_alert('error', JSON.stringify(res.data));
                  alert(JSON.stringify(res.data));
                }
          })
         
      }
    }) 





  }

  
  
  
 


}