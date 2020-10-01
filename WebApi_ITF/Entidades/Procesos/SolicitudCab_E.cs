using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Entidades.Procesos
{
    public class SolicitudCab_E
    {
        public int id_Sol_Medico_cab { get; set; }
        public string solicitante { get; set; }
        public string fechaSolicitudFormateado { get; set; }
        public DateTime fechaSolicitud { get; set; }
        public string descripcionSolicitud { get; set; }

        public string fechaRespuesta { get; set; }
        public string comentarioRespuesta { get; set; }
        public string id_estado { get; set; }
        public string descripcionEstado { get; set; }

    }
}
