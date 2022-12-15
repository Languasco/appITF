
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
  selector: 'app-usuario-gastos',
  templateUrl: './usuario-gastos.component.html',
  styleUrls: ['./usuario-gastos.component.css']
}) 
 

export class UsuarioGastosComponent implements OnInit {

  formParamsFiltro : FormGroup;
  formParams: FormGroup;
  formParamsFile: FormGroup;

  idUserGlobal :number = 0;
  idPerfilGlobal:number = 0;
  flag_modoEdicion :boolean =false;

  empresas :any[]=[];
  
  areas :any[]=[];
  perfiles :any[]=[];
  usuarios :any[]=[];
  supervisores :any[]=[];

  filePhoto:InputFileI[] = [];
 
  filtrarMantenimiento = "";
  areasSeleccionadas :any[]=[];
  imgProducto= './assets/img/sinImagen.jpg';

  datosGeneralesEmpresa :any;
 
  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService,private funcionGlobalServices : FuncionesglobalesService, private funcionesglobalesService : FuncionesglobalesService, private usuariosService : UsuariosService, private uploadService : UploadService) {         
    this.idUserGlobal = this.loginService.get_idUsuario();
    this.idPerfilGlobal = this.loginService.get_idPerfil();
  }
 
 ngOnInit(): void {
   this.getCargarCombos();
   this.inicializarFormularioFiltro();
   this.inicializarFormulario(); 
 }

 inicializarFormularioFiltro(){ 
    this.formParamsFiltro= new FormGroup({
      idEstado : new FormControl('1'),
      idRol : new FormControl('0')
     }) 
 }

 inicializarFormulario(){ 
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
      es_supervisor: new FormControl(false),

      nro_contactos_medicos: new FormControl(''),  
      nro_contactos_byf: new FormControl(''),  
      centro_costos: new FormControl(''),  
      pres_movilidad: new FormControl(''),
    }) 
 }

 getCargarCombos(){ 
    this.spinner.show();
    combineLatest([  this.usuariosService.get_perfil(), this.usuariosService.get_supervisores() , this.usuariosService.get_datosGeneralesEmpresa(false) ]).subscribe( ([ _perfiles, _supervisores , _datosGeneralesEmpresa])=>{
      this.perfiles = _perfiles;
      this.supervisores = _supervisores;
      this.datosGeneralesEmpresa = _datosGeneralesEmpresa;
      this.spinner.hide(); 
    })
 }

 getDatosEmpresa(){ 
  combineLatest([  this.usuariosService.get_datosGeneralesEmpresa(true) ]).subscribe( ([   _datosGeneralesEmpresa])=>{
    this.datosGeneralesEmpresa = _datosGeneralesEmpresa; 
  })
}

 mostrarInformacion(){  
      this.spinner.show();
      this.usuariosService.get_mostrarUsuario_general(this.formParamsFiltro.value.idEstado,this.formParamsFiltro.value.idRol )
          .subscribe((res:RespuestaServer)=>{     
     
              this.spinner.hide();
              if (res.ok==true) {        
                  this.usuarios = res.data; 
              }else{
                this.alertasService.Swal_alert('error', JSON.stringify(res.data));
                alert(JSON.stringify(res.data));
              }
      })
 }   
  
 cerrarModal(){
    setTimeout(()=>{ // 
      $('#modal_mantenimiento').modal('hide');  
    },0); 
 }

 nuevo(){
    this.flag_modoEdicion = false;
    this.inicializarFormulario();  
    const { nro_contactos_byf, nro_contactos_medicos} =  this.datosGeneralesEmpresa[0];

    setTimeout(()=>{ // 
      $('#modal_mantenimiento').modal('show');  
      $('#cbo_supervisor').removeClass('disabledForm');
      this.imgProducto= './assets/img/sinImagen.jpg';
      this.formParams.patchValue({ "nro_contactos_byf" : nro_contactos_byf , "nro_contactos_medicos" : nro_contactos_medicos });
    },0); 

 } 

 async saveUpdate(){ 

  if ( this.flag_modoEdicion==true) { //// nuevo
     if (this.formParams.value.id_Usuario == '' || this.formParams.value.id_Usuario == 0) {
       this.alertasService.Swal_alert('error','No se cargó el id usuario, por favor actulize su página');
       return 
     }   
  }

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

  // const fechaNaci = this.funcionGlobalServices.formatoFecha(this.formParams.value.fecha_nacimiento_usuario);


  if ( this.idPerfilGlobal == 1) {

    const { nro_contactos_byf, nro_contactos_medicos} =  this.datosGeneralesEmpresa[0];
    const nrocontactos_byf = this.formParams.value.nro_contactos_byf;
    const nrocontactos_medicos = this.formParams.value.nro_contactos_medicos;
  
    let flagEdit = false;
    if (nro_contactos_byf != nrocontactos_byf) {
      flagEdit=true;
    }
    if (flagEdit == false) {
      if (nro_contactos_medicos != nrocontactos_medicos) {
        flagEdit=true;
      }
    }
  
    if (flagEdit) {
      this.spinner.show();
      console.log('entroo')
      const  datosEmpresa  = await this.usuariosService.get_actualizar_datosEmpresa( nrocontactos_byf, nrocontactos_medicos);
      this.getDatosEmpresa();
      this.spinner.hide();
    }
  }

  if ( this.flag_modoEdicion==false) { //// nuevo  

     Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
     Swal.showLoading();

     const  dniUsuario  = await this.usuariosService.get_verificar_DniUsuario(this.formParams.value.nrodoc_usuario);
     if (dniUsuario) {
      Swal.close();
      this.alertasService.Swal_alert('error','El nro de documento ya se encuentra registrada, verifique..');
      return;
     } 
     
     const  loginUsuario  = await this.usuariosService.get_verificar_logginUsuario(this.formParams.value.login_usuario);
     if (loginUsuario) {
      Swal.close();
      this.alertasService.Swal_alert('error','El login ingresado esta registrada, cambialo por favor..');
      return;
     }

     this.usuariosService.set_saveUsuarios(this.formParams.value).subscribe((res:RespuestaServer)=>{
       Swal.close();    
       if (res.ok ==true) {     
         this.flag_modoEdicion = true;
         this.formParams.patchValue({ "id_Usuario" : Number(res.data[0].id_Usuario) });
        //  this.mostrarInformacion();

        this.upload_imageProduct(res.data[0].id_Usuario);

        this.usuarios.push(res.data[0])

        this.alertasService.Swal_Success('Se agrego correctamente..');


       }else{
         this.alertasService.Swal_alert('error', JSON.stringify(res.data));
         alert(JSON.stringify(res.data));
       }
     })
     
   }else{ /// editar

     Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Actualizando, espere por favor'  })
     Swal.showLoading();
     this.usuariosService.set_editUsuario(this.formParams.value, this.formParams.value.id_Usuario ).subscribe((res:RespuestaServer)=>{
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
              obj.centro_costos= this.formParams.value.centro_costos;
              obj.pres_movilidad= this.formParams.value.pres_movilidad;
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

 } 

 editar({ id_Usuario, nrodoc_usuario, email_usuario, id_Perfil, fotourl, login_usuario, contrasenia_usuario, estado, apellido_paterno_usuario, apellido_materno_usuario, nombres_usuario, celular_usuario, fecha_nacimiento_usuario, sexo_usuario, id_supervisor, es_supervisor, centro_costos, pres_movilidad }){

   this.flag_modoEdicion=true;
   const { nro_contactos_byf, nro_contactos_medicos} =  this.datosGeneralesEmpresa[0];

   this.formParams.patchValue({ "id_Usuario" : id_Usuario,  "nrodoc_usuario" : nrodoc_usuario ,"centro_costos": centro_costos, "pres_movilidad": pres_movilidad   ,  "celular_usuario" :  celular_usuario,  "email_usuario" : email_usuario, "id_Perfil" : id_Perfil , "login_usuario" : login_usuario, "contrasenia_usuario" : contrasenia_usuario, "estado" : estado, "usuario_creacion" : this.idUserGlobal, "apellido_paterno_usuario" : apellido_paterno_usuario, "apellido_materno_usuario" : apellido_materno_usuario,"nombres_usuario" : nombres_usuario , "fecha_nacimiento_usuario" : new Date(fecha_nacimiento_usuario), "sexo_usuario" : sexo_usuario, "id_supervisor" : id_supervisor, "es_supervisor" : es_supervisor }
   );
   this.formParams.patchValue({ "nro_contactos_byf" : nro_contactos_byf , "nro_contactos_medicos" : nro_contactos_medicos  });

   this.imgProducto = (!fotourl)? './assets/img/sinImagen.jpg' : fotourl;
 
   if (es_supervisor == '1' || es_supervisor ==true ) {
    setTimeout(()=>{ // 
      $('#cbo_supervisor').addClass('disabledForm');      
    },0); 
   }else{
    setTimeout(()=>{ // 
      $('#cbo_supervisor').removeClass('disabledForm');      
    },0); 
   }

   setTimeout(()=>{ // 
    $('#modal_mantenimiento').modal('show');  
  },0);  
 
 } 

 anular(objBD:any){

   if (objBD.estado ===0 || objBD.estado =='0') {      
     return;      
   }

   this.alertasService.Swal_Question('Sistemas', 'Esta seguro de anular ?')
   .then((result)=>{
     if(result.value){

       Swal.fire({  icon: 'info', allowOutsideClick: false, allowEscapeKey: false, text: 'Espere por favor'  })
       Swal.showLoading();
       this.usuariosService.set_anularUsuario(objBD.id_Usuario).subscribe((res:RespuestaServer)=>{
         Swal.close();        
         if (res.ok ==true) { 
           
           for (const user of this.usuarios) {
             if (user.id_Usuario == objBD.id_Usuario ) {
                 user.estado = 0;
                 user.descripcion_estado =  "INACTIVO" ;
                 break;
             }
           }
           this.alertasService.Swal_Success('Se anulo correctamente..')  

         }else{
           this.alertasService.Swal_alert('error', JSON.stringify(res.data));
           alert(JSON.stringify(res.data));
         }
       })
        
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
    Swal.close();
      if (res.ok==true) {
        for (const obj of this.usuarios) {
          if (obj.id_Usuario == this.formParams.value.id_Usuario) {
             obj.fotourl= res.data ;       
             break;
          }
        }
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
 }

 onlyNumberKey(event) {
  return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
}

onlyDecimalNumberKey(event) {
  let charCode = (event.which) ? event.which : event.keyCode;
  if (charCode != 46 && charCode > 31
      && (charCode < 48 || charCode > 57))
      return false;
  return true;
}

keyPress(event: any) {
  const pattern = /[0-9\+\-\ ]/;
  let inputChar = String.fromCharCode(event.charCode);
  if (event.keyCode != 8 && !pattern.test(inputChar)) {
    event.preventDefault();
  }
}


}