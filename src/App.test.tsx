import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {App} from "./App";

const {toBlobMock} = vi.hoisted(() => ({
  toBlobMock: vi.fn(),
}));

vi.mock("html-to-image", () => ({
  toBlob: toBlobMock,
}));

beforeEach(() => {
  toBlobMock.mockReset();
  window.history.replaceState({}, "", "/");
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  cleanup();
});

describe("App", () => {
  it("shows page 01 with controls collapsed by default", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", {name: "Input -> f(x) -> Output", level: 1}),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(
        "从输入经过一个函数得到输出，这是后续所有框架演化前的最小骨架。",
      ),
    ).toHaveLength(2);
    expect(
      screen.getByText(
        "第一页保持静态终态，不做入场动画。观众先记住这条最简单的主轴，后面我们再往这条主轴上加结构。",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", {name: "Show controls"})).toBeInTheDocument();
    expect(screen.queryByLabelText("Variant")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Motion")).not.toBeInTheDocument();
    expect(screen.getByText(/Motion 1x/)).toBeInTheDocument();
  });

  it("exposes inline layout tuning variables for the wider notes column", () => {
    render(<App />);

    const shell = document.querySelector(".workbench-shell");

    expect(shell).not.toBeNull();
    expect(shell).toHaveStyle("--notes-column-min: 22rem");
    expect(shell).toHaveStyle("--notes-column-max: 30rem");
    expect(shell).toHaveStyle("--stage-column-fr: 0.94fr");
  });

  it("renders browser-neutral select shells for all four controls", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", {name: "Show controls"}));

    expect(document.querySelectorAll(".control-select-shell")).toHaveLength(4);
    expect(document.querySelectorAll(".control-select-icon")).toHaveLength(4);
  });

  it("dedicates the right panel to the runtime canvas without an extra inner card", () => {
    render(<App />);

    expect(document.querySelector(".stage-card")).not.toBeInTheDocument();
    expect(
      screen.getByLabelText("Animation stage").querySelector(".stage-runtime"),
    ).toBeInTheDocument();
  });

  it("lets the user switch directly to page 02 from the controls", async () => {
    const user = userEvent.setup();

    render(<App />);
    await user.click(screen.getByRole("button", {name: "Show controls"}));

    await user.selectOptions(screen.getByLabelText("Variant"), "shared-focus");
    await user.selectOptions(screen.getByLabelText("Step"), "page_02");
    await user.selectOptions(screen.getByLabelText("Motion"), "half");

    expect(screen.getByLabelText("Variant")).toHaveValue("shared-focus");
    expect(screen.getByLabelText("Step")).toHaveValue("page_02");
    expect(screen.getByLabelText("Aspect")).toHaveValue("16:9");
    expect(screen.getByLabelText("Motion")).toHaveValue("half");
    expect(
      screen.getByRole("heading", {
        name: "VertexData -> GPU -> Pixels",
        level: 1,
      }),
    ).toBeInTheDocument();
  });

  it("lets the user switch directly to page 03 from the controls", async () => {
    const user = userEvent.setup();

    render(<App />);
    await user.click(screen.getByRole("button", {name: "Show controls"}));
    await user.selectOptions(screen.getByLabelText("Step"), "page_03");

    expect(screen.getByLabelText("Step")).toHaveValue("page_03");
    expect(
      screen.getByRole("heading", {
        name: "OpenGL",
        level: 1,
      }),
    ).toBeInTheDocument();
  });

  it("lets the user switch directly to page 04 from the controls", async () => {
    const user = userEvent.setup();

    render(<App />);
    await user.click(screen.getByRole("button", {name: "Show controls"}));
    await user.selectOptions(screen.getByLabelText("Step"), "page_04");

    expect(screen.getByLabelText("Step")).toHaveValue("page_04");
    expect(
      screen.getByRole("heading", {
        name: "Vulkan",
        level: 1,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/SPIR-V/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/PSO/).length).toBeGreaterThan(0);
  });

  it("lets the user switch directly to page 05 from the controls", async () => {
    const user = userEvent.setup();

    render(<App />);
    await user.click(screen.getByRole("button", {name: "Show controls"}));
    await user.selectOptions(screen.getByLabelText("Step"), "page_05");

    expect(screen.getByLabelText("Step")).toHaveValue("page_05");
    expect(
      screen.getByRole("heading", {
        name: "UE Asset Cook",
        level: 1,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/Cooked ShaderCode/).length).toBeGreaterThan(0);
  });

  it("lets the user switch directly to page 06 from the controls", async () => {
    const user = userEvent.setup();

    render(<App />);
    await user.click(screen.getByRole("button", {name: "Show controls"}));
    await user.selectOptions(screen.getByLabelText("Step"), "page_06");

    expect(screen.getByLabelText("Step")).toHaveValue("page_06");
    expect(
      screen.getByRole("heading", {
        name: "区分因素在哪一层",
        level: 1,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/FMaterialResource/).length).toBeGreaterThan(0);
  });

  it("lets the user switch directly to page 07 from the controls", async () => {
    const user = userEvent.setup();

    render(<App />);
    await user.click(screen.getByRole("button", {name: "Show controls"}));
    await user.selectOptions(screen.getByLabelText("Step"), "page_07");

    expect(screen.getByLabelText("Step")).toHaveValue("page_07");
    expect(
      screen.getByRole("heading", {
        name: "InlineCode 如何拿到 code",
        level: 1,
      }),
    ).toBeInTheDocument();
  });

  it("lets the user switch directly to page 08 from the controls", async () => {
    const user = userEvent.setup();

    render(<App />);
    await user.click(screen.getByRole("button", {name: "Show controls"}));
    await user.selectOptions(screen.getByLabelText("Step"), "page_08");

    expect(screen.getByLabelText("Step")).toHaveValue("page_08");
    expect(
      screen.getByRole("heading", {
        name: "PSO cache 为什么只存 Hash",
        level: 1,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/Hash/).length).toBeGreaterThan(0);
  });

  it("lets the user switch directly to page 09 from the controls", async () => {
    const user = userEvent.setup();

    render(<App />);
    await user.click(screen.getByRole("button", {name: "Show controls"}));
    await user.selectOptions(screen.getByLabelText("Step"), "page_09");

    expect(screen.getByLabelText("Step")).toHaveValue("page_09");
    expect(
      screen.getByRole("heading", {
        name: "SharedCode 为什么成为必需",
        level: 1,
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/SharedCode/).length).toBeGreaterThan(0);
  });

  it("moves between storyboard steps with arrow keys", async () => {
    render(<App />);

    fireEvent.keyDown(document.body, {key: "ArrowRight", bubbles: true});
    await waitFor(() => {
      expect(screen.getByRole("heading", {level: 1})).toHaveTextContent(
        "VertexData -> GPU -> Pixels",
      );
    });
    expect(screen.getByLabelText("Speaker notes")).toHaveAttribute(
      "data-motion-direction",
      "forward",
    );

    fireEvent.keyDown(document.body, {key: "ArrowRight", bubbles: true});
    await waitFor(() => {
      expect(screen.getByRole("heading", {level: 1})).toHaveTextContent("OpenGL");
    });

    fireEvent.keyDown(document.body, {key: "ArrowLeft", bubbles: true});
    await waitFor(() => {
      expect(screen.getByRole("heading", {level: 1})).toHaveTextContent(
        "VertexData -> GPU -> Pixels",
      );
    });

    fireEvent.keyDown(document.body, {key: "ArrowLeft", bubbles: true});
    await waitFor(() => {
      expect(screen.getByRole("heading", {level: 1})).toHaveTextContent(
        "Input -> f(x) -> Output",
      );
    });

    for (const expectedTitle of [
      "VertexData -> GPU -> Pixels",
      "OpenGL",
      "Vulkan",
      "UE Asset Cook",
      "区分因素在哪一层",
      "InlineCode 如何拿到 code",
      "PSO cache 为什么只存 Hash",
      "SharedCode 为什么成为必需",
    ]) {
      fireEvent.keyDown(document.body, {key: "ArrowRight", bubbles: true});
      await waitFor(() => {
        expect(screen.getByRole("heading", {level: 1})).toHaveTextContent(
          expectedTitle,
        );
      });
    }
  });

  it("renders the progress rail with one current step and eight compact future steps", () => {
    render(<App />);

    expect(document.querySelectorAll(".progress-step-shell")).toHaveLength(9);
    expect(
      document.querySelector(
        '.progress-step-shell[data-step-id="page_01"][data-state="current"][data-size-mode="expanded"]',
      ),
    ).toBeInTheDocument();
    expect(
      document.querySelector(
        '.progress-step-shell[data-step-id="page_02"][data-state="future"][data-size-mode="compact"]',
      ),
    ).toBeInTheDocument();
    expect(
      document.querySelector(
        '.progress-step-shell[data-step-id="page_03"][data-state="future"][data-size-mode="compact"]',
      ),
    ).toBeInTheDocument();
    expect(
      document.querySelector(
        '.progress-step-shell[data-step-id="page_04"][data-state="future"][data-size-mode="compact"]',
      ),
    ).toBeInTheDocument();
    expect(
      document.querySelector(
        '.progress-step-shell[data-step-id="page_05"][data-state="future"][data-size-mode="compact"]',
      ),
    ).toBeInTheDocument();
    expect(
      document.querySelector(
        '.progress-step-shell[data-step-id="page_06"][data-state="future"][data-size-mode="compact"]',
      ),
    ).toBeInTheDocument();
    expect(
      document.querySelector(
        '.progress-step-shell[data-step-id="page_07"][data-state="future"][data-size-mode="compact"]',
      ),
    ).toBeInTheDocument();
    expect(
      document.querySelector(
        '.progress-step-shell[data-step-id="page_08"][data-state="future"][data-size-mode="compact"]',
      ),
    ).toBeInTheDocument();
    expect(
      document.querySelector(
        '.progress-step-shell[data-step-id="page_09"][data-state="future"][data-size-mode="compact"]',
      ),
    ).toBeInTheDocument();
  });

  it("renders baseline notes as the current card with no outgoing step", () => {
    render(<App />);

    expect(document.querySelectorAll(".notes-card-layer")).toHaveLength(2);
    expect(
      document.querySelector(
        '.notes-card-layer--current[data-step-id="page_01"][data-stack-role="front"][data-motion-direction="idle"]',
      ),
    ).toBeInTheDocument();
    expect(
      document.querySelector(
        '.notes-card-layer--outgoing[data-has-step="false"][data-stack-role="back"][data-fade="off"]',
      ),
    ).toBeInTheDocument();
  });

  it("supports keyboard motion debugging shortcuts", async () => {
    render(<App />);

    expect(document.querySelector(".workbench-shell")).toHaveAttribute(
      "data-motion-preset",
      "normal",
    );

    fireEvent.keyDown(document.body, {key: "[", bubbles: true});
    await waitFor(() => {
      expect(document.querySelector(".workbench-shell")).toHaveAttribute(
        "data-motion-preset",
        "half",
      );
    });

    fireEvent.keyDown(document.body, {key: "[", bubbles: true});
    await waitFor(() => {
      expect(document.querySelector(".workbench-shell")).toHaveAttribute(
        "data-motion-preset",
        "quarter",
      );
    });

    fireEvent.keyDown(document.body, {key: "]", bubbles: true});
    await waitFor(() => {
      expect(document.querySelector(".workbench-shell")).toHaveAttribute(
        "data-motion-preset",
        "half",
      );
    });

    fireEvent.keyDown(document.body, {key: "0", bubbles: true});
    await waitFor(() => {
      expect(document.querySelector(".workbench-shell")).toHaveAttribute(
        "data-motion-preset",
        "normal",
      );
    });
  });

  it("boots directly into review mode from query params and opens the requested page", () => {
    window.history.replaceState(
      {},
      "",
      "/?step=page_08&controls=1&review=1&motion=half&variant=shared-focus",
    );

    render(<App />);

    expect(screen.getByRole("button", {name: "Hide controls"})).toBeInTheDocument();
    expect(screen.getByLabelText("Step")).toHaveValue("page_08");
    expect(screen.getByRole("heading", {level: 1})).toHaveTextContent(
      "PSO cache 为什么只存 Hash",
    );
    expect(screen.getByLabelText("Review HUD")).toBeInTheDocument();
    expect(document.querySelector(".workbench-shell")).toHaveAttribute(
      "data-motion-preset",
      "half",
    );
  });

  it("lets the review HUD jump straight to another page without opening the main controls", async () => {
    const user = userEvent.setup();
    window.history.replaceState({}, "", "/?review=1");

    render(<App />);

    await user.selectOptions(screen.getByLabelText("Review Step"), "page_08");

    expect(screen.getByRole("heading", {level: 1})).toHaveTextContent(
      "PSO cache 为什么只存 Hash",
    );
    expect(screen.getByLabelText("Review Score")).toHaveTextContent("0.0 / 5.0");
  });

  it("does not hijack arrow keys while a select is focused", async () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", {name: "Show controls"}));

    const variantSelect = screen.getByLabelText("Variant");
    variantSelect.focus();

    fireEvent.keyDown(variantSelect, {key: "ArrowRight", bubbles: true});

    expect(screen.getByLabelText("Step")).toHaveValue("page_01");
    expect(screen.getByRole("heading", {level: 1})).toHaveTextContent(
      "Input -> f(x) -> Output",
    );
  });

  it("captures the current workbench render from the floating action button and falls back to a PNG download", async () => {
    const user = userEvent.setup();
    const imageBlob = new Blob(["png"], {type: "image/png"});
    const downloadClickMock = vi.fn();
    toBlobMock.mockResolvedValue(imageBlob);
    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      value: vi.fn(() => "blob:slideapp-test"),
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      value: vi.fn(),
    });
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(downloadClickMock);
    Object.defineProperty(globalThis.navigator, "clipboard", {
      configurable: true,
      value: undefined,
    });

    render(<App />);

    await user.click(screen.getByRole("button", {name: "复制当前页面截图"}));

    await waitFor(() => {
      expect(toBlobMock).toHaveBeenCalledWith(
        document.querySelector(".workbench-shell"),
        expect.objectContaining({
          cacheBust: true,
          pixelRatio: 2,
        }),
      );
    });

    await waitFor(() => {
      expect(downloadClickMock).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText("已下载 PNG")).toBeInTheDocument();
  });

  it("captures only the stage runtime from the review HUD button", async () => {
    const user = userEvent.setup();
    const imageBlob = new Blob(["png"], {type: "image/png"});
    const downloadClickMock = vi.fn();
    toBlobMock.mockResolvedValue(imageBlob);
    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      value: vi.fn(() => "blob:slideapp-stage-test"),
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      value: vi.fn(),
    });
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(downloadClickMock);
    Object.defineProperty(globalThis.navigator, "clipboard", {
      configurable: true,
      value: undefined,
    });
    window.history.replaceState({}, "", "/?review=1");

    render(<App />);

    await user.click(screen.getByRole("button", {name: "复制当前舞台截图"}));

    await waitFor(() => {
      expect(toBlobMock).toHaveBeenCalledWith(
        document.querySelector(".stage-runtime"),
        expect.objectContaining({
          cacheBust: true,
          pixelRatio: 2,
        }),
      );
    });

    await waitFor(() => {
      expect(downloadClickMock).toHaveBeenCalledTimes(1);
    });
  });
});
