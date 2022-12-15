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
    public class tblCiclos_GastosController : ApiController
    {
        private ITF_PERUEntities db = new ITF_PERUEntities();

        // GET: api/tblCiclos_Gastos
        public IQueryable<tbl_Ciclos_Gastos> Gettbl_Ciclos_Gastos()
        {
            return db.tbl_Ciclos_Gastos;
        }

        // GET: api/tblCiclos_Gastos/5
        [ResponseType(typeof(tbl_Ciclos_Gastos))]
        public IHttpActionResult Gettbl_Ciclos_Gastos(int id)
        {
            tbl_Ciclos_Gastos tbl_Ciclos_Gastos = db.tbl_Ciclos_Gastos.Find(id);
            if (tbl_Ciclos_Gastos == null)
            {
                return NotFound();
            }

            return Ok(tbl_Ciclos_Gastos);
        }




        public object Posttbl_Ciclos_Gastos(tbl_Ciclos_Gastos tbl_Ciclos_Gastos)
        {
            Resultado res = new Resultado();
            try
            {
                tbl_Ciclos_Gastos.fecha_creacion = DateTime.Now;
                db.tbl_Ciclos_Gastos.Add(tbl_Ciclos_Gastos);
                db.SaveChanges();

                res.ok = true;
                res.data = (from a in db.tbl_Ciclos_Gastos
                            join b in db.tbl_Estados on a.estado equals b.id_Estado
                            where a.id_Ciclo == tbl_Ciclos_Gastos.id_Ciclo
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

        public object Puttbl_Ciclos_Gastos(int id, tbl_Ciclos_Gastos tbl_Ciclos_Gastos)
        {
            Resultado res = new Resultado();

            tbl_Ciclos_Gastos objReemplazar;
            objReemplazar = db.tbl_Ciclos_Gastos.Where(u => u.id_Ciclo == id).FirstOrDefault<tbl_Ciclos_Gastos>();

            objReemplazar.nombre_ciclo = tbl_Ciclos_Gastos.nombre_ciclo;
            objReemplazar.desde_ciclo = tbl_Ciclos_Gastos.desde_ciclo;
            objReemplazar.hasta_ciclo = tbl_Ciclos_Gastos.hasta_ciclo;
            objReemplazar.estado = tbl_Ciclos_Gastos.estado;

            objReemplazar.usuario_edicion = tbl_Ciclos_Gastos.usuario_creacion;
            objReemplazar.fecha_edicion = DateTime.Now;

            db.Entry(objReemplazar).State = EntityState.Modified;

            try
            {
                db.SaveChanges();

                int idEstado = Convert.ToInt32(tbl_Ciclos_Gastos.estado);
                int idUsuario = Convert.ToInt32(tbl_Ciclos_Gastos.usuario_creacion);

                ////if (idEstado == 4) //--- solo si el ciclo esta en proceso
                ////{
                ////    //Mantenimientos_BL obj_negocio = new Mantenimientos_BL();
                ////    //obj_negocio.set_puntosContactoCalculo(id, idUsuario);
                ////}

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





        // DELETE: api/tblCiclos_Gastos/5
        [ResponseType(typeof(tbl_Ciclos_Gastos))]
        public IHttpActionResult Deletetbl_Ciclos_Gastos(int id)
        {
            tbl_Ciclos_Gastos tbl_Ciclos_Gastos = db.tbl_Ciclos_Gastos.Find(id);
            if (tbl_Ciclos_Gastos == null)
            {
                return NotFound();
            }

            db.tbl_Ciclos_Gastos.Remove(tbl_Ciclos_Gastos);
            db.SaveChanges();

            return Ok(tbl_Ciclos_Gastos);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_Ciclos_GastosExists(int id)
        {
            return db.tbl_Ciclos_Gastos.Count(e => e.id_Ciclo == id) > 0;
        }
    }
}