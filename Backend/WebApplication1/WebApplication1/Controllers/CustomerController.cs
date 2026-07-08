using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;
using WebApplication1.DTOs;
using System.Text.Json;
using System.Linq.Expressions;
using System.Reflection;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/customers")]
    public class CustomersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CustomersController(AppDbContext context)
        {
            _context = context;
        }
        private static readonly Dictionary<string, string> ColumnMap = new()
        {
            { "customerId", "CustomerId" },
            { "customerName", "CustomerName" },
            { "customerEmail", "CustomerEmail" },
            { "customerPhone", "CustomerPhone" },
            { "totalOrders", "TotalOrders" },
            { "isActive", "IsActive" },
            { "dob", "DOB" }
        };

        [HttpGet]
        public async Task<IActionResult> GetCustomers()
        {
            var customers = await _context.Customers
                .OrderBy(c => c.CustomerId)
                .ToListAsync();

            return Ok(customers);
        }
    }
}
