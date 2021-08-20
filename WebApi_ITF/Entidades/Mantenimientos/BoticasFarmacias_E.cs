using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entidades.Mantenimientos
{
   public class BoticasFarmacias_E
    {
       public int id_Medico { get; set; }
        public string id_Identificador_Medico { get; set; }
        public string cmp_medico { get; set; }
        public string nombres_medico { get; set; }
        public string id_Categoria { get; set; }
        public string email_medico { get; set; }
        public string telefono_medico { get; set; }
        public string estado { get; set; }
        public string id_tipo_visita { get; set; }
        public string usuario_creacion { get; set; }
        public int id_Medicos_Direccion { get; set; }
        public string codigo_departamento { get; set; }
        public string codigo_provincia { get; set; }
        public string codigo_distrito { get; set; }
        public string direccion_medico_direccion { get; set; }

    }

    public class SolicitudesBoticasFarmacias_E
    {
        public int id_Sol_Medico_cab { get; set; }
        public int id_Medico { get; set; }
        public string id_Identificador_Medico { get; set; }
        public string cmp_medico { get; set; }
        public string nombres_medico { get; set; }
        public string id_Categoria { get; set; }
        public string email_medico { get; set; }
        public string telefono_medico { get; set; }
        public string estado { get; set; }
        public string id_tipo_visita { get; set; }
        public string usuario_creacion { get; set; }
        public int id_Medicos_Direccion { get; set; }
        public string codigo_departamento { get; set; }
        public string codigo_provincia { get; set; }
        public string codigo_distrito { get; set; }
        public string direccion_medico_direccion { get; set; }

    }

}
