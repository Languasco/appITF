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
using Negocio.Procesos;
using Negocio.Resultados;

namespace WebApi_ITF.Controllers.Mantenimiento
{
    [EnableCors("*", "*", "*")]
    public class tblMedicosController : ApiController
    {
        private ITF_PERUEntities db = new ITF_PERUEntities();

        // GET: api/tblMedicos
        public IQueryable<tbl_Medicos> Gettbl_Medicos()
        {
            return db.tbl_Medicos;
        }
        
        public object Gettbl_Medicos(int opcion, string filtro)
        {
            Resultado res = new Resultado();
            object resul = null;
            try
            {
                if (opcion == 1)
                {
                    string[] parametros = filtro.Split('|');
                    string cmp = parametros[0].ToString();
                    string medico = parametros[1].ToString();
                    string email = parametros[2].ToString();
                    int categoria = Convert.ToInt32(parametros[3].ToString());
                    int especialidad = Convert.ToInt32(parametros[4].ToString());
                    int profesional = Convert.ToInt32(parametros[5].ToString());
                    int idEstado = Convert.ToInt32(parametros[6].ToString());

                    Mantenimientos_BL obj_negocios = new Mantenimientos_BL();
                    resul = obj_negocios.get_medicos(cmp, medico, email, categoria, especialidad, profesional, idEstado);
                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');
                    int id_Medico = Convert.ToInt32(parametros[0].ToString());

                    tbl_Medicos objReemplazar;
                    objReemplazar = db.tbl_Medicos.Where(u => u.id_Medico == id_Medico).FirstOrDefault<tbl_Medicos>();
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
                    //string[] parametros = filtro.Split('|');
                    //string codEsp = parametros[0].ToString().ToUpper();

                    //if (db.tbl_Medicos.Count(e => e.codigo_especialidad.ToUpper() == codEsp) > 0)
                    //{
                    //    resul = true;
                    //}
                    //else
                    //{
                    //    resul = false;
                    //}
                }
                else if (opcion == 4)
                {

                    Mantenimientos_BL obj_negocios = new Mantenimientos_BL();
                    string[] parametros = filtro.Split('|');
                    int idMedico = Convert.ToInt32(parametros[0].ToString());

                    res.ok = true;
                    res.data = obj_negocios.get_direccionesMedicos(idMedico);
                    res.totalpage = 0;
                    resul = res;

                }
                else if (opcion == 5)
                {
                    res.ok = true;
                    res.data = (from a in db.tbl_Identificador_Medico
                                where a.estado == 1
                                select new
                                {
                                    a.id_Identificador_Medico,
                                    a.descripcion_identificador_medico,

                                }).ToList();
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 6) ///--- departamentos
                {
                    Mantenimientos_BL obj_negocios = new Mantenimientos_BL();

                    res.ok = true;
                    res.data = obj_negocios.get_departamentos();
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 7) ///--- provincia
                {
                    Mantenimientos_BL obj_negocios = new Mantenimientos_BL();

                    string[] parametros = filtro.Split('|');
                    string codDepartamento = parametros[0].ToString();

                    res.ok = true;
                    res.data = obj_negocios.get_provincias(codDepartamento);
                    res.totalpage = 0;
                    resul = res;

                }
                else if (opcion == 8) ///--- distrito
                {
                    Mantenimientos_BL obj_negocios = new Mantenimientos_BL();

                    string[] parametros = filtro.Split('|');
                    string codDepartamento = parametros[0].ToString();
                    string codProvincia = parametros[1].ToString();

                    res.ok = true;
                    res.data = obj_negocios.get_distritos(codDepartamento, codProvincia);
                    res.totalpage = 0;
                    resul = res;
                } else if (opcion == 9) {

                    string[] parametros = filtro.Split('|');
                    int idMedicosDireccion = Convert.ToInt32(parametros[0].ToString()); 

                    tbl_Medicos_Direccion tbl_MedicosDireccion = db.tbl_Medicos_Direccion.Find(idMedicosDireccion);
                    db.tbl_Medicos_Direccion.Remove(tbl_MedicosDireccion);
                    db.SaveChanges();

                    res.ok = true;
                    res.data = "OK";
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 10)
                {
                    string[] parametros = filtro.Split('|');
                    int idUsuario = Convert.ToInt32(parametros[0].ToString());

                    Mantenimientos_BL obj_negocio = new Mantenimientos_BL();

                    res.ok = true;
                    res.data = obj_negocio.set_grabar_ImportacionMedicos(idUsuario);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 11)
                {
                    string[] parametros = filtro.Split('|');
                    int idMedico = Convert.ToInt32(parametros[0].ToString());
                    int idSolDet = Convert.ToInt32(parametros[1].ToString());

                    SolicitudesCab_BL obj_negocio = new SolicitudesCab_BL();

                    res.ok = true;
                    res.data = obj_negocio.set_eliminar_solicitudDetalle_det(idMedico, idSolDet);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 12)
                {

                    Mantenimientos_BL obj_negocios = new Mantenimientos_BL();
                    string[] parametros = filtro.Split('|');
                    int idDireccion = Convert.ToInt32(parametros[0].ToString());

                    res.ok = true;
                    res.data = obj_negocios.get_direccionesMedicos_id(idDireccion);
                    res.totalpage = 0;
                    resul = res;

                }
                else if (opcion == 13) ///---  tipo visistas
                {
                    Mantenimientos_BL obj_negocios = new Mantenimientos_BL();

                    res.ok = true;
                    res.data = obj_negocios.get_tipoVisitas();
                    res.totalpage = 0;
                    resul = res;
                }
                else if(opcion == 14)
                {
                    string[] parametros = filtro.Split('|');
                    string cmp = parametros[0].ToString();
                    string medico = parametros[1].ToString();
                    string email = parametros[2].ToString();
                    int categoria = Convert.ToInt32(parametros[3].ToString());
 
                    int profesional = Convert.ToInt32(parametros[4].ToString());
                    int idEstado = Convert.ToInt32(parametros[5].ToString());

                    Mantenimientos_BL obj_negocios = new Mantenimientos_BL();
                    resul = obj_negocios.get_boticasFarmacias(cmp, medico, email, categoria, profesional, idEstado);
                }
                else if (opcion == 15)
                {

                    string[] parametros = filtro.Split('|');
                    string nroRuc = parametros[0].ToString();
                    Mantenimientos_BL obj_negocios = new Mantenimientos_BL();

                    res.ok = true;
                    res.data = obj_negocios.get_consultandoRuc(nroRuc);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 16) ///--- lcoales
                {
                    Mantenimientos_BL obj_negocios = new Mantenimientos_BL();

                    string[] parametros = filtro.Split('|');
                    string codDepartamento = parametros[0].ToString();
                    string codProvincia = parametros[1].ToString();
                    string codDistrito = parametros[2].ToString();
                    string nroRuc = parametros[3].ToString();

                    res.ok = true;
                    res.data = obj_negocios.get_locales(codDepartamento, codProvincia, codDistrito, nroRuc);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 17)
                {
                    string[] parametros = filtro.Split('|');
                    int idUsuario = Convert.ToInt32(parametros[0].ToString());
                    Mantenimientos_BL obj_negocio = new Mantenimientos_BL();

                    res.ok = true;
                    res.data = obj_negocio.set_grabar_ImportacionBoticasFarmacias(idUsuario);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 18)
                {

                    string[] parametros = filtro.Split('|');
                    string filtroBusqueda = parametros[0].ToString();
                    Mantenimientos_BL obj_negocios = new Mantenimientos_BL();

                    res.ok = true;
                    res.data = obj_negocios.get_consultandoInstituciones(filtroBusqueda);
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

        public object Posttbl_Medicos(tbl_Medicos tbl_Medicos)
        {
            Resultado res = new Resultado();
            try
            {
                tbl_Medicos.fecha_creacion = DateTime.Now;
                db.tbl_Medicos.Add(tbl_Medicos);
                db.SaveChanges();

                res.ok = true;
                res.data = (from a in db.tbl_Medicos
                            join b in db.tbl_Identificador_Medico on a.id_Identificador_Medico equals b.id_Identificador_Medico
                            join c in db.tbl_Categorias on a.id_Categoria equals c.id_Categoria
                            join d in db.tbl_Especialidades on a.id_Especialidad1 equals d.id_Especialidad
                            where a.id_Medico == tbl_Medicos.id_Medico
                            select new
                            {
                                a.id_Medico,
                                a.id_Identificador_Medico,
                                b.descripcion_identificador_medico,
                                a.cmp_medico,
                                a.nombres_medico,
                                a.apellido_paterno_medico,
                                a.apellido_materno_medico,
                                a.id_Categoria,
                                c.codigo_categoria,
                                a.id_Especialidad1,
                                d.codigo_especialidad,
                                a.id_Especialidad2,
                                a.email_medico,
                                a.fecha_nacimiento_medico,
                                fechaNacimientoMedico = a.fecha_nacimiento_medico,
                                a.sexo_medico,
                                a.telefono_medico,        
                                a.estado,
                                descripcion_estado = a.estado == 0 ? "INACTIVO" : "ACTIVO",
                                a.usuario_creacion,
                                a.id_tipo_visita
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

        public object Puttbl_Medicos(int id, tbl_Medicos tbl_Medicos)
        {
            Resultado res = new Resultado();

            tbl_Medicos objReemplazar;
            objReemplazar = db.tbl_Medicos.Where(u => u.id_Medico == id).FirstOrDefault<tbl_Medicos>();

            objReemplazar.id_Identificador_Medico = tbl_Medicos.id_Identificador_Medico;
            objReemplazar.cmp_medico = tbl_Medicos.cmp_medico;
            objReemplazar.nombres_medico = tbl_Medicos.nombres_medico;
            objReemplazar.apellido_paterno_medico = tbl_Medicos.apellido_paterno_medico;
            objReemplazar.apellido_materno_medico = tbl_Medicos.apellido_materno_medico;
            objReemplazar.id_Categoria = tbl_Medicos.id_Categoria;

            objReemplazar.id_Especialidad1 = tbl_Medicos.id_Especialidad1;
            objReemplazar.id_Especialidad2 = tbl_Medicos.id_Especialidad2;
            objReemplazar.email_medico = tbl_Medicos.email_medico;
            objReemplazar.fecha_nacimiento_medico = tbl_Medicos.fecha_nacimiento_medico;
            objReemplazar.sexo_medico = tbl_Medicos.sexo_medico;
            objReemplazar.id_tipo_visita = tbl_Medicos.id_tipo_visita;

            objReemplazar.telefono_medico = tbl_Medicos.telefono_medico;
            objReemplazar.estado = tbl_Medicos.estado;
            objReemplazar.usuario_edicion = tbl_Medicos.usuario_creacion;
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
        
        // DELETE: api/tblMedicos/5
        [ResponseType(typeof(tbl_Medicos))]
        public IHttpActionResult Deletetbl_Medicos(int id)
        {
            tbl_Medicos tbl_Medicos = db.tbl_Medicos.Find(id);
            if (tbl_Medicos == null)
            {
                return NotFound();
            }

            db.tbl_Medicos.Remove(tbl_Medicos);
            db.SaveChanges();

            return Ok(tbl_Medicos);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_MedicosExists(int id)
        {
            return db.tbl_Medicos.Count(e => e.id_Medico == id) > 0;
        }
    }
}