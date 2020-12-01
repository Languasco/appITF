using Entidades.Procesos;
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

namespace Negocio.Procesos
{
    public class SolicitudDireccion_BL
    {

        public object get_mostrarSolicitudesDireccionCab(int idUsuario, int idEstado)
        {
            Resultado res = new Resultado();
            List<SolicitudDireccion_E> obj_List = new List<SolicitudDireccion_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_SOL_DIRECCION_MEDICO_CAB_LISTAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;
                        cmd.Parameters.Add("@idEstado", SqlDbType.Int).Value = idEstado;


                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                SolicitudDireccion_E Entidad = new SolicitudDireccion_E();

                                Entidad.id_Sol_Medico_Direccion = Convert.ToInt32(dr["id_Sol_Medico_Direccion"].ToString());
                                
                                Entidad.id_Medicos_Direccion = dr["id_Medicos_Direccion"].ToString();
                                Entidad.id_Medico = dr["id_Medico"].ToString();
                                Entidad.medico = dr["medico"].ToString();

                                Entidad.solicitante = dr["solicitante"].ToString();
                                Entidad.fechaSolicitud = dr["fechaSolicitud"].ToString();
                                Entidad.fechaRespuesta = dr["fechaRespuesta"].ToString();
                                Entidad.comentarioRespuesta = dr["comentarioRespuesta"].ToString();

                                Entidad.idEstado = dr["idEstado"].ToString();
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

        public object get_busqueda_medico(int idCategoria, int idEspecialidad, string medico, int idMedico, int idUsuario)
        {
            Resultado res = new Resultado();
            List<AltasBajasTarget_Medico_E> obj_List = new List<AltasBajasTarget_Medico_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_SOL_DIRECCION_MEDICO_COMBO_MEDICO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idCategoria", SqlDbType.Int).Value = idCategoria;
                        cmd.Parameters.Add("@idEspecialidad", SqlDbType.Int).Value = idEspecialidad;
                        cmd.Parameters.Add("@medico", SqlDbType.VarChar).Value = medico;
                        cmd.Parameters.Add("@idMedico", SqlDbType.Int).Value = idMedico;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;

                        using (SqlDataReader dr = cmd.ExecuteReader())
                        {
                            while (dr.Read())
                            {
                                AltasBajasTarget_Medico_E Entidad = new AltasBajasTarget_Medico_E();

                                Entidad.id_Medico = Convert.ToInt32(dr["id_Medico"].ToString());
                                Entidad.datosMedico = dr["datosMedico"].ToString(); 
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
                     
        public DataTable get_datosEnviosCorreo_solicitudDireccionMedico(int idSolMedico_Direccion, int idusuario)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_SOL_DIRECCION_MEDICO_ENVIAR_CORREO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idSolMedico_Direccion", SqlDbType.Int).Value = idSolMedico_Direccion;
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

        public void set_envioCorreo_solicitudDireccionMedico(int idSolMedico_Direccion, int idusuario)
        {
            DataTable dt_detalleMail = new DataTable();
            try
            {
                ///---obtenere la informacion para el llenado del correo ---
                dt_detalleMail = get_datosEnviosCorreo_solicitudDireccionMedico(idSolMedico_Direccion, idusuario);

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



        public string set_aprobarRechazar_direccioMedico(int idSolMedico_Direccion, string descripcion, string proceso, int id_usuario)
        {
            string res = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_APROBAR_SOL_DIRECCION_MEDICO_GRABAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idSolMedico_Direccion", SqlDbType.Int).Value = idSolMedico_Direccion;
                        cmd.Parameters.Add("@descripcion", SqlDbType.VarChar).Value = descripcion;
                        cmd.Parameters.Add("@proceso", SqlDbType.VarChar).Value = proceso;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = id_usuario;
                        cmd.ExecuteNonQuery();

                        set_envioCorreo_AprobarSolicitudDireccionMedico(idSolMedico_Direccion, id_usuario);

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


        public void set_envioCorreo_AprobarSolicitudDireccionMedico(int idSolMedico_Direccion, int idusuario)
        {
            DataTable dt_detalleMail = new DataTable();
            try
            {
                ///---obtenere la informacion para el llenado del correo ---
                dt_detalleMail = get_datosEnviosCorreo_aprobarSolicitudDireccionMedico(idSolMedico_Direccion, idusuario);

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


        public DataTable get_datosEnviosCorreo_aprobarSolicitudDireccionMedico(int idSolMedico_Direccion, int idusuario)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_APROBAR_SOL_DIRECCION_MEDICO_ENVIAR_CORREO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idSolMedico_Direccion", SqlDbType.Int).Value = idSolMedico_Direccion;
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




    }
}
