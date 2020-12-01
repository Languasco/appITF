import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';

import { Subject } from 'rxjs';
import { map } from 'rxjs/operators'; 

@Injectable({
  providedIn: 'root'
})
export class LoginService {


  usuarioLogeado:boolean=false;
  dataLogeado= [];
  isLogginUser$ = new Subject<any>();


   URL = environment.URL_API;
   constructor(private http:HttpClient) {
 
  }
         //-----creando el observable --

  updateLoginNameStatus(status: boolean, objMenu: any ) {
    var objSesion = {
      'status':status,
      'menu':objMenu
    }
    this.isLogginUser$.next(objSesion);
  }  

  get_iniciarSesion(nombreUsuario:string , contrasenia:string){    
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '1');
    parametros = parametros.append('filtro', nombreUsuario + '|' + contrasenia );


    console.log(this.URL + 'Login')

    return this.http.get( this.URL + 'Login' , {params: parametros})
               .pipe(map((res:any)=>{       
                    if (res.ok ==true || res.ok == 'true' ) {        
               
                      let infoUser = {
                        id_usuario:res.data.id_usuario,                        
                        nombre_usuario : res.data.nombre_usuario,
                        id_perfil:res.data.id_perfil,
                        menu_permisos : res.data.menuPermisos,
                        menu_eventos : res.data.menuEventos
                      }                      
                      this.guardarSesion(infoUser);

                      return res;
                    }else{
                      return res;
                    }
               }));               
  }

  public guardarSesion(data:any){
    this.usuarioLogeado =true;
    localStorage.setItem('data_ITF_usuario', JSON.stringify(data));
    this.updateLoginNameStatus(true,data.menu_permisos); 
  }

  leerSesion(){    
   // si es que existe una  variable creada en el local storage, leemos su valor
    if (localStorage.getItem('data_ITF_usuario')) { 
      this.usuarioLogeado =true;
      this.dataLogeado =  JSON.parse(localStorage.getItem("data_ITF_usuario"));
      // xxthis.updateLoginNameStatus(true,this.dataLogeado['menu_permisos'] );
    }else{  
      this.usuarioLogeado =false;
      this.dataLogeado = [];
      ///xx this.updateLoginNameStatus(false,'');
    }
  } 

  logOut(){
    this.usuarioLogeado= false;
    localStorage.removeItem('data_ITF_usuario');
  }

  getSession(){
    if (localStorage.getItem('data_ITF_usuario')) { 
      return true;
    }else{
      return false;
    }
  }
  getSessionNombre(){
    if (localStorage.getItem('data_ITF_usuario')) { 
      this.dataLogeado =  JSON.parse(localStorage.getItem("data_ITF_usuario"));
      return this.dataLogeado['nombre_usuario'];
    }else{
      return "Sin-nombre";
    }
  }

  getSessionMenu(){
    if (localStorage.getItem('data_ITF_usuario')) { 
      this.dataLogeado =  JSON.parse(localStorage.getItem("data_ITF_usuario"));
      return this.dataLogeado['menu_permisos'];
    }else{
      return null;
    }
  }
 
  estadoAutentificado(){
    this.leerSesion();
    return  this.usuarioLogeado;
  }

  get_idUsuario():number{
    if (localStorage.getItem('data_ITF_usuario')) { 
       this.dataLogeado =  JSON.parse(localStorage.getItem("data_ITF_usuario"));
      return this.dataLogeado['id_usuario'];
    }else{
      return 0;
    }
  }

  get_idPerfil():number{
    if (localStorage.getItem('data_ITF_usuario')) { 
       this.dataLogeado =  JSON.parse(localStorage.getItem("data_ITF_usuario"));
      return this.dataLogeado['id_perfil'];
    }else{
      return 0;
    }
  }

  getEventosMenu(modulo:number){ 
    if (localStorage.getItem('data_ITF_usuario')) { 
      this.dataLogeado =  JSON.parse(localStorage.getItem("data_ITF_usuario"));
      const listEventos = this.dataLogeado['menu_eventos'].filter(evento => evento.id_opcion == modulo);
      return listEventos
    }else{
      return null;
    }
  }
  
  get_reporteResumen_rrmm(idCiclo : number , id_usuario : number ){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '3');
    parametros = parametros.append('filtro',  String(idCiclo)  + '|' +   String(id_usuario)   );
    //parametros = parametros.append('filtro',    '1|6'   );

    return this.http.get( this.URL + 'login' , {params: parametros});
  }

  get_reporteResumenDiario_rrmm(idCiclo : number , id_usuario : number ){ 
    let parametros = new HttpParams();
    parametros = parametros.append('opcion', '4');
    parametros = parametros.append('filtro',  String(idCiclo)  + '|' +   String(id_usuario)   );
    // parametros = parametros.append('filtro',    '1|18'   );

    return this.http.get( this.URL + 'login' , {params: parametros});
  }


}
