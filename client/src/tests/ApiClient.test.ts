import { ApiClient } from "../api/apiClient";
import { server } from "./mocks/server";
import { http, HttpResponse } from "msw";
import {finalUrl} from "../baseUrl.ts";

test("ApiClient returns users", async () => {
    server.use(
        http.get(finalUrl + "/users", () =>
            HttpResponse.json([{ id: 1, name: "Bob" }])
        )
    );

    const client = new ApiClient(finalUrl);
    const users = await client.usersAll();

    expect(users[0].name).toBe("Bob");
});
