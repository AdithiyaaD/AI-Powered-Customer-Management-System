namespace WebApplication1.DTOs
{
    public class CustomerCreateDto
    {
        public string CustomerName { get; set; }
        public string CustomerEmail { get; set; }
        public string CustomerPhone { get; set; }
        public DateTime DOB { get; set; }
        public int TotalOrders { get; set; }
        public bool IsActive { get; set; }
    }
}
