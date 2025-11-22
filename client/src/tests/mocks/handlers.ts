import { http, HttpResponse } from "msw";

export const handlers = [
    
    // Users mock
    http.get("http://localhost:5139/users", () => {
        return HttpResponse.json([
            { id: 1, name: "Alice", email: "alice@test.com", phone: "555", balance: 20 },
        ]);
    }),
    
    // AdminBoards mock
    http.get("http://localhost:5139/board", () => {
        return HttpResponse.json([
            {
                id: 1,
                name: "Board A",
                weeknumber: "2024-05-10",
                totalwinners: 3,
                winningnumbers: "2,7,10",
                winningusers: "Alice,Bob,Carol",
                isopen: true
            }
        ]);
    }),

    // Admins mock
    http.get("http://localhost:5139/admins", () => {
        return HttpResponse.json([
            { id: 1, name: "AdminUser", email: "admin@test.com" }
        ]);
    }),

    // Transactions mock
    http.get("http://localhost:5139/transactions", () => {
        return HttpResponse.json([
            {
                id: 100,
                username: "TestUser",
                transactionid: "TX123",
                status: 2,
                balance: 150
            }
        ]);
    })
];


    


