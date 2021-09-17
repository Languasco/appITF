import { Injectable } from '@angular/core';
 
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const HttpUploadOptions = {
  headers: new HttpHeaders({ "Content-Type": "multipart/form-data" })
}
 

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  URL = environment.URL_API;
  constructor(private http:HttpClient) { }
  upload_imagen_usuario(file:any, idUsuario:number, idusuarioLogin : any) {   
    const formData = new FormData();   
    formData.append('file', file);
    const filtro =  idUsuario + '|' + idusuarioLogin;
    return this.http.post(this.URL + 'Uploads/post_imagenUsuario?filtros=' + filtro, formData);    
  }
 
  upload_Excel_medicos(file:any, idusuario : any) { 
    const formData = new FormData();   
    formData.append('file', file);
    const filtro =  idusuario 
    return this.http.post(this.URL + 'Uploads/post_archivoExcel_medicos?filtros=' + filtro, formData);
  }

  save_archivoExcel_medicos(idusuario : any){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '10');
    parametros = parametros.append('filtro', idusuario) ;
    return this.http.get( this.URL + 'tblMedicos' , {params: parametros});
  }

  upload_Excel_stock(file:any, ciclo:number, idusuario : number) { 
    const formData = new FormData();   
    formData.append('file', file);
    const filtro =  ciclo +'|'+ idusuario 
    return this.http.post(this.URL + 'Uploads/post_archivoExcel_stock?filtros=' + filtro, formData);
  }

  save_archivoExcel_stock(idusuario : any, fechaAsignacion :string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '4');
    parametros = parametros.append('filtro', idusuario   +  '|' + fechaAsignacion ) ;
    return this.http.get( this.URL + 'tblStock' , {params: parametros});
  }
  
  upload_Excel_target(file:any, opcionTarget:string, idusuario : number) { 
    const formData = new FormData();   
    formData.append('file', file);
    const filtro =  opcionTarget +'|'+ idusuario ;
    return this.http.post(this.URL + 'Uploads/post_archivoExcel_target?filtros=' + filtro, formData);
  }

  save_archivoExcel_target(opcionTarget :string, idusuario : any){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '2');
    parametros = parametros.append('filtro', opcionTarget  + '|' + idusuario) ;
    return this.http.get( this.URL + 'Target' , {params: parametros});
  }

  upload_Excel_formato1( ) { 
    return this.http.post(this.URL + 'Uploads/post_archivoExcel_programacionData1',httpOptions);
  }

  upload_Excel_formato2( ) { 
    return this.http.post(this.URL + 'Uploads/post_archivoExcel_programacionData2',httpOptions);
  }

  upload_Excel_boticasFarmacias(file:any, idusuario : any) { 
    const formData = new FormData();   
    formData.append('file', file);
    const filtro =  idusuario 
    return this.http.post(this.URL + 'Uploads/post_archivoExcel_boticasFarmacias?filtros=' + filtro, formData);
  }

  save_archivoExcel_boticasFarmacias(idusuario : any){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '17');
    parametros = parametros.append('filtro', idusuario) ;
    return this.http.get( this.URL + 'tblMedicos' , {params: parametros});
  }

  upload_Excel_target_boticasFarmacias(file:any, opcionTarget:string, idusuario : number) { 
    const formData = new FormData();   
    formData.append('file', file);
    const filtro =  opcionTarget +'|'+ idusuario ;
    return this.http.post(this.URL + 'Uploads/post_archivoExcel_target_boticasFarmacias?filtros=' + filtro, formData);
  }

  save_archivoExcel_target_boticasFarmacias(opcionTarget :string, idusuario : any){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '13');
    parametros = parametros.append('filtro', opcionTarget  + '|' + idusuario) ;
    return this.http.get( this.URL + 'Target' , {params: parametros});
  }

  get_verificar_codigoRol(codRol:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '3');
    parametros = parametros.append('filtro', codRol);

    return this.http.get( this.URL + 'tblActividades' , {params: parametros}).toPromise();
  }
 

}
