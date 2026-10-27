import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import SongCard from "./SongCard";

const song = { id: 7, artist: "Artist", song: "Title", img_url: null };

const renderCard = (props) =>
  render(
    <MemoryRouter>
      <SongCard song={song} {...props} />
    </MemoryRouter>
  );

describe("SongCard", () => {
  it("links to the song page", () => {
    renderCard();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/song/7");
  });

  it("shows the snippet and match percentage", () => {
    renderCard({ snippet: "a line of lyrics", score: 0.874 });
    expect(screen.getByText("a line of lyrics")).toBeInTheDocument();
    expect(screen.getByText("87% match")).toBeInTheDocument();
  });

  it("renders without a cover image url", () => {
    renderCard();
    expect(screen.getByAltText("Title by Artist")).toBeInTheDocument();
  });

  it("toggles the favourite button", async () => {
    renderCard();
    const button = screen.getByRole("button", { name: /add title to favourites/i });
    expect(button).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(button);
    expect(
      screen.getByRole("button", { name: /remove title from favourites/i })
    ).toHaveAttribute("aria-pressed", "true");
  });
});
