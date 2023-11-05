import { expect, vi, test } from "vitest";
import { render } from "test/utils";

import Home from "../src/pages/index";

test("renders user email when user is logged in", () => {
  vi.mock("src/users/hooks/useCurrentUser", () => ({
    useCurrentUser: () => ({
      id: 1,
      name: "User",
      email: "user@email.com",
      role: "user",
    })
  }));

  const { getByText } = render(<Home />);
  const linkElement = getByText(/user@email.com/i);
  expect(linkElement).toBeInTheDocument();
});
