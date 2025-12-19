import { render, screen, waitFor } from "@testing-library/react";
import Users from "../api/Users";
import { server } from "./mocks/server";
import { http, HttpResponse } from "msw";
import {finalUrl} from "../baseUrl.ts";

test("renders users in table", async () => {

    server.use(
        http.get(finalUrl + "/users", () =>
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
