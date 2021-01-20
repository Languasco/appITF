
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlertasService } from '../../../services/alertas/alertas.service';
import { RespuestaServer } from '../../../models/respuestaServer.models';
import { FuncionesglobalesService } from '../../../services/funciones/funcionesglobales.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../../../services/login/login.service';
import Swal from 'sweetalert2';
import { combineLatest } from 'rxjs'; 
import { CumpleaniosService } from '../../../services/reportes/cumpleanios.service';

declare var $:any;


@Component({
  selector: 'app-cumpleanios',
  templateUrl: './cumpleanios.component.html',
  styleUrls: ['./cumpleanios.component.css']
})
  

export class CumpleaniosComponent implements OnInit {

  formParamsFiltro : FormGroup;
  formParams: FormGroup;

  idUserGlobal :number = 0;
  flag_modoEdicion :boolean =false;

  cumpleanios :any[]=[]; 
  filtrarMantenimiento = "";

  usuarios :any[]=[]; 
  meses :any[]=[]; 
 
 
  constructor(private alertasService : AlertasService, private spinner: NgxSpinnerService, private loginService: LoginService, private funcionesglobalesService : FuncionesglobalesService, private cumpleaniosService : CumpleaniosService ) {         
    this.idUserGlobal = this.loginService.get_idUsuario();
  }
 
 ngOnInit(): void {
   this.inicializarFormularioFiltro();
   this.getCargarCombos();
  }

 inicializarFormularioFiltro(){ 
    this.formParamsFiltro= new FormGroup({
      idUsuario : new FormControl('0'),
      idMes : new FormControl('0'),
     }) 
 }

 getCargarCombos(){ 
  this.spinner.show();
  combineLatest([  this.cumpleaniosService.get_usuarios(this.idUserGlobal), this.cumpleaniosService.get_meses()  ])
  .subscribe( ([ _usuarios, _meses, ])=>{

    this.usuarios = _usuarios;
    this.meses = _meses;
    this.formParamsFiltro.patchValue({ "idUsuario" : _usuarios[0].id_Usuario  });     

    this.spinner.hide(); 
  })
}


 mostrarInformacion(){

  if (this.formParamsFiltro.value.idUsuario == '' || this.formParamsFiltro.value.idUsuario == 0) {
    this.alertasService.Swal_alert('error','Por favor seleccione el usuario');
    return 
  }
  if (this.formParamsFiltro.value.idMes == '' || this.formParamsFiltro.value.idMes == 0) {
    this.alertasService.Swal_alert('error','Por favor seleccione el ciclo');
    return 
  }
 
    this.spinner.show();
    this.cumpleaniosService.get_mostrar_cumpleanios( this.formParamsFiltro.value.idUsuario, this.formParamsFiltro.value.idMes)
        .subscribe((res:RespuestaServer)=>{  
            this.spinner.hide();
            if (res.ok==true) {        
                this.cumpleanios = res.data; 
            }else{
              this.alertasService.Swal_alert('error', JSON.stringify(res.data));
              alert(JSON.stringify(res.data));
            }
    })
 }   
  
 
 
 


 

}

