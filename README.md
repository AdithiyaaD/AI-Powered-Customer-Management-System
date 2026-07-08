# AI-Powered Customer Management System

An enterprise-grade customer management system powered by Artificial Intelligence that enables users to interact with customer data using natural language. Instead of manually configuring filters, sorting, or aggregations, users simply describe what they need, and the AI automatically transforms the request into AG Grid operations.

> Developed during my internship at **Glencore Information Services Pvt. Ltd.**

---

## Project Overview

Managing large customer datasets often requires users to manually configure multiple filters, sorting options, and column settings. This project simplifies that workflow by integrating Google's Gemini AI with AG Grid, allowing users to perform complex data operations through conversational prompts.

The application converts natural language into structured grid configurations, providing an intuitive and intelligent way to explore customer data.

---

## ✨ Features

### AI-Powered Natural Language Queries

Perform operations such as:

- Filter customers using plain English
- Sort one or multiple columns
- Show or hide columns
- Resize columns
- Perform aggregations
- Export filtered data
- Reset grid state

Example prompts:

```
Filter customers whose email contains "joshi"
```
<img width="876" height="442" alt="image" src="https://github.com/user-attachments/assets/4c55867a-b959-4e78-a8c4-5320cdcbfe40" />


```
Sort customers by descending order of DOB
```
<img width="872" height="405" alt="image" src="https://github.com/user-attachments/assets/37c7f540-5ef3-4d65-928c-bd78bee2a844" />


```
Hide Customer Name column
```
<img width="852" height="405" alt="image" src="https://github.com/user-attachments/assets/207b1d24-4491-441c-9ccc-4241da17b838" />

```
Show only Customer Name
```
<img width="862" height="425" alt="image" src="https://github.com/user-attachments/assets/66cefb4c-964f-46ee-897d-6d475057502f" />

```
Calculate average and sum of total orders
```
<img width="862" height="522" alt="image" src="https://github.com/user-attachments/assets/fb7cc458-cc34-4bc1-949c-b5393c0957c7" />

---

### AI-Assisted Analytics

The AI understands business intent and automatically performs operations including:

- Text filtering
- Numeric filtering
- Date filtering
- Multi-condition filtering
- Single and multi-column sorting
- Statistical aggregation
- Column management

---

### 📈 Data Insights

Supports calculations such as:

- Sum
- Average
- Count
- Minimum
- Maximum

---

### Conversational Interface

The integrated AI chat interface allows users to:

- Ask questions about customer data
- Configure the grid automatically
- Perform complex filtering
- Analyze datasets
- Generate insights

---

## 🏗️ Architecture

```
                 User
                   │
                   ▼
          Natural Language Query
                   │
                   ▼
            Angular Frontend
                   │
                   ▼
          Gemini AI Integration
                   │
         Structured JSON Response
                   │
                   ▼
              AG Grid API
                   │
                   ▼
          Customer Data Grid
                   │
                   ▼
              SQL Database
```

---

# Technology Stack

## Frontend

- Angular
- TypeScript
- AG Grid Community
- AG Grid Enterprise
- HTML5
- CSS3

## Backend

- ASP.NET Core
- C#
- REST APIs

## Artificial Intelligence

- Google Gemini API
- Prompt Engineering
- JSON Response Mapping

## Database

- SQL Server
- Entity Framework

## API Testing

- Swagger
- Postman

## Development Tools

- Visual Studio
- Visual Studio Code
- Git
- GitHub

---

# AI Workflow

1. User enters a natural language prompt.
2. Prompt is sent to Gemini API.
3. AI interprets the request.
4. AI generates structured JSON.
5. JSON is validated.
6. AG Grid API applies filters/sorting.
7. Grid updates instantly.

---

# Performance Optimizations

- AG Grid Virtualization
- Pagination
- Optimized Grid API calls
- Prompt Schema Injection
- Structured JSON Parsing
- Optimistic UI Updates
- Loading Skeletons
- Efficient State Management

---

# AI Reliability

To reduce hallucinations, the application uses **Schema Injection**.

Instead of allowing the model to generate arbitrary field names, the prompt includes all valid database columns. The AI can therefore only generate operations on supported fields.

Benefits include:

- Reduced hallucinations
- Reliable JSON responses
- Safer execution
- Faster validation

---

# Project Demonstration

The application supports:

- Customer dashboard
- AI filtering
- Multi-filter support
- Single and multi-column sorting
- Column visibility
- Column resizing
- Statistical aggregation
- Intelligent data insights

---

# Future Enhancements

- Voice-controlled queries
- Role-based authentication
- Dashboard analytics
- Charts and reports
- Predictive analytics
- Smart recommendations
- Export to Excel/PDF
- AI-generated reports
- Row grouping
- Pivot tables
- Dark mode

---

# Learning Outcomes

This project strengthened my understanding of:

- Enterprise Angular Development
- AG Grid APIs
- RESTful API Integration
- ASP.NET Core
- SQL Server
- Prompt Engineering
- LLM Integration
- AI-assisted User Interfaces
- Enterprise Application Architecture
- Full-Stack Development

---

# Author

**Adithiyaa D**

B.Tech Computer Science Engineering (AI & ML)

Vellore Institute of Technology, Chennai

GitHub: https://github.com/AdithiyaaD

LinkedIn: www.linkedin.com/in/adithiyaa-d

---
