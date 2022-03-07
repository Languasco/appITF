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
    public class tblExamen_Rm_CabController : ApiController
    {
        private ITF_PERUEntities db = new ITF_PERUEntities();

        // GET: api/tblExamen_Rm_Cab

        public object Gettbl_Examen_Rm_Cab(int opcion, string filtro)
        {
            Resultado res = new Resultado();
            object resul = null;
            try
            {
                if (opcion == 1)
                {
                    string[] parametros = filtro.Split('|');

                    string fechaInicio =  parametros[0].ToString();
                    string fechaFin =  parametros[1].ToString();
                    int idEstado = Convert.ToInt32(parametros[2].ToString());

                    Mantenimientos_BL obj_negocios = new Mantenimientos_BL();
                    resul = obj_negocios.get_examenes(fechaInicio, fechaFin, idEstado);
                }
                else if (opcion == 2)
                {
                    Mantenimientos_BL obj_negocios = new Mantenimientos_BL();

                    res.ok = true;
                    res.data = obj_negocios.get_usuarios_examen();
                    res.totalpage = 0;
                    resul = res;

                }
                else if (opcion == 3)
                {
                    string[] parametros = filtro.Split('|');

                    Mantenimientos_BL obj_negocios = new Mantenimientos_BL();
                    int idExamenCab = Convert.ToInt32(parametros[0].ToString());

                    res.ok = true;
                    res.data = (from a in db.tbl_Examen_Rm_Det_Usuarios
                                join b in db.tbl_Usuarios on a.id_Usuario equals b.id_Usuario
                                where a.id_Examen_Rm_Cab == idExamenCab 
                                select new
                                {
                                    a.id_Examen_RM_Det_Usuarios,
                                    a.id_Examen_Rm_Cab,
                                    a.id_Usuario,
                                    descripcion_usuario = b.apellido_paterno_usuario + " " + b.apellido_materno_usuario
                                }).ToList();
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 4)
                {
                    string[] parametros = filtro.Split('|');

                    Mantenimientos_BL obj_negocios = new Mantenimientos_BL();
                    int idExamenDet_usuario = Convert.ToInt32(parametros[0].ToString());

                    tbl_Examen_Rm_Det_Usuarios tbl_Examen_Rm_Det_Usuarios = db.tbl_Examen_Rm_Det_Usuarios.Find(idExamenDet_usuario);                

                    try
                    {
                        db.tbl_Examen_Rm_Det_Usuarios.Remove(tbl_Examen_Rm_Det_Usuarios);
                        db.SaveChanges();
                        res.ok = true;
                        res.data = "OK";
                        res.totalpage = 0;
                    }
                    catch (Exception ex)
                    {
                        res.ok = false;
                        res.data = ex.Message;
                        res.totalpage = 0;
                    } 

                    resul = res;

                }
                else if (opcion == 5)
                {
                    string[] parametros = filtro.Split('|');

                    Mantenimientos_BL obj_negocios = new Mantenimientos_BL();
                    int idExamenCab = Convert.ToInt32(parametros[0].ToString());

                    res.ok = true;
                    res.data = obj_negocios.get_preguntas_examen(idExamenCab);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 6)
                {
                    string[] parametros = filtro.Split('|');

                    Mantenimientos_BL obj_negocios = new Mantenimientos_BL();
                    int idExamenCab = Convert.ToInt32(parametros[0].ToString());
                    int item = Convert.ToInt32(parametros[1].ToString());

                    res.ok = true;
                    res.data = obj_negocios.set_eliminarPregunta(idExamenCab, item);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 7)
                {
                    string[] parametros = filtro.Split('|');

                    Mantenimientos_BL obj_negocios = new Mantenimientos_BL();
                    int idExamenCab = Convert.ToInt32(parametros[0].ToString());
                    int item_pregunta = Convert.ToInt32(parametros[1].ToString());


                    res.ok = true;
                    res.data = (from a in db.tbl_Examen_Rm_Det_Preguntas
                                where a.id_Examen_Rm_Cab == idExamenCab && a.item_pregunta == item_pregunta
                                select new
                                {
                                   a.id_Examen_RM_Det_Preguntas,
                                   a.id_Examen_Rm_Cab,
                                   a.item_pregunta,
                                   a.descripcion_pregunta,
                                   a.puntaje_pregunta,
                                   a.item_alternativa,
                                   a.descripcion_alternativa,
                                   a.es_respuesta
                                }).ToList();
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 8)
                {
                    string[] parametros = filtro.Split('|');

                    Mantenimientos_BL obj_negocios = new Mantenimientos_BL();
                    int id_Examen_RM_Det_Preguntas = Convert.ToInt32(parametros[0].ToString());

                    tbl_Examen_Rm_Det_Preguntas tbl_Examen_Rm_Det_Preguntas = db.tbl_Examen_Rm_Det_Preguntas.Find(id_Examen_RM_Det_Preguntas);

                    try
                    {
                        db.tbl_Examen_Rm_Det_Preguntas.Remove(tbl_Examen_Rm_Det_Preguntas);
                        db.SaveChanges();
                        res.ok = true;
                        res.data = "OK";
                        res.totalpage = 0;
                    }
                    catch (Exception ex)
                    {
                        res.ok = false;
                        res.data = ex.Message;
                        res.totalpage = 0;
                    }

                    resul = res;

                }
                else if (opcion == 9)
                {
                    string[] parametros = filtro.Split('|');

                    Mantenimientos_BL obj_negocios = new Mantenimientos_BL();
                    int idExamenCab = Convert.ToInt32(parametros[0].ToString());
                    int id_usuario = Convert.ToInt32(parametros[1].ToString());

                    res.ok = true;
                    res.data = obj_negocios.set_cerrandoExamen(idExamenCab, id_usuario);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 10)
                {

                    string[] parametros = filtro.Split('|');
                    int id_usuario = Convert.ToInt32(parametros[0].ToString());
                    Mantenimientos_BL obj_negocios = new Mantenimientos_BL();

                    res.ok = true;
                    res.data = obj_negocios.get_preguntasExamen(id_usuario);
                    res.totalpage = 0;
                    resul = res;

                }
                else if (opcion == 11)
                {
                    string[] parametros = filtro.Split('|');

                    Mantenimientos_BL obj_negocios = new Mantenimientos_BL();
                    int id_Examen_Rm_Resolucion_Cab = Convert.ToInt32(parametros[0].ToString());
                    int id_Examen_Rm_Cab = Convert.ToInt32(parametros[1].ToString());
                    int calificacion = Convert.ToInt32(parametros[2].ToString());
                    int id_usuario = Convert.ToInt32(parametros[3].ToString());

                    res.ok = true;
                    res.data = obj_negocios.get_iniciarExamen(id_Examen_Rm_Resolucion_Cab, id_Examen_Rm_Cab, calificacion , id_usuario);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 12)
                {
                    string[] parametros = filtro.Split('|');

                    Mantenimientos_BL obj_negocios = new Mantenimientos_BL();

                    int id_Examen_Rm_Resolucion_Det = Convert.ToInt32(parametros[0].ToString());
                    int id_Examen_Rm_Resolucion_Cab = Convert.ToInt32(parametros[1].ToString());
                    int id_Examen_RM_Det_Preguntas = Convert.ToInt32(parametros[2].ToString());
                    int id_usuario = Convert.ToInt32(parametros[3].ToString());
                    string texto_respuesta =  parametros[4].ToString();

                    res.ok = true;
                    res.data = obj_negocios.set_grabando_respuesExamen(id_Examen_Rm_Resolucion_Det, id_Examen_Rm_Resolucion_Cab, id_Examen_RM_Det_Preguntas, id_usuario, texto_respuesta);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 13)
                {
                    string[] parametros = filtro.Split('|');

                    Mantenimientos_BL obj_negocios = new Mantenimientos_BL();

                    int id_Resolucion_Cab = Convert.ToInt32(parametros[0].ToString());
                    int id_usuario = Convert.ToInt32(parametros[1].ToString());

                    res.ok = true;
                    res.data = obj_negocios.set_tiempoConcluidoExamen(id_Resolucion_Cab, id_usuario);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 14)
                {
                    string[] parametros = filtro.Split('|');

                    Mantenimientos_BL obj_negocios = new Mantenimientos_BL();
                    int idExamenCab = Convert.ToInt32(parametros[0].ToString());
                    int id_usuario = Convert.ToInt32(parametros[1].ToString());

                    res.ok = true;
                    res.data = obj_negocios.set_activandoExamen(idExamenCab, id_usuario);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 15)
                {
                    string[] parametros = filtro.Split('|');

                    Mantenimientos_BL obj_negocios = new Mantenimientos_BL();
                    int id_usuario = Convert.ToInt32(parametros[0].ToString());

                    res.ok = true;
                    res.data = obj_negocios.get_listado_examenes(id_usuario);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 16)
                {
                    string[] parametros = filtro.Split('|');

                    Mantenimientos_BL obj_negocios = new Mantenimientos_BL();
                    int idExamenCab = Convert.ToInt32(parametros[0].ToString());
                    int id_usuario = Convert.ToInt32(parametros[1].ToString());

                    res.ok = true;
                    res.data = obj_negocios.get_listado_representanteMedico(idExamenCab,id_usuario);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 17)
                {

                    string[] parametros = filtro.Split('|');
                    int idExamen = Convert.ToInt32(parametros[0].ToString());
                    int idRepresentanteMedico = Convert.ToInt32(parametros[1].ToString());
                    int idUsuario = Convert.ToInt32(parametros[2].ToString());

                    Mantenimientos_BL obj_negocios = new Mantenimientos_BL();

                    res.ok = true;
                    res.data = obj_negocios.get_preguntasExamen_imprimir(idExamen, idRepresentanteMedico, idUsuario);
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

        public object Posttbl_Examen_Rm_Cab(tbl_Examen_Rm_Cab tbl_Examen_Rm_Cab)
        {
            Resultado res = new Resultado();
            try
            {
                tbl_Examen_Rm_Cab.fecha_creacion = DateTime.Now;
                db.tbl_Examen_Rm_Cab.Add(tbl_Examen_Rm_Cab);
                db.SaveChanges();

                res.ok = true;
                res.data = tbl_Examen_Rm_Cab.id_Examen_Rm_Cab;
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

        public object Puttbl_Examen_Rm_Cab(int id, tbl_Examen_Rm_Cab tbl_Examen_Rm_Cab)
        {
            Resultado res = new Resultado();

            tbl_Examen_Rm_Cab objReemplazar;
            objReemplazar = db.tbl_Examen_Rm_Cab.Where(u => u.id_Examen_Rm_Cab == id).FirstOrDefault<tbl_Examen_Rm_Cab>();

            objReemplazar.nombre_examen_rm_cab = tbl_Examen_Rm_Cab.nombre_examen_rm_cab; 
            objReemplazar.tiempo_examen_rm = tbl_Examen_Rm_Cab.tiempo_examen_rm;
            objReemplazar.fecha_hora_inicio = tbl_Examen_Rm_Cab.fecha_hora_inicio;
            objReemplazar.usuario_edicion = tbl_Examen_Rm_Cab.usuario_creacion;
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

        // DELETE: api/tblExamen_Rm_Cab/5
        [ResponseType(typeof(tbl_Examen_Rm_Cab))]
        public IHttpActionResult Deletetbl_Examen_Rm_Cab(int id)
        {
            tbl_Examen_Rm_Cab tbl_Examen_Rm_Cab = db.tbl_Examen_Rm_Cab.Find(id);
            if (tbl_Examen_Rm_Cab == null)
            {
                return NotFound();
            }

            db.tbl_Examen_Rm_Cab.Remove(tbl_Examen_Rm_Cab);
            db.SaveChanges();

            return Ok(tbl_Examen_Rm_Cab);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_Examen_Rm_CabExists(int id)
        {
            return db.tbl_Examen_Rm_Cab.Count(e => e.id_Examen_Rm_Cab == id) > 0;
        }
    }
}