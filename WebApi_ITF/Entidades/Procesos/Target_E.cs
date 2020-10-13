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

    public class AltasBajasTarget_E
    {
        public int id_Target_cab { get; set; }
        public string usuario { get; set; }
        public string fechaSol { get; set; }
        public string textoSol { get; set; }

        public string aprobadorRechazador { get; set; }
        public DateTime fechaRespuesta { get; set; }
        public string textoRespuesta { get; set; }
        public string idEstado { get; set; }
        public string descripcionEstado { get; set; }

    }

    public class AltasBajasTarget_Medico_E
    {
        public bool checkeado { get; set; }
        public int id_Medico { get; set; }
        public string cmp_medico { get; set; }
        public string nombres_medico { get; set; }
        public string apellido_paterno_medico { get; set; }
        public string apellido_materno_medico { get; set; }
        public string codigo_categoria { get; set; }
        public string codigo_especialidad { get; set; }
        public string visitadoPor { get; set; }
        public string nro_contactos { get; set; }

    }



}
