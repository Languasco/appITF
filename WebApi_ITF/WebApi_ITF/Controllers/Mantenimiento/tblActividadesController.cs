using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;
using Datos;
using Negocio.Mantenimientos;
using Negocio.Resultados;

namespace WebApi_ITF.Controllers.Mantenimiento
{
    [EnableCors("*", "*", "*")]
    public class tblActividadesController : ApiController
    {
        private ITF_PERUEntities db = new ITF_PERUEntities();

        // GET: api/tblActividades
        public IQueryable<tbl_Actividades> Gettbl_Actividades()
        {
            return db.tbl_Actividades;
        }


        public object Gettbl_Actividades(int opcion, string filtro)
        {
            Resultado res = new Resultado();
            object resul = null;
            try
            {
                if (opcion == 1)
                {
                    string[] parametros = filtro.Split('|');
 
                    int idUsuario = Convert.ToInt32(parametros[0].ToString());
                    int idCiclo = Convert.ToInt32(parametros[1].ToString());
                    int idEstado = Convert.ToInt32(parametros[2].ToString());

                    Mantenimientos_BL obj_negocios = new Mantenimientos_BL();
                    resul = obj_negocios.get_actividades(idUsuario, idCiclo, idEstado);
                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');
                    int id_actividad = Convert.ToInt32(parametros[0].ToString());

                    tbl_Actividades objReemplazar;
                    objReemplazar = db.tbl_Actividades.Where(u => u.id_actividad == id_actividad).FirstOrDefault<tbl_Actividades>();
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
                else if (opcion == 3)  ///----- usuaarios 
                {
                    string[] parametros = filtro.Split('|');
                    int idUsuario = Convert.ToInt32(parametros[0].ToString());

                    Mantenimientos_BL obj_negocios = new Mantenimientos_BL();

                    res.ok = true;
                    res.data = obj_negocios.get_usuarios(idUsuario);
                    res.totalpage = 0;
                    resul = res;

                }
                else if (opcion == 4)  ////- ---ciclos
                {
                    res.ok = true;
                    res.data = (from a in db.tbl_Ciclos
                                select new
                                {
                                    a.id_Ciclo,
                                    a.nombre_ciclo,
                                    a.estado
                                }).ToList();
                    res.totalpage = 0;

                    resul = res;

                }
                else if (opcion == 5)
                {
                    res.ok = true;
                    res.data = (from a in db.tbl_Duracion_Actividades
                                where a.estado == 1
                                select new
                                {
                                    a.id_Duracion_Actividad,
                                    a.descripcion_duracion_actividad,
                                }).ToList();
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 6) /// estados 
                {
                    res.ok = true;
                    res.data = (from a in db.tbl_Estados
                                select new
                                {
                                    a.id_Estado,
                                    a.descripcion_estado,
                                    a.grupo_estado,

                                }).ToList();
                    res.totalpage = 0;

                    resul = res;
                }
                //-----------------APROBAR O RECHAZAR---------------
                else if (opcion == 7)
                {
                    string[] parametros = filtro.Split('|');

                    int idUsuario = Convert.ToInt32(parametros[0].ToString());
                    string fechaIni = parametros[1].ToString();
                    string fechaFin = parametros[2].ToString();
                    int idEstado = Convert.ToInt32(parametros[3].ToString());
                    int id_usuario = Convert.ToInt32(parametros[4].ToString());

                    Mantenimientos_BL obj_negocios = new Mantenimientos_BL();
                    resul = obj_negocios.get_actividadesAprobarRechazar(idUsuario, fechaIni, fechaFin, idEstado, id_usuario);
                }
                else if (opcion == 8)
                {
                    string[] parametros = filtro.Split('|');

                    int id_actividad = Convert.ToInt32(parametros[0].ToString());
                    string descripcion = parametros[1].ToString();
                    string proceso = parametros[2].ToString();
                    int id_usuario = Convert.ToInt32(parametros[3].ToString());

                    Mantenimientos_BL obj_negocios = new Mantenimientos_BL();

                    res.ok = true;
                    res.data = obj_negocios.set_aprobarRechazar(id_actividad, descripcion, proceso, id_usuario);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 9)
                {
                    string[] parametros = filtro.Split('|');
                    int idUsuario = Convert.ToInt32(parametros[0].ToString());

                    Mantenimientos_BL obj_negocios = new Mantenimientos_BL();
                    resul = obj_negocios.get_busqueda_medico(  idUsuario);
                }
                else if (opcion == 10 )  ///----- alertas 
                {
                    string[] parametros = filtro.Split('|');
                    int idCiclo = Convert.ToInt32(parametros[0].ToString());
                    int idMedico = Convert.ToInt32(parametros[1].ToString());
                    int idUsuario = Convert.ToInt32(parametros[2].ToString());

                    Mantenimientos_BL obj_negocios = new Mantenimientos_BL();

                    res.ok = true;
                    res.data = obj_negocios.getActividadesAlertas(idCiclo, idMedico, idUsuario);
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

        public object Posttbl_Actividades(tbl_Actividades tbl_Actividades)
        {
            Resultado res = new Resultado();
            Mantenimientos_BL objnegocio = new Mantenimientos_BL();
            try
            {
                tbl_Actividades.tipo_interfaz_actividad = "W";
                tbl_Actividades.fecha_creacion = DateTime.Now;
                db.tbl_Actividades.Add(tbl_Actividades);
                db.SaveChanges();
                //-----ENVIANDO UN CORREO DE NOTIFCACION ---
                objnegocio.set_envioCorreo_actividad(tbl_Actividades.id_actividad ,Convert.ToInt32(tbl_Actividades.usuario_creacion));

                res.ok = true;
                res.data = tbl_Actividades.id_actividad;
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

        public object Puttbl_Actividades(int id, tbl_Actividades tbl_Actividades)
        {
            Resultado res = new Resultado();

            tbl_Actividades objReemplazar;
            objReemplazar = db.tbl_Actividades.Where(u => u.id_actividad == id).FirstOrDefault<tbl_Actividades>();

            objReemplazar.id_Ciclo = tbl_Actividades.id_Ciclo;
            objReemplazar.fecha_actividad = tbl_Actividades.fecha_actividad;
            objReemplazar.id_Duracion = tbl_Actividades.id_Duracion;
            objReemplazar.detalle_actividad = tbl_Actividades.detalle_actividad;
            objReemplazar.id_Medico = tbl_Actividades.id_Medico;

            objReemplazar.estado = tbl_Actividades.estado;
            objReemplazar.usuario_edicion = tbl_Actividades.usuario_creacion;
            objReemplazar.fecha_edicion = DateTime.Now;

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
        

        // DELETE: api/tblActividades/5
        [ResponseType(typeof(tbl_Actividades))]
        public IHttpActionResult Deletetbl_Actividades(int id)
        {
            tbl_Actividades tbl_Actividades = db.tbl_Actividades.Find(id);
            if (tbl_Actividades == null)
            {
                return NotFound();
            }

            db.tbl_Actividades.Remove(tbl_Actividades);
            db.SaveChanges();

            return Ok(tbl_Actividades);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_ActividadesExists(int id)
        {
            return db.tbl_Actividades.Count(e => e.id_actividad == id) > 0;
        }
    }
}