using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Cors;
using Datos;
using Entidades.Acceso;
using Microsoft.VisualBasic;
using Negocio.Acceso;
using Negocio.Resultados;

namespace WebApi_3R_Dominion.Controllers.Acceso
{
    [EnableCors("*", "*", "*")]
    public class loginController : ApiController
    {
        private ITF_PERUEntities db = new ITF_PERUEntities();


        public object GetLogin(int opcion, string filtro)
        {
            Resultado res = new Resultado();
            object resul = null;
            try
            {
                if (opcion == 1)
                {
                    string[] parametros = filtro.Split('|');
                    string login = parametros[0].ToString();
                    string contra = parametros[1].ToString();

                    var flagLogin = db.tbl_Usuarios.Count(e => e.login_usuario == login && e.contrasenia_usuario == contra);

                    if (flagLogin == 0)
                    {
                        res.ok = false;
                        res.data = "El usuario y/o contraseña no son correctos, verifique ";
                        res.totalpage = 0;
                        resul = res;
                    }
                    else
                    {
                        var Parents = new string[] { "1" };
                        tbl_Usuarios objUsuario = db.tbl_Usuarios.Where(p => p.login_usuario == login && p.contrasenia_usuario == contra).SingleOrDefault();

                        Menu listamenu = new Menu();
                        List<MenuPermisos> listaAccesos = new List<MenuPermisos>();

                        var listaMenu = (from w in db.tbl_Accesos_Evento
                                         join od in db.tbl_Definicion_Opciones on w.id_Opcion equals od.id_Opcion
                                         join u in db.tbl_Usuarios on w.id_Usuario equals u.id_Usuario
                                         where u.id_Usuario == objUsuario.id_Usuario && Parents.Contains(od.parentID.ToString()) && od.estado == 1
                                         orderby od.orden_Opcion ascending
                                         select new
                                         {
                                             id_opcion = w.id_Opcion,
                                             id_usuarios = w.id_Usuario,
                                             nombre_principal = od.nombre_opcion,
                                             parent_id_principal = od.parentID,
                                             urlmagene_principal = od.urlImagen_Opcion

                                         }).Distinct();

                        foreach (var item in listaMenu)
                        {
                            MenuPermisos listaJsonObj = new MenuPermisos();

                            listaJsonObj.id_opcion = Convert.ToInt32(item.id_opcion);
                            listaJsonObj.id_usuarios = Convert.ToInt32(item.id_usuarios);
                            listaJsonObj.nombre_principal = item.nombre_principal;
                            listaJsonObj.parent_id_principal = Convert.ToInt32(item.parent_id_principal);
                            listaJsonObj.urlmagene_principal = item.urlmagene_principal;
                            listaJsonObj.listMenu = (from w in db.tbl_Accesos_Evento
                                                     join od in db.tbl_Definicion_Opciones on w.id_Opcion equals od.id_Opcion
                                                     join u in db.tbl_Usuarios on w.id_Usuario equals u.id_Usuario
                                                     where u.id_Usuario == objUsuario.id_Usuario && od.parentID == item.id_opcion && od.estado == 1 && od.TipoInterface == "W"
                                                     orderby od.orden_Opcion ascending
                                                     select new
                                                     {
                                                         nombre_page = od.nombre_opcion,
                                                         url_page = od.url_opcion,
                                                         orden = od.orden_Opcion,
                                                         url_image = od.urlImagen_Opcion
                                                     })
                                            .ToList()
                                            .Distinct();

                            listaAccesos.Add(listaJsonObj);
                        }

                        listamenu.menuPermisos = listaAccesos;
                        listamenu.menuEventos = null;
                        listamenu.id_usuario = objUsuario.id_Usuario;
                        listamenu.nombre_usuario = objUsuario.apellido_paterno_usuario + " " + objUsuario.apellido_materno_usuario + " " + objUsuario.nombres_usuario;
                        listamenu.id_perfil = objUsuario.id_Perfil;
                        listamenu.es_supervisor =Convert.ToInt32( objUsuario.es_supervisor );
                         
                        res.ok = true;
                        res.data = listamenu;
                        res.totalpage = 0;

                        resul = res;

                    }
                }

                else if (opcion == 2)
                {

                    var Parents = new string[] { "1" };
                    MenuAcceso listamenuAcceso = new MenuAcceso();
                    List<MenuPermisosAcceso> listaAccesos = new List<MenuPermisosAcceso>();

                    var listaMenu = (from od in db.tbl_Definicion_Opciones
                                     where Parents.Contains(od.parentID.ToString()) && od.estado == 1 && od.TipoInterface == "W"
                                     select new
                                     {
                                         od.id_Opcion,
                                         od.nombre_opcion
                                     }).Distinct();

                    foreach (var item in listaMenu)
                    {
                        MenuPermisosAcceso listaJsonObj = new MenuPermisosAcceso();

                        listaJsonObj.text = item.nombre_opcion;
                        listaJsonObj.value = item.id_Opcion;
                        listaJsonObj.children = (from od in db.tbl_Definicion_Opciones
                                                 where od.parentID == item.id_Opcion && od.estado == 1
                                                 select new
                                                 {
                                                     text = od.nombre_opcion,
                                                     value = od.id_Opcion,
                                                     Checked = false
                                                 })
                                        .Distinct()
                                        .ToList();
                        listaAccesos.Add(listaJsonObj);
                    }

                    listamenuAcceso.text = "ITF PERU";
                    listamenuAcceso.value = "-1";
                    listamenuAcceso.children = listaAccesos;

                    res.ok = true;
                    res.data = listamenuAcceso;
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 3)
                {
                    string[] parametros = filtro.Split('|');

                    int idCiclo = Convert.ToInt32(parametros[0].ToString());
                    int idUsuario = Convert.ToInt32(parametros[1].ToString());

                    Login_BL obj_negocios = new Login_BL();

                    tbl_Usuarios objUsuario = db.tbl_Usuarios.Where(p => p.id_Usuario == idUsuario).SingleOrDefault();
                    if (objUsuario.es_supervisor == 1)
                    {
                        resul = obj_negocios.generarResumenGeneral_supervisor(idCiclo, idUsuario);
                    }
                    else {
                        resul = obj_negocios.generarResumenGeneral_normal(idCiclo, idUsuario);
                    }
                }
                else if (opcion == 4)
                {
                    string[] parametros = filtro.Split('|');

                    int idCiclo = Convert.ToInt32(parametros[0].ToString());
                    int idUsuario = Convert.ToInt32(parametros[1].ToString());

                    Login_BL obj_negocios = new Login_BL();


                    tbl_Usuarios objUsuario = db.tbl_Usuarios.Where(p => p.id_Usuario == idUsuario).SingleOrDefault();
                    if (objUsuario.es_supervisor == 1)
                    {
                        resul = obj_negocios.generarResumenDiario_supervisor(idCiclo, idUsuario);
                    }
                    else
                    {
                        resul = obj_negocios.generarResumenDiario_normal(idCiclo, idUsuario);
                    }

                }
                else
                {
                    resul = "Opcion seleccionada invalida...";
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



    }
}
