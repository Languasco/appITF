using Entidades.Procesos;
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

namespace Negocio.Procesos
{
    public class SolicitudesCab_BL
    {
        public object get_solicitudesMedicos_cab(int idUsuario, string fechaIni, string fechaFin, int idEstado)
        {
            Resultado res = new Resultado();
            List<SolicitudCab_E> obj_List = new List<SolicitudCab_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_SOLICITUD_MEDICO_CAB_LISTAR", cn))
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
                                SolicitudCab_E Entidad = new SolicitudCab_E();

                                Entidad.id_Sol_Medico_cab = Convert.ToInt32(dr["id_Sol_Medico_cab"].ToString());
                                Entidad.solicitante = dr["solicitante"].ToString();
                                Entidad.fechaSolicitudFormateado = dr["fechaSolicitudFormateado"].ToString();
                                Entidad.fechaSolicitud = Convert.ToDateTime(dr["fechaSolicitud"].ToString());
                                Entidad.medico =dr["medico"].ToString();

                                Entidad.descripcionSolicitud = dr["descripcionSolicitud"].ToString();
                                Entidad.fechaRespuesta = dr["fechaRespuesta"].ToString();
                                Entidad.comentarioRespuesta = dr["comentarioRespuesta"].ToString();
                                Entidad.id_estado = dr["id_estado"].ToString();
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
        
        public DataTable get_solicitudDetalle(int idSolCab)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_SOLICITUD_MEDICO_DET_LISTAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idSolCab", SqlDbType.VarChar).Value = idSolCab;

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

        public string set_eliminar_solicitudDetalle_det(int idMedico, int idSolDet)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_SOLICITUD_MEDICO_DET_ELIMINAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idMedico", SqlDbType.Int).Value = idMedico;
                        cmd.Parameters.Add("@idSolDet", SqlDbType.Int).Value = idSolDet;

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

        public string set_enviarSolicitudMedico(int idSolCab, int idUsuario)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_SOLICITUD_MEDICO_ENVIAR_SOLICITUD", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idSolCab", SqlDbType.Int).Value = idSolCab;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;
                        cmd.ExecuteNonQuery();

                        set_envioCorreo_solicitudMedico(idSolCab, idUsuario);


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

        public DataTable get_datosEnviosCorreo_solicitudMedico(int idSolCab, int idusuario)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_SOLICITUD_MEDICO_ENVIAR_CORREO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idSolCab", SqlDbType.Int).Value = idSolCab;
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

