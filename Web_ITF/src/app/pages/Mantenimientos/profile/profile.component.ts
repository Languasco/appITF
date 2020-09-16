
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertasService } from '../../../services/alertas/alertas.service';
import { RespuestaServer } from '../../../models/respuestaServer.models';
import { FuncionesglobalesService } from '../../../services/funciones/funcionesglobales.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../../../services/login/login.service';
import { combineLatest } from 'rxjs';
import Swal from 'sweetalert2';
import { InputFileI } from '../../../models/inputFile.models';
import { UploadService } from '../../../services/Upload/upload.service';
import { UsuariosService } from '../../../services/Mantenimientos/usuarios.service';

declare var $:any;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
 

export class ProfileComponent implements OnInit {
 
  formParams: FormGroup;
  formParamsFile: FormGroup;

  idUserGlobal :number = 0;
  flag_modoEdicion :boolean =false; 

  usuariosProfile :any[]=[];
  perfiles :any[]=[];
  usuarios :any[]=[];
  filePhoto:InputFileI[] = []; 
  supervisores :any[]=[];

  filtrarMantenimiento = "";
 
  imgProducto= './assets/img/sinImagen.jpg';
 
  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService,private funcionGlobalServices : FuncionesglobalesService, private funcionesglobalesService : FuncionesglobalesService, private usuariosService : UsuariosService, private uploadService : UploadService) {         
    this.idUserGlobal = this.loginService.get_idUsuario();
  }
 
 ngOnInit(): void {
   this.getCargarCombos();
   this.inicializarFormulario();

   setTimeout(() => {
    this.mostrar_perfilUsuario(); 
   }, 0);
 }

 inicializarFormulario(){ 

  // id_Usuario, nrodoc_usuario, email_usuario, id_Perfil, fotourl, login_usuario, contrasenia_usuario, estado, usuario_creacion,  
  // apellido_paterno_usuario, apellido_materno_usuario, nombres_usuario, celular_usuario, fecha_nacimiento_usuario, sexo_usuario, id_supervisor, es_supervisor
  
      this.formParams= new FormGroup({
        id_Usuario: new FormControl('0'), 
        nrodoc_usuario: new FormControl(''),  
        email_usuario: new FormControl(''),
        id_Perfil: new FormControl('0'), 
        login_usuario: new FormControl(''), 
        contrasenia_usuario: new FormControl(''), 
        estado : new FormControl('1'),   
        usuario_creacion : new FormControl(''),
  
        apellido_paterno_usuario: new FormControl(''),
        apellido_materno_usuario: new FormControl(''),
        nombres_usuario: new FormControl(''),  
  
        celular_usuario: new FormControl(''),  
        fecha_nacimiento_usuario: new FormControl(new Date()),  
        sexo_usuario: new FormControl('0'),  
        id_supervisor: new FormControl('0'),  
        es_supervisor: new FormControl(false)
      }) 
   }

 getCargarCombos(){ 
    this.spinner.show();
    combineLatest([  this.usuariosService.get_perfil(), this.usuariosService.get_supervisores() ]).subscribe( ([ _perfiles, _supervisores ])=>{
      this.perfiles = _perfiles;
      this.supervisores = _supervisores;
      this.spinner.hide(); 
    })

 }

 mostrar_perfilUsuario(){
      this.spinner.show();
      this.usuariosProfile = [];
      this.usuariosService.get_mostrarUsuario(this.idUserGlobal)
          .subscribe((res:RespuestaServer)=>{            
              this.spinner.hide();

              if (res.ok==true) {                     
                this.usuariosProfile = res.data;                
                for (const user of this.usuariosProfile ) { 

                  this.formParams.patchValue({ "id_Usuario" : user.id_Usuario,  "nrodoc_usuario" : user.nrodoc_usuario ,"email_usuario" : user.email_usuario, "id_Perfil" : user.id_Perfil , "login_usuario" : user.login_usuario, "contrasenia_usuario" : user.contrasenia_usuario, "estado" : user.estado, "usuario_creacion" : this.idUserGlobal, "apellido_paterno_usuario" : user.apellido_paterno_usuario, "apellido_materno_usuario" : user.apellido_materno_usuario,"nombres_usuario" : user.nombres_usuario , "fecha_nacimiento_usuario" : new Date(user.fecha_nacimiento_usuario), "sexo_usuario" : user.sexo_usuario, "id_supervisor" : user.id_supervisor, "es_supervisor" : user.es_supervisor }
                  );
               
                  this.imgProducto = (!user.fotourl)? './assets/img/sinImagen.jpg' : user.fotourl;

                  if (this.formParams.value.es_supervisor === true || this.formParams.value.es_supervisor === 1) {
    
                    this.formParams.patchValue({ "id_supervisor" : 0}); 
                    setTimeout(()=>{ // 
                      $('#cbo_supervisor').addClass('disabledForm');      
                    },0);  
                
                   }else{
                    setTimeout(()=>{ // 
                        $('#cbo_supervisor').removeClass('disabledForm');
                    },0);  
                   }

                  break;
                }          
 
              }else{
                this.spinner.hide();
                this.alertasService.Swal_alert('error', JSON.stringify(res.data));
                alert(JSON.stringify(res.data));
              }
      })
 }   


 async saveProfileUsuario(){ 

  if (this.formParams.value.apellido_paterno_usuario == '' || this.formParams.value.apellido_paterno_usuario == 0) {
    this.alertasService.Swal_alert('error','Por favor ingrese el apellido paterno');
    return 
  }

  if (this.formParams.value.apellido_materno_usuario == '' || this.formParams.value.apellido_materno_usuario == 0) {
    this.alertasService.Swal_alert('error','Por favor ingrese el apellido materno');
    return 
  }

  if (this.formParams.value.nombres_usuario == '' || this.formParams.value.nombres_usuario == 0) {
    this.alertasService.Swal_alert('error','Por favor ingrese el nombre');
    return 
  }

  if (this.formParams.value.nrodoc_usuario == '' || this.formParams.value.nrodoc_usuario == 0) {
    this.alertasService.Swal_alert('error','Por favor ingrese el numero de documento');
    return 
  }

  if (this.formParams.value.fecha_nacimiento_usuario == '' || this.formParams.value.fecha_nacimiento_usuario == null) {
    this.alertasService.Swal_alert('error','Por favor seleccione la fecha de nacimiento');
    return 
  }

  if (this.formParams.value.es_supervisor == '0' || this.formParams.value.es_supervisor == false) {
    if (this.formParams.value.id_supervisor == '0' || this.formParams.value.id_supervisor == 0) {
        this.alertasService.Swal_alert('error','Por favor seleccione el Supervisor');
        return 
    }
  }
  if (this.formParams.value.login_usuario == '' || this.formParams.value.login_usuario == 0) {
    this.alertasService.Swal_alert('error','Por favor ingrese Login');
    return 
  }

  if (this.formParams.value.contrasenia_usuario == '' || this.formParams.value.contrasenia_usuario == 0) {
    this.alertasService.Swal_alert('error','Por favor ingrese la constraseña');
    return 
  }

  if (this.formParams.value.id_Perfil == '' || this.formParams.value.id_Perfil == 0) {
    this.alertasService.Swal_alert('error','Por favor seleccione un perfil');
    return 
  } 
 
  const flagSupr = ( this.formParams.value.es_supervisor) ? 0 : this.formParams.value.id_supervisor ;
  this.formParams.patchValue({ "usuario_creacion" : this.idUserGlobal, "id_supervisor" : flagSupr });
 
  Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Actualizando, espere por favor'  })
  Swal.showLoading();
  this.usuariosService.set_editUsuario(this.formParams.value , this.formParams.value.id_Usuario).subscribe((res:RespuestaServer)=>{
    Swal.close(); 
    if (res.ok ==true) {  
      
      const perfilSeleccionada  = $('#cbo_cargo option:selected').text();

      for (const obj of this.usuarios) {
        if (obj.id_Usuario == this.formParams.value.id_Usuario ) {
           obj.nrodoc_usuario= this.formParams.value.nrodoc_usuario ;
           obj.email_usuario= this.formParams.value.email_usuario ;   
           obj.id_Perfil= this.formParams.value.id_Perfil ;
           obj.descripcion_perfil = perfilSeleccionada ;    
           
           obj.login_usuario= this.formParams.value.login_usuario ;
           obj.contrasenia_usuario= this.formParams.value.contrasenia_usuario ;        
           obj.estado= this.formParams.value.estado ;
           obj.descripcion_estado = this.formParams.value.estado == 0 ? "INACTIVO" : "ACTIVO";  

           obj.apellido_paterno_usuario = this.formParams.value.apellido_paterno_usuario ; 
           obj.apellido_materno_usuario = this.formParams.value.apellido_materno_usuario ; 
           obj.nombres_usuario= this.formParams.value.nombres_usuario ;        
           obj.celular_usuario= this.formParams.value.celular_usuario ;  

           obj.fecha_nacimiento_usuario= this.formParams.value.fecha_nacimiento_usuario ; 
           obj.sexo_usuario= this.formParams.value.sexo_usuario ; 
           obj.id_supervisor= this.formParams.value.id_supervisor ; 
           obj.es_supervisor= (this.formParams.value.es_supervisor == true) ? 1:0;             

           break;
        }
      }
      this.upload_imageProduct(this.formParams.value.id_Usuario );

      this.alertasService.Swal_Success('Se actualizó correctamente..');  
    }else{
      this.alertasService.Swal_alert('error', JSON.stringify(res.data));
      alert(JSON.stringify(res.data));
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
                 this.imgProducto = String(urlImage['result']);      
             }
             reader.readAsDataURL(file);
         })(filesTemporal[i]);
     }
 }
 
 upload_imageProduct(id_producto:number) {
    if ( this.filePhoto.length ==0){
      return;
    }
    Swal.fire({
      icon: 'info',
      allowOutsideClick: false,
      allowEscapeKey: false,
      text: 'Espere por favor'
    })
    Swal.showLoading();
   this.uploadService.upload_imagen_usuario( this.filePhoto[0].file , id_producto, this.idUserGlobal ).subscribe(
     (res:RespuestaServer) =>{

      console.log(res);
      Swal.close();
       if (res.ok==true) { 
       }else{
          this.alertasService.Swal_alert('error',JSON.stringify(res.data));
       }
       },(err) => {
        Swal.close();
        this.alertasService.Swal_alert('error',JSON.stringify(err)); 
       }
   )

 }

 onChange_supervisor(event:any){
  if (this.formParams.value.es_supervisor === true) {
   
   this.formParams.patchValue({ "id_supervisor" : 0}); 
   setTimeout(()=>{ // 
     $('#cbo_supervisor').addClass('disabledForm');      
   },0);  

  }else{
   setTimeout(()=>{ // 
       $('#cbo_supervisor').removeClass('disabledForm');
   },0);  
  }
}



}
