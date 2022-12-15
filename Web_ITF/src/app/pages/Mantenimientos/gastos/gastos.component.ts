
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertasService } from '../../../services/alertas/alertas.service';
import { RespuestaServer } from '../../../models/respuestaServer.models';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../../../services/login/login.service';
import { combineLatest } from 'rxjs';
import Swal from 'sweetalert2';
import { InputFileI } from '../../../models/inputFile.models';
import { UploadService } from '../../../services/Upload/upload.service';

import { BsDatepickerConfig, BsDatepickerViewMode } from 'ngx-bootstrap/datepicker';
import { GastosService } from 'src/app/services/Mantenimientos/gastos.service';

//--- descagar una Tabla
import * as XLSX from 'xlsx'; 

//----pdf---
import { jsPDF } from "jspdf";
import { FuncionesglobalesService } from '../../../services/funciones/funcionesglobales.service';

declare var $:any;
@Component({
  selector: 'app-gastos',
  templateUrl: './gastos.component.html',
  styleUrls: ['./gastos.component.css']
})
 

export class GastosComponent implements OnInit {

  formParamsFiltro : FormGroup;
  formParams: FormGroup;
  formParamsFile: FormGroup;

  idUserGlobal :number = 0;
  idPerfilGlobal:number = 0;
  flag_modoEdicion :boolean =false;

  empresas :any[]=[];
  
  areas :any[]=[];
 
  usuarios :any[]=[];
  conceptosGastos :any[]=[];
  tiposComprobantes :any[]=[];
  monedas :any[]=[];

  filePhoto:InputFileI[] = [];
 
  filtrarMantenimiento = "";
  imgVoucher= './assets/img/sinImagen.jpg';

  datosGeneralesEmpresa :any;
  minMode: BsDatepickerViewMode = 'month'; 
  bsConfig: Partial<BsDatepickerConfig>;

  gastosCab :any[]=[];
  rptGastoRepresentacion :any[]=[];
  rptGastos :any[]=[];
  rptGastoMovilidad :any[]=[];
  fechasCiclos :any[]=[];
 
