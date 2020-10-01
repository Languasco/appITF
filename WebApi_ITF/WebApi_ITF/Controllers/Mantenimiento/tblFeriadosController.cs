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
    public class tblFeriadosController : ApiController
    {
        private ITF_PERUEntities db = new ITF_PERUEntities();

        // GET: api/tblFeriados
        public IQueryable<tbl_Feriados> Gettbl_Feriados()
        {
            return db.tbl_Feriados;
        }
        
        public object Gettbl_Feriados(int opcion, string filtro)
        {
            Resultado res = new Resultado();
            object resul = null;
            try
            {
                if (opcion == 1)
                {
                    string[] parametros = filtro.Split('|');
                    int idEstado = Convert.ToInt32(parametros[0].ToString());

                    Mantenimientos_BL obj_negocios = new Mantenimientos_BL();

                    res.ok = true;
                    res.data = obj_negocios.get_feriados(idEstado);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');
                    int idFeriado = Convert.ToInt32(parametros[0].ToString());

                    tbl_Feriados objReemplazar;
                    objReemplazar = db.tbl_Feriados.Where(u => u.id_Feriado == idFeriado).FirstOrDefault<tbl_Feriados>();
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
                    string descripcionferiado = parametros[0].ToString().ToUpper();

                    if (db.tbl_Feriados.Count(e => e.descripcion_feriado.ToUpper() == descripcionferiado) > 0)
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
                    //string[] parametros = filtro.Split('|');
                    //string fechaFeriado = parametros[0].ToString();
                                                                       

                    //if (db.tbl_Feriados.Count(e => e.fecha_feriado.ToString("dd/MM/yyyy") == fechaFeriado) > 0)
                    //{
                    //    resul = true;
                    //}
                    //else
                    //{
                    //    resul = false;
                    //}
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

        public object Posttbl_Feriados(tbl_Feriados tbl_Feriados)
        {
            Resultado res = new Resultado();
            try
            {
                tbl_Feriados.fecha_creacion = DateTime.Now;
                db.tbl_Feriados.Add(tbl_Feriados);
                db.SaveChanges();

                res.ok = true;
                res.data = tbl_Feriados.id_Feriado;
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

        public object Puttbl_Feriados(int id, tbl_Feriados tbl_Feriados)
        {
            Resultado res = new Resultado();

            tbl_Feriados objReemplazar;
            objReemplazar = db.tbl_Feriados.Where(u => u.id_Feriado == id).FirstOrDefault<tbl_Feriados>();

            objReemplazar.descripcion_feriado = tbl_Feriados.descripcion_feriado;
            objReemplazar.estado = tbl_Feriados.estado;

            objReemplazar.usuario_edicion = tbl_Feriados.usuario_creacion;
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


        // DELETE: api/tblFeriados/5
        [ResponseType(typeof(tbl_Feriados))]
        public IHttpActionResult Deletetbl_Feriados(int id)
        {
            tbl_Feriados tbl_Feriados = db.tbl_Feriados.Find(id);
            if (tbl_Feriados == null)
            {
                return NotFound();
            }

            db.tbl_Feriados.Remove(tbl_Feriados);
            db.SaveChanges();

            return Ok(tbl_Feriados);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_FeriadosExists(int id)
        {
            return db.tbl_Feriados.Count(e => e.id_Feriado == id) > 0;
        }
    }
}