import { render, screen } from "@testing-library/react";
import Root from "./Root";

test("renders learn react link", () => {
  render(<Root />);
  expect(linkElement).toBeInTheDocument();
});
