using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entidades.Procesos
{
   public class Target_E
    {
        public string  usuario { get; set; }
        public string  identificador { get; set; }
        public string  codigo { get; set; }
        public string  medico { get; set; }
        public string  categoria { get; set; }
        public string  especialidad { get; set; }
        public string  descripcionEstado { get; set; }
    }

    public class AltasBajarTarget_E
    {
        //id_Target_cab, id, usuario, fechaSol, textoSol, fechaRespuesta, textoRespuesta, idEstado, descripcionEstado
        public string usuario { get; set; }
        public string identificador { get; set; }
        public string codigo { get; set; }
        public string medico { get; set; }
        public string categoria { get; set; }
        public string especialidad { get; set; }
        public string descripcionEstado { get; set; }
    }



}
