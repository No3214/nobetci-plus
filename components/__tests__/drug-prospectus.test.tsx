// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import DrugProspectus from "../DrugProspectus";

// Mock framer-motion to render children synchronously without animation delays
vi.mock("framer-motion", () => {
  return {
    motion: {
      div: React.forwardRef(({ children, ...props }: any, ref: any) => {
        // Strip out animation props that throw warnings on raw HTML elements
        const { initial, animate, exit, transition, ...cleanProps } = props;
        return <div {...cleanProps} ref={ref}>{children}</div>;
      }),
      span: React.forwardRef(({ children, ...props }: any, ref: any) => {
        const { initial, animate, exit, transition, ...cleanProps } = props;
        return <span {...cleanProps} ref={ref}>{children}</span>;
      }),
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

describe("DrugProspectus Component", () => {
  it("renders search input and popular drugs list", () => {
    render(<DrugProspectus />);
    expect(screen.getByPlaceholderText(/İlaç veya etken madde adı yazın/)).toBeDefined();
    expect(screen.getByText("Sık Aranan İlaçlar:")).toBeDefined();
    expect(screen.getByText("Parol")).toBeDefined();
    expect(screen.getByText("Arveles")).toBeDefined();
  });

  it("shows drug details when a popular drug is clicked", () => {
    render(<DrugProspectus />);
    const parolButton = screen.getByText("Parol");
    fireEvent.click(parolButton);

    expect(screen.getByText("Parasetamol (Acetaminophen)")).toBeDefined();
    expect(screen.getByText(/Merkezi sinir sisteminde/)).toBeDefined();
    expect(screen.getByText("Yasal Uyarı:")).toBeDefined();
  });

  it("shows drug details when searched", () => {
    render(<DrugProspectus />);
    const input = screen.getByPlaceholderText(/İlaç veya etken madde adı yazın/);
    fireEvent.change(input, { target: { value: "arveles" } });

    expect(screen.getByText("Deksketoprofen Trometamol")).toBeDefined();
    expect(screen.getByText(/siklooksijenaz-1/)).toBeDefined();
  });

  it("shows not found message when drug is not in database", () => {
    render(<DrugProspectus />);
    const input = screen.getByPlaceholderText(/İlaç veya etken madde adı yazın/);
    fireEvent.change(input, { target: { value: "BilinmeyenIlac" } });

    expect(screen.getByText("Kayıtlı İlaç Bulunamadı")).toBeDefined();
  });
});
