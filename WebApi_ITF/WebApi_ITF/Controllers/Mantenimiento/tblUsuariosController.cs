using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;
using Datos;
using Negocio.Mantenimientos;
using Negocio.Resultados;

namespace WebApi_3R_Dominion.Controllers.Mantenimiento
{
    [EnableCors("*", "*", "*")]
    public class tblUsuariosController : ApiController
    {
        private ITF_PERUEntities db = new ITF_PERUEntities();

        // GET: api/tblUsuarios
        public IQueryable<tbl_Usuarios> Gettbl_Usuarios()
        {
            return db.tbl_Usuarios;
        }


        public object Gettbl_usuarios(int opcion, string filtro)
        {
            Resultado res = new Resultado();
            object resul = null;
            string url = ConfigurationManager.AppSettings["imagen"];

            try
            {
                if (opcion == 1)
                {
                    string[] parametros = filtro.Split('|');
                    int idEstado = Convert.ToInt32(parametros[0].ToString());
                    int idRol = Convert.ToInt32(parametros[1].ToString());

                    if (idRol == 0)
                    {
                        res.data = (from a in db.tbl_Usuarios
                                    join b in db.tbl_Perfil on a.id_Perfil equals b.id_perfil
                                    where a.estado == idEstado
                                    select new
                                    {
                                        a.id_Usuario,
                                        a.nrodoc_usuario,
                                        a.email_usuario,
                                        a.id_Perfil,
                                        b.descripcion_perfil,
                                        fotourl = (string.IsNullOrEmpty(a.fotourl)) ? "./assets/img/sinImagen.jpg" : url + a.fotourl,
                                        a.login_usuario,
                                        a.contrasenia_usuario,
                                        a.estado,
                                        descripcion_estado = a.estado == 0 ? "INACTIVO" : "ACTIVO",

                                        a.usuario_creacion,
                                        a.apellido_paterno_usuario,
                                        a.apellido_materno_usuario,
                                        a.nombres_usuario,
                                        a.celular_usuario,
                                        a.fecha_nacimiento_usuario,
                                        a.sexo_usuario,
                                        a.id_supervisor,
                                        a.es_supervisor,
                                        a.centro_costos,
                                        a.pres_movilidad
                                    }).ToList();
                    }
                    else {
                        res.data = (from a in db.tbl_Usuarios
                                    join b in db.tbl_Perfil on a.id_Perfil equals b.id_perfil
                                    where a.id_Perfil == idRol && a.estado == idEstado
                                    select new
                                    {
                                        a.id_Usuario,
                                        a.nrodoc_usuario,
                                        a.email_usuario,
                                        a.id_Perfil,
                                        b.descripcion_perfil,
                                        fotourl = (string.IsNullOrEmpty(a.fotourl)) ? "./assets/img/sinImagen.jpg" : url + a.fotourl,
                                        a.login_usuario,
                                        a.contrasenia_usuario,
                                        a.estado,
                                        descripcion_estado = a.estado == 0 ? "INACTIVO" : "ACTIVO",

                                        a.usuario_creacion,
                                        a.apellido_paterno_usuario,
                                        a.apellido_materno_usuario,
                                        a.nombres_usuario,
                                        a.celular_usuario,
                                        a.fecha_nacimiento_usuario,
                                        a.sexo_usuario,
                                        a.id_supervisor,
                                        a.es_supervisor,
                                        a.centro_costos,
                                        a.pres_movilidad
                                    }).ToList();
                    }


                    
                    res.ok = true;

                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');
                    int idUsuario = Convert.ToInt32(parametros[0].ToString());

                    res.ok = true;
                    res.data = (from a in db.tbl_Usuarios
                                join b in db.tbl_Perfil on a.id_Perfil equals b.id_perfil
                                where a.id_Usuario == idUsuario
                                select new
                                {
                                    a.id_Usuario,
                                    a.nrodoc_usuario,
                                    a.email_usuario,
                                    a.id_Perfil,
                                    b.descripcion_perfil,
                                    fotourl = (string.IsNullOrEmpty(a.fotourl)) ? "./assets/img/sinImagen.jpg" : url + a.fotourl,
                                    a.login_usuario,
                                    a.contrasenia_usuario,
                                    a.estado,
                                    descripcion_estado = a.estado == 0 ? "INACTIVO" : "ACTIVO",

                                    a.usuario_creacion,
                                    a.apellido_paterno_usuario,
                                    a.apellido_materno_usuario,
                                    a.nombres_usuario,
                                    a.celular_usuario,
                                    a.fecha_nacimiento_usuario,
                                    a.sexo_usuario,
                                    a.id_supervisor,
                                    a.es_supervisor
                                }).ToList();
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 3)
                {
                    res.ok = true;
                    res.data = (from a in db.tbl_Usuarios
                                where a.estado == 1 && a.es_supervisor ==1
                                select new
                                {
                                   a.id_Usuario,
                                   supervisor = a.apellido_paterno_usuario + " " + a.apellido_materno_usuario + " " + a.nombres_usuario
                                }).ToList();
                    res.totalpage = 0;
                    resul = res;
                }
                //else if (opcion == 4)
                //{

                //}
                else if (opcion == 5)
                {
                    string[] parametros = filtro.Split('|');
                    int idUsuario = Convert.ToInt32(parametros[0].ToString());

                    tbl_Usuarios objReemplazar;
                    objReemplazar = db.tbl_Usuarios.Where(u => u.id_Usuario == idUsuario).FirstOrDefault<tbl_Usuarios>();
                    objReemplazar.estado = 0;

                    db.Entry(objReemplazar).State = EntityState.Modified;
                    try
                    {
                        db.SaveChanges();
                        res.ok = true;
                        res.data = "OK";
                        res.totalpage = 0;
                    }
                    catch (DbUpdateConcurrencyException ex)
                    {
                        res.ok = false;
                        res.data = ex.InnerException.Message;
                        res.totalpage = 0;
                    }
                    resul = res;

                }
                else if (opcion == 6)
                {
                    string[] parametros = filtro.Split('|');
                    string nroDoc = parametros[0].ToString();

                    if (db.tbl_Usuarios.Count(e => e.nrodoc_usuario == nroDoc) > 0)
                    {
                        resul = true;
                    }
                    else
                    {
                        resul = false;
                    }
                }
                else if (opcion == 7)  /// perfil
                {

                    res.ok = true;
                    res.data = (from a in db.tbl_Perfil
                                where a.estado == 1
                                select new
                                {
                                    a.id_perfil,
                                    a.descripcion_perfil
                                }).ToList();
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 8)  /// buscar por dni
                {
 
                }
                else if (opcion == 9)
                {
                    string[] parametros = filtro.Split('|');
                    string loggin = parametros[0].ToString();

                    if (db.tbl_Usuarios.Count(e => e.login_usuario == loggin) > 0)
                    {
                        resul = true;
                    }
                    else
                    {
                        resul = false;
                    }
                }
                else if (opcion == 10)   
                {
 
                }
                else if (opcion == 11)   
                {
 
                }
                else if (opcion == 12)
                {
 
                }
                else if (opcion == 13)
                {
                    res.ok = true;
                    res.data = (from a in db.tbl_Usuarios
                                where a.estado == 1
                                orderby a.id_Usuario ascending
                                select new
                                {
                                    checkeado = false,
                                    a.id_Usuario,
                                    a.nrodoc_usuario,
                                    apellidos_usuario = a.apellido_paterno_usuario + " "  + a.apellido_materno_usuario  + " " + a.nombres_usuario,
                                    a.nombres_usuario
                                }).ToList();
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 14)
                {
                    string[] parametros = filtro.Split('|');
                    string idOpciones = parametros[0].ToString();

                    Usuarios_BL obj_negocios = new Usuarios_BL();

                    res.ok = true;
                    res.data = obj_negocios.get_usuariosAccesos(idOpciones);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 15)
                {
                    string[] parametros = filtro.Split('|');
                    string idOpciones = parametros[0].ToString();
                    int idUsuario = Convert.ToInt32(parametros[1].ToString());

                    Usuarios_BL obj_negocios = new Usuarios_BL();

                    res.ok = true;
                    res.data = obj_negocios.get_eventosUsuarioMarcados(idOpciones, idUsuario);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 16)
                {
                    string[] parametros = filtro.Split('|');
                    string idOpciones = parametros[0].ToString();
                    string idEventos = parametros[1].ToString();
                    int idPrincipal = Convert.ToInt32(parametros[2].ToString());
                    string modalElegido = parametros[3].ToString();

                    Usuarios_BL obj_negocios = new Usuarios_BL();
                    

                    res.ok = true;
                    if (modalElegido == "usuarios")
                    {
                        res.data = obj_negocios.set_grabandoEventos(idOpciones, idEventos, idPrincipal);
                    }
                    if (modalElegido == "perfiles")
                    {
                        res.data = obj_negocios.set_grabandoEventosPerfiles(idOpciones, idEventos, idPrincipal);
                    }
                    res.totalpage = 0;
                    resul = res;

                    //res.ok = true;
                    //res.data = obj_negocios.set_grabandoEventos(idOpciones, idEventos, idUsuario);
                    //res.totalpage = 0;
                    //resul = res;
                }

                else if (opcion == 17) //----- PERFILES
                {
                    res.ok = true;
                    res.data = (from a in db.tbl_Perfil 
                                where a.estado == 1
                                select new
                                {
                                    checkeando = false,
                                    a.id_perfil,
                                    a.descripcion_perfil
                                }).ToList();
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 18)
                {
                    string[] parametros = filtro.Split('|');
                    string idOpciones = parametros[0].ToString();

                    Usuarios_BL obj_negocios = new Usuarios_BL();

                    res.ok = true;
                    res.data = obj_negocios.get_perfilAccesos(idOpciones);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 19)
                {
                    string[] parametros = filtro.Split('|');
                    string idOpciones = parametros[0].ToString();
                    int idPerfil = Convert.ToInt32(parametros[1].ToString());

                    Usuarios_BL obj_negocios = new Usuarios_BL();

                    res.ok = true;
                    res.data = obj_negocios.get_eventosPerfilMarcados(idOpciones, idPerfil);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 20) //----- ACCESOSPERFILES
                {
                    string[] parametros = filtro.Split('|');
                    int idPerfil = Convert.ToInt32(parametros[0].ToString());

                    res.ok = true;
                    res.data = (from a in db.tbl_Perfil_Accesos
                                where a.id_perfil == idPerfil
                                select new
                                {
                                  a.id_opcion
                                }).ToList();
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 21)  
                {

                    res.ok = true;
                    res.data = (from a in db.tbl_Empresa
                                select new
                                {
                                    a.id_empresa,
                                    a.nro_contactos_byf,
                                    a.nro_contactos_medicos
                                }).ToList();
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 22)
                {
                    string[] parametros = filtro.Split('|');
                    string nro_contactos_byf = parametros[0].ToString();
                    string nro_contactos_medicos = parametros[1].ToString();

                    tbl_Empresa objReemplazar;
                    objReemplazar = db.tbl_Empresa.Where(u => u.id_empresa == 1).FirstOrDefault<tbl_Empresa>();
                    objReemplazar.nro_contactos_byf = Convert.ToInt32(nro_contactos_byf);
                    objReemplazar.nro_contactos_medicos = Convert.ToInt32(nro_contactos_medicos);
                    db.Entry(objReemplazar).State = EntityState.Modified;

                    try
                    {
                        db.SaveChanges();
                        res.ok = true;
                        res.data = "OK";
                        res.totalpage = 0;
                    }
                    catch (DbUpdateConcurrencyException ex)
                    {
                        res.ok = false;
                        res.data = ex.InnerException.Message;
                        res.totalpage = 0;
                    }

                    return res;
                }
               else if (opcion == 23)
                {
                    string[] parametros = filtro.Split('|');
                    int idEstado = Convert.ToInt32(parametros[0].ToString());
 
                    res.data = (from a in db.tbl_Usuarios
                                join b in db.tbl_Perfil on a.id_Perfil equals b.id_perfil
                                where a.estado == idEstado
                                select new
                                {
                                    a.id_Usuario,
                                    a.nrodoc_usuario,
                                    a.email_usuario,    
                                    a.estado,
                                    descripcion_estado = a.estado == 2 ? "INACTIVO" : "ACTIVO",
                                    a.usuario_creacion,
                                    a.apellido_paterno_usuario,
                                    a.apellido_materno_usuario,
                                    a.nombres_usuario,
                                    a.celular_usuario,
                                    a.fecha_nacimiento_usuario,
                                    a.sexo_usuario
                                }).ToList();         
                    res.ok = true;
                    res.totalpage = 0;

                    resul = res;
                }

                else
                {
                    res.ok = false;
                    res.data = "Opcion seleccionada invalida";
                    res.totalpage = 0;

                    resul = res;
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
                res.totalpage = 0;
                resul = res;
            }
            return resul;
        }

