import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const HttpUploadOptions = {
  headers: new HttpHeaders({ "Content-Type": "multipart/form-data" })
}

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
 

  URL = environment.URL_API;
  estados:any[] = [];
  perfiles :any[] = [];
  supervisores :any[] = [];

  constructor(private http:HttpClient) { }

  get_estados(){
    if (this.estados.length > 0) {
      return of( this.estados )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '1');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'tblUsuarios' , {params: parametros})
                 .pipe(map((res:any)=>{
                       this.estados = res.data;
                       return res.data;
                  }) );
    }
  } 

  get_perfil(){
    if (this.perfiles.length > 0) {
      return of( this.perfiles )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '7');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'tblUsuarios' , {params: parametros})
                 .pipe(map((res:any)=>{
                        this.perfiles = res.data;
                       return res.data;
                  }) );
    }
  }

  get_supervisores(){
    if (this.supervisores.length > 0) {
      return of( this.supervisores )
    }else{
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '3');
      parametros = parametros.append('filtro', '');
  
      return this.http.get( this.URL + 'tblUsuarios' , {params: parametros})
                 .pipe(map((res:any)=>{
                        this.supervisores = res.data;
                       return res.data;
                  }) );
    }
  }


  get_mostrarUsuario_general(idEstado:number, idRol:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '1');
    parametros = parametros.append('filtro', String(idEstado) + '|' +  idRol);

    return this.http.get( this.URL + 'tblUsuarios' , {params: parametros});
  }

  get_mostrarUsuario(idUsuario:number){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '2');
    parametros = parametros.append('filtro', String(idUsuario));
    return this.http.get( this.URL + 'tblUsuarios' , {params: parametros});
  }



  get_verificar_DniPersonal(nroDoc:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '5');
    parametros = parametros.append('filtro', nroDoc);

    return this.http.get( this.URL + 'tblPersonal' , {params: parametros}).toPromise();
  }
  
  get_verificar_DniUsuario(nroDoc:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '6');
    parametros = parametros.append('filtro', nroDoc);

    return this.http.get( this.URL + 'tblUsuarios' , {params: parametros}).toPromise();
  }

  get_obtenerDatos_documento(nroDoc:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '8');
    parametros = parametros.append('filtro', nroDoc);

    return this.http.get( this.URL + 'tblUsuarios' , {params: parametros}).toPromise();
  }

  get_verificar_logginUsuario(loggin:string){
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '9');
    parametros = parametros.append('filtro', loggin);

    return this.http.get( this.URL + 'tblUsuarios' , {params: parametros}).toPromise();
  } 
  
  set_saveUsuarios(objUsuarios:any){

    const usuario_BD = {
      id_Usuario: objUsuarios.id_Usuario , 
      nrodoc_usuario: objUsuarios.nrodoc_usuario ,  
      email_usuario: objUsuarios.email_usuario ,  
      id_Perfil: objUsuarios.id_Perfil ,  
      login_usuario: objUsuarios.login_usuario ,  
      contrasenia_usuario: objUsuarios.contrasenia_usuario ,  
      estado : objUsuarios.estado ,   
      usuario_creacion : objUsuarios.usuario_creacion ,  
    
      apellido_paterno_usuario: objUsuarios.apellido_paterno_usuario ,  
      apellido_materno_usuario: objUsuarios.apellido_materno_usuario ,  
      nombres_usuario: objUsuarios.nombres_usuario ,  
    
      celular_usuario: objUsuarios.celular_usuario ,   
      fecha_nacimiento_usuario: objUsuarios.fecha_nacimiento_usuario  ,  
      sexo_usuario: objUsuarios.sexo_usuario ,  
      id_supervisor: objUsuarios.id_supervisor ,  
      es_supervisor:  (objUsuarios.es_supervisor== true) ? 1:0 ,  
    }
    return this.http.post(this.URL + 'tblUsuarios', JSON.stringify(usuario_BD), httpOptions);
  }

  set_editUsuario(objUsuarios:any,idUsuario :number){

    const usuario_BD = {
      id_Usuario: objUsuarios.id_Usuario , 
      nrodoc_usuario: objUsuarios.nrodoc_usuario ,  
      email_usuario: objUsuarios.email_usuario ,  
      id_Perfil: objUsuarios.id_Perfil ,  
      login_usuario: objUsuarios.login_usuario ,  
      contrasenia_usuario: objUsuarios.contrasenia_usuario ,  
      estado : objUsuarios.estado ,   
      usuario_creacion : objUsuarios.usuario_creacion ,  
    
      apellido_paterno_usuario: objUsuarios.apellido_paterno_usuario ,  
      apellido_materno_usuario: objUsuarios.apellido_materno_usuario ,  
      nombres_usuario: objUsuarios.nombres_usuario ,  
    
      celular_usuario: objUsuarios.celular_usuario ,   
      fecha_nacimiento_usuario: objUsuarios.fecha_nacimiento_usuario  ,  
      sexo_usuario: objUsuarios.sexo_usuario ,  
      id_supervisor: objUsuarios.id_supervisor ,  
      es_supervisor:  (objUsuarios.es_supervisor== true) ? 1:0 ,  
    }
    return this.http.put(this.URL + 'tblUsuarios/' + idUsuario , JSON.stringify(usuario_BD), httpOptions);
  }

  set_anularUsuario(idUsuario : number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '5');
    parametros = parametros.append('filtro',  String(idUsuario));

    return this.http.get( this.URL + 'tblUsuarios' , {params: parametros});
  }  

  set_grabarAreasMasivo(idUsuarioBD : number, areas:string, idUser:number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '10');
    parametros = parametros.append('filtro', idUsuarioBD + '|' +  areas  + '|' +  idUser  );
    return this.http.get( this.URL + 'tblUsuarios' , {params: parametros});
  }  

  get_AreasMasivo(idUsuarioBD : number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '11');
    parametros = parametros.append('filtro', String(idUsuarioBD) );
    return this.http.get( this.URL + 'tblUsuarios' , {params: parametros});
  }  

  generararDescargar_codigoQr(idUsuario : number){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '12');
    parametros = parametros.append('filtro',  String(idUsuario));

    console.log(idUsuario)

    return this.http.get( this.URL + 'tblUsuarios' , {params: parametros});
  } 


    //-----accesos  menu

    get_accesosMenu(){
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '2');
      parametros = parametros.append('filtro',  '' );
  
      return this.http.get( this.URL + 'Login' , {params: parametros});
    }
  
    get_mostrarUsuarios_generalAccesos(){
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '13');
      parametros = parametros.append('filtro',  '' );
      return this.http.get( this.URL + 'tblUsuarios' , {params: parametros});
    }

    get_mostrarPerfiles_generalAccesos(){
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '17');
      parametros = parametros.append('filtro',  '' );
      return this.http.get( this.URL + 'tblUsuarios' , {params: parametros});
    }
  
    get_permisosUsuarioAcceso(idOpciones:string ){
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '14');
      parametros = parametros.append('filtro',  idOpciones );
      return this.http.get( this.URL + 'tblUsuarios' , {params: parametros});
    }

    get_permisosPerfilAcceso(idOpciones:string ){
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '18');
      parametros = parametros.append('filtro',  idOpciones );
      return this.http.get( this.URL + 'tblUsuarios' , {params: parametros});
    }
    
    get_eventosUsuarioMarcados(idOpciones:string,id_usuario:number ){
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '15');
      parametros = parametros.append('filtro',  idOpciones +'|'+ id_usuario );
      return this.http.get( this.URL + 'tblUsuarios' , {params: parametros});
    }
    
    get_eventosPerfilMarcados(idOpciones:string, idPerfil:number ){
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '19');
      parametros = parametros.append('filtro',  idOpciones +'|'+ idPerfil );
      return this.http.get( this.URL + 'tblUsuarios' , {params: parametros});
    }

    set_grabarEventos(idOpciones:string,idEventos :string , id_usuario:number, modalElegido:string ){
      let parametros = new HttpParams();
      parametros = parametros.append('opcion', '16');
      parametros = parametros.append('filtro',  idOpciones +'|'+ idEventos +'|'+ id_usuario +'|'+ modalElegido );
      return this.http.get( this.URL + 'tblUsuarios' , {params: parametros});
    }




 
}