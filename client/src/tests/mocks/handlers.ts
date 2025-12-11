import { http, HttpResponse } from "msw";
import {finalUrl} from "../../baseUrl.ts";

export const handlers = [
    
    // Users mock
    http.get(finalUrl + "/users", () => {
        return HttpResponse.json([
            { id: 1, name: "Alice", email: "alice@test.com", phone: "555", balance: 20 },
        ]);
    }),
    
    // AdminBoards mock
    http.get(finalUrl + "/board", () => {
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
    http.get(finalUrl + "/admins", () => {
        return HttpResponse.json([
            { id: 1, name: "AdminUser", email: "admin@test.com" }
        ]);
    }),

    // Transactions mock
    http.get(finalUrl + "/transactions", () => {
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


    


