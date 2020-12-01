using Negocio.Procesos;
using Negocio.Resultados;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace WebApi_ITF.Controllers.Procesos
{
    [EnableCors("*", "*", "*")]
    public class RejaPromocionalController : ApiController
    {
        public object GetRejaPromocional(int opcion, string filtro)
        {
            Resultado res = new Resultado();
            object resul = null;
            try
            {
                if (opcion == 1)
                {
                    string[] parametros = filtro.Split('|');

                    int idEspecialidad = Convert.ToInt32(parametros[0].ToString());
                    int idEstado = Convert.ToInt32(parametros[1].ToString());

                    RejaPromocional_BL obj_negocios = new RejaPromocional_BL();
                    resul = obj_negocios.get_mostrarRejaPromocionalCab( idEspecialidad, idEstado);
                }
                else if (opcion == 2)
                {
                    string[] parametros = filtro.Split('|');
                    
                    int idTipoProducto = Convert.ToInt32(parametros[0].ToString());
                    string producto= parametros[1].ToString();
                    int idUsuario = Convert.ToInt32(parametros[2].ToString());

                    RejaPromocional_BL obj_negocios = new RejaPromocional_BL();
                    resul = obj_negocios.get_mostrarProductos_reja(idTipoProducto, producto, idUsuario);
                }

                else if (opcion == 3)
                {
                    string[] parametros = filtro.Split('|');

                    int idRejaCab = Convert.ToInt32(parametros[0].ToString());
                    string descripcionReja = parametros[1].ToString();
                    string objEspecialidad = parametros[2].ToString();
                    string objProducto = parametros[3].ToString();
                    int idUsuario = Convert.ToInt32(parametros[4].ToString());

                    RejaPromocional_BL obj_negocios = new RejaPromocional_BL();

                    res.ok = true;
                    res.data = obj_negocios.Set_insert_update_rejaPromocional(idRejaCab, descripcionReja, objEspecialidad, objProducto, idUsuario);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 4)
                {
                    string[] parametros = filtro.Split('|');
                    int idRejaCab = Convert.ToInt32(parametros[0].ToString());
                    int idUsuario = Convert.ToInt32(parametros[1].ToString());

                    RejaPromocional_BL obj_negocios = new RejaPromocional_BL();
                    res.ok = true;
                    res.data = obj_negocios.get_detalleReja_especialidades(idRejaCab , idUsuario);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 5)
                {
                    string[] parametros = filtro.Split('|');
                    int idRejaCab = Convert.ToInt32(parametros[0].ToString());
                    int idUsuario = Convert.ToInt32(parametros[1].ToString());

                    RejaPromocional_BL obj_negocios = new RejaPromocional_BL();
                    res.ok = true;
                    res.data = obj_negocios.get_detalleReja_productos(idRejaCab, idUsuario);
                    res.totalpage = 0;
                    resul = res;
                }
                else if (opcion == 6)
                {
                    string[] parametros = filtro.Split('|');
                    int idRejaCab = Convert.ToInt32(parametros[0].ToString());
                    int idUsuario = Convert.ToInt32(parametros[1].ToString());

                    RejaPromocional_BL obj_negocios = new RejaPromocional_BL();
                    res.ok = true;
                    res.data = obj_negocios.set_cerrarRejaPromocional(idRejaCab, idUsuario);
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

    }
}