        public object Posttbl_Usuarios(tbl_Usuarios tbl_Usuarios)
        {
            Resultado res = new Resultado();
            string url = ConfigurationManager.AppSettings["imagen"];

            try
            {
                tbl_Usuarios.fecha_creacion = DateTime.Now;
                db.tbl_Usuarios.Add(tbl_Usuarios);
                db.SaveChanges();

                Usuarios_BL obj_negocio = new Usuarios_BL();
                obj_negocio.Set_insertarActualizarUsuario(tbl_Usuarios.id_Usuario);

                //---retornando el nuevo usuario
                res.ok = true;
                res.data = (from a in db.tbl_Usuarios
                            join b in db.tbl_Perfil on a.id_Perfil equals b.id_perfil
                            where a.id_Usuario == tbl_Usuarios.id_Usuario
                            select new
                            {
                                a.id_Usuario,
                                a.nrodoc_usuario,
                                a.email_usuario,
                                a.id_Perfil,
                                b.descripcion_perfil,
                                fotourl = (string.IsNullOrEmpty(a.fotourl)) ? "./assets/img/sinImagen.jpg" : url + a.fotourl,
                                a.login_usuario,
                                a.contrasenia_usuario,
                                a.estado,
                                descripcion_estado = a.estado == 0 ? "INACTIVO" : "ACTIVO",

                                a.usuario_creacion,
                                a.apellido_paterno_usuario,
                                a.apellido_materno_usuario,
                                a.nombres_usuario,
                                a.celular_usuario,
                                a.fecha_nacimiento_usuario,
                                a.sexo_usuario,
                                a.id_supervisor,
                                a.es_supervisor,
                                a.centro_costos,
                                a.pres_movilidad
                            }).ToList();

                res.totalpage = 0;
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
                res.totalpage = 0;
            }
            return res;
        }
                              
