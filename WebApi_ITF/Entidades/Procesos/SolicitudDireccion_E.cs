using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entidades.Procesos
{
    public class SolicitudDireccion_E
    {
        public int id_Sol_Medico_Direccion { get; set; }
        public string id_Medicos_Direccion { get; set; }
        
        public string id_Medico { get; set; }
        public string medico { get; set; }

        public string solicitante { get; set; }
        public string fechaSolicitud { get; set; }
        public string fechaRespuesta { get; set; }
        public string comentarioRespuesta { get; set; }


        public string idEstado { get; set; }
        public string descripcionEstado { get; set; }
    }
}
