import { render, screen, waitFor } from "@testing-library/react";
import Transactions from "../api/Transactions";
import { http, HttpResponse } from "msw";
import { server } from "./mocks/server";

test("Transactions renders transaction table", async () => {
    server.use(
        http.get("http://localhost:5139/transactions", () => {
            return HttpResponse.json([
                {
                    id: 999,
                    username: "DemoUser",
                    transactionid: "TX999",
                    status: 1,
                    balance: 999,
                }
            ]);
        })
    );

    render(<Transactions />);

    await waitFor(() => {
        expect(screen.getByText("DemoUser")).toBeInTheDocument();
    });

    expect(screen.getByText("999 dkk")).toBeInTheDocument();
    expect(screen.getByText("pending")).toBeInTheDocument();
    expect(screen.getByText("TX999")).toBeInTheDocument();
});
