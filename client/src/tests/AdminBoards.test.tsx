import { render, screen, waitFor } from "@testing-library/react";
import AdminBoards from "../api/AdminBoards";
import { http, HttpResponse } from "msw";
import { server } from "./mocks/server";

test("AdminBoards renders board data correctly", async () => {

    server.use(
        http.get("http://localhost:5139/board", () => {
            return HttpResponse.json([
                {
                    id: 10,
                    name: "Weekly Board",
                    weeknumber: "2024-01-15",
                    totalwinners: 5,
                    winningnumbers: "1,2,3,4",
                    winningusers: "Ali,Hana,Mark",
                    isopen: false
                }
            ]);
        })
    );

    render(<AdminBoards />);

    await waitFor(() => {
        expect(screen.getByText("Weekly Board")).toBeInTheDocument();
    });

    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("1,2,3,4")).toBeInTheDocument();
    expect(screen.getByText("Ali,Hana,Mark")).toBeInTheDocument();
    expect(screen.getByText("close")).toBeInTheDocument();
});
