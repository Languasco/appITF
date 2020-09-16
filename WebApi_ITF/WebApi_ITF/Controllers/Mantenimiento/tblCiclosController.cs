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
    public class tblCiclosController : ApiController
    {
        private ITF_PERUEntities db = new ITF_PERUEntities();

        // GET: api/tblCiclos
        public IQueryable<tbl_Ciclos> Gettbl_Ciclos()
        {
            return db.tbl_Ciclos;
        }
                
        public object Gettbl_Ciclos(int opcion, string filtro)
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

                    if (idEstado == 0)
                    {
                        res.data = (from a in db.tbl_Ciclos
                                    join b in db.tbl_Estados on a.estado equals b.id_Estado
                                    select new
                                    {
                                        a.id_Ciclo,
                                        a.nombre_ciclo,
                                        a.desde_ciclo,
                                        a.hasta_ciclo,
                                        a.estado,                     
                                        b.descripcion_estado,
                                        a.usuario_creacion
                                    }).ToList();
                    }
                    else
                    {
                        res.data = (from a in db.tbl_Ciclos
                                    join b in db.tbl_Estados on a.estado equals b.id_Estado
                                    where a.estado == idEstado
                                    select new
                                    {
                                        a.id_Ciclo,
                                        a.nombre_ciclo,
                                        a.desde_ciclo,
                                        a.hasta_ciclo,
                                        a.estado,
                                        b.descripcion_estado,
                                        a.usuario_creacion
                                    }).ToList();
                    }

                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');
                    int id_Ciclo = Convert.ToInt32(parametros[0].ToString());

                    tbl_Ciclos objReemplazar;
                    objReemplazar = db.tbl_Ciclos.Where(u => u.id_Ciclo == id_Ciclo).FirstOrDefault<tbl_Ciclos>();
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
                else if (opcion == 3)
                {
                    string[] parametros = filtro.Split('|');
                    string cod = parametros[0].ToString().ToUpper();

                    if (db.tbl_Ciclos.Count(e => e.nombre_ciclo.ToUpper() == cod) > 0)
                    {
                        resul = true;
                    }
                    else
                    {
                        resul = false;
                    }
                }
                else if (opcion == 4)
                {
 
                }
                else if (opcion == 5)
                {
 
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

        public object Posttbl_Ciclos(tbl_Ciclos tbl_Ciclos)
        {
            Resultado res = new Resultado();
            try
            {
                tbl_Ciclos.fecha_creacion = DateTime.Now;
                db.tbl_Ciclos.Add(tbl_Ciclos);
                db.SaveChanges();

                res.ok = true;
                res.data = (from a in db.tbl_Ciclos
                           join b in db.tbl_Estados on a.estado equals b.id_Estado
                           where a.id_Ciclo == tbl_Ciclos.id_Ciclo
                            select new
                           {
                               a.id_Ciclo,
                               a.nombre_ciclo,
                               a.desde_ciclo,
                               a.hasta_ciclo,
                               a.estado,
                               b.descripcion_estado,
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

        public object Puttbl_Ciclos(int id, tbl_Ciclos tbl_Ciclos)
        {
            Resultado res = new Resultado();

            tbl_Ciclos objReemplazar;
            objReemplazar = db.tbl_Ciclos.Where(u => u.id_Ciclo == id).FirstOrDefault<tbl_Ciclos>();

            objReemplazar.nombre_ciclo = tbl_Ciclos.nombre_ciclo;
            objReemplazar.desde_ciclo = tbl_Ciclos.desde_ciclo;
            objReemplazar.hasta_ciclo = tbl_Ciclos.hasta_ciclo;
            objReemplazar.estado = tbl_Ciclos.estado;

            objReemplazar.usuario_edicion = tbl_Ciclos.usuario_creacion;
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


        // DELETE: api/tblCiclos/5
        [ResponseType(typeof(tbl_Ciclos))]
        public IHttpActionResult Deletetbl_Ciclos(int id)
        {
            tbl_Ciclos tbl_Ciclos = db.tbl_Ciclos.Find(id);
            if (tbl_Ciclos == null)
            {
                return NotFound();
            }

            db.tbl_Ciclos.Remove(tbl_Ciclos);
            db.SaveChanges();

            return Ok(tbl_Ciclos);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_CiclosExists(int id)
        {
            return db.tbl_Ciclos.Count(e => e.id_Ciclo == id) > 0;
        }
    }
}