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
  selector: 'app-rendir-examen',
  templateUrl: './rendir-examen.component.html',
   styleUrls: ['./rendir-examen.component.css']
})

export class RendirExamenComponent implements OnInit {

  formParamsFiltro : FormGroup;
  idUserGlobal :number = 0;
  personalesCadistas :any [] = [];
  examen :any [] = [];
  nombreExamen = '';
  tiempoExamen = '';
  calificacionExamen = '';
  recomendacionExamen = '';
  preguntaResueltaExamen = ''
  flagDarExamen = false;
  id_Examen_Rm_Cab_Global = 0;
  id_Resolucion_Cab_Global = 0;
  id_estadoResol_Cab_Global = 0;


  hours = '00';
  minutes = '00';
  seconds = '00';

 
  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService,private funcionGlobalServices : FuncionesglobalesService, 
    private funcionesglobalesService : FuncionesglobalesService, private examenService : ExamenService , private uploadService : UploadService ) {         
    this.idUserGlobal = this.loginService.get_idUsuario();
  }
 
 ngOnInit(): void {
   this.inicializarFormularioFiltro();
   this.mostrarInformacion_examen();
  //  this.contadorTiempo(1);
 }


 contadorTiempo(tiempoExamen : number){

   const getTime = dateTo => {
      let now = new Date(),
          time = (new Date(dateTo).getTime() - now.getTime() + 1000) / 1000,
          seconds = ('0' + Math.floor(time % 60)).slice(-2),
          minutes = ('0' + Math.floor(time / 60 % 60)).slice(-2),
          hours = ('0' + Math.floor(time / 3600 % 24)).slice(-2),
          days = Math.floor(time / (3600 * 24));
  
      return { seconds, minutes,  hours,  days,  time  }
   };

   const countdown = (dateTo) => {  
      const timerUpdate = setInterval( () => {

          let currenTime = getTime(dateTo);

          this.hours =currenTime.hours;
          this.minutes =currenTime.minutes;
          this.seconds =currenTime.seconds;  

          if (currenTime.time <= 1) {

              clearInterval(timerUpdate);

              this.spinner.show();
              this.examenService.get_mostrar_examen( this.idUserGlobal)
              .subscribe((res:RespuestaServer)=>{  
                  this.spinner.hide();
            
                  if (res.ok ==true) { 
                    if ( !res.data[0].mensaje) {
            
                      this.calificacionExamen  = res.data[0].calificacion;
                      this.preguntaResueltaExamen = res.data[0].preguntas_resueltas;         
                      this.alertasService.Swal_Success('El tiempo del examen concluyo su Nota es ' +  this.calificacionExamen );  
              
                    }
                  }else{
                    this.alertasService.Swal_alert('error', JSON.stringify(res.data));
                    alert(JSON.stringify(res.data));
                  }
                })

              setTimeout(() => { // enfocando
                $('#formExamenCabecera').addClass('disabledForm');
              }, 0);

              this.tiempoConcluidoExamen();
          }  
        }, 1000);
    };

    let date = new Date()
    let new_date2 = new Date(date);
    new_date2.setMinutes(date.getMinutes() + tiempoExamen);

    countdown(new_date2); 
  }



 inicializarFormularioFiltro(){ 
    this.formParamsFiltro= new FormGroup({
      idEstado : new FormControl('0')
     }) 
 }

 mostrarInformacion_examen(){ 
    this.spinner.show();
    this.examenService.get_mostrar_examen( this.idUserGlobal)
        .subscribe((res:RespuestaServer)=>{  
            this.spinner.hide();
            if (res.ok==true) {               
              
              if ( !res.data[0].mensaje) {

                this.flagDarExamen = true;
                let preguntas = [];

                this.nombreExamen  = res.data[0].nombre_examen;
                this.tiempoExamen  = res.data[0].tiempo_examen;
                this.calificacionExamen  = res.data[0].calificacion;
                this.recomendacionExamen  = res.data[0].recomendaciones;
                this.preguntaResueltaExamen = res.data[0].preguntas_resueltas;

                this.id_Examen_Rm_Cab_Global = res.data[0].id_Examen_Rm_Cab;                
                this.id_Resolucion_Cab_Global = res.data[0].id_Examen_Rm_Resolucion_Cab;
                this.id_estadoResol_Cab_Global  = res.data[0].estado;

                if ( this.id_estadoResol_Cab_Global  == 35) {   //---- aun examen esta pendiente ----    
                     
                  const tiempo = (this.tiempoExamen=='') ? 0 :  Number(this.tiempoExamen);
                  this.contadorTiempo( tiempo );

                  setTimeout(() => { // enfocando
                    $('#formExamen').removeClass('disabledForm');
                  }, 0);
                }else {
                  setTimeout(() => { // enfocando
                    $('#formExamen').addClass('disabledForm');
                  }, 0);
                }

                 res.data.forEach((item)=>{
                    if(!preguntas.includes(item.descripcion_pregunta)){
                    preguntas.push(item.descripcion_pregunta);
                  }
                })        
                this.examen = [];

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

              }else{
 
                  this.flagDarExamen = false;
                  this.nombreExamen  = res.data[0].mensaje;
                  this.tiempoExamen  = '';
                  this.calificacionExamen  = '';
                  this.recomendacionExamen  = '';
                  this.preguntaResueltaExamen = '';
              } 

            }else{
              this.alertasService.Swal_alert('error', JSON.stringify(res.data));
              alert(JSON.stringify(res.data));
            }
    })
 }   
  
 iniciarExamen(){

  this.alertasService.Swal_Question('Sistemas', 'Esta seguro de Iniciar el Examen ?')
  .then((result)=>{
    if(result.value){
        Swal.fire({
          icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor ...'
        })
        Swal.showLoading();
      
        const id_Examen_Rm_Resolucion_Cab  = 0;
        const id_Examen_Rm_Cab  = this.id_Examen_Rm_Cab_Global;
        const calificacion  = this.calificacionExamen == '' ? 0 : Number(this.calificacionExamen) ;
      
        this.examenService.get_iniciar_examen( id_Examen_Rm_Resolucion_Cab, id_Examen_Rm_Cab, calificacion,  this.idUserGlobal)
            .subscribe((res:RespuestaServer)=>{  
              Swal.close();
                if (res.ok==true) {  
      
                  this.id_Resolucion_Cab_Global = res.data[0].id_Examen_Rm_Resolucion_Cab;   
      
                  const tiempo = (this.tiempoExamen=='') ? 0 :  Number(this.tiempoExamen);
                  this.contadorTiempo(tiempo);
      
                  setTimeout(() => { // enfocando
                    $('#formExamen').removeClass('disabledForm');
                  }, 0);
      
                }else{
                  this.alertasService.Swal_alert('error', JSON.stringify(res.data));
                  alert(JSON.stringify(res.data));
                }              
        })       
    }
  })   

 }


 changeAlternativa(idAlternativa : any, objAlternativa : any) {     
  for (let item of this.examen){
    for (let row of item.alternativas ){
      if (row.id_Examen_RM_Det_Preguntas == objAlternativa.id_Examen_RM_Det_Preguntas  ) {
        row.eligio = true;
        break;
      }
    }
  }       
 }
 
 registrarPregunta(obj:any) {

   if ( obj.tipoPregunta == 1) {  //---- para marcar ---
         //-----validaciones ----------------------
         let flagMarco = false;
         let alternativaElegida = [];
         for (let item of this.examen){
           if (item.pregunta == obj.pregunta  ) {            
             alternativaElegida = item.alternativas.filter((alt) => alt.eligio == true);
             if (alternativaElegida.length > 0) {
              flagMarco = true
             }     
             break
           }
         }
      
         if (flagMarco == false) {
            this.alertasService.Swal_alert('error','Marque una Alternativa para la  pregunta  '   + obj.pregunta  + ' ?');
            return ;
         }       
         //----- fin de validaciones ----------------
      
         this.grabarRespuestaPregunta(alternativaElegida[0]);
   }else{   //---- para escribir ---
        console.log(obj)
        const textoRespuesta= obj.alternativas[0].texto_respuesta;
        if (textoRespuesta == '' || textoRespuesta == null) {
          this.alertasService.Swal_alert('error','Por favor ingrese la respuesta para la pregunta '  + obj.pregunta  + ' ?' );
          return 
        }
        this.grabarRespuestaPregunta(obj.alternativas[0]);
   }

 }
 
 grabarRespuestaPregunta(alternativa :any){

  this.alertasService.Swal_Question('Sistemas', 'Esta seguro de registrar la respuesta a esta pregunta. ?')
  .then((result)=>{
    if(result.value){

      const id_Examen_Rm_Resolucion_Det  = 0;
      const id_Examen_Rm_Resolucion_Cab  = this.id_Resolucion_Cab_Global;
      const id_Examen_RM_Det_Preguntas  =  alternativa.id_Examen_RM_Det_Preguntas  ;
      const texto_respuesta  =  alternativa.texto_respuesta;
 
      Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
      Swal.showLoading();
      this.examenService.set_respuesta_examen( id_Examen_Rm_Resolucion_Det, id_Examen_Rm_Resolucion_Cab,  id_Examen_RM_Det_Preguntas, this.idUserGlobal, texto_respuesta ).subscribe((res:RespuestaServer)=>{
        Swal.close();        
        if (res.ok ==true) { 

          //----- desabilitando la  pregunta respondida ---
          for (let pregunta of this.examen){   
            if (pregunta.pregunta  == alternativa.descripcion_pregunta  ) {
              pregunta.respondida = true;
              break;
            }
          }           
          this.verificandoSiConcluyoResponder();        
        }else{
          this.alertasService.Swal_alert('error', JSON.stringify(res.data));
          alert(JSON.stringify(res.data));
        }
      })
       
    }
  }) 

 }

 verificandoSiConcluyoResponder(){ 
  const exam= this.examen.filter(ex => ex.respondida == false);

  this.spinner.show();
  this.examenService.get_mostrar_examen( this.idUserGlobal)
  .subscribe((res:RespuestaServer)=>{  
      this.spinner.hide();

      if (res.ok ==true) { 
        if ( !res.data[0].mensaje) {

          this.calificacionExamen  = res.data[0].calificacion;
          this.preguntaResueltaExamen = res.data[0].preguntas_resueltas;

          if (exam.length == 0) {
            this.alertasService.Swal_Success('Usted termino el examen su Nota es ' +  this.calificacionExamen );  
          }else{
            this.alertasService.Swal_alert('success','Se almaceno su respuesta...');
          }
        }
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
    })
 }

 tiempoConcluidoExamen(){
  this.spinner.show();
  this.examenService.set_tiempoConcluido_examen( this.id_Resolucion_Cab_Global, this.idUserGlobal)
      .subscribe((res:RespuestaServer)=>{  
          this.spinner.hide();
          if (res.ok==true) {   

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

}
