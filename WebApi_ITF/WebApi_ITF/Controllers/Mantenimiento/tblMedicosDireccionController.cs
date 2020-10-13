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
    public class tblMedicosDireccionController : ApiController
    {
        private ITF_PERUEntities db = new ITF_PERUEntities();

        // GET: api/tblMedicosDireccion
        public IQueryable<tbl_Medicos_Direccion> Gettbl_Medicos_Direccion()
        {
            return db.tbl_Medicos_Direccion;
        }

        // GET: api/tblMedicosDireccion/5
        [ResponseType(typeof(tbl_Medicos_Direccion))]
        public IHttpActionResult Gettbl_Medicos_Direccion(int id)
        {
            tbl_Medicos_Direccion tbl_Medicos_Direccion = db.tbl_Medicos_Direccion.Find(id);
            if (tbl_Medicos_Direccion == null)
            {
                return NotFound();
            }

            return Ok(tbl_Medicos_Direccion);
        }
        
        public object Posttbl_Medicos_Direccion(tbl_Medicos_Direccion tbl_Medicos_Direccion)
        {
            Resultado res = new Resultado();
            try
            {
                tbl_Medicos_Direccion.fecha_creacion = DateTime.Now;
                db.tbl_Medicos_Direccion.Add(tbl_Medicos_Direccion);
                db.SaveChanges();

                res.ok = true;
                res.data = tbl_Medicos_Direccion.id_Medicos_Direccion;
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

        public object Puttbl_Medicos_Direccion(int id, tbl_Medicos_Direccion tbl_Medicos_Direccion)
        {
            Resultado res = new Resultado();

            tbl_Medicos_Direccion objReemplazar;
            objReemplazar = db.tbl_Medicos_Direccion.Where(u => u.id_Medicos_Direccion == id).FirstOrDefault<tbl_Medicos_Direccion>();

            objReemplazar.codigo_departamento = tbl_Medicos_Direccion.codigo_departamento;
            objReemplazar.codigo_provincia = tbl_Medicos_Direccion.codigo_provincia;
            objReemplazar.codigo_distrito = tbl_Medicos_Direccion.codigo_distrito;
            objReemplazar.direccion_medico_direccion = tbl_Medicos_Direccion.direccion_medico_direccion;
            objReemplazar.referencia_medico_direccion = tbl_Medicos_Direccion.referencia_medico_direccion;
            objReemplazar.nombre_institucion_direccion = tbl_Medicos_Direccion.nombre_institucion_direccion;

            objReemplazar.estado = tbl_Medicos_Direccion.estado;
            objReemplazar.usuario_edicion = tbl_Medicos_Direccion.usuario_creacion;
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

        // DELETE: api/tblMedicosDireccion/5
        [ResponseType(typeof(tbl_Medicos_Direccion))]
        public IHttpActionResult Deletetbl_Medicos_Direccion(int id)
        {
            tbl_Medicos_Direccion tbl_Medicos_Direccion = db.tbl_Medicos_Direccion.Find(id);
            if (tbl_Medicos_Direccion == null)
            {
                return NotFound();
            }

            db.tbl_Medicos_Direccion.Remove(tbl_Medicos_Direccion);
            db.SaveChanges();

            return Ok(tbl_Medicos_Direccion);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_Medicos_DireccionExists(int id)
        {
            return db.tbl_Medicos_Direccion.Count(e => e.id_Medicos_Direccion == id) > 0;
        }
    }
}