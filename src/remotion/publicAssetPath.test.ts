import {describe, expect, it} from "vitest";
import {resolvePublicAssetHref} from "./publicAssetPath";

describe("resolvePublicAssetHref", () => {
  it("prefixes root-relative public assets with the configured base url", () => {
    expect(
      resolvePublicAssetHref("/MT-PSO-Talk-SlideApp/", "/supplement/ogl-mtl/opengl-compile-count.png"),
    ).toBe(
      "/MT-PSO-Talk-SlideApp/supplement/ogl-mtl/opengl-compile-count.png",
    );
  });

  it("keeps root-relative assets unchanged under the default root base", () => {
    expect(
      resolvePublicAssetHref("/", "/supplement/pso-rec-cache.png"),
    ).toBe("/supplement/pso-rec-cache.png");
  });

  it("does not rewrite external or relative href values", () => {
    expect(
      resolvePublicAssetHref("/MT-PSO-Talk-SlideApp/", "https://example.com/demo.png"),
    ).toBe("https://example.com/demo.png");
    expect(
      resolvePublicAssetHref("/MT-PSO-Talk-SlideApp/", "data:image/png;base64,abc"),
    ).toBe("data:image/png;base64,abc");
    expect(
      resolvePublicAssetHref("/MT-PSO-Talk-SlideApp/", "supplement/local.png"),
    ).toBe("supplement/local.png");
  });
});
