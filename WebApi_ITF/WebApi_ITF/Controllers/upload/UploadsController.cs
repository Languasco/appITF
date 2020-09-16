using Datos;
using Negocio.Mantenimientos;
using Negocio.Resultados;
using Negocio.upload;
using System;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;

 
namespace WebApi_3R_Dominion.Controllers.upload
{
    [EnableCors("*", "*", "*")]
    public class UploadsController : ApiController
    {
        private ITF_PERUEntities db = new ITF_PERUEntities();

        [HttpPost]
        [Route("api/Uploads/post_archivoExcel")]
        public object post_archivoExcel(string filtros)
        {
            Resultado res = new Resultado();
            var nombreFile = "";
            string sPath = "";

            try
            {
                //--- obteniendo los parametros que vienen por el FormData

                var file = HttpContext.Current.Request.Files["file"];
                //--- obteniendo los parametros que vienen por el FormData
                string extension = Path.GetExtension(file.FileName);

                string[] parametros = filtros.Split('|');
                string fechaImportacion = parametros[0].ToString();
                string idUsuario = parametros[1].ToString();

                //nombreFile = "Impotacion_Excels" + "_" + idUsuario + extension;

                //-----generando clave unica---
                var guid = Guid.NewGuid();
                var guidB = guid.ToString("B");
                nombreFile = idUsuario + "_Importacion_Excel_" + Guid.Parse(guidB) + extension;

                //-------almacenando la archivo---
                sPath = HttpContext.Current.Server.MapPath("~/Archivos/Excel/" + nombreFile);
                //if (System.IO.File.Exists(sPath))
                //{
                //    System.IO.File.Delete(sPath);
                //}
                file.SaveAs(sPath);

                //-------almacenando la archivo---
                if (File.Exists(sPath))
                {
                    Upload_BL obj_negocio = new Upload_BL();
                    string valor = obj_negocio.setAlmacenandoFile_Excel(sPath, file.FileName, fechaImportacion, idUsuario);
                    if (valor == "OK")
                    {
                        res.ok = true;
                        res.data = obj_negocio.get_datosCargados(idUsuario, fechaImportacion);
                        res.totalpage = 0;
                    }
                }
                else
                {
                    res.ok = false;
                    res.data = "No se pudo almacenar el archivo en el servidor";
                    res.totalpage = 0;
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
                res.totalpage = 0;
            }
            return res;
        }


        [HttpPost]
        [Route("api/Uploads/post_imagenUsuario")]
        public object post_imagenUsuario(string filtros)
        {
            Resultado res = new Resultado();
            string nombreFile = "";
            string nombreFileServer = "";
            string path = "";
            string url = ConfigurationManager.AppSettings["imagen"];

            try
            {
                var file = HttpContext.Current.Request.Files["file"];
                string extension = System.IO.Path.GetExtension(file.FileName);
                
                string[] parametros = filtros.Split('|');
                int idUsuario = Convert.ToInt32(parametros[0].ToString());
                int idusuarioLogin = Convert.ToInt32(parametros[1].ToString());


                nombreFile = file.FileName;

                //-----generando clave unica---
                var guid = Guid.NewGuid();
                var guidB = guid.ToString("B");
                nombreFileServer = idUsuario + "_image_user_" + Guid.Parse(guidB) + extension;

                //---almacenando la imagen--
                path = System.Web.Hosting.HostingEnvironment.MapPath("~/Imagen/" + nombreFileServer);
                file.SaveAs(path);
 

                //------suspendemos el hilo, y esperamos ..
                System.Threading.Thread.Sleep(1000);

                if (File.Exists(path))
                {
                    ///----validando que en servidor solo halla una sola foto---
                    tbl_Usuarios object_usuario;
                    object_usuario = db.tbl_Usuarios.Where(p => p.id_Usuario == idUsuario).FirstOrDefault<tbl_Usuarios>();
                    string urlFotoAntes = (string.IsNullOrEmpty(object_usuario.fotourl)) ? "" : object_usuario.fotourl;

                    Usuarios_BL obj_negocio = new Usuarios_BL();
                    obj_negocio.Set_Actualizar_imagenUsuario(idUsuario, nombreFileServer);

                    res.ok = true;
                    res.data = url + nombreFileServer;

                    //---si previamente habia una foto, al reemplazarla borramos la anterior
                    if (urlFotoAntes.Length > 0)
                    {
                        path = System.Web.Hosting.HostingEnvironment.MapPath("~/Imagen/" + urlFotoAntes);

                        if (File.Exists(path))
                        {
                            File.Delete(path);
                        }
                    }
                }
                else
                {
                    res.ok = false;
                    res.data = "No se pudo guardar el archivo en el servidor..";
                }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message;
            }

            return res;
        }



    }
}
