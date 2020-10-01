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

namespace WebApi_ITF.Controllers.Procesos
{
    [EnableCors("*", "*", "*")]
    public class tblStockController : ApiController
    {
        private ITF_PERUEntities db = new ITF_PERUEntities();

        // GET: api/tblStock
        public IQueryable<tbl_Stock> Gettbl_Stock()
        {
            return db.tbl_Stock;
        }


        // GET: api/tblTiposProductos
        public IQueryable<tbl_Stock> Getbl_Stock()
        {
            return db.tbl_Stock;
        }

        public object Gettbl_Stock(int opcion, string filtro)
        {
            Resultado res = new Resultado();
            object resul = null;
            try
            {
                if (opcion == 1)
                {
                    string[] parametros = filtro.Split('|');

                    int idUsuario = Convert.ToInt32(parametros[0].ToString());
                    int idCiclo = Convert.ToInt32(parametros[1].ToString());
                    string producto = parametros[2].ToString();

                    AsignacionProducto_BL obj_negocios = new AsignacionProducto_BL();
                    resul = obj_negocios.get_asignacionProducto_Cab(idUsuario, idCiclo, producto);
                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');
                    int idUsuario = Convert.ToInt32(parametros[0].ToString());

                    Mantenimientos_BL obj_negocios = new Mantenimientos_BL();

                    res.ok = true;
                    res.data = obj_negocios.get_usuariosGeneral(idUsuario);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 3)
                {
                    Mantenimientos_BL obj_negocios = new Mantenimientos_BL();

                    res.ok = true;
                    res.data = obj_negocios.get_productosGeneral();
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 4)
                {
                    string[] parametros = filtro.Split('|');
                    int idUsuario = Convert.ToInt32(parametros[0].ToString());

                    Mantenimientos_BL obj_negocio = new Mantenimientos_BL();

                    res.ok = true;
                    res.data = obj_negocio.set_grabar_ImportacionStock(idUsuario);
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

        public object Posttbl_Stock(tbl_Stock tbl_Stock)
        {
            Resultado res = new Resultado();
            try
            {

                tbl_Stock.fecha_stock = DateTime.Now;
                tbl_Stock.fecha_creacion = DateTime.Now;
                db.tbl_Stock.Add(tbl_Stock);
                db.SaveChanges();

                res.ok = true;
                res.data = (from a in db.tbl_Stock
                            join b in db.tbl_Ciclos on a.id_Ciclo equals b.id_Ciclo
                            join c in db.tbl_Usuarios on a.id_Usuario equals c.id_Usuario
                            join d in db.tbl_Productos on a.id_Producto equals d.id_Producto
                            where a.id_Stock == tbl_Stock.id_Stock
                            select new
                            {
                                a.id_Stock,
                                a.id_Ciclo,
                                descripcionCiclo = b.nombre_ciclo,
                                a.id_Usuario ,
                                codigoUsuario = c.id_Usuario,
                                descripcionUsuario = c.apellido_materno_usuario + " " + c.apellido_paterno_usuario + " " + c.nombres_usuario,
                                a.id_Producto,
                                codigoProducto = d.codigo_producto ,
                                descripcionProducto = d.descripcion_producto,
                                a.cantidad_stock,
                                a.lote_stock,
                                a.fecha_stock
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

        public object Puttbl_Stock(int id, tbl_Stock tbl_Stock)
        {
            Resultado res = new Resultado();

            tbl_Stock objReemplazar;
            objReemplazar = db.tbl_Stock.Where(u => u.id_Stock == id).FirstOrDefault<tbl_Stock>();

            objReemplazar.id_Ciclo = tbl_Stock.id_Ciclo;
            objReemplazar.id_Producto = tbl_Stock.id_Producto;
            objReemplazar.id_Usuario = tbl_Stock.id_Usuario;
            objReemplazar.cantidad_stock = tbl_Stock.cantidad_stock;
            objReemplazar.lote_stock = tbl_Stock.lote_stock;
            //objReemplazar.fecha_stock = tbl_Stock.fecha_stock;
            //objReemplazar.nombre_archivo_stock = tbl_Stock.nombre_archivo_stock;

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


        // DELETE: api/tblStock/5
        [ResponseType(typeof(tbl_Stock))]
        public IHttpActionResult Deletetbl_Stock(int id)
        {
            tbl_Stock tbl_Stock = db.tbl_Stock.Find(id);
            if (tbl_Stock == null)
            {
                return NotFound();
            }

            db.tbl_Stock.Remove(tbl_Stock);
            db.SaveChanges();

            return Ok(tbl_Stock);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool tbl_StockExists(int id)
        {
            return db.tbl_Stock.Count(e => e.id_Stock == id) > 0;
        }
    }
}