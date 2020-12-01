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
using Negocio.Procesos;
using Negocio.Resultados;

namespace WebApi_ITF.Controllers.Procesos
{
    [EnableCors("*", "*", "*")]
    public class tblSolMedicoDireccionController : ApiController
    {
        private ITF_PERUEntities db = new ITF_PERUEntities();

        // GET: api/tblSolMedicoDireccion
        public IQueryable<tbl_Sol_Medico_Direccion> Gettbl_Sol_Medico_Direccion()
        {
            return db.tbl_Sol_Medico_Direccion;
        }

        public object GetProgramacion(int opcion, string filtro)
        {
            Resultado res = new Resultado();
            SolicitudDireccion_BL obj_negocios = new SolicitudDireccion_BL();

            object resul = null;
            try
            {
                if (opcion == 1)
                {
                    string[] parametros = filtro.Split('|');

                    int idUsuario = Convert.ToInt32(parametros[0].ToString());
                    int idEstado = Convert.ToInt32(parametros[1].ToString());

                    resul = obj_negocios.get_mostrarSolicitudesDireccionCab(idUsuario, idEstado);
                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');

                    int categoria = Convert.ToInt32(parametros[0].ToString());
                    int especialidad = Convert.ToInt32(parametros[1].ToString());
                    string medico =  parametros[2].ToString();
                    int idMedico = Convert.ToInt32(parametros[3].ToString());
                    int idUsuario = Convert.ToInt32(parametros[4].ToString());

                    resul = obj_negocios.get_busqueda_medico(categoria, especialidad, medico, idMedico, idUsuario);
                }
                else if (opcion == 3)
                {
                    string[] parametros = filtro.Split('|');

                    int idSolMedico_Direccion = Convert.ToInt32(parametros[0].ToString());
                    string descripcion = parametros[1].ToString();
                    string proceso = parametros[2].ToString();
                    int id_usuario = Convert.ToInt32(parametros[3].ToString());

                    res.ok = true;
                    res.data = obj_negocios.set_aprobarRechazar_direccioMedico(idSolMedico_Direccion, descripcion, proceso, id_usuario);
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



        public object Posttbl_Sol_Medico_Direccion(tbl_Sol_Medico_Direccion tbl_Sol_Medico_Direccion)
        {
            Resultado res = new Resultado();
            try
            {
                tbl_Sol_Medico_Direccion.tipo_interfaz_actividad = "W";
                tbl_Sol_Medico_Direccion.fecha_creacion = DateTime.Now;
                db.tbl_Sol_Medico_Direccion.Add(tbl_Sol_Medico_Direccion);
                db.SaveChanges();

                int idSolMedico_Direccion = tbl_Sol_Medico_Direccion.id_Sol_Medico_Direccion;
                int id_usuario = Convert.ToInt32(tbl_Sol_Medico_Direccion.usuario_creacion);

                SolicitudDireccion_BL obj_negocio = new SolicitudDireccion_BL();
                obj_negocio.set_envioCorreo_solicitudDireccionMedico(idSolMedico_Direccion, id_usuario);


                res.ok = true;
                res.data = tbl_Sol_Medico_Direccion.id_Sol_Medico_Direccion ;
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

        public object Puttbl_Sol_Medico_Direccion(int id, tbl_Sol_Medico_Direccion tbl_Sol_Medico_Direccion)
        {
            Resultado res = new Resultado();

            tbl_Sol_Medico_Direccion objReemplazar;
            objReemplazar = db.tbl_Sol_Medico_Direccion.Where(u => u.id_Sol_Medico_Direccion == id).FirstOrDefault<tbl_Sol_Medico_Direccion>();            
            objReemplazar.usuario_edicion = tbl_Sol_Medico_Direccion.usuario_creacion;
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


        // DELETE: api/tblSolMedicoDireccion/5
        [ResponseType(typeof(tbl_Sol_Medico_Direccion))]
        public IHttpActionResult Deletetbl_Sol_Medico_Direccion(int id)
        {
            tbl_Sol_Medico_Direccion tbl_Sol_Medico_Direccion = db.tbl_Sol_Medico_Direccion.Find(id);
            if (tbl_Sol_Medico_Direccion == null)
            {
                return NotFound();
            }

            db.tbl_Sol_Medico_Direccion.Remove(tbl_Sol_Medico_Direccion);
            db.SaveChanges();

            return Ok(tbl_Sol_Medico_Direccion);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_Sol_Medico_DireccionExists(int id)
        {
            return db.tbl_Sol_Medico_Direccion.Count(e => e.id_Sol_Medico_Direccion == id) > 0;
        }
    }
}