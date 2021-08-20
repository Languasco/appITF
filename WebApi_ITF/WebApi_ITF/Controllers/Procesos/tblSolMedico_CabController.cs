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
    public class tblSolMedico_CabController : ApiController
    {
        private ITF_PERUEntities db = new ITF_PERUEntities();

        // GET: api/tblSolMedico_Cab
        public IQueryable<tbl_Sol_Medico_Cab> Gettbl_Sol_Medico_Cab()
        {
            return db.tbl_Sol_Medico_Cab;
        }
        
        public object Gettbl_Sol_Medico_Cab(int opcion, string filtro)
        {
            Resultado res = new Resultado();

            object resul = null;
            try
            {              
                if (opcion == 1)
                {
                    string[] parametros = filtro.Split('|');

                    int idUsuario = Convert.ToInt32(parametros[0].ToString());
                    string fechaIni = parametros[1].ToString();
                    string fechaFin = parametros[2].ToString();
                    int idEstado = Convert.ToInt32(parametros[3].ToString());

                    SolicitudesCab_BL obj_negocios = new SolicitudesCab_BL();
                    resul = obj_negocios.get_solicitudesMedicos_cab(idUsuario, fechaIni, fechaFin, idEstado);
                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');

                    int idSolCab = Convert.ToInt32(parametros[0].ToString()); 
                    int idUsuario = Convert.ToInt32(parametros[1].ToString());

                    SolicitudesCab_BL obj_negocios = new SolicitudesCab_BL();

                    res.ok = true;
                    res.data = obj_negocios.set_enviarSolicitudMedico(idSolCab, idUsuario);
                    res.totalpage = 0;
                    resul = res;

                }
                else if (opcion == 3)
                {
                    string[] parametros = filtro.Split('|');

                    int idUsuario = Convert.ToInt32(parametros[0].ToString());
                    string fechaIni = parametros[1].ToString();
                    string fechaFin = parametros[2].ToString();
                    int idEstado = Convert.ToInt32(parametros[3].ToString());

                    SolicitudesCab_BL obj_negocios = new SolicitudesCab_BL();
                    resul = obj_negocios.get_aprobarSolicitudesMedicos_cab(idUsuario, fechaIni, fechaFin, idEstado);
                }
                else if (opcion == 4)
                {
                    string[] parametros = filtro.Split('|');

                    int idSolCab = Convert.ToInt32(parametros[0].ToString());
                    int idUsuario = Convert.ToInt32(parametros[1].ToString());

                    SolicitudesCab_BL obj_negocios = new SolicitudesCab_BL();

                    res.ok = true;
                    res.data = obj_negocios.set_descartarSolicitudMedico(idSolCab, idUsuario);
                    res.totalpage = 0;
                    resul = res;

                }
                else if (opcion == 5)
                {
                    string[] parametros = filtro.Split('|');
                    string identificadorMedico = parametros[0].ToString();

                    if (db.tbl_Medicos.Count(e => e.id_Identificador_Medico + "_" + e.cmp_medico  == identificadorMedico) > 0)
                    {
                        resul = true;
                    }
                    else
                    {
                        resul = false;
                    }
                }
                else if (opcion == 6)
                {
                    string[] parametros = filtro.Split('|');

                    int idSolCab = Convert.ToInt32(parametros[0].ToString());
                    int idUsuario = Convert.ToInt32(parametros[1].ToString());

                    SolicitudesCab_BL obj_negocios = new SolicitudesCab_BL();

                    obj_negocios.set_envioCorreo_solicitudMedico(idSolCab, idUsuario);

                    res.ok = true;
                    res.data = "OK";
                    res.totalpage = 0;
                    resul = res;

                }
                else if (opcion == 7)
                {
                    string[] parametros = filtro.Split('|');

                    int idUsuario = Convert.ToInt32(parametros[0].ToString());
                    string fechaIni = parametros[1].ToString();
                    string fechaFin = parametros[2].ToString();
                    int idEstado = Convert.ToInt32(parametros[3].ToString());

                    SolicitudesCab_BL obj_negocios = new SolicitudesCab_BL();
                    resul = obj_negocios.get_solicitudesBoticasFarmacias_cab(idUsuario, fechaIni, fechaFin, idEstado);
                }
                else if (opcion == 8)
                {
                    string[] parametros = filtro.Split('|');

                    int idUsuario = Convert.ToInt32(parametros[0].ToString());
                    string fechaIni = parametros[1].ToString();
                    string fechaFin = parametros[2].ToString();
                    int idEstado = Convert.ToInt32(parametros[3].ToString());

                    SolicitudesCab_BL obj_negocios = new SolicitudesCab_BL();
                    resul = obj_negocios.get_aprobarSolicitudesBoticasFarmacias_cab(idUsuario, fechaIni, fechaFin, idEstado);
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
        
        public object Posttbl_Sol_Medico_Cab(tbl_Sol_Medico_Cab tbl_Sol_Medico_Cab)
        {
            Resultado res = new Resultado();
            try
            {

                tbl_Sol_Medico_Cab.tipo_interfaz_sol_medico_cab = "W";
                tbl_Sol_Medico_Cab.fecha_creacion = DateTime.Now;
                db.tbl_Sol_Medico_Cab.Add(tbl_Sol_Medico_Cab);
                db.SaveChanges();

                res.ok = true;
                res.data = tbl_Sol_Medico_Cab.id_Sol_Medico_cab;
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

        public object Puttbl_Sol_Medico_Cab(int id, tbl_Sol_Medico_Cab tbl_Sol_Medico_Cab)
        {
            Resultado res = new Resultado();

            tbl_Sol_Medico_Cab objReemplazar;
            objReemplazar = db.tbl_Sol_Medico_Cab.Where(u => u.id_Sol_Medico_cab == id).FirstOrDefault<tbl_Sol_Medico_Cab>();

            objReemplazar.mensaje_sol_medico_cab = tbl_Sol_Medico_Cab.mensaje_sol_medico_cab;
            //objReemplazar.estado_sol_medico_cab = tbl_Sol_Medico_Cab.estado_sol_medico_cab;
            objReemplazar.usuario_edicion = tbl_Sol_Medico_Cab.usuario_creacion;
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
                
        // DELETE: api/tblSolMedico_Cab/5
        [ResponseType(typeof(tbl_Sol_Medico_Cab))]
        public IHttpActionResult Deletetbl_Sol_Medico_Cab(int id)
        {
            tbl_Sol_Medico_Cab tbl_Sol_Medico_Cab = db.tbl_Sol_Medico_Cab.Find(id);
            if (tbl_Sol_Medico_Cab == null)
            {
                return NotFound();
            }

            db.tbl_Sol_Medico_Cab.Remove(tbl_Sol_Medico_Cab);
            db.SaveChanges();

            return Ok(tbl_Sol_Medico_Cab);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_Sol_Medico_CabExists(int id)
        {
            return db.tbl_Sol_Medico_Cab.Count(e => e.id_Sol_Medico_cab == id) > 0;
        }
    }
}