        public object Puttbl_Usuarios(int id, tbl_Usuarios tbl_Usuarios)
        {
            Resultado res = new Resultado();

            tbl_Usuarios objReemplazar;
            objReemplazar = db.tbl_Usuarios.Where(u => u.id_Usuario == id).FirstOrDefault<tbl_Usuarios>();
            
            objReemplazar.nrodoc_usuario = tbl_Usuarios.nrodoc_usuario;
            objReemplazar.email_usuario = tbl_Usuarios.email_usuario; 
            objReemplazar.id_Perfil = tbl_Usuarios.id_Perfil;
            objReemplazar.login_usuario = tbl_Usuarios.login_usuario;
            objReemplazar.contrasenia_usuario = tbl_Usuarios.contrasenia_usuario;
            objReemplazar.estado = tbl_Usuarios.estado;
            objReemplazar.usuario_edicion = tbl_Usuarios.usuario_creacion;
            objReemplazar.fecha_edicion = DateTime.Now;

            objReemplazar.apellido_paterno_usuario = tbl_Usuarios.apellido_paterno_usuario;
            objReemplazar.apellido_materno_usuario = tbl_Usuarios.apellido_materno_usuario;
            objReemplazar.nombres_usuario = tbl_Usuarios.nombres_usuario;

            objReemplazar.celular_usuario = tbl_Usuarios.celular_usuario;
            objReemplazar.fecha_nacimiento_usuario = tbl_Usuarios.fecha_nacimiento_usuario;
            objReemplazar.sexo_usuario = tbl_Usuarios.sexo_usuario;
            objReemplazar.id_supervisor = tbl_Usuarios.id_supervisor;
            objReemplazar.es_supervisor = tbl_Usuarios.es_supervisor;

