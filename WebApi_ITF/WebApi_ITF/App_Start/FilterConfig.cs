using System.Web;
using System.Web.Mvc;

namespace WebApi_3R_Dominion
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}
