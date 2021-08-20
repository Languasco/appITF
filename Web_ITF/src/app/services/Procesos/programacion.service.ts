 
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const HttpUploadOptions = {
  headers: new HttpHeaders({ "Content-Type": "multipart/form-data" })
}

@Injectable({
  providedIn: 'root'
})
export class ProgramacionService {

  URL = environment.URL_API;
  resultadosVisitas :any [] = [];

  constructor(private http:HttpClient) { }   


  get_resultadosVisitas(){
    if (this.resultadosVisitas.length > 0) {
      return of( this.resultadosVisitas )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '2');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'Programacion' , {params: parametros})
                 .pipe(map((res:any)=>{
                        this.resultadosVisitas = res.data;
                       return res.data;
                  }) );
    }
  }
 
  get_mostrarProgramaciones({idUsuario, idCiclo, medico, categoria,  especialidad,resultado, idEstado }){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '1');
    parametros = parametros.append('filtro', String(idUsuario)  + '|' + idCiclo + '|' + medico + '|' +  categoria  + '|' + especialidad + '|' + String(resultado)  + '|' + String(idEstado)  );

    return this.http.get( this.URL + 'Programacion' , {params: parametros});
  }


  get_datosProgramacionCab(idProgCab:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '3');
    parametros = parametros.append('filtro', String(idProgCab) );

    return this.http.get( this.URL + 'Programacion' , {params: parametros});
  }

  get_direccionesMedicos(idMedico:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '5');
    parametros = parametros.append('filtro', String(idMedico) );

    return this.http.get( this.URL + 'Programacion' , {params: parametros});
  }

  get_datosProgramacionDet(idProgCab:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '4');
    parametros = parametros.append('filtro', String(idProgCab) );

    return this.http.get( this.URL + 'Programacion' , {params: parametros});
  }

  set_update_programacionCab(objProgramacion:any, idProcCab :number, horaProgram:any , horaReport:any){
    return this.http.put(this.URL + 'tblProgramacion_Cab/'  + idProcCab + '?horaProgramacion='+ horaProgram +'&horaReporte=' + horaReport  , JSON.stringify(objProgramacion), httpOptions); 
  }


  get_datosProductos(idCiclo:number , idUser:number ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '6');
    parametros = parametros.append('filtro', String(idCiclo) + '|' + String(idUser)  );
    return this.http.get( this.URL + 'Programacion' , {params: parametros});
  }

  
  get_datosStock(idCiclo:number , idUser:number , idProducto :number ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '7');
    parametros = parametros.append('filtro', String(idCiclo) + '|' + String(idUser)  + '|' + String(idProducto)  );

    return this.http.get( this.URL + 'Programacion' , {params: parametros});
  }

  set_save_programacionDet(listProgramacionDet : any, idUsuario:number){
    return this.http.post(this.URL + 'Programacion/set_guardandoDetalleProgramacion?idUsuario='+ idUsuario, JSON.stringify(listProgramacionDet), httpOptions);
  }

  get_informacionMedico_Programacion(idMedico:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '9');
    parametros = parametros.append('filtro', String(idMedico));

   return this.http.get( this.URL + 'Programacion' , {params: parametros});
  }

  get_informacionMedico_ProgramacionDet(idMedico:number, mercadoProducto : string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '10');
    parametros = parametros.append('filtro', String(idMedico)  + '|' + String(mercadoProducto)  );

   return this.http.get( this.URL + 'Programacion' , {params: parametros});
  }

  get_informacion_rejaPromocional(idEspecialidad:number ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '11');
    parametros = parametros.append('filtro', String(idEspecialidad)    );

   return this.http.get( this.URL + 'Programacion' , {params: parametros});
  }

  set_eliminarInformacionTemporal(opcionModal:number ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '12');
    parametros = parametros.append('filtro', String(opcionModal)  );

   return this.http.get( this.URL + 'Programacion' , {params: parametros});
  }

  get_verificar_visitaMedico(idMedico_Global:number, fechaReporte:string ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '13');
    parametros = parametros.append('filtro', String(idMedico_Global)  + '|' + String(fechaReporte));

    return this.http.get( this.URL + 'Programacion' , {params: parametros}).toPromise();
  }

  get_resetearProgramacion(id_Programacion_cab : number , idUser : number ){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '14');
    parametros = parametros.append('filtro', String(id_Programacion_cab)  + '|' + String(idUser));
 
    return this.http.get( this.URL + 'Programacion' , {params: parametros});
  }


  //--- BOTICAS Y FARMACIAS ----

  get_mostrarProgramaciones_boticasFarmacias({idUsuario, idCiclo, medico, categoria,  especialidad,resultado, idEstado }){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '15');
    parametros = parametros.append('filtro', String(idUsuario)  + '|' + idCiclo + '|' + medico + '|' +  categoria  + '|' + especialidad + '|' + String(resultado)  + '|' + String(idEstado)  );

    return this.http.get( this.URL + 'Programacion' , {params: parametros});
  }



 
}
