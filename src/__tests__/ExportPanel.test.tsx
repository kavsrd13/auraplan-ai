import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExportPanel } from '@/components/ExportPanel';
import { getDemoPlan } from '@/services/demoData';

describe('ExportPanel Component', () => {
  const demoPlan = getDemoPlan();

  beforeEach(() => {
    // Mock anchor click to prevent jsdom navigation error
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  });

  it('renders all four export options', () => {
    const onSave = vi.fn();
    render(<ExportPanel plan={demoPlan} onSavePlan={onSave} />);

    expect(screen.getByText('Save to Browser')).toBeInTheDocument();
    expect(screen.getByText('Export Markdown')).toBeInTheDocument();
    expect(screen.getByText('Raw JSON Schema')).toBeInTheDocument();
    expect(screen.getByText('Print / PDF')).toBeInTheDocument();
  });

  it('triggers onSavePlan and displays success message when Save is clicked', () => {
    const onSave = vi.fn();
    render(<ExportPanel plan={demoPlan} onSavePlan={onSave} />);

    const saveBtn = screen.getByRole('button', { name: /Save to LocalStorage/i });
    fireEvent.click(saveBtn);

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Saved Successfully!')).toBeInTheDocument();
  });

  it('triggers window.print when Print / Save PDF is clicked', () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {});
    const onSave = vi.fn();
    render(<ExportPanel plan={demoPlan} onSavePlan={onSave} />);

    const printBtn = screen.getByRole('button', { name: /Print \/ Save PDF/i });
    fireEvent.click(printBtn);

    expect(printSpy).toHaveBeenCalledTimes(1);
    printSpy.mockRestore();
  });

  it('handles JSON export file download creation', () => {
    const onSave = vi.fn();
    render(<ExportPanel plan={demoPlan} onSavePlan={onSave} />);

    const jsonBtn = screen.getByRole('button', { name: /Download \.JSON/i });
    expect(jsonBtn).toBeInTheDocument();

    // Verify click executes without throwing error
    expect(() => fireEvent.click(jsonBtn)).not.toThrow();
  });

  it('handles Markdown export file download creation', () => {
    const onSave = vi.fn();
    render(<ExportPanel plan={demoPlan} onSavePlan={onSave} />);

    const mdBtn = screen.getByRole('button', { name: /Download \.MD/i });
    expect(mdBtn).toBeInTheDocument();

    // Verify click executes without throwing error
    expect(() => fireEvent.click(mdBtn)).not.toThrow();
  });
});
