using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entidades.Mantenimientos
{
    public class Medicos_E
    {
        public string  id_Medico { get; set; }
        public string  id_Identificador_Medico { get; set; }
        public string  descripcion_identificador_medico { get; set; }
        public string  cmp_medico { get; set; }
        public string  nombres_medico { get; set; }
        public string  apellido_paterno_medico { get; set; }
        public string  apellido_materno_medico { get; set; }
        public string  id_Categoria { get; set; }
        public string  codigo_categoria { get; set; }
        public string  id_Especialidad1 { get; set; }
        public string  codigo_especialidad { get; set; }
        public string  id_Especialidad2 { get; set; }
        public string  email_medico { get; set; }
        public string  fecha_nacimiento_medico { get; set; }
        public DateTime fechaNacimientoMedico { get; set; }
        
        public string  sexo_medico { get; set; }
        public string  telefono_medico { get; set; }
        public string  estado { get; set; }
        public string descripcion_estado { get; set; }

        
    }
}
