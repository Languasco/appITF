
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
  idProgramacionCab_Global :number = 0;
  idCiclo_Global :number = 0;

  flag_modoEdicion :boolean =false;

  programacionCab :any[]=[]; 
  filtrarMantenimiento = "";

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
 
  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService, private funcionesglobalesService : FuncionesglobalesService, private actividadService : ActividadService, private categoriaService : CategoriaService, private programacionService : ProgramacionService, private especialidadService : EspecialidadService) {         
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
      id_resultado_visita : new FormControl('0'),
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
    stock : new FormControl(''),
    cantidad : new FormControl(''),
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
  combineLatest([  this.actividadService.get_usuarios(this.idUserGlobal), this.actividadService.get_ciclos() , this.actividadService.get_duracionActividades(),this.actividadService.get_estados(),
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
    // if (this.formParamsFiltro.value.idCiclo == '' || this.formParamsFiltro.value.idCiclo == 0) {
    //   this.alertasService.Swal_alert('error','Por favor seleccione el ciclo');
    //   return 
    // }
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
  this.obteniendoDatosProgramacionCab();

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
          console.log(res.data)

          if (res.ok==true) {                

            let datosCab : any  = res.data[0];
            const { id_Ciclo, ciclo, visita, visitador, cmp, id_Medico, medico, categoria, especialidad, id_Medicos_Direccion, fecha_programacion_programacion_cab, hora_programacion_programacion_cab, fecha_reporte_programacion_cab, hora_reporte_programacion_cab, id_resultado_visita, visita_acompaniada_programacion_cab, datos_acompaniante_programacion_cab } = datosCab;

            this.idCiclo_Global = id_Ciclo;

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
              "fecha_programacion_programacion_cab" : (fecha_programacion_programacion_cab == '01/01/1900 0:00:00' || fecha_programacion_programacion_cab == null ) ? null :new Date(fecha_programacion_programacion_cab) ,
              "hora_programacion_programacion_cab" :  (hora_programacion_programacion_cab == '01/01/1900 0:00:00' || hora_programacion_programacion_cab == null ) ? null :new Date(hora_programacion_programacion_cab) ,
        
              "fecha_reporte_programacion_cab" :  (fecha_reporte_programacion_cab == '01/01/1900 0:00:00' || fecha_reporte_programacion_cab == null ) ? null :  new Date(fecha_reporte_programacion_cab) ,
              "hora_reporte_programacion_cab" : (hora_reporte_programacion_cab == '01/01/1900 0:00:00'  || hora_reporte_programacion_cab == null) ? null : new Date(hora_reporte_programacion_cab) ,
              "id_resultado_visita" : id_resultado_visita,
              "visita_acompaniada_programacion_cab" : visita_acompaniada_programacion_cab ,
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
        this.alertasService.Swal_alert('error', 'Tiene que ingresar al menos un producto');
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

 
  this.formParams.patchValue({"id_Programacion_cab" : 1 ,  "hora_programacion_programacion_cab" : fechaformatoStart, "hora_reporte_programacion_cab" : fechaformatoEnd, "usuario_creacion" : this.idUserGlobal , "estado_programacion_cab"  : estadoProgramacion});  

  console.log()

  Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
  Swal.showLoading();   

  this.programacionService.set_update_programacionCab( this.formParams.value, 1 , fechaformatoStart, fechaformatoEnd ).subscribe((res:RespuestaServer)=>{
    Swal.close();    
    if (res.ok ==true) { 
      // this.mostrarInformacion();
      // this.alertasService.Swal_Success('Proceso realizado correctamente..');  
      // this.cerrarModal();
    }else{
      this.alertasService.Swal_alert('error', JSON.stringify(res.data));
      alert(JSON.stringify(res.data));
    }
  }) 

 } 


 obteniendoDatosProductos(){ 
  this.spinner.show();
  this.programacionService.get_datosProductos( this.idCiclo_Global, this.idUserGlobal )
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
      this.formParamsProd.patchValue({ "lote" : '0', "stock" : '', "cantidad" : '', "orden" : '' }); 
      return ;
    }

    this.spinner.show();
    this.programacionService.get_datosStock( this.idCiclo_Global, this.idUserGlobal, idProducto)
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
     const product = {
       idProducto :  this.formParamsProd.value.idProducto , 
       codigoProducto : codigo_producto,
       producto : descripcion_producto,
       lote : this.formParamsProd.value.lote , 
       cantidad : this.formParamsProd.value.cantidad , 
       orden : this.formParamsProd.value.orden , 
     }
    this.programacionDet.push(product);

    this.inicializarFormularioProducto();
    
   }

   eliminarProducto(item:any){    
    const index = this.programacionDet.indexOf( item );
    this.programacionDet.splice( index, 1 );
  }
  
  
 


}