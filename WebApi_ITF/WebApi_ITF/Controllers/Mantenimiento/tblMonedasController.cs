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
    public class tblMonedasController : ApiController
    {
        private ITF_PERUEntities db = new ITF_PERUEntities();

        // GET: api/tblMonedas
        public IQueryable<tbl_Monedas> Gettbl_Monedas()
        {
            return db.tbl_Monedas;
        }

        public object Gettbl_Monedas(int opcion, string filtro)
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
                        res.data = (from a in db.tbl_Monedas
                                    select new
                                    {
                                        a.id_Moneda,
                                        a.codigo_moneda,
                                        a.descripcion_moneda,
                                        a.simbolo_moneda,
                                        a.estado,
                                        descripcion_estado = a.estado == 0 ? "INACTIVO" : "ACTIVO",
                                        a.usuario_creacion
                                    }).ToList();
                    }
                    else
                    {
                        res.data = (from a in db.tbl_Monedas
                                    where a.estado == idEstado
                                    select new
                                    {
                                        a.id_Moneda,
                                        a.codigo_moneda,
                                        a.descripcion_moneda,
                                        a.simbolo_moneda,
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
                    int id_Moneda = Convert.ToInt32(parametros[0].ToString());

                    tbl_Monedas objReemplazar;
                    objReemplazar = db.tbl_Monedas.Where(u => u.id_Moneda == id_Moneda).FirstOrDefault<tbl_Monedas>();
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
                    string codMoneda = parametros[0].ToString().ToUpper();

                    if (db.tbl_Monedas.Count(e => e.codigo_moneda.ToUpper() == codMoneda) > 0)
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
                    string[] parametros = filtro.Split('|');
                    string descripcionmoneda = parametros[0].ToString().ToUpper();

                    if (db.tbl_Monedas.Count(e => e.descripcion_moneda.ToUpper() == descripcionmoneda) > 0)
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

        public object Posttbl_Monedas(tbl_Monedas tbl_Monedas)
        {
            Resultado res = new Resultado();
            try
            {
                tbl_Monedas.fecha_creacion = DateTime.Now;
                db.tbl_Monedas.Add(tbl_Monedas);
                db.SaveChanges();

                res.ok = true;
                res.data = (from a in db.tbl_Monedas
                            where a.id_Moneda == tbl_Monedas.id_Moneda
                            select new
                            {
                                a.id_Moneda,
                                a.codigo_moneda,
                                a.descripcion_moneda,
                                a.simbolo_moneda,
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

        public object Puttbl_Monedas(int id, tbl_Monedas tbl_Monedas)
        {
            Resultado res = new Resultado();

            tbl_Monedas objReemplazar;
            objReemplazar = db.tbl_Monedas.Where(u => u.id_Moneda == id).FirstOrDefault<tbl_Monedas>();

            objReemplazar.descripcion_moneda = tbl_Monedas.descripcion_moneda;
            objReemplazar.simbolo_moneda = tbl_Monedas.simbolo_moneda;
            objReemplazar.estado = tbl_Monedas.estado;

            objReemplazar.usuario_edicion = tbl_Monedas.usuario_creacion;
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

        // DELETE: api/tblMonedas/5
        [ResponseType(typeof(tbl_Monedas))]
        public IHttpActionResult Deletetbl_Monedas(int id)
        {
            tbl_Monedas tbl_Monedas = db.tbl_Monedas.Find(id);
            if (tbl_Monedas == null)
            {
                return NotFound();
            }

            db.tbl_Monedas.Remove(tbl_Monedas);
            db.SaveChanges();

            return Ok(tbl_Monedas);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_MonedasExists(int id)
        {
            return db.tbl_Monedas.Count(e => e.id_Moneda == id) > 0;
        }
    }
}