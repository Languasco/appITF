using Entidades.Mantenimientos;
using Negocio.Conexion;
using Negocio.Resultados;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace Negocio.Mantenimientos
{
    public class Mantenimientos_BL
    {
        public DataTable get_feriados(int idEstado)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_MANT_LISTA_FERIADO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_estado", SqlDbType.VarChar).Value = idEstado;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }
                }
                return dt_detalle;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public object get_productos(string producto, int tipoProducto, int idEstado)
        {
            Resultado res = new Resultado();
            List<Productos_E> obj_List = new List<Productos_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_MANT_LISTA_PRODUCTO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@producto", SqlDbType.VarChar).Value = producto;
                        cmd.Parameters.Add("@tipoProducto", SqlDbType.Int).Value = tipoProducto;
                        cmd.Parameters.Add("@id_estado", SqlDbType.Int).Value = idEstado;

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                Productos_E Entidad = new Productos_E();

                                Entidad.id_Producto = dr["id_Producto"].ToString();
                                Entidad.codigo_producto = dr["codigo_producto"].ToString();
                                Entidad.descripcion_producto = dr["descripcion_producto"].ToString();
                                Entidad.id_Tipo_Produto = dr["id_Tipo_Produto"].ToString();

                                Entidad.descripcionTipoProducto = dr["descripcionTipoProducto"].ToString();
                                Entidad.abreviatura_producto = dr["abreviatura_producto"].ToString();
                                Entidad.estado = dr["estado"].ToString();
                                Entidad.id_Control_Stock = dr["id_Control_Stock"].ToString();
                                Entidad.descripcion_estado = dr["descripcion_estado"].ToString();

                                obj_List.Add(Entidad);
                            }

                            res.ok = true;
                            res.data = obj_List;
                            res.totalpage = 0;
                        }

                    }
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

        public object get_medicos(string cmp, string medico, string email, int categoria, int especialidad, int  profesional, int idEstado)
        {
            Resultado res = new Resultado();
            List<Medicos_E> obj_List = new List<Medicos_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_MANT_LISTA_MEDICOS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@cmp", SqlDbType.VarChar).Value = cmp;
                        cmd.Parameters.Add("@medico", SqlDbType.VarChar).Value = medico;
                        cmd.Parameters.Add("@email", SqlDbType.VarChar).Value = email;

                        cmd.Parameters.Add("@idCategoria", SqlDbType.Int).Value = categoria;
                        cmd.Parameters.Add("@idEspecialidad", SqlDbType.Int).Value = especialidad;
                        cmd.Parameters.Add("@idProfesion", SqlDbType.Int).Value = profesional;
                        cmd.Parameters.Add("@idEstado", SqlDbType.Int).Value = idEstado;

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                Medicos_E Entidad = new Medicos_E();

                                Entidad.id_Medico = dr["id_Medico"].ToString();
                                Entidad.id_Identificador_Medico = dr["id_Identificador_Medico"].ToString();
                                Entidad.descripcion_identificador_medico = dr["descripcion_identificador_medico"].ToString();
                                Entidad.cmp_medico = dr["cmp_medico"].ToString();
                                Entidad.nombres_medico = dr["nombres_medico"].ToString();
                                Entidad.apellido_paterno_medico = dr["apellido_paterno_medico"].ToString();
                                Entidad.apellido_materno_medico = dr["apellido_materno_medico"].ToString();

                                Entidad.id_Categoria = dr["id_Categoria"].ToString();
                                Entidad.codigo_categoria = dr["codigo_categoria"].ToString();
                                Entidad.id_Especialidad1 = dr["id_Especialidad1"].ToString();
                                Entidad.codigo_especialidad = dr["codigo_especialidad"].ToString();
                                Entidad.id_Especialidad2 = dr["id_Especialidad2"].ToString();
                                Entidad.email_medico = dr["email_medico"].ToString();

                                Entidad.fecha_nacimiento_medico = dr["fecha_nacimiento_medico"].ToString();
                                Entidad.fechaNacimientoMedico = Convert.ToDateTime( dr["fechaNacimientoMedico"].ToString());
                                
                                Entidad.sexo_medico = dr["sexo_medico"].ToString();
                                Entidad.telefono_medico = dr["telefono_medico"].ToString();
                                Entidad.estado = dr["estado"].ToString();
                                Entidad.descripcion_estado = dr["descripcion_estado"].ToString();
                                

                                obj_List.Add(Entidad);
                            }

                            res.ok = true;
                            res.data = obj_List;
                            res.totalpage = 0;
                        }

                    }
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

        public DataTable get_direccionesMedicos(int idMedico)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_MANT_LISTA_MEDICOS_DIRECCIONES", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idMedico", SqlDbType.VarChar).Value = idMedico;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }
                }
                return dt_detalle;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public DataTable get_departamentos()
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_MANT_LISTA_DEPARTAMENTOS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }
                }
                return dt_detalle;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public DataTable get_provincias(string codDepartamento)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_MANT_LISTA_PROVINCIAS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@CODIGO_DEPARTAMENTO", SqlDbType.VarChar).Value = codDepartamento;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }
                }
                return dt_detalle;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public DataTable get_distritos(string codDepartamento, string codProvincia)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_MANT_LISTA_DISTRITOS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@CODIGO_DEPARTAMENTO", SqlDbType.VarChar).Value = codDepartamento;
                        cmd.Parameters.Add("@CODIGO_PROVINCIA", SqlDbType.VarChar).Value = codProvincia;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }
                }
                return dt_detalle;
            }
            catch (Exception)
            {
                throw;
            }
        }
        
        public object get_actividades(int idUsuario, int idCiclo, int idEstado)
        {
            Resultado res = new Resultado();
            List<Actividades_E> obj_List = new List<Actividades_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_MANT_LISTA_ACTIVIDADES", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;
                        cmd.Parameters.Add("@idCiclo", SqlDbType.Int).Value = idCiclo;
                        cmd.Parameters.Add("@idEstado", SqlDbType.Int).Value = idEstado;

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                Actividades_E Entidad = new Actividades_E();

                                Entidad.id_actividad = dr["id_actividad"].ToString();
                                Entidad.id_Ciclo = dr["id_Ciclo"].ToString();
                                Entidad.fecha_actividad = Convert.ToDateTime(dr["fecha_actividad"]);
                                Entidad.fecha = dr["fecha"].ToString();
                                Entidad.id_Duracion = dr["id_Duracion"].ToString();
                                Entidad.descripcionDuracion = dr["descripcionDuracion"].ToString();
                                Entidad.detalle_actividad = dr["detalle_actividad"].ToString();
                                Entidad.estado = dr["estado"].ToString();
                                Entidad.descripcionEstado = dr["descripcionEstado"].ToString();
                                Entidad.Aprobador = dr["Aprobador"].ToString();
                                Entidad.observacion = dr["observacion"].ToString();
                                Entidad.usuario = dr["usuario"].ToString();

                                obj_List.Add(Entidad);
                            }

                            res.ok = true;
                            res.data = obj_List;
                            res.totalpage = 0;
                        }

                    }
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
        
        public DataTable get_usuarios(int idUsuario)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_MANT_ACTIVIDADES_LISTA_USUARIOS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.VarChar).Value = idUsuario;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }
                }
                return dt_detalle;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public DataTable get_usuariosGeneral(int idUsuario)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_ASIGNACION_PRODUCTO_LISTA_USUARIOS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.VarChar).Value = idUsuario;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }
                }
                return dt_detalle;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public DataTable get_productosGeneral()
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_ASIGNACION_PRODUCTO_LISTA_PRODUCTOS", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }
                }
                return dt_detalle;
            }
            catch (Exception)
            {
                throw;
            }
        }


        //---------------APROBAR O RECHAZAR ACTIVIDADES
        //---------------------------------------------

        public object get_actividadesAprobarRechazar(int idUsuario , string fechaIni,string fechaFin, int idEstado)
        {
            Resultado res = new Resultado();
            List<AprobarActividades_E> obj_List = new List<AprobarActividades_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_APROBAR_ACTIVIDADES_LISTAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;
                        cmd.Parameters.Add("@fechaIni", SqlDbType.VarChar).Value = fechaIni;
                        cmd.Parameters.Add("@fechaFin", SqlDbType.VarChar).Value = fechaFin;
                        cmd.Parameters.Add("@idEstado", SqlDbType.Int).Value = idEstado;

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                AprobarActividades_E Entidad = new AprobarActividades_E();

                                Entidad.id_actividad = Convert.ToInt32(dr["id_actividad"].ToString());
                                Entidad.ciclo = dr["ciclo"].ToString();
                                Entidad.solicitante = dr["solicitante"].ToString();
                                Entidad.duracion = dr["duracion"].ToString();
                                Entidad.fechaSolicitud = dr["fechaSolicitud"].ToString();
                                Entidad.descripcionSolicitud = dr["descripcionSolicitud"].ToString();                              
                                
                                Entidad.aprobadorRechazador = dr["aprobadorRechazador"].ToString();
                                Entidad.usuario_aprobador_actividad = dr["usuario_aprobador_actividad"].ToString();
                                Entidad.fechaRespuesta = dr["fechaRespuesta"].ToString();
                                Entidad.id_estado = dr["id_estado"].ToString();
                                Entidad.descripcionRespuesta = dr["descripcionRespuesta"].ToString();
                                Entidad.descripcionEstado = dr["descripcionEstado"].ToString();
                                obj_List.Add(Entidad);
                            }

                            res.ok = true;
                            res.data = obj_List;
                            res.totalpage = 0;
                        }

                    }
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

        public string set_aprobarRechazar(int id_actividad, string descripcion, string proceso, int id_usuario)
        {
            string res = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_APROBAR_ACTIVIDADES_GRABAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_actividad", SqlDbType.Int).Value = id_actividad;
                        cmd.Parameters.Add("@descripcion", SqlDbType.VarChar).Value = descripcion;
                        cmd.Parameters.Add("@proceso", SqlDbType.VarChar).Value = proceso;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = id_usuario;
                        cmd.ExecuteNonQuery();
                        //-----envio de correo al aprobar o rechazar ---
                        set_envioCorreo_aprobarActividad(id_actividad, proceso, id_usuario);

                        res = "OK";
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
            return res;
        }
        
        public string set_grabar_ImportacionMedicos(int id_usuario)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_MANT_MEDICO_TEMPORAL_MEDICOS_GRABAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.VarChar).Value = id_usuario;

                        cmd.ExecuteNonQuery();
                        resultado = "OK";
                    }
                }
            }
            catch (Exception e)
            {
                resultado = e.Message;
            }
            return resultado;
        }

        /// <summary>
        /// ---- ENVIO DE CORREO CUANDO SE GENERA UNA NUEVA ACTIVIDAD ---
 
        public DataTable get_datosEnviosCorreo_actividad(int idActividad, int idusuario)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_ACTIVIDADES_ENVIAR_CORREO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idActividad", SqlDbType.Int).Value = idActividad;
                        cmd.Parameters.Add("@idusuario", SqlDbType.Int).Value = idusuario;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }
                }
                return dt_detalle;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public void set_envioCorreo_actividad(int idActividad, int idusuario)
        {
            DataTable dt_detalleMail = new DataTable();
            try
            {
                ///---obtenere la informacion para el llenado del correo ---
                dt_detalleMail = get_datosEnviosCorreo_actividad(idActividad, idusuario);

                if (dt_detalleMail.Rows.Count > 0)
                {
                    if (dt_detalleMail.Rows[0]["destinatario"].ToString().Length > 0)
                    {
                        var message = new MailMessage();
                        message.From = new MailAddress(dt_detalleMail.Rows[0]["remitente"].ToString());
                        message.To.Add(new MailAddress(dt_detalleMail.Rows[0]["destinatario"].ToString()));
                        message.Subject = dt_detalleMail.Rows[0]["asunto"].ToString();
                        message.Body = dt_detalleMail.Rows[0]["cuerpoMensaje"].ToString();
                        message.IsBodyHtml = true;
                        message.Priority = MailPriority.Normal;

                        //---agregando la copia del correo 
                        if (dt_detalleMail.Rows[0]["copiaDestinatario"].ToString().Length > 0)
                        {
                            message.CC.Add(new MailAddress(dt_detalleMail.Rows[0]["copiaDestinatario"].ToString()));
                        }
                        using (var smtp = new SmtpClient())
                        {
                            smtp.EnableSsl = true;
                            smtp.UseDefaultCredentials = false;

                            var credential = new NetworkCredential(dt_detalleMail.Rows[0]["remitente"].ToString(), dt_detalleMail.Rows[0]["remitentePass"].ToString());
                            smtp.Credentials = credential;
                            smtp.Host = "smtp.gmail.com";
                            smtp.Port = 587;
                            smtp.Send(message);
                        }
                    }
                    else
                    {
                        throw new System.ArgumentException("Error al envio de correo no hay correo de destinatario");
                    }
                }
                else
                {
                    throw new System.ArgumentException("Error al envio de correo no hay informacion para enviar");
                }
            }
            catch (Exception)
            {
                throw;
            }
        }


        /// ---- ENVIO DE CORREO CUANDO SE GENERA LA APROBACION DE UNA ACTIVIDAD ---

        public DataTable get_datosEnviosCorreo_aprobarActividad(int idActividad, string procesos, int idusuario)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_APROBAR_ACTIVIDADES_ENVIAR_CORREO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idActividad", SqlDbType.Int).Value = idActividad;
                        cmd.Parameters.Add("@proceso", SqlDbType.VarChar).Value = procesos;
                        cmd.Parameters.Add("@idusuario", SqlDbType.Int).Value = idusuario;

                        using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(dt_detalle);
                        }
                    }
                }
                return dt_detalle;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public void set_envioCorreo_aprobarActividad(int idActividad, string procesos , int idusuario)
        {
            DataTable dt_detalleMail = new DataTable();
            try
            {
                ///---obtenere la informacion para el llenado del correo ---
                dt_detalleMail = get_datosEnviosCorreo_aprobarActividad(idActividad, procesos, idusuario);

                if (dt_detalleMail.Rows.Count > 0)
                {
                    if (dt_detalleMail.Rows[0]["destinatario"].ToString().Length > 0)
                    {
                        var message = new MailMessage();
                        message.From = new MailAddress(dt_detalleMail.Rows[0]["remitente"].ToString());
                        message.To.Add(new MailAddress(dt_detalleMail.Rows[0]["destinatario"].ToString()));
                        message.Subject = dt_detalleMail.Rows[0]["asunto"].ToString();
                        message.Body = dt_detalleMail.Rows[0]["cuerpoMensaje"].ToString();
                        message.IsBodyHtml = true;
                        message.Priority = MailPriority.Normal;

                        //---agregando la copia del correo 
                        if (dt_detalleMail.Rows[0]["copiaDestinatario"].ToString().Length > 0)
                        {
                            message.CC.Add(new MailAddress(dt_detalleMail.Rows[0]["copiaDestinatario"].ToString()));
                        }
                        using (var smtp = new SmtpClient())
                        {
                            smtp.EnableSsl = true;
                            smtp.UseDefaultCredentials = false;

                            var credential = new NetworkCredential(dt_detalleMail.Rows[0]["remitente"].ToString(), dt_detalleMail.Rows[0]["remitentePass"].ToString());
                            smtp.Credentials = credential;
                            smtp.Host = "smtp.gmail.com";
                            smtp.Port = 587;
                            smtp.Send(message);
                        }
                    }
                    else
                    {
                        throw new System.ArgumentException("Error al envio de correo no hay correo de destinatario");
                    }
                }
                else
                {
                    throw new System.ArgumentException("Error al envio de correo no hay informacion para enviar");
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public string set_grabar_ImportacionStock(int id_usuario, string fechaAsignacion)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_ASIGNACION_PRODUCTO_TEMPORAL_STOCK_GRABAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = id_usuario;
                        cmd.Parameters.Add("@fecha_Asignacion", SqlDbType.VarChar).Value = fechaAsignacion;

                        cmd.ExecuteNonQuery();
                        resultado = "OK";
                    }
                }
            }
            catch (Exception e)
            {
                resultado = e.Message;
            }
            return resultado;
        }

    }
}
