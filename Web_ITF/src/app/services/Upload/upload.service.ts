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

  //-----carga  carta Enel de excel ------ 
  upload_imagen_usuario(file:any, idUsuario:number, idusuarioLogin : any) {  
 
    const formData = new FormData();   
    formData.append('file', file);
    const filtro =  idUsuario + '|' + idusuarioLogin;
    return this.http.post(this.URL + 'Uploads/post_imagenUsuario?filtros=' + filtro, formData);
    
  }

 

}
