import {cleanup, render, screen} from "@testing-library/react";
import {afterEach, beforeEach, describe, expect, it} from "vitest";
import {App} from "./App";

beforeEach(() => {
  window.history.replaceState({}, "", "/?step=page_25");
});

afterEach(() => {
  window.history.replaceState({}, "", "/");
  cleanup();
});

describe("App hidden navigation", () => {
  it("ignores still-hidden step ids from query params and falls back to the visible opening page", () => {
    render(<App />);

    expect(screen.getByRole("heading", {name: "开场", level: 1})).toBeInTheDocument();
    expect(document.querySelector('option[value="page_25"]')).toBeNull();
  });
});
