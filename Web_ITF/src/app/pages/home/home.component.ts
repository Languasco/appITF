
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertasService } from '../../services/alertas/alertas.service';
import { RespuestaServer } from '../../models/respuestaServer.models';
import { FuncionesglobalesService } from '../../services/funciones/funcionesglobales.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../../services/login/login.service';
import Swal from 'sweetalert2';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';


import { combineLatest } from 'rxjs';
import { ActividadService } from '../../services/Mantenimientos/actividad.service';
 
declare var $:any; 
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent  {

  formParamsFiltro : FormGroup;
  idUserGlobal = 0;

  flag_es_supervisor =0;

  ciclos :any[]=[]; 
  ciclosByF :any[]=[]; 

  tabControlDetalle: string[] = ['RESUMEN GENERAL','RESUMEN DIARIO' ]; 
  selectedTabControlDetalle :any;

  objectoReporteCab :any = {};

  resumenGeneral :any[]=[]; 
  resumenDiario :any[]=[]; 
  columnsResumenDiario = [];

   //---grafico ---
  dataFrecuenciaMes : Object;
  dataFrecuenciaFecha : Object;
  
  dataCoberturaMes : Object;
  dataCoberturaFecha : Object;

  frecuenciaMes :any[]=[]; 
  frecuenciaFecha :any[]=[]; 

  CoberturaMes :any[]=[]; 
  CoberturaFecha :any[]=[]; 


  //----boticas y farmacias ---
  resumenGeneral_ByF :any[]=[]; 
  resumenDiario_ByF :any[]=[]; 
  columnsResumenDiario_ByF = [];

  
  frecuenciaMes_ByF :any[]=[]; 
  frecuenciaFecha_ByF :any[]=[]; 

  CoberturaMes_ByF :any[]=[]; 
  CoberturaFecha_ByF :any[]=[]; 

  dataFrecuenciaMes_ByF : Object;
  dataFrecuenciaFecha_ByF : Object;
  
  dataCoberturaMes_ByF : Object;
  dataCoberturaFecha_ByF : Object;

  objectoReporteCab_ByF :any = {};

  @ViewChild('staticTabs', { static: false }) staticTabs?: TabsetComponent;
  
  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService, private funcionesglobalesService : FuncionesglobalesService, private actividadService :ActividadService  ) {         
    this.idUserGlobal = this.loginService.get_idUsuario();
    this.flag_es_supervisor = this.loginService.get_flag_EsSupervisor();
  }

  ngOnInit(): void {
    this.selectedTabControlDetalle = this.tabControlDetalle[0];

     ///---enfocando Tab----
      this.enfoncandoTabs(0)
      this.getCargarCombos();
      this.inicializarFormularioFiltro();
            
      this.dataFrecuenciaMes =  this.get_estructuraGraficoCalibre(1);
      this.dataFrecuenciaFecha =  this.get_estructuraGraficoCalibre(1);

      this.dataCoberturaMes =  this.get_estructuraGraficoCalibre(1);
      this.dataCoberturaFecha =  this.get_estructuraGraficoCalibre(1);


                  
      this.dataFrecuenciaMes_ByF =  this.get_estructuraGraficoCalibre(1);
      this.dataFrecuenciaFecha_ByF =  this.get_estructuraGraficoCalibre(1);

      this.dataCoberturaMes_ByF =  this.get_estructuraGraficoCalibre(1);
      this.dataCoberturaFecha_ByF =  this.get_estructuraGraficoCalibre(1);

    }

    enfoncandoTabs(tabId: number) {
      if (this.staticTabs?.tabs[tabId]) {
        this.staticTabs.tabs[tabId].active = true;
      }
    }

    
 selectTab(data: TabDirective){   

  const nameTab = data.heading;  
     switch (nameTab) {
       case 'ARCHIVOS':  
          setTimeout(()=>{ // 
            $('#tablaFile').DataTable()
         },0);
       break;
       // case 'MARTES':
       //   this.formParams.patchValue({"periodo_dia": 2});
       // break;           
       default:
         break;
     }
  }

    get_estructuraGraficoCalibre(valorPorcentaje : number){
      const data = {
        chart: {
          lowerlimit: "0",
          upperlimit: "150",
          showvalue: "1",
          // numbersuffix: "%",
          theme: "fusion",
          showtooltip: "0",
          showTickValues: "0",
          showTickMarks: "0"
        },
        colorrange: {
          color: [
            {
              minvalue: "0",
              maxvalue: "70",
              code: "#F2726F"
            },
            {
              minvalue: "70",
              maxvalue: "100",
              code: "#FFC533"
            },
            {
              minvalue: "100",
              maxvalue: "150",
              code: "#62B58F"
            }
          ]
        },
        dials: {
          dial: [
            {
              value: valorPorcentaje
            }
          ]
        }
      }
      return data;
    }

    inicializarFormularioFiltro(){ 
      this.formParamsFiltro= new FormGroup({
        idCiclo : new FormControl('0') ,
        idCicloByF : new FormControl('0') 
       }) 
    }
      
   getCargarCombos(){ 
    this.spinner.show();
    combineLatest([this.actividadService.get_ciclos() ])
    .subscribe( ([_ciclos ])=>{
      this.ciclos = _ciclos;
      this.ciclosByF = _ciclos;
      this.spinner.hide(); 
    })
   }
  
   change_ciclo(idCiclo:any){
  
    if (idCiclo == 0 ||  idCiclo == '0' ) {

      this.resumenGeneral =  [];
 
      this.frecuenciaMes = [];
      this.frecuenciaFecha = [];

      this.CoberturaMes = [];
      this.CoberturaFecha = [];

      this.resumenDiario =[];
      this.columnsResumenDiario = [];

      this.dataFrecuenciaMes =  this.get_estructuraGraficoCalibre(1);
      this.dataFrecuenciaFecha =  this.get_estructuraGraficoCalibre(1);

      this.dataCoberturaMes =  this.get_estructuraGraficoCalibre(1);
      this.dataCoberturaFecha =  this.get_estructuraGraficoCalibre(1);

      return;
    }
   
    Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
    Swal.showLoading();
    this.loginService.get_reporteResumen_rrmm( idCiclo, this.idUserGlobal).subscribe((res:RespuestaServer)=>{
      Swal.close();      
      
      if (res.ok ==true) {    

        if (res.data.length > 0) {

          if ( this.flag_es_supervisor == 1 ) {
            this.resumenGeneral = res.data; 

            const { fecha_inicio_ciclo, dias_ciclo_mes, fecha_fin_ciclo, dias_a_la_fecha, fecha_actual } =   this.resumenGeneral[0];                  
            this.objectoReporteCab = { fecha_inicio_ciclo, dias_ciclo_mes, fecha_fin_ciclo, dias_a_la_fecha, fecha_actual  } ;

          }else{

            if (res.data.length = 2) {

                this.resumenGeneral = res.data;  

                const { fecha_inicio_ciclo, dias_ciclo_mes, fecha_fin_ciclo, dias_a_la_fecha, fecha_actual } =   this.resumenGeneral[0];                  
                this.objectoReporteCab = { fecha_inicio_ciclo, dias_ciclo_mes, fecha_fin_ciclo, dias_a_la_fecha, fecha_actual  } ;

                this.frecuenciaMes = [];
                this.frecuenciaFecha = [];

                this.CoberturaMes = [];
                this.CoberturaFecha = [];

                let valorFrecMes=0;
                for (let index = 0; index < this.resumenGeneral.length; index++) {                  
                  this.frecuenciaMes.push({
                    cuota_mes: this.resumenGeneral[index].cuota_mes,
                    numero_visitas : this.resumenGeneral[index].numero_visitas,
                    porcentaje_mes : this.resumenGeneral[index].porcentaje_mes,
                    saldo_mes : this.resumenGeneral[index].saldo_mes  
                  })
                  valorFrecMes = Number(this.resumenGeneral[index].porcentaje_mes);
                  break;
                }
           
                this.dataFrecuenciaMes =  this.get_estructuraGraficoCalibre(valorFrecMes);

                let valorFrecFecha=0;
                for (let index = 0; index < this.resumenGeneral.length; index++) {                     
                  this.frecuenciaFecha.push({
                    cuota_fecha: this.resumenGeneral[index].cuota_fecha,
                    numero_visitas : this.resumenGeneral[index].numero_visitas,
                    porcentaje_fecha : this.resumenGeneral[index].porcentaje_fecha,
                    saldo_fecha : this.resumenGeneral[index].saldo_fecha  
                  })
                  valorFrecFecha = Number(this.resumenGeneral[index].porcentaje_fecha);
                  break;
                }
 
                this.dataFrecuenciaFecha =  this.get_estructuraGraficoCalibre(valorFrecFecha);
                
                // ---- COBERTURA
 
                
                let valorCoberMes=0;
                for (let index = 0; index < this.resumenGeneral.length; index++) {     
                  
                  if (index == 0) {
                    continue;
                  }
                  this.CoberturaMes.push({
                    cuota_mes: this.resumenGeneral[index].cuota_mes,
                    numero_visitas : this.resumenGeneral[index].numero_visitas,
                    porcentaje_mes : this.resumenGeneral[index].porcentaje_mes,
                    saldo_mes : this.resumenGeneral[index].saldo_mes  
                  })
                  valorCoberMes = Number(this.resumenGeneral[index].porcentaje_mes);
                  break;
                }            
                this.dataCoberturaMes = this.get_estructuraGraficoCalibre(valorCoberMes);
 
                let valorCoberFecha=0;
                for (let index = 0; index < this.resumenGeneral.length; index++) {   
                  if (index == 0) {
                    continue;
                  }                  
                  this.CoberturaFecha.push({
                    cuota_fecha: this.resumenGeneral[index].cuota_fecha,
                    numero_visitas : this.resumenGeneral[index].numero_visitas,
                    porcentaje_fecha : this.resumenGeneral[index].porcentaje_fecha,
                    saldo_fecha : this.resumenGeneral[index].saldo_fecha  
                  })
                  valorCoberFecha = Number(this.resumenGeneral[index].porcentaje_fecha);
                  break;
                }

                this.dataCoberturaFecha =this.get_estructuraGraficoCalibre(valorCoberFecha);
            }
            else{
              this.resumenGeneral =  [];
 
              this.frecuenciaMes = [];
              this.frecuenciaFecha = [];
        
              this.CoberturaMes = [];
              this.CoberturaFecha = [];
        
              this.resumenDiario =[];
              this.columnsResumenDiario = [];
        
              this.dataFrecuenciaMes =  this.get_estructuraGraficoCalibre(1);
              this.dataFrecuenciaFecha =  this.get_estructuraGraficoCalibre(1);
        
              this.dataCoberturaMes =  this.get_estructuraGraficoCalibre(1);
              this.dataCoberturaFecha =  this.get_estructuraGraficoCalibre(1);
            }
          }

          //---ejecutando segundo reporte resumen diario -----
          Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
          Swal.showLoading();
          this.loginService.get_reporteResumenDiario_rrmm( idCiclo, this.idUserGlobal).subscribe((res:RespuestaServer)=>{
            Swal.close();    
            if (res.ok ==true) {  
              
              this.resumenDiario =[];
              this.columnsResumenDiario = [];

              this.resumenDiario = res.data; 

              if (this.resumenDiario.length > 0){  
                     //---- generando las columnas dinamicas ----
                     let columnsDiario :any [] = [];
                     columnsDiario = Object.keys(this.resumenDiario[0]); 

                     for (const key in columnsDiario) { 
                           this.columnsResumenDiario.push( columnsDiario[key] );  
                     } 

                    //---- generando el total por fila dinamica  
                    let totalFila= 0;
                     for (let index = 0; index < this.resumenDiario.length; index++) {
                      
                      totalFila= 0;
                      for (const key in columnsDiario) {                          
                        if (Number(key)>4) {           
                          totalFila += Number(this.resumenDiario[index][this.columnsResumenDiario[key]]);  
                        }                  
                      } 
                      this.resumenDiario[index].TOTAL = totalFila;
                    }
              }      
     
            }else{
              this.alertasService.Swal_alert('error', JSON.stringify(res.data));
              alert(JSON.stringify(res.data));
            }
          }) 
          //---fin de  reporte resumen diario -----

 
        }else{
          this.alertasService.Swal_alert('warning', 'No hay informacion para mostrar..');


          this.resumenGeneral =  [];
 
          this.frecuenciaMes = [];
          this.frecuenciaFecha = [];
    
          this.CoberturaMes = [];
          this.CoberturaFecha = [];
    
          this.resumenDiario =[];
          this.columnsResumenDiario = [];
    
          this.dataFrecuenciaMes =  this.get_estructuraGraficoCalibre(1);
          this.dataFrecuenciaFecha =  this.get_estructuraGraficoCalibre(1);
    
          this.dataCoberturaMes =  this.get_estructuraGraficoCalibre(1);
          this.dataCoberturaFecha =  this.get_estructuraGraficoCalibre(1);


          return;
        }
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
    })  
        
   }


   change_ciclo_ByF(idCiclo:any){
  
    if (idCiclo == 0 ||  idCiclo == '0' ) {

      this.resumenGeneral_ByF =  [];
 
      this.frecuenciaMes_ByF = [];
      this.frecuenciaFecha_ByF = [];

      this.CoberturaMes_ByF = [];
      this.CoberturaFecha_ByF = [];

      this.resumenDiario_ByF =[];
      this.columnsResumenDiario_ByF = [];

      this.dataFrecuenciaMes_ByF =  this.get_estructuraGraficoCalibre(1);
      this.dataFrecuenciaFecha_ByF =  this.get_estructuraGraficoCalibre(1);
      


      this.dataCoberturaMes_ByF =  this.get_estructuraGraficoCalibre(1);
      this.dataCoberturaFecha_ByF =  this.get_estructuraGraficoCalibre(1);

      return;
    }
   
    Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
    Swal.showLoading();
    this.loginService.get_reporteResumen_rrmm_ByF( idCiclo, this.idUserGlobal).subscribe((res:RespuestaServer)=>{
      Swal.close();      
      
      if (res.ok ==true) {    

        if (res.data.length > 0) {

          if ( this.flag_es_supervisor == 1 ) {
            this.resumenGeneral_ByF = res.data; 

            const { fecha_inicio_ciclo, dias_ciclo_mes, fecha_fin_ciclo, dias_a_la_fecha, fecha_actual } =   this.resumenGeneral_ByF[0];                  
            this.objectoReporteCab_ByF = { fecha_inicio_ciclo, dias_ciclo_mes, fecha_fin_ciclo, dias_a_la_fecha, fecha_actual  } ;

          }else{

            if (res.data.length = 2) {

                this.resumenGeneral_ByF = res.data;  

                const { fecha_inicio_ciclo, dias_ciclo_mes, fecha_fin_ciclo, dias_a_la_fecha, fecha_actual } =   this.resumenGeneral_ByF[0];                  
                this.objectoReporteCab_ByF = { fecha_inicio_ciclo, dias_ciclo_mes, fecha_fin_ciclo, dias_a_la_fecha, fecha_actual  } ;

                this.frecuenciaMes_ByF = [];
                this.frecuenciaFecha_ByF = [];

                this.CoberturaMes_ByF = [];
                this.CoberturaFecha_ByF = [];

                let valorFrecMes=0;
                for (let index = 0; index < this.resumenGeneral_ByF.length; index++) {                  
                  this.frecuenciaMes_ByF.push({
                    cuota_mes: this.resumenGeneral_ByF[index].cuota_mes,
                    numero_visitas : this.resumenGeneral_ByF[index].numero_visitas,
                    porcentaje_mes : this.resumenGeneral_ByF[index].porcentaje_mes,
                    saldo_mes : this.resumenGeneral_ByF[index].saldo_mes  
                  })
                  valorFrecMes = Number(this.resumenGeneral_ByF[index].porcentaje_mes);
                  break;
                }
           
                this.dataFrecuenciaMes_ByF =  this.get_estructuraGraficoCalibre(valorFrecMes);

                let valorFrecFecha=0;
                for (let index = 0; index < this.resumenGeneral_ByF.length; index++) {                     
                  this.frecuenciaFecha_ByF.push({
                    cuota_fecha: this.resumenGeneral_ByF[index].cuota_fecha,
                    numero_visitas : this.resumenGeneral_ByF[index].numero_visitas,
                    porcentaje_fecha : this.resumenGeneral_ByF[index].porcentaje_fecha,
                    saldo_fecha : this.resumenGeneral_ByF[index].saldo_fecha  
                  })
                  valorFrecFecha = Number(this.resumenGeneral_ByF[index].porcentaje_fecha);
                  break;
                }
 
                this.dataFrecuenciaFecha_ByF =  this.get_estructuraGraficoCalibre(valorFrecFecha);
                
                // ---- COBERTURA
 
                
                let valorCoberMes=0;
                for (let index = 0; index < this.resumenGeneral_ByF.length; index++) {     
                  
                  if (index == 0) {
                    continue;
                  }
                  this.CoberturaMes_ByF.push({
                    cuota_mes: this.resumenGeneral_ByF[index].cuota_mes,
                    numero_visitas : this.resumenGeneral_ByF[index].numero_visitas,
                    porcentaje_mes : this.resumenGeneral_ByF[index].porcentaje_mes,
                    saldo_mes : this.resumenGeneral_ByF[index].saldo_mes  
                  })
                  valorCoberMes = Number(this.resumenGeneral_ByF[index].porcentaje_mes);
                  break;
                }            
                this.dataCoberturaMes_ByF = this.get_estructuraGraficoCalibre(valorCoberMes);
 
                let valorCoberFecha=0;
                for (let index = 0; index < this.resumenGeneral_ByF.length; index++) {   
                  if (index == 0) {
                    continue;
                  }                  
                  this.CoberturaFecha_ByF.push({
                    cuota_fecha: this.resumenGeneral_ByF[index].cuota_fecha,
                    numero_visitas : this.resumenGeneral_ByF[index].numero_visitas,
                    porcentaje_fecha : this.resumenGeneral_ByF[index].porcentaje_fecha,
                    saldo_fecha : this.resumenGeneral_ByF[index].saldo_fecha  
                  })
                  valorCoberFecha = Number(this.resumenGeneral_ByF[index].porcentaje_fecha);
                  break;
                }

                this.dataCoberturaFecha_ByF =this.get_estructuraGraficoCalibre(valorCoberFecha);
            }
            else{
              this.resumenGeneral_ByF =  [];
 
              this.frecuenciaMes_ByF = [];
              this.frecuenciaFecha_ByF = [];
        
              this.CoberturaMes_ByF = [];
              this.CoberturaFecha_ByF = [];
        
              this.resumenDiario_ByF =[];
              this.columnsResumenDiario_ByF = [];
        
              this.dataFrecuenciaMes_ByF =  this.get_estructuraGraficoCalibre(1);
              this.dataFrecuenciaFecha_ByF =  this.get_estructuraGraficoCalibre(1);
        
              this.dataCoberturaMes_ByF =  this.get_estructuraGraficoCalibre(1);
              this.dataCoberturaFecha_ByF =  this.get_estructuraGraficoCalibre(1);
            }
          }

          //---ejecutando segundo reporte resumen diario -----
          Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
          Swal.showLoading();
          this.loginService.get_reporteResumenDiario_rrmm_ByF( idCiclo, this.idUserGlobal).subscribe((res:RespuestaServer)=>{
            Swal.close();    
            if (res.ok ==true) {  
              
              this.resumenDiario_ByF =[];
              this.columnsResumenDiario_ByF = [];

              this.resumenDiario_ByF = res.data; 

              if (this.resumenDiario_ByF.length > 0){  
                     //---- generando las columnas dinamicas ----
                     let columnsDiario :any [] = [];
                     columnsDiario = Object.keys(this.resumenDiario_ByF[0]); 

                     for (const key in columnsDiario) { 
                           this.columnsResumenDiario_ByF.push( columnsDiario[key] );  
                     } 

                    //---- generando el total por fila dinamica  
                    let totalFila= 0;
                     for (let index = 0; index < this.resumenDiario_ByF.length; index++) {
                      
                      totalFila= 0;
                      for (const key in columnsDiario) {                          
                        if (Number(key)>4) {           
                          totalFila += Number(this.resumenDiario_ByF[index][this.columnsResumenDiario_ByF[key]]);  
                        }                  
                      } 
                      this.resumenDiario_ByF[index].TOTAL = totalFila;
                    }
              }      
     
            }else{
              this.alertasService.Swal_alert('error', JSON.stringify(res.data));
              alert(JSON.stringify(res.data));
            }
          }) 
          //---fin de  reporte resumen diario -----

 
        }else{
          this.alertasService.Swal_alert('warning', 'No hay informacion para mostrar..');


          this.resumenGeneral_ByF =  [];
 
          this.frecuenciaMes_ByF = [];
          this.frecuenciaFecha_ByF = [];
    
          this.CoberturaMes_ByF = [];
          this.CoberturaFecha_ByF = [];
    
          this.resumenDiario_ByF =[];
          this.columnsResumenDiario_ByF = [];
    
          this.dataFrecuenciaMes_ByF =  this.get_estructuraGraficoCalibre(1);
          this.dataFrecuenciaFecha_ByF =  this.get_estructuraGraficoCalibre(1);
    
          this.dataCoberturaMes_ByF =  this.get_estructuraGraficoCalibre(1);
          this.dataCoberturaFecha_ByF =  this.get_estructuraGraficoCalibre(1);


          return;
        }
      }else{
        this.alertasService.Swal_alert('error', JSON.stringify(res.data));
        alert(JSON.stringify(res.data));
      }
    })  
        
   }


   getAlineamiento(valor:any){
    if (valor == 'REPRESENTANTE') {
      return 'text-left'
    }
    if (valor == 'ACCION') {
      return 'text-center'
    }
    else{
      return 'text-right'
    }
  }

  
getColorEstado(valor:number){ 
  if (valor > 0 &&  valor <=70 ) {
    return 'red';
  }
  else if (valor > 71  && valor <= 100 ) {
    return 'yellow';
  }
  else if (valor > 101) {
    return 'green';
  }else{
    return 'white';
  }  
}

 



}
