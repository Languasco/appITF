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
using Negocio.Resultados;

namespace WebApi_ITF.Controllers.Mantenimiento
{
    [EnableCors("*", "*", "*")]
    public class tblResultadosVisitasController : ApiController
    {
        private ITF_PERUEntities db = new ITF_PERUEntities();

        // GET: api/tblResultadosVisitas
        public IQueryable<tbl_Resultados_Visitas> Gettbl_Resultados_Visitas()
        {
            return db.tbl_Resultados_Visitas;
        }


        public object Gettbl_Resultados_Visitas(int opcion, string filtro)
        {
            Resultado res = new Resultado();
            object resul = null;
            try
            {
                if (opcion == 1)
                {
                    string[] parametros = filtro.Split('|');
                    int idEstado = Convert.ToInt32(parametros[0].ToString());

                    res.ok = true;

                    if (idEstado == -1)
                    {
                        res.data = (from a in db.tbl_Resultados_Visitas
                                    select new
                                    {
                                        a.id_Resultado_Visita,
                                        a.descripcion_resultado_visita,
                                        a.por_defecto_resultado_visita,
                                        a.estado,
                                        descripcion_estado = a.estado == 0 ? "INACTIVO" : "ACTIVO",
                                        a.usuario_creacion
                                    }).ToList();
                    }
                    else
                    {
                        res.data = (from a in db.tbl_Resultados_Visitas
                                    where a.estado == idEstado
                                    select new
                                    {
                                        a.id_Resultado_Visita,
                                        a.descripcion_resultado_visita,
                                        a.por_defecto_resultado_visita,
                                        a.estado,
                                        descripcion_estado = a.estado == 0 ? "INACTIVO" : "ACTIVO",
                                        a.usuario_creacion
                                    }).ToList();
                    }

                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');
                    int id_Resultado_Visita = Convert.ToInt32(parametros[0].ToString());

                    tbl_Resultados_Visitas objReemplazar;
                    objReemplazar = db.tbl_Resultados_Visitas.Where(u => u.id_Resultado_Visita == id_Resultado_Visita).FirstOrDefault<tbl_Resultados_Visitas>();
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
                else if (opcion == 4)
                {
                    string[] parametros = filtro.Split('|');
                    string des = parametros[0].ToString().ToUpper();

                    if (db.tbl_Resultados_Visitas.Count(e => e.descripcion_resultado_visita.ToUpper() == des) > 0)
                    {
                        resul = true;
                    }
                    else
                    {
                        resul = false;
                    }
                }
                else if (opcion == 5)
                {
                    string[] parametros = filtro.Split('|');
                    string des = parametros[0].ToString().ToUpper();

                    if (db.tbl_Resultados_Visitas.Count(e => e.por_defecto_resultado_visita == "1") > 0)
                    {
                        resul = true;
                    }
                    else
                    {
                        resul = false;
                    }
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

        public object Posttbl_Resultados_Visitas(tbl_Resultados_Visitas tbl_Resultados_Visitas)
        {
            Resultado res = new Resultado();
            try
            {
                tbl_Resultados_Visitas.fecha_creacion = DateTime.Now;
                db.tbl_Resultados_Visitas.Add(tbl_Resultados_Visitas);
                db.SaveChanges();

                res.ok = true;
                res.data = (from a in db.tbl_Resultados_Visitas
                            where a.id_Resultado_Visita == tbl_Resultados_Visitas.id_Resultado_Visita
                            select new
                            {
                                a.id_Resultado_Visita,
                                a.descripcion_resultado_visita,
                                a.por_defecto_resultado_visita,
                                a.estado,
                                descripcion_estado = a.estado == 0 ? "INACTIVO" : "ACTIVO",
                                a.usuario_creacion
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

        public object Puttbl_Resultados_Visitas(int id, tbl_Resultados_Visitas tbl_Resultados_Visitas)
        {
            Resultado res = new Resultado();

            tbl_Resultados_Visitas objReemplazar;
            objReemplazar = db.tbl_Resultados_Visitas.Where(u => u.id_Resultado_Visita == id).FirstOrDefault<tbl_Resultados_Visitas>();

            objReemplazar.descripcion_resultado_visita = tbl_Resultados_Visitas.descripcion_resultado_visita;
            objReemplazar.por_defecto_resultado_visita = tbl_Resultados_Visitas.por_defecto_resultado_visita;
            objReemplazar.estado = tbl_Resultados_Visitas.estado;

            objReemplazar.usuario_edicion = tbl_Resultados_Visitas.usuario_creacion;
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

        // DELETE: api/tblResultadosVisitas/5
        [ResponseType(typeof(tbl_Resultados_Visitas))]
        public IHttpActionResult Deletetbl_Resultados_Visitas(int id)
        {
            tbl_Resultados_Visitas tbl_Resultados_Visitas = db.tbl_Resultados_Visitas.Find(id);
            if (tbl_Resultados_Visitas == null)
            {
                return NotFound();
            }

            db.tbl_Resultados_Visitas.Remove(tbl_Resultados_Visitas);
            db.SaveChanges();

            return Ok(tbl_Resultados_Visitas);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_Resultados_VisitasExists(int id)
        {
            return db.tbl_Resultados_Visitas.Count(e => e.id_Resultado_Visita == id) > 0;
        }
    }
}