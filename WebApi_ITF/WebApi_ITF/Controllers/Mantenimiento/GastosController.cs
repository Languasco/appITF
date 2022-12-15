using Datos;
using Negocio.Mantenimientos;
using Negocio.RestClient;
using Negocio.Resultados;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Web.Http;
using System.Web.Http.Cors;

namespace WebApi_ITF.Controllers.Mantenimiento
{
    [EnableCors("*", "*", "*")]
    public class GastosController : ApiController
    {
        private ITF_PERUEntities db = new ITF_PERUEntities();

        public object GetGastos(int opcion, string filtro)
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
                    res.data = obj_negocios.get_conceptosGastos(idEstado);
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');
                    int idConceptosGastos = Convert.ToInt32(parametros[0].ToString());

                    tbl_Conceptos_Gastos objReemplazar;
                    objReemplazar = db.tbl_Conceptos_Gastos.Where(u => u.id_conceptos_gastos == idConceptosGastos).FirstOrDefault<tbl_Conceptos_Gastos>();
                    objReemplazar.estado = 2;

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
                    string mesAnio =  parametros[0].ToString();
                    int idUsuario = Convert.ToInt32(parametros[1].ToString());

                    Mantenimientos_BL obj_negocios = new Mantenimientos_BL();

                    res.ok = true;
                    res.data = obj_negocios.get_Gastos(mesAnio, idUsuario);
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 4)
                {
                    string[] parametros = filtro.Split('|');
                    int idUsuario = Convert.ToInt32(parametros[0].ToString());

                    Mantenimientos_BL obj_negocios = new Mantenimientos_BL();

                    res.ok = true;
                    res.data = obj_negocios.get_usuariosGastos(idUsuario);
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 5)
                {
                    string[] parametros = filtro.Split('|');
                    string ruc = parametros[0].ToString();

                    Mantenimientos_BL obj_negocios = new Mantenimientos_BL();

                    res.ok = true;
                    res.data = obj_negocios.get_cosultaRucGastos(ruc);
                    res.totalpage = 0;

                    resul = res;
                }