        public void set_envioCorreo_solicitudMedico(int idSolCab, int idusuario)
        {
            DataTable dt_detalleMail = new DataTable();
            try
            {
                ///---obtenere la informacion para el llenado del correo ---
                dt_detalleMail = get_datosEnviosCorreo_solicitudMedico(idSolCab, idusuario);

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

        public object get_aprobarSolicitudesMedicos_cab(int idUsuario, string fechaIni, string fechaFin, int idEstado)
        {
            Resultado res = new Resultado();
            List<SolicitudCab_E> obj_List = new List<SolicitudCab_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_APROBAR_SOLICITUD_MEDICO_CAB_LISTAR", cn))
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
                                SolicitudCab_E Entidad = new SolicitudCab_E();

                                Entidad.id_Sol_Medico_cab = Convert.ToInt32(dr["id_Sol_Medico_cab"].ToString());
                                Entidad.solicitante = dr["solicitante"].ToString();
                                Entidad.fechaSolicitudFormateado = dr["fechaSolicitudFormateado"].ToString();
                                Entidad.fechaSolicitud = Convert.ToDateTime(dr["fechaSolicitud"].ToString());
                                Entidad.medico = dr["medico"].ToString();

                                Entidad.descripcionSolicitud = dr["descripcionSolicitud"].ToString();
                                Entidad.fechaRespuesta = dr["fechaRespuesta"].ToString();
                                Entidad.comentarioRespuesta = dr["comentarioRespuesta"].ToString();
                                Entidad.id_estado = dr["id_estado"].ToString();
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

        public string set_descartarSolicitudMedico(int idSolCab, int idUsuario)
        {
            string resultado = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_SOLICITUD_MEDICO_DESCARTAR_SOLICITUD", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idSolCab", SqlDbType.Int).Value = idSolCab;
                        cmd.Parameters.Add("@idUsuario", SqlDbType.Int).Value = idUsuario;
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

        //APROBACIONES 

        public DataTable get_aprobacionSolicitudDetalle(int idSolCab)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_APROBAR_SOLICITUD_MEDICO_DET_LISTAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idSolCab", SqlDbType.VarChar).Value = idSolCab;

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

        public string set_aprobarRechazar_medico(int id_SolMedicodet, string descripcion, string proceso, int id_usuario)
        {
            string res = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_APROBAR_SOLICITUD_MEDICO_DET_GRABAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_SolMedicodet", SqlDbType.Int).Value = id_SolMedicodet;
                        cmd.Parameters.Add("@descripcion", SqlDbType.VarChar).Value = descripcion;
                        cmd.Parameters.Add("@proceso", SqlDbType.VarChar).Value = proceso;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = id_usuario;
                        cmd.ExecuteNonQuery();

                        set_envioCorreo_aprobarSolicitudMedico(id_SolMedicodet, id_usuario);

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


        public DataTable get_datosEnviosCorreo_aprobarSolicitudMedico(int id_SolMedicodet, int idusuario)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_APROBAR_SOLICITUD_MEDICO_ENVIAR_CORREO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_SolMedicodet", SqlDbType.Int).Value = id_SolMedicodet;
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
        
        public void set_envioCorreo_aprobarSolicitudMedico(int id_SolMedicodet, int idusuario)
        {
            DataTable dt_detalleMail = new DataTable();
            try
            {
                ///---obtenere la informacion para el llenado del correo ---
                dt_detalleMail = get_datosEnviosCorreo_aprobarSolicitudMedico(id_SolMedicodet, idusuario);

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


        public object get_solicitudesBoticasFarmacias_cab(int idUsuario, string fechaIni, string fechaFin, int idEstado)
        {
            Resultado res = new Resultado();
            List<SolicitudCab_E> obj_List = new List<SolicitudCab_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_SOLICITUD_BYF_CAB_LISTAR", cn))
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
                                SolicitudCab_E Entidad = new SolicitudCab_E();

                                Entidad.id_Sol_Medico_cab = Convert.ToInt32(dr["id_Sol_Medico_cab"].ToString());
                                Entidad.solicitante = dr["solicitante"].ToString();
                                Entidad.fechaSolicitudFormateado = dr["fechaSolicitudFormateado"].ToString();
                                Entidad.fechaSolicitud = Convert.ToDateTime(dr["fechaSolicitud"].ToString());
                                Entidad.razonSocial = dr["razonSocial"].ToString();

                                Entidad.descripcionSolicitud = dr["descripcionSolicitud"].ToString();
                                Entidad.fechaRespuesta = dr["fechaRespuesta"].ToString();
                                Entidad.comentarioRespuesta = dr["comentarioRespuesta"].ToString();
                                Entidad.id_estado = dr["id_estado"].ToString();
                                Entidad.descripcionEstado = dr["descripcionEstado"].ToString();
                                Entidad.direccion = dr["direccion"].ToString();

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


        public object get_aprobarSolicitudesBoticasFarmacias_cab(int idUsuario, string fechaIni, string fechaFin, int idEstado)
        {
            Resultado res = new Resultado();
            List<SolicitudCab_E> obj_List = new List<SolicitudCab_E>();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_APROBAR_SOLICITUD_BYF_CAB_LISTAR", cn))
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
                                SolicitudCab_E Entidad = new SolicitudCab_E();

                                Entidad.id_Sol_Medico_cab = Convert.ToInt32(dr["id_Sol_Medico_cab"].ToString());
                                Entidad.solicitante = dr["solicitante"].ToString();
                                Entidad.fechaSolicitudFormateado = dr["fechaSolicitudFormateado"].ToString();
                                Entidad.fechaSolicitud = Convert.ToDateTime(dr["fechaSolicitud"].ToString());
                                Entidad.razonSocial = dr["razonSocial"].ToString();

                                Entidad.descripcionSolicitud = dr["descripcionSolicitud"].ToString();
                                Entidad.fechaRespuesta = dr["fechaRespuesta"].ToString();
                                Entidad.comentarioRespuesta = dr["comentarioRespuesta"].ToString();
                                Entidad.id_estado = dr["id_estado"].ToString();
                                Entidad.descripcionEstado = dr["descripcionEstado"].ToString();
                                Entidad.direccion = dr["direccion"].ToString();

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


        public DataTable get_aprobacionSolicitud_boticasFarmacias_Detalle(int idSolCab)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_APROBAR_SOLICITUD_BYF_DET_LISTAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@idSolCab", SqlDbType.VarChar).Value = idSolCab;

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



        public DataTable get_datosEnviosCorreo_aprobarSolicitud_BYF(int id_SolMedicodet, int idusuario)
        {
            DataTable dt_detalle = new DataTable();
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_APROBAR_SOLICITUD_BYF_ENVIAR_CORREO", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_SolMedicodet", SqlDbType.Int).Value = id_SolMedicodet;
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


        public void set_envioCorreo_aprobarSolicitud_boticasFarmacias(int id_SolMedicodet, int idusuario)
        {
            DataTable dt_detalleMail = new DataTable();
            try
            {
                ///---obtenere la informacion para el llenado del correo ---
                dt_detalleMail = get_datosEnviosCorreo_aprobarSolicitud_BYF(id_SolMedicodet, idusuario);

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

        public string set_aprobarRechazar_boticasFarmacias(int id_SolMedicodet, string descripcion, string proceso, int id_usuario)
        {
            string res = "";
            try
            {
                using (SqlConnection cn = new SqlConnection(Conexion.bdConexion.cadenaBDcx()))
                {
                    cn.Open();
                    using (SqlCommand cmd = new SqlCommand("SP_PROY_W_PROC_APROBAR_SOLICITUD_BYF_DET_GRABAR", cn))
                    {
                        cmd.CommandTimeout = 0;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add("@id_SolMedicodet", SqlDbType.Int).Value = id_SolMedicodet;
                        cmd.Parameters.Add("@descripcion", SqlDbType.VarChar).Value = descripcion;
                        cmd.Parameters.Add("@proceso", SqlDbType.VarChar).Value = proceso;
                        cmd.Parameters.Add("@id_usuario", SqlDbType.Int).Value = id_usuario;
                        cmd.ExecuteNonQuery();

                        //set_envioCorreo_aprobarSolicitud_boticasFarmacias(id_SolMedicodet, id_usuario);

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


    }

}
