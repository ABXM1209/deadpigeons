import { ApiClient } from "../api/apiClient";
import { server } from "./mocks/server";
import { http, HttpResponse } from "msw";

test("ApiClient returns users", async () => {
    server.use(
        http.get("http://localhost:5139/users", () =>
            HttpResponse.json([{ id: 1, name: "Bob" }])
        )
    );

    const client = new ApiClient("http://localhost:5139");
    const users = await client.usersAll();

    expect(users[0].name).toBe("Bob");
});
