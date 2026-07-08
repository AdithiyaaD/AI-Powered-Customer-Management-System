namespace WebApplication1.DTOs
{
    public class CustomerUpdateDto
    {
        public int CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string CustomerEmail { get; set; }
        public string CustomerPhone { get; set; }
        public DateTime DOB { get; set; }
        public int TotalOrders { get; set; }
        public bool IsActive { get; set; }
    }
}

