using WebApplication1.Models;
using System;
using System.Linq;
using System.Collections.Generic;

namespace WebApplication1.Data
{
    public static class SeedData
    {
        public static void Initialize(AppDbContext context)
        {
            if (context.Customers.Any())
                return;

            var random = new Random();
            var customers = new List<Customer>();

            string[] firstNames =
            {
                "Arjun","Amit","Rahul","Rohit","Karthik","Suresh","Vikram","Manoj","Ravi","Anil",
                "Priya","Neha","Ananya","Sneha","Pooja","Meera","Kavya","Divya","Nisha","Aishwarya",
                "Sanjay","Deepak","Ashwin","Harish","Naveen","Varun","Abhishek","Akash","Ramesh","Mahesh"
            };

            string[] lastNames =
            {
                "Kumar","Sharma","Verma","Patel","Gupta","Iyer","Nair","Reddy","Naidu","Chatterjee",
                "Banerjee","Ghosh","Das","Mehta","Joshi","Malhotra","Bansal","Aggarwal","Singh","Yadav"
            };

            for (int i = 1; i <= 1000; i++)
            {
                var firstName = firstNames[random.Next(firstNames.Length)];
                var lastName = lastNames[random.Next(lastNames.Length)];
                var fullName = $"{firstName} {lastName}";

                customers.Add(new Customer
                {
                    CustomerName = fullName,
                    CustomerEmail = $"{firstName.ToLower()}.{lastName.ToLower()}{i}@gmail.com",
                    CustomerPhone = $"9{random.Next(100000000, 999999999)}",
                    DOB = DateTime.Now.AddYears(-random.Next(18, 60))
                                      .AddDays(random.Next(1, 365)),
                    TotalOrders = random.Next(0, 50),
                    IsActive = random.Next(0, 100) < 80
                });
            }

            context.Customers.AddRange(customers);
            context.SaveChanges();
        }
    }
}