                else if (opcion == 6)
                {
                    Mantenimientos_BL obj_negocios = new Mantenimientos_BL();
                    res.ok = true;
                    res.data = obj_negocios.get_conceptoGastos_combo();
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 7)
                {
                    Mantenimientos_BL obj_negocios = new Mantenimientos_BL();
                    res.ok = true;
                    res.data = obj_negocios.get_tipoComprobante_combo();
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 8)
                {
                    Mantenimientos_BL obj_negocios = new Mantenimientos_BL();
                    res.ok = true;
                    res.data = obj_negocios.get_monedas_combo();
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 9)
                {
                    string[] parametros = filtro.Split('|');
                    int id_gastos = Convert.ToInt32(parametros[0].ToString());

                    tbl_Gastos objReemplazar;
                    objReemplazar = db.tbl_Gastos.Where(u => u.id_gastos == id_gastos).FirstOrDefault<tbl_Gastos>();
                    objReemplazar.estado = 2;

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
                else if (opcion == 10)
                {
                    string[] parametros = filtro.Split('|');
                    string mesAnio = parametros[0].ToString();
                    int idUsuario = Convert.ToInt32(parametros[1].ToString());
                    int TipoReporte = Convert.ToInt32(parametros[2].ToString());

                    Mantenimientos_BL obj_negocios = new Mantenimientos_BL();

                    res.ok = true;
                    res.data = obj_negocios.get_reporteGastos(mesAnio, idUsuario, TipoReporte);
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 11)
                {
                    Mantenimientos_BL obj_negocios = new Mantenimientos_BL();
                    res.ok = true;
                    res.data = obj_negocios.get_fechasCiclos();
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 12)
                {
                    string[] parametros = filtro.Split('|');
                    string usuario = parametros[0].ToString();
                    string fecha_gastos = parametros[1].ToString();
                    string id_concepto_gastos = parametros[2].ToString();
                    string total = parametros[3].ToString();

                    Mantenimientos_BL obj_negocios = new Mantenimientos_BL();
                    res.ok = true;
                    res.data = obj_negocios.get_verificarPresupuesto(usuario, fecha_gastos, id_concepto_gastos, total);
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 13)
                {
                    string[] parametros = filtro.Split('|');
                    string mesAnio = parametros[0].ToString();
                    int idUsuario = Convert.ToInt32(parametros[1].ToString());

                    Mantenimientos_BL obj_negocios = new Mantenimientos_BL();
                    resul = obj_negocios.GenerarReporte_grillaGastos(mesAnio, idUsuario);
                }
                else if (opcion == 14)
                {
                    Mantenimientos_BL obj_negocios = new Mantenimientos_BL();
                    res.ok = true;
                    res.data = obj_negocios.get_fechasCiclos_Gastos();
                    res.totalpage = 0;

                    resul = res;
                }
                else if (opcion == 15)
                {
                    string[] parametros = filtro.Split('|');
                    string nroRuc = parametros[0].ToString();
                    nroRuc = "20601473403";

                    ApiPeru obj_apiPeru = new ApiPeru();
                    obj_apiPeru.endPoint = "https://apiperu.dev/api/ruc/" + nroRuc;
                    resul = obj_apiPeru.getConsultarRuc();
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


        [HttpPost]
        [Route("api/Gastos/Posttbl_Conceptos_Gastos")]
        public object Posttbl_Conceptos_Gastos(tbl_Conceptos_Gastos tbl_Conceptos_Gastos)
        {
            Resultado res = new Resultado();
            try
            {
                tbl_Conceptos_Gastos.fecha_creacion = DateTime.Now;
                db.tbl_Conceptos_Gastos.Add(tbl_Conceptos_Gastos);
                db.SaveChanges();

                res.ok = true;
                res.data = tbl_Conceptos_Gastos.id_conceptos_gastos;
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

        [HttpPut]
        [Route("api/Gastos/Puttbl_Conceptos_Gastos")]
        public object Puttbl_Conceptos_Gastos(int id, tbl_Conceptos_Gastos tbl_Conceptos_Gastos)
        {
            Resultado res = new Resultado();

            tbl_Conceptos_Gastos objReemplazar;
            objReemplazar = db.tbl_Conceptos_Gastos.Where(u => u.id_conceptos_gastos == id).FirstOrDefault<tbl_Conceptos_Gastos>();

            objReemplazar.descripcion_conceptos_gastos = tbl_Conceptos_Gastos.descripcion_conceptos_gastos;
            objReemplazar.cuenta_contable = tbl_Conceptos_Gastos.cuenta_contable;
            objReemplazar.requiere_imagen = tbl_Conceptos_Gastos.requiere_imagen;
            objReemplazar.estado = tbl_Conceptos_Gastos.estado;
            objReemplazar.usuario_edicion = tbl_Conceptos_Gastos.usuario_creacion;
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



        [HttpPost]
        [Route("api/Gastos/Posttbl_Gastos")]
        public object Posttbl_Gastos(tbl_Gastos tbl_Gastos)
        {
            Resultado res = new Resultado();
            try
            {
                tbl_Gastos.fecha_creacion = DateTime.Now;
                db.tbl_Gastos.Add(tbl_Gastos);
                db.SaveChanges();

                //----enviando informacion al procedimiento almacenado --
                Thread.Sleep(1000);
                Mantenimientos_BL obj_negocio = new Mantenimientos_BL();
                obj_negocio.set_gastos_insertUpdate(Convert.ToInt32(tbl_Gastos.id_gastos), Convert.ToInt32(tbl_Gastos.usuario_creacion), "I");

                res.ok = true;
                res.data = tbl_Gastos.id_gastos;
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



        [HttpPut]
        [Route("api/Gastos/Puttbl_Gastos")]
        public object Puttbl_Gastos(int id, tbl_Gastos tbl_Gastos)
        {
            Resultado res = new Resultado();

            tbl_Gastos objReemplazar;
            objReemplazar = db.tbl_Gastos.Where(u => u.id_gastos == id).FirstOrDefault<tbl_Gastos>();

            objReemplazar.fecha_gastos = tbl_Gastos.fecha_gastos;
            objReemplazar.ruc = tbl_Gastos.ruc;
            objReemplazar.razon_social = tbl_Gastos.razon_social;            
            objReemplazar.id_concepto_gastos = tbl_Gastos.id_concepto_gastos;
            objReemplazar.id_tipo_documento = tbl_Gastos.id_tipo_documento;
            objReemplazar.serie_documento = tbl_Gastos.serie_documento;
            objReemplazar.numero_documento = tbl_Gastos.numero_documento;
            objReemplazar.id_moneda = tbl_Gastos.id_moneda;
            objReemplazar.total = tbl_Gastos.total;
            objReemplazar.observaciones = tbl_Gastos.observaciones;
            objReemplazar.estado = tbl_Gastos.estado;
            objReemplazar.usuario_edicion = tbl_Gastos.usuario_creacion;
            objReemplazar.fecha_edicion = DateTime.Now;

            db.Entry(objReemplazar).State = EntityState.Modified;

            try
            {
                db.SaveChanges();

                //----enviando informacion al procedimiento almacenado --
                Thread.Sleep(1000);
                Mantenimientos_BL obj_negocio = new Mantenimientos_BL();
                obj_negocio.set_gastos_insertUpdate(Convert.ToInt32(tbl_Gastos.id_gastos), Convert.ToInt32(tbl_Gastos.usuario_creacion), "U");

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




    }
}
