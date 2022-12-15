using Negocio.Resultados;
using System;
using System.IO;
using System.Net;
using System.Text;

namespace Negocio.RestClient
{ 
        public enum httpVerb
        {
            GET,
            POST,
            PUT,
            DELETE
        }

       public class ApiPeru
        {
            public string endPoint { get; set; }
            public string token { get; set; }
        public httpVerb httpMethod { get; set; }

            public ApiPeru()
            {
                endPoint = "";
                httpMethod = httpVerb.GET;
                token = "5416254d16404dafd20ee82915ae5f87f266f51edf8984ab44080f96a6ea0bda";
            }

            public object  getConsultarRuc()
            {
                HttpWebResponse response = null;
                Resultado res = new Resultado();

                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(endPoint);
                request.Method = httpMethod.ToString();

                request.ContentType = "application/json";
                request.Headers.Add("Authorization", "Bearer " + token);

            try
            {
                response = (HttpWebResponse)request.GetResponse();

                    if (response.StatusCode != HttpStatusCode.OK)
                    {
                        res.ok = false;
                        res.data = response.StatusCode.ToString();
                    }
                    else {
                        using (Stream responseStream = response.GetResponseStream())
                        {
                            if (responseStream != null)
                            {
                                using (StreamReader reader = new StreamReader(responseStream))
                                {
                                    //strResponseValue = reader.ReadToEnd();
                                    res.ok = true;
                                    res.data = reader.ReadToEnd();
                                }
                            }
                        }
                    }
            }
            catch (Exception ex)
            {
                res.ok = false;
                res.data = ex.Message.ToString();
                }
            finally
            {
                if (response != null)
                {
                    ((IDisposable)response).Dispose();
                }
            }
                return res;
            }
        }
  
}
