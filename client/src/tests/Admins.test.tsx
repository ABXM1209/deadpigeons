import { render, screen, waitFor } from "@testing-library/react";
import Admins from "../api/Admins";
import { http, HttpResponse } from "msw";
import { server } from "./mocks/server";
import {finalUrl} from "../baseUrl.ts";

test("Admins renders admin list", async () => {
    server.use(
        http.get(finalUrl + "/admins", () => {
            return HttpResponse.json([
                { id: 55, name: "MasterAdmin", email: "master@admin.com" }
            ]);
        })
    );

    render(<Admins />);

    await waitFor(() => {
        expect(screen.getByText("MasterAdmin")).toBeInTheDocument();
    });

    expect(screen.getByText("55")).toBeInTheDocument();
    expect(screen.getByText("master@admin.com")).toBeInTheDocument();
});