            if (tbl_Usuarios.centro_costos != null)
            {
                objReemplazar.centro_costos = tbl_Usuarios.centro_costos;
            }
            if (tbl_Usuarios.pres_movilidad != null)
            {
                objReemplazar.pres_movilidad = tbl_Usuarios.pres_movilidad;
            }

            db.Entry(objReemplazar).State = EntityState.Modified;

            try
            {
                db.SaveChanges();

                Usuarios_BL obj_negocio = new Usuarios_BL();
                obj_negocio.Set_insertarActualizarUsuario(tbl_Usuarios.id_Usuario);

                res.ok = true;
                res.data = "OK";
                res.totalpage = 0;
            }
            catch (DbUpdateConcurrencyException ex)
            {
                res.ok = false;
                res.data = ex.InnerException.Message;
                res.totalpage = 0;
            }

            return res;
        }
        
        // DELETE: api/tblUsuarios/5
        [ResponseType(typeof(tbl_Usuarios))]
        public IHttpActionResult Deletetbl_Usuarios(int id)
        {
            tbl_Usuarios tbl_Usuarios = db.tbl_Usuarios.Find(id);
            if (tbl_Usuarios == null)
            {
                return NotFound();
            }

            db.tbl_Usuarios.Remove(tbl_Usuarios);
            db.SaveChanges();

            return Ok(tbl_Usuarios);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_UsuariosExists(int id)
        {
            return db.tbl_Usuarios.Count(e => e.id_Usuario == id) > 0;
        }
    }
}