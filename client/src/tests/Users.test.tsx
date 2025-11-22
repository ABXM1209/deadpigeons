import { render, screen, waitFor } from "@testing-library/react";
import Users from "../api/Users";
import { server } from "./mocks/server";
import { http, HttpResponse } from "msw";

test("renders users in table", async () => {

    server.use(
        http.get("http://localhost:5139/users", () =>
            HttpResponse.json([
                { id: 1, name: "Test User", email: "test@x.com", phone: "12345", balance: 50 }
            ])
        )
    );

    render(<Users />);

    await waitFor(() => {
        expect(screen.getByText("Test User")).toBeInTheDocument();
    });
});
