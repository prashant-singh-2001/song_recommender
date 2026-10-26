import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import SearchBar, { DEBOUNCE_MS } from "./SearchBar";

const setup = () => {
  const props = { onResults: vi.fn(), onLoading: vi.fn(), onError: vi.fn() };
  render(<SearchBar {...props} />);
  return { props, input: screen.getByRole("searchbox") };
};

const type = (input, value) => fireEvent.change(input, { target: { value } });

describe("SearchBar", () => {
  let fetchMock;
  beforeEach(() => {
    vi.useFakeTimers();
    fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => [{ id: 1 }] });
    vi.stubGlobal("fetch", fetchMock);
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("sends one request after typing stops", async () => {
    const { props, input } = setup();
    type(input, "lo");
    type(input, "lov");
    type(input, "love");
    await act(() => vi.advanceTimersByTimeAsync(DEBOUNCE_MS - 1));
    expect(fetchMock).not.toHaveBeenCalled();
    await act(() => vi.advanceTimersByTimeAsync(2));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toContain("q=love");
    expect(props.onResults).toHaveBeenLastCalledWith([{ id: 1 }]);
  });

  it("searches immediately on Enter", async () => {
    const { input } = setup();
    type(input, "love");
    fireEvent.submit(input.closest("form"));
    await act(() => vi.advanceTimersByTimeAsync(0));
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("ignores queries shorter than two characters", async () => {
    const { props, input } = setup();
    type(input, "a");
    await act(() => vi.advanceTimersByTimeAsync(DEBOUNCE_MS * 2));
    expect(fetchMock).not.toHaveBeenCalled();
    expect(props.onResults).toHaveBeenLastCalledWith(null);
  });

  it("aborts the previous request so a stale response cannot win", async () => {
    const signals = [];
    fetchMock.mockImplementation((_url, { signal }) => {
      signals.push(signal);
      return new Promise(() => {});
    });
    const { input } = setup();
    type(input, "first");
    await act(() => vi.advanceTimersByTimeAsync(DEBOUNCE_MS + 1));
    type(input, "second");
    expect(signals[0].aborted).toBe(true);
  });

  it("reports an error when the request fails", async () => {
    fetchMock.mockRejectedValue(new Error("network"));
    const { props, input } = setup();
    type(input, "love");
    await act(() => vi.advanceTimersByTimeAsync(DEBOUNCE_MS + 1));
    expect(props.onError).toHaveBeenLastCalledWith(expect.stringMatching(/could not reach/i));
  });
});
