
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertasService } from '../../services/alertas/alertas.service';
import { RespuestaServer } from '../../models/respuestaServer.models';
import { FuncionesglobalesService } from '../../services/funciones/funcionesglobales.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../../services/login/login.service';
import Swal from 'sweetalert2';

import { combineLatest } from 'rxjs';
import { ActividadService } from '../../services/Mantenimientos/actividad.service';
 

declare var $:any;
 
declare var $:any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent  {

  formParamsFiltro : FormGroup;
  idUserGlobal = 0;
  ciclos :any[]=[]; 

  tabControlDetalle: string[] = ['RESUMEN GENERAL','RESUMEN DIARIO' ]; 
  selectedTabControlDetalle :any;

  objectoReporteCab :any = {};

  resumenGeneral :any[]=[]; 
  resumenDiario :any[]=[]; 
  columnsResumenDiario = [];


  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService, private funcionesglobalesService : FuncionesglobalesService, private actividadService :ActividadService  ) {         
    this.idUserGlobal = this.loginService.get_idUsuario();
  }

  ngOnInit(): void {
    this.selectedTabControlDetalle = this.tabControlDetalle[0];
      this.getCargarCombos();
      this.inicializarFormularioFiltro();
    }

    inicializarFormularioFiltro(){ 
      this.formParamsFiltro= new FormGroup({
        idCiclo : new FormControl('0') 
       }) 
    }
      
   getCargarCombos(){ 
    this.spinner.show();
    combineLatest([this.actividadService.get_ciclos() ])
    .subscribe( ([_ciclos])=>{
      this.ciclos = _ciclos;
      this.spinner.hide(); 
    })
   }
  
   change_ciclo(idCiclo:any){
  
    if (idCiclo == 0 ||  idCiclo == '0' ) {
      return;
    }
   
    Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
    Swal.showLoading();
    this.loginService.get_reporteResumen_rrmm( idCiclo, this.idUserGlobal).subscribe((res:RespuestaServer)=>{
      Swal.close();      
      
      if (res.ok ==true) {    

        this.resumenGeneral = res.data; 

        if (res.data.length > 0) {
          
          const { fecha_inicio_ciclo, dias_ciclo_mes, fecha_fin_ciclo, dias_a_la_fecha, fecha_actual } =   this.resumenGeneral[0];                  
          this.objectoReporteCab = { fecha_inicio_ciclo, dias_ciclo_mes, fecha_fin_ciclo, dias_a_la_fecha, fecha_actual  } ;

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