  desde_ciclo: Date;
  hasta_ciclo: Date;
  requireImagen_global = false;
 
  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService, private uploadService : UploadService, private gastosService : GastosService,
    private funcionesglobalesService : FuncionesglobalesService
    ) {         
    this.idUserGlobal = this.loginService.get_idUsuario();
    this.idPerfilGlobal = this.loginService.get_idPerfil();
  }
 
 ngOnInit(): void {
   this.getCargarCombos();
   this.inicializarFormularioFiltro();
   this.inicializarFormulario(); 

   this.bsConfig = Object.assign({}, {
    minMode : this.minMode
  });
 }

 inicializarFormularioFiltro(){ 
    const fecha = new Date();
    const anioActual = fecha.getFullYear();
    const mesActual = fecha.getMonth() + 1; 
    const mesAnio = anioActual + "-" + (mesActual<=9 ? '0' + mesActual : mesActual) ;

    this.formParamsFiltro= new FormGroup({
      mesAnio: new FormControl(mesAnio),
      idUsuario : new FormControl('0'),
     }) 

     console.log( this.formParamsFiltro.value )
 }

 inicializarFormulario(){ 
    this.formParams= new FormGroup({
      id_gastos: new FormControl('0'),  
      fecha_gastos: new FormControl(new Date()),  
      ruc: new FormControl(''),  
      razon_social: new FormControl(''),  
      id_concepto_gastos: new FormControl('0'),  
      id_tipo_documento: new FormControl('0'),  
      serie_documento: new FormControl(''),  
      numero_documento: new FormControl(''),  
      id_moneda: new FormControl('0'),  
      total: new FormControl(''),  
      observaciones: new FormControl(''),  
      imagen: new FormControl(''),  
      estado: new FormControl('1'),  
      usuario_creacion: new FormControl( this.idUserGlobal),  
      tipo_interfaz: new FormControl('W'),  
    }) 
 }

 getCargarCombos(){ 
    this.spinner.show();
    combineLatest([ this.gastosService.get_usuarios_Gastos(this.idUserGlobal),
                    this.gastosService.get_conceptos_Gastos() , 
                    this.gastosService.get_tiposComprobantes_Gastos() , 
                    this.gastosService.get_monedas_Gastos(), 
                    this.gastosService.get_fechasCiclos_Gastos() ]).subscribe( ([_usuarios,  _conceptosGastos , _tiposComprobantes, _monedas,_fechasCiclos])=>{
 
      this.usuarios = _usuarios;
      this.conceptosGastos = _conceptosGastos;
      this.tiposComprobantes = _tiposComprobantes;
      this.monedas = _monedas;
      this.fechasCiclos = _fechasCiclos;
      this.spinner.hide(); 


      if (this.fechasCiclos.length > 0  ) {
        this.desde_ciclo = new Date(this.fechasCiclos[0].desde_ciclo) ;
        this.hasta_ciclo = new Date(this.fechasCiclos[0].hasta_ciclo) ;
      }else{
        this.desde_ciclo = null ;
        this.hasta_ciclo = null ;
      } 

    })
 }
 

 mostrarInformacion(){  

    if (this.formParamsFiltro.value.mesAnio == '' || this.formParamsFiltro.value.mesAnio == null) {
      this.alertasService.Swal_alert('error','Por favor seleccione el añio y el mes');
      return 
    }  

    this.spinner.show();
    this.gastosService.get_mostrar_Gastos(this.formParamsFiltro.value.mesAnio,this.formParamsFiltro.value.idUsuario )
        .subscribe((res:RespuestaServer)=>{     
    
            this.spinner.hide();
            if (res.ok==true) {        
                this.gastosCab = res.data; 
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
    this.filePhoto = [];

    setTimeout(()=>{ // 
      $('#modal_mantenimiento').modal('show');  
      this.imgVoucher= './assets/img/sinImagen.jpg';
    },0); 

 } 

 async saveUpdate(){ 

  if ( this.flag_modoEdicion==true) {  ///editar
     if (this.formParams.value.id_gastos == '' || this.formParams.value.id_gastos == 0) {
       this.alertasService.Swal_alert('error','No se cargó el id, por favor actulize su página');
       return 
     }   
  }

  if (this.formParams.value.fecha_gastos == '' || this.formParams.value.fecha_gastos == null) {
    this.alertasService.Swal_alert('error','Por favor seleccione la Fecha del Gasto');
    return 
  }

  if (this.formParams.value.ruc == '' || this.formParams.value.ruc == null || this.formParams.value.ruc == 0) {
    this.alertasService.Swal_alert('error','Por favor ingrese el numero de ruc');
    return 
  }

  if (this.formParams.value.razon_social == '' || this.formParams.value.razon_social == null) {
    this.alertasService.Swal_alert('error','Por favor presion enter un busque el Nro de Ruc');
    return 
  }

  if (this.formParams.value.id_concepto_gastos == '' || this.formParams.value.id_concepto_gastos == 0) {
    this.alertasService.Swal_alert('error','Por favor seleccione el Concepto del Gasto');
    return 
  }
  if (this.formParams.value.id_tipo_documento == '0' || this.formParams.value.id_tipo_documento == 0) {
    this.alertasService.Swal_alert('error','Por favor seleccione el Tipo de Comprobante');
    return 
  }
 
  if (this.formParams.value.serie_documento == '' || this.formParams.value.serie_documento == null) {
    this.alertasService.Swal_alert('error','Por favor ingrese la Serie del Comprobante');
    return 
  }

  if (this.formParams.value.numero_documento == '' || this.formParams.value.numero_documento == 0) {
    this.alertasService.Swal_alert('error','Por favor ingrese el Numero del Comprobante');
    return 
  }

  if (this.formParams.value.id_moneda == '' || this.formParams.value.id_moneda == 0) {
    this.alertasService.Swal_alert('error','Por favor seleccione la Moneda');
    return 
  } 

  if (this.formParams.value.total == '' || this.formParams.value.total == null) {
    this.alertasService.Swal_alert('error','Por favor ingrese el Total');
    return 
  } 
  if ( Number(this.formParams.value.total) <= 0) {
    this.alertasService.Swal_alert('error','Por favor ingrese en el Total un valor positivo');
    return 
  }  
 
  this.formParams.patchValue({ "usuario_creacion" : this.idUserGlobal }); 

  if ( this.flag_modoEdicion==false) { //// nuevo  

    if ( this.requireImagen_global == true ) {
      if ( this.filePhoto.length ==0){
        this.alertasService.Swal_alert('error','Por favor seleccione una Imagen es obligatorio por el Concepto del Gasto..');
        return
      }       
    }

    // -----validando si tiene presupuesto -----
    const fechaGasto = this.funcionesglobalesService.formatoFecha(this.formParams.value.fecha_gastos);
    this.spinner.show();
    const  {ok, data} : any  = await this.gastosService.get_verificarPresupuesto({...this.formParams.value , 'fecha_gastos' : fechaGasto });  
    this.spinner.hide();

     if (ok ==true) {     
        if (data[0].estado == 1) {
          this.alertasService.Swal_alert('error', data[0].mensaje);
          return;
        }
     }else{
       this.alertasService.Swal_alert('error', JSON.stringify(data));
       alert(JSON.stringify(data));
     }

     Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
     Swal.showLoading();
     this.gastosService.set_save_Gastos(this.formParams.value).subscribe((res:RespuestaServer)=>{
       Swal.close();    
       if (res.ok ==true) {     

          this.flag_modoEdicion = true;
          const idGastoNew = res.data;      
          
          this.upload_imageGasto( Number(idGastoNew));
          this.alertasService.Swal_Success('Se agrego correctamente..');
          this.cerrarModal();  

       }else{
         this.alertasService.Swal_alert('error', JSON.stringify(res.data));
         alert(JSON.stringify(res.data));
       }
     })
     
   }else{ /// editar

    if ( this.requireImagen_global == true ) {
      if ( this.imgVoucher == 'http://92.204.134.45/WebApi_Itf/Imagen/' ){
        this.alertasService.Swal_alert('error','Por favor seleccione una Imagen es obligatorio por el Concepto del Gasto..');
        return
      }       
    }

     Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Actualizando, espere por favor'  })
     Swal.showLoading();
     this.gastosService.set_edit_Gastos(this.formParams.value, this.formParams.value.id_gastos ).subscribe((res:RespuestaServer)=>{
       Swal.close(); 
       if (res.ok ==true) {           
 
         this.upload_imageGasto(this.formParams.value.id_gastos );
         this.alertasService.Swal_Success('Se actualizó correctamente..');            
         this.cerrarModal();  

       }else{
         this.alertasService.Swal_alert('error', JSON.stringify(res.data));
         alert(JSON.stringify(res.data));
       }
     })
   }

 } 

 editar({ id_gastos, fecha_gastos, ruc, razon_social, id_concepto_gastos, id_tipo_documento, serie_documento, numero_documento, id_moneda, total, observaciones, imagen, estado }){

   this.flag_modoEdicion=true;
   this.formParams.patchValue({ "id_gastos" : id_gastos, "fecha_gastos" : new Date(fecha_gastos) , "ruc" : ruc , "razon_social" : razon_social , "id_concepto_gastos" : id_concepto_gastos , "id_tipo_documento" : id_tipo_documento ,
                                 "serie_documento" : serie_documento , "numero_documento" : numero_documento , "id_moneda" : id_moneda  , "total" : total , "observaciones" : observaciones , "estado" : estado   }
   );

   this.imgVoucher = (!imagen)? './assets/img/sinImagen.jpg' : imagen;
   this.change_conceptoGasto(null);

   setTimeout(()=>{ // 
    $('#modal_mantenimiento').modal('show');  
  },0);  
 
 } 

 anular(objBD:any){

   if (objBD.estado ===2 || objBD.estado =='2') {      
     return;      
   }

   this.alertasService.Swal_Question('Sistemas', 'Esta seguro de anular ?')
   .then((result)=>{
     if(result.value){

       Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
       Swal.showLoading();
       this.gastosService.set_anularGastos(objBD.id_gastos).subscribe((res:RespuestaServer)=>{
         Swal.close();        
         if (res.ok ==true) { 
           
           for (const user of this.gastosCab) {
             if (user.id_gastos == objBD.id_gastos ) {
                 user.estado = 2;
                 user.descripcion_estado =  "Inactivo" ;
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

 openFile(){
  $('#inputFileOpen').click();
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
     this.filePhoto = fileE;
 
     for (var i = 0; i < filesTemporal.length; i++) { //for multiple files          
         ((file)=> {
             var name = file;
             var reader = new FileReader();
             reader.onload = (e)=> {
                 let urlImage = e.target;
                 this.imgVoucher = String(urlImage['result']);    
              }
             reader.readAsDataURL(file);
         })(filesTemporal[i]);
     }
 }
 
 upload_imageGasto(idGasto:number) {
  if ( this.filePhoto.length ==0){
    this.mostrarInformacion();
    return;
  }
  Swal.fire({
    icon: 'info',allowOutsideClick: false, allowEscapeKey: false,  text: 'Espere por favor'
  })
  Swal.showLoading();
  this.uploadService.upload_imagen_gastos( this.filePhoto[0].file , idGasto, this.idUserGlobal ).subscribe(
    (res:RespuestaServer) =>{
    Swal.close();
      if (res.ok==true) {
        this.mostrarInformacion();
      }else{
        this.alertasService.Swal_alert('error',JSON.stringify(res.data));
      }
      },(err) => {
      Swal.close();
      this.alertasService.Swal_alert('error',JSON.stringify(err)); 
      }
  )

 }
   onlyNumberKey(event) {
    return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }
  
  onlyDecimalNumberKey(event) {
    let charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31
        && (charCode < 48 || charCode > 57))
        return false;
    return true;
  }
  
  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  buscarRuc(){ 

    const nroRuc =  this.formParams.value.ruc;
    if (nroRuc == '') {
     return
   }
   
     Swal.fire({
       icon: 'info', allowOutsideClick: false,allowEscapeKey: false,text: 'Espere por favor'
     })
     Swal.showLoading();
      this.gastosService.get_consultarRucGasto(nroRuc).subscribe((res:RespuestaServer)=>{
       Swal.close();
       if (res.ok) {
         if (res.data.length > 0) {
           const { razon_social }  = res.data[0];
           this.formParams.patchValue({"razon_social"  : razon_social });
         }else{ 
           this.formParams.patchValue({"razon_social"  : '' });
           this.alertasService.Swal_alert('error','No se encontro informacion con el Ruc ingresado..');
           return 
         } 
       }else{
         this.alertasService.Swal_alert('error', JSON.stringify(res.data));
         alert(JSON.stringify(res.data));
       }
     })
   }

   exportExcel(tipo:number,nombreHoja:string, objdata:any): void  {
    /* table id is passed over here */   
    var element;
    if (tipo==1) {
      element = document.getElementById('tableGastos'); 
    }

   if (objdata.length ==0) {
     return;
   }

    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, nombreHoja);

    /* save to file */
    XLSX.writeFile(wb, nombreHoja + '.xlsx');			
 }



 reporteGastos(TipoReporte:number){ 
    if (this.formParamsFiltro.value.mesAnio == '' || this.formParamsFiltro.value.mesAnio == null) {
      this.alertasService.Swal_alert('error','Por favor seleccione el añio y el mes');
      return 
    }  

    this.spinner.show();
    this.gastosService.get_reporteGastos(this.formParamsFiltro.value.mesAnio,this.formParamsFiltro.value.idUsuario, TipoReporte )
        .subscribe((res:RespuestaServer)=>{     
    
            this.spinner.hide();
            if (res.ok==true) {        
              if (res.data.length > 0) {

                 if (TipoReporte == 1) {
                  this.rptGastoRepresentacion = res.data;
                  this.imprimirPDF_GastoRepresentacion();
                 }
                 else if (TipoReporte == 2) {
                  this.rptGastos = res.data;
                  console.log(this.rptGastos)
                  this.imprimirPDF_Gastos();
                 }
                 else if (TipoReporte == 3) {
                  this.rptGastoMovilidad = res.data;
                  this.imprimirPDF_GastoMovilidad();
                 }

            }else{ 
              this.alertasService.Swal_alert('error','No  hay informacion para mostrar');
              return 
            } 
            }else{
              this.alertasService.Swal_alert('error', JSON.stringify(res.data));
              alert(JSON.stringify(res.data));
            }
    })
 }

 imprimirPDF_GastoRepresentacion(){

  try {
    const doc = new jsPDF();  
    let altura = 24;
    let codigoAle = Math.floor(Math.random() * 1000000) + '_' + new Date().getTime(); 
    let splitTitle = '';
    
    const cabeceraDocumento= ()=>{
      doc.setFontSize(15);
      doc.setFont("italic");
      doc.setTextColor("#17202A");
      // ----- centrando un texto jspdf
      doc.setTextColor("#000000"); //// ---txto normal negrita
      let pageWidth = doc.internal.pageSize.getWidth();
      doc.text(this.rptGastoRepresentacion[0].tituloReporte , pageWidth / 2, 20, {align:"center"} );
      doc.line(30, altura, 180,  altura ) // horizontal line
      altura = altura + 8;
      doc.setFontSize(10);
      doc.setTextColor("#17202A"); //// ---txto normal
      splitTitle = doc.splitTextToSize(  String( this.rptGastoRepresentacion[0].declaracion ), 190);

      doc.text(splitTitle, 8, altura);     
      let _val = 0;      
      if (splitTitle.length == 0) {
        _val = 4;
      } else {
        if (splitTitle.length == 1) {
            _val = 4;
        } else {
            _val = (4 * splitTitle.length);
        }
      }
      altura = (altura + _val);

      altura = altura + 8;

      doc.setTextColor("#000000"); //// ---txto normal negrita
      doc.rect(5, altura - 4, 25, 5.5);  // rectangulo
      doc.text('FECHA' ,8, altura );
      
      doc.rect(30, altura - 4, 58, 5.5);  // rectangulo
      doc.text('CONCEPTO' ,43, altura );  

      doc.rect(88, altura - 4, 90, 5.5);  // rectangulo
      doc.text('OBSERVACIONES' , 115, altura );  

      doc.rect(178, altura - 4, 30, 5.5);  // rectangulo
      doc.text('IMPORTE' ,190, altura );  
      altura = altura + 6;
    }
  
    cabeceraDocumento();

    //----detalle del documento *****
    doc.setFont("times");
    doc.setTextColor("#17202A"); //// ---txto normal 
    for (let rpt of this.rptGastoRepresentacion){ 
        doc.text( String(rpt.fecha) ,7, altura );  
        doc.text(String(rpt.concepto) ,31, altura );  
        // doc.text(String(rpt.observaciones) ,90, altura );  
        doc.text(String(rpt.importe.toFixed(2)), 205, altura, { align: 'right', });
        
        splitTitle = doc.splitTextToSize( String(rpt.observaciones), 90);        
        doc.text(splitTitle,90, altura);     

        let _val = 0;      
        if (splitTitle.length == 0) {
          _val = 4;
        } else {
          if (splitTitle.length == 1) {
              _val = 4;
              doc.line(5, altura + 1 , 205,  altura + 1  ) // horizontal line
              altura = altura + 6;
          } else {
              _val = (4 * splitTitle.length);
              altura = (altura + _val + 1);
              doc.line(5, altura - 3 , 205,  altura -3 ) // horizontal line
          }
        }
        if (altura > 261) {
          doc.addPage();
          altura = 24
          cabeceraDocumento();
        }       
    }
 
    altura = altura + 4;
    doc.setTextColor("#000000"); //// ---negrita
    doc.text( String('TOTAL : ') , 150, altura );

    let imp = 0;
    this.rptGastoRepresentacion.map((rpt)=>{
      imp += rpt.importe;
      return rpt.importe
    })
    
    const total= imp;
    doc.text(String(total.toFixed(2)), 205, altura, { align: 'right', });

    //---- pie de pagina    
    altura = altura + 8;
    doc.setFontSize(10);
    doc.setTextColor("#000000"); //// ---negrita
    splitTitle = doc.splitTextToSize(  String( this.rptGastoRepresentacion[0].notas ), 190);

    doc.text(splitTitle, 8, altura);     
    let _val = 0;      
    if (splitTitle.length == 0) {
      _val = 4;
    } else {
      if (splitTitle.length == 1) {
          _val = 4;
      } else {
          _val = (4 * splitTitle.length);
      }
    }
    altura = (altura + _val);
    altura = altura + 8;
    doc.setFontSize(10);
    doc.setTextColor("#000000"); //// ---negrita
    doc.line(110, altura + 1 , 200,  altura + 1  ) // horizontal line
    altura = altura + 4
    doc.text( String( this.rptGastoRepresentacion[0].datosRepresentante ) , 125, altura );
    altura = altura + 4
    doc.text( String( this.rptGastoRepresentacion[0].documentoRepresentante ) ,140, altura );
  
    // doc.output('dataurlnewwindow');
    doc.save( 'pdf_gastoRepresentacion_' + codigoAle +'.pdf');  

  } catch (error) {
    console.error(error);
  }
 }
 
 imprimirPDF_GastoMovilidad(){

  try {
    const doc = new jsPDF();  
    let altura = 24;
 
    let codigoAle = Math.floor(Math.random() * 1000000) + '_' + new Date().getTime(); 
    let splitTitle = '';
    
    const cabeceraDocumento= ()=>{
      doc.setFontSize(15);
      doc.setFont("italic");
      doc.setTextColor("#17202A");
      // ----- centrando un texto jspdf
      doc.setTextColor("#000000"); //// ---txto normal negrita
      let pageWidth = doc.internal.pageSize.getWidth();
      doc.text(this.rptGastoMovilidad[0].tituloReporte , pageWidth / 2, 20, {align:"center"} );
      doc.line(30, altura, 180,  altura ) // horizontal line
      altura = altura + 8;
      doc.setFontSize(10);
      doc.setTextColor("#17202A"); //// ---txto normal
 
      doc.text('EMPLEADO : ' + String(this.rptGastoMovilidad[0].empleado)  ,7, altura ); 
      doc.text('DNI : ' + String(this.rptGastoMovilidad[0].dni)  ,150, altura );       
      altura = altura + 6;
      doc.text('PERIODO : ' + String(this.rptGastoMovilidad[0].periodo)  ,7, altura );    

      altura = altura + 10;
      doc.setTextColor("#000000"); //// ---txto normal negrita
      doc.rect(5, altura - 4, 25, 5.5);  // rectangulo
      doc.text('FECHA' ,8, altura );
      
      doc.rect(30, altura - 4, 58, 5.5);  // rectangulo
      doc.text('CONCEPTO' ,43, altura );  

      doc.rect(88, altura - 4, 90, 5.5);  // rectangulo
      doc.text('OBSERVACIONES' , 115, altura );  

      doc.rect(178, altura - 4, 30, 5.5);  // rectangulo
      doc.text('IMPORTE' ,190, altura );  
      altura = altura + 6;
    }
  
    cabeceraDocumento();

      //----detalle del documento *****
      doc.setFont("times");
      doc.setTextColor("#17202A"); //// ---txto normal 
      for (let rpt of this.rptGastoMovilidad){ 
          doc.text( String(rpt.fecha) ,7, altura );  
          doc.text(String(rpt.concepto) ,31, altura );  
          // doc.text(String(rpt.observaciones) ,90, altura );  
          doc.text(String(rpt.importe.toFixed(2)), 205, altura, { align: 'right', });
          
          splitTitle = doc.splitTextToSize( String(rpt.observaciones), 90);        
          doc.text(splitTitle,90, altura);     
  
          let _val = 0;      
          if (splitTitle.length == 0) {
            _val = 4;
          } else {
            if (splitTitle.length == 1) {
                _val = 4;
                doc.line(5, altura + 1 , 205,  altura + 1  ) // horizontal line
                altura = altura + 6;
            } else {
                _val = (4 * splitTitle.length);
                altura = (altura + _val + 1);
                doc.line(5, altura - 3 , 205,  altura -3 ) // horizontal line
            }
          }
          if (altura > 261) {
            doc.addPage();
            altura = 24
            cabeceraDocumento();
          }       
      }
 
      altura = altura + 4;
      doc.setTextColor("#000000"); //// ---negrita
      doc.text( String('TOTAL : ') , 150, altura );
  
      let imp = 0;
      this.rptGastoMovilidad.map((rpt)=>{
        imp += rpt.importe;
        return rpt.importe
      })
      
      const total= imp;
      doc.text(String(total.toFixed(2)), 205, altura, { align: 'right', });

      //---- pie de pagina    

      altura = altura + 20;
      doc.setFontSize(10);
      doc.setTextColor("#000000"); //// ---negrita


      doc.line(10, altura + 1 , 70,  altura + 1  ) // horizontal line
      doc.text(String( "FIRMA DEL EMPLEADO" ) , 20, altura + 5 );

      doc.line(140, altura + 1 , 200,  altura + 1  ) // horizontal line
      doc.text(String( "APROBADOR" ) , 158, altura + 5 );
      
      
      //doc.output('dataurlnewwindow');
      doc.save( 'pdf_gastoMovilidad_' + codigoAle +'.pdf');  

  } catch (error) {
    console.error(error);
  }
 }

  
 imprimirPDF_Gastos(){

  try {
    const doc = new jsPDF();  
    let altura = 24;
 
    let codigoAle = Math.floor(Math.random() * 1000000) + '_' + new Date().getTime(); 
    let splitTitle = '';
    
    const cabeceraDocumento= ()=>{
      doc.setFontSize(15);
      doc.setFont("italic");
      doc.setTextColor("#17202A");
      // ----- centrando un texto jspdf
      doc.setTextColor("#000000"); //// ---txto normal negrita
      let pageWidth = doc.internal.pageSize.getWidth();
      doc.text(this.rptGastos[0].tituloReporte , pageWidth / 2, 20, {align:"center"} );
      doc.line(30, altura, 180,  altura ) // horizontal line
      altura = altura + 8;
      doc.setFontSize(10);
      doc.setTextColor("#17202A"); //// ---txto normal
 
      doc.text('EMPLEADO : ' + String(this.rptGastos[0].empleado)  ,7, altura ); 
      doc.text('DNI : ' + String(this.rptGastos[0].dni)  ,150, altura );       
      altura = altura + 6;
      doc.text('PERIODO : ' + String(this.rptGastos[0].periodo)  ,7, altura );    


      doc.setFontSize(8);
      altura = altura + 10;
      doc.setTextColor("#000000"); //// ---txto normal negrita
      // doc.rect(5, altura - 4, 25, 5.5);  // rectangulo

      doc.line(5, altura - 4 , 205,  altura - 4 ) // horizontal line


      doc.text('FECHA' ,8, altura );
      
      // doc.rect(30, altura - 4, 58, 5.5);  // rectangulo
      doc.text('RAZON SOCIAL' , 38, altura );  

      // doc.rect(88, altura - 4, 90, 5.5);  // rectangulo
      doc.text('TIPO' , 91, altura );  

      // doc.rect(88, altura - 4, 90, 5.5);  // rectangulo
      doc.text('SERIE' , 99, altura );  

      // doc.rect(88, altura - 4, 90, 5.5);  // rectangulo
      doc.text('NUMERO' , 109, altura );  

      // doc.rect(88, altura - 4, 90, 5.5);  // rectangulo
      doc.text('CONCEPTO' , 145, altura );  

      //doc.rect(178, altura - 4, 30, 5.5);  // rectangulo
      doc.text('TOTAL' ,195, altura );  

      doc.line(5, altura + 1.5 , 205,  altura + 1.5  ) // horizontal line


      altura = altura + 6;
    }
  
    cabeceraDocumento();

      //----detalle del documento *****
      doc.setFont("times");
      doc.setTextColor("#17202A"); //// ---txto normal 
      for (let rpt of this.rptGastos){ 
          doc.text( String(rpt.fecha) ,5, altura );  
          doc.text(String(rpt.tipo) , 92, altura ); 
          doc.text(String(rpt.serie) , 100, altura ); 
          doc.text(String(rpt.numero) , 109, altura ); 
          doc.text(String(rpt.concepto) , 125, altura ); 

          doc.text(String(rpt.total.toFixed(2)), 205, altura, { align: 'right', });
          
          splitTitle = doc.splitTextToSize( String(rpt.razonSocial), 70 );        
          doc.text(splitTitle, 20, altura);     
  
          let _val = 0;      
          if (splitTitle.length == 0) {
            _val = 4;
          } else {
            if (splitTitle.length == 1) {
                _val = 4;
                doc.line(5, altura + 1 , 205,  altura + 1  ) // horizontal line
                altura = altura + 6;
            } else {
                _val = (4 * splitTitle.length);
                altura = (altura + _val + 1);
                doc.line(5, altura - 3 , 205,  altura -3 ) // horizontal line
            }
          }
          if (altura > 261) {
            doc.addPage();
            altura = 24
            cabeceraDocumento();
          }       
      }
 
      altura = altura + 4;
      doc.setTextColor("#000000"); //// ---negrita
      doc.text( String('TOTAL : ') , 160, altura );
  
      let imp = 0;
      this.rptGastos.map((rpt)=>{
        imp += rpt.total;
        return rpt.total
      })
      
      const total= imp;
      doc.text(String(total.toFixed(2)), 205, altura, { align: 'right', });

      //---- pie de pagina    

      altura = altura + 20;
      doc.setFontSize(10);
      doc.setTextColor("#000000"); //// ---negrita

      doc.line(10, altura + 1 , 70,  altura + 1  ) // horizontal line
      doc.text(String( "FIRMA DEL EMPLEADO" ) , 20, altura + 5 );

      doc.line(140, altura + 1 , 200,  altura + 1  ) // horizontal line
      doc.text(String( "APROBADOR" ) , 158, altura + 5 );
      
      
      //doc.output('dataurlnewwindow');
     doc.save( 'pdf_reporteGastos' + codigoAle +'.pdf');  

  } catch (error) {
    console.error(error);
  }
 }

 descargar_grillaGastos() {

  if (this.formParamsFiltro.value.mesAnio == '' || this.formParamsFiltro.value.mesAnio == null) {
    this.alertasService.Swal_alert('error','Por favor seleccione el añio y el mes');
    return 
  }  

  this.spinner.show();
  this.gastosService.get_descargarGrilla_Gastos(this.formParamsFiltro.value.mesAnio,this.formParamsFiltro.value.idUsuario )
      .subscribe((res:RespuestaServer)=>{   
          this.spinner.hide();
          console.log(res)
          if (res.ok) {
            window.open(String(res.data), '_blank');
          } else {
            this.alertasService.Swal_alert('error', JSON.stringify(res.data));
            alert(JSON.stringify(res.data));
          }
  }) 

}



  change_conceptoGasto(event:any){      
    const idConcepto =  this.formParams.value.id_concepto_gastos;
    if( idConcepto == 0  ){
      this.requireImagen_global = false;
      return;
    }
  
    this.requireImagen_global = false;
    for (const concepto of this.conceptosGastos) {
      if ( concepto.id_conceptos_gastos == this.formParams.value.id_concepto_gastos ) {
        if (concepto.requiere_imagen ==1) {
          this.requireImagen_global = true;
        }
        break;
      }    
    }
  }
  


}