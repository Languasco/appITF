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
import { jsPDF } from "jspdf";

declare var $:any;
@Component({
  selector: 'app-imprimir-examen',
  templateUrl: './imprimir-examen.component.html',
  styleUrls: ['./imprimir-examen.component.css']
})
export class ImprimirExamenComponent implements OnInit {

  formParamsFiltro : FormGroup;
  idUserGlobal :number = 0;
  personalesCadistas :any [] = [];
  examen :any [] = [];
  nombreExamen = '';
  nombreRepresentanteMedico= '';
  tiempoExamen = '';
  calificacionExamen = '';
  recomendacionExamen = '';
  preguntaResueltaExamen = ''
  flagDarExamen = false;
 
 
 
  hours = '00';
  minutes = '00';
  seconds = '00';

  relacionExamenes :any [] = [];
  representantesMedicos :any [] = [];
 
  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService,private funcionGlobalServices : FuncionesglobalesService, 
    private funcionesglobalesService : FuncionesglobalesService, private examenService : ExamenService , private uploadService : UploadService ) {         
    this.idUserGlobal = this.loginService.get_idUsuario();
  }
 
 ngOnInit(): void {
   this.inicializarFormularioFiltro();
   this.listadoExamen();
 }

 inicializarFormularioFiltro(){ 
    this.formParamsFiltro= new FormGroup({
      idExamen : new FormControl('0'),
      idRepresentanteMedico : new FormControl('0'),
     }) 
 }

 mostrarInformacion_examen(){ 
  
  if (this.formParamsFiltro.value.idExamen == '' || this.formParamsFiltro.value.idExamen == 0) {
    this.alertasService.Swal_alert('error','Por favor seleccione un Examen');
    return 
  }   
  if (this.formParamsFiltro.value.idRepresentanteMedico == '' || this.formParamsFiltro.value.idRepresentanteMedico == 0) {
    this.alertasService.Swal_alert('error','Por favor seleccione un Representante Medico');
    return 
  }   
  
  this.spinner.show();
    this.examenService.get_mostrar_examen_imprimir(this.formParamsFiltro.value.idExamen, this.formParamsFiltro.value.idRepresentanteMedico,  this.idUserGlobal)
        .subscribe((res:RespuestaServer)=>{  
            this.spinner.hide();
            if (res.ok==true) {    
              
              this.flagDarExamen = false;
              let preguntas = [];
              this.examen = [];

               if (res.data.length > 0) {

                this.flagDarExamen = true;

                this.nombreExamen  = res.data[0].nombre_examen;
                this.nombreRepresentanteMedico  = res.data[0].nombreRepresentanteMedico;
                this.tiempoExamen  = res.data[0].tiempo_examen;
                this.calificacionExamen  = res.data[0].calificacion;
                this.recomendacionExamen  = res.data[0].recomendaciones;
                this.preguntaResueltaExamen = res.data[0].preguntas_resueltas;           
 
                 res.data.forEach((item)=>{
                    if(!preguntas.includes(item.descripcion_pregunta)){
                    preguntas.push(item.descripcion_pregunta);
                  }
                })        
 

                const get_tipoPregunta =({ tipo_pregunta})=>{
                  return tipo_pregunta;
                }
                
                //---- armando la estructura del examen ------
                for (let pregunta of preguntas){    
                  this.examen.push({
                    pregunta : pregunta,
                    respondida : false,
                    tipoPregunta :  get_tipoPregunta(res.data.find( ex =>  ex.descripcion_pregunta == pregunta )),
                    alternativas : res.data.filter((preg) => preg.descripcion_pregunta == pregunta).map((alt) =>{
                       return {...alt, eligio : (alt.pregunta_resuelta == 0) ? false : true }
                    })
                  });
                }

                this.verificandoSiRespondio();

                //----fin de  armando la estructura del examen ------
              }       
            }else{
              this.alertasService.Swal_alert('error', JSON.stringify(res.data));
              alert(JSON.stringify(res.data));
            }
    })
 }   

 verificandoSiRespondio(){

   const respondidas = [];

    for (let item of this.examen){  
      for (let row of item.alternativas ){
        if (row.eligio == true ) {
          respondidas.push(row.descripcion_pregunta)
        }
      }  
    }

    for (let item of this.examen){  
      for (let row of respondidas){
        if (row  == item.pregunta) {
          item.respondida = true;
        }
      }
    }    

 }

   listadoExamen(){
    this.spinner.show();
    this.examenService.get_listadoExamenes( this.idUserGlobal )
        .subscribe((res:RespuestaServer)=>{  
            this.spinner.hide();
           if (res.ok==true) {        
                this.relacionExamenes = res.data; 
            }else{
              this.alertasService.Swal_alert('error', JSON.stringify(res.data));
              alert(JSON.stringify(res.data));
            }
    })
  }

  change_examen(idExamen : number){
      if (idExamen == 0) {
         this.representantesMedicos = [];
         this.formParamsFiltro.patchValue({ "idRepresentanteMedico" : '0' });
        return;
      }
      this.listadoRepresentanteMedico(idExamen)
  }

  listadoRepresentanteMedico(idExamen:number){
    this.spinner.show();
    this.examenService.get_listadoRepresentanteMedico( idExamen, this.idUserGlobal )
        .subscribe((res:RespuestaServer)=>{  
            this.spinner.hide();
           if (res.ok==true) {        
                this.representantesMedicos = res.data; 
            }else{
              this.alertasService.Swal_alert('error', JSON.stringify(res.data));
              alert(JSON.stringify(res.data));
            }
    })
  }

  imprimirPDF(){

    try {
      const doc = new jsPDF();  
      let altura = 20;
      const codigoAle = Math.floor(Math.random() * 1000000); 
      
      const cabeceraDocumento= ()=>{
        doc.setFontSize(15);
        doc.setFont("courier");
        doc.setTextColor("#17202A");
        // ----- centrando un texto jspdf
        let pageWidth = doc.internal.pageSize.getWidth();
        doc.text(this.nombreExamen,pageWidth / 2, 20, {align:"center"} );

        doc.setTextColor("#808080");
        doc.setFontSize(10);
        altura = altura + 6;
        doc.setTextColor("#000000"); //// ---txto normal negrita
        doc.text('Representante Médico : ' + String( this.nombreRepresentanteMedico) ,5, altura );  
        altura = altura + 6;
        // doc.setTextColor("#808080"); //// ---txto normal
        doc.setTextColor("#000000"); //// ---txto normal negrita
        doc.text('Calificación : ' + String( this.calificacionExamen) ,5, altura );  
        altura = altura + 2;
      }
    
      cabeceraDocumento();
      let ac = 0;
      let splitTitle = '';
      for (let exam of this.examen){
        
        ac +=1;
         //---- Preguntas  ------
        altura = altura + 8;
        doc.setTextColor("#000000"); //// ---txto normal negrita
        splitTitle = doc.splitTextToSize( ac +'. '+  String(exam.pregunta), 190);
 
        doc.text(splitTitle,4, altura);     
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

        //---- alternativas ------
        if (exam.tipoPregunta == 2) {
          for( let pregunta of exam.alternativas){
            // doc.rect(4, altura - 2, 200, 6)
            doc.line(4, altura + 3, 200,  altura + 3 ) // horizontal line
            altura = altura + 2;
            doc.setTextColor("#808080"); //// ---txto normal      
            doc.text(String( pregunta.texto_respuesta ), 6, altura ); 
          }
        }
        if (exam.tipoPregunta == 1) {
          for( let pregunta of exam.alternativas){

            doc.setTextColor("#808080"); //// ---txto normal
            doc.rect(5, altura - 2, 5, 5)
            altura = altura + 1;
            doc.text( (pregunta.pregunta_resuelta ==0) ? '' : 'X'  , 6.5, altura + 0.5 ); 
            doc.text(String( pregunta.descripcion_alternativa ), 12, altura ); 
            altura = altura + 5;

            if (altura > 280) {
              doc.addPage();
              altura = 20
              cabeceraDocumento();
              altura = altura + 5;
            }
          }
          altura = altura - 4;
        }
        if (altura > 275) {
          doc.addPage();
          altura = 20
          cabeceraDocumento();
        }
      }
   
      //doc.output('dataurlnewwindow');
      doc.save( 'pdf_examen_' + codigoAle +'.pdf');  
  
    } catch (error) {
      console.error(error);
    }
  }


}
