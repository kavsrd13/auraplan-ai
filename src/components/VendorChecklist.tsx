/**
 * Smart Vendor Checklist component.
 * Displays tailored vendor categories with AI-generated negotiation tips,
 * vetting questions, status tracking, and cost estimates.
 * Optimized with useMemo, useCallback, and React.memo.
 *
 * @module VendorChecklist
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  Store,
  HelpCircle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { VendorItem, VendorStatus } from '@/types/event';
import { Badge } from './ui/Badge';
import { formatCurrency } from '@/utils/calculations';
import { VENDOR_STATUS } from '@/utils/constants';

/**
 * Props for VendorChecklist component.
 */
export interface VendorChecklistProps {
  /** Array of vendor categories with vetting questions and tips */
  vendors: VendorItem[];
  /** Callback fired to update an individual vendor record */
  onUpdateVendor: (id: string, updates: Partial<VendorItem>) => void;
}

const statusOptions: Array<{ value: VendorStatus; label: string }> = [
  { value: VENDOR_STATUS.NOT_CONTACTED, label: 'Not Contacted' },
  { value: VENDOR_STATUS.CONTACTED, label: 'Contacted' },
  { value: VENDOR_STATUS.BOOKED, label: 'Booked' },
  { value: VENDOR_STATUS.CONFIRMED, label: 'Confirmed' },
];

/**
 * Interactive Vendor Checklist component.
 *
 * @param props - Component properties
 * @returns Curated vendor list with accordion expanders and negotiation tips
 */
const VendorChecklistComponent: React.FC<VendorChecklistProps> = ({
  vendors,
  onUpdateVendor,
}) => {
  const [expandedVendorId, setExpandedVendorId] = useState<string | null>(
    vendors[0]?.id || null
  );

  const toggleExpand = useCallback((id: string): void => {
    setExpandedVendorId((prev) => (prev === id ? null : id));
  }, []);

  const totalEstimatedCost = useMemo(
    () => vendors.reduce((sum, v) => sum + v.estimatedCost, 0),
    [vendors]
  );

  const bookedCount = useMemo(
    () =>
      vendors.filter(
        (v) => v.status === VENDOR_STATUS.BOOKED || v.status === VENDOR_STATUS.CONFIRMED
      ).length,
    [vendors]
  );

  const getStatusBadge = useCallback((status: VendorStatus) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="success">Confirmed</Badge>;
      case 'booked':
        return <Badge variant="info">Booked</Badge>;
      case 'contacted':
        return <Badge variant="warning">Contacted</Badge>;
      case 'not-contacted':
      default:
        return <Badge variant="neutral">Not Contacted</Badge>;
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Vendor Stats Header */}
      <div className="p-6 bg-white rounded-2xl border border-surface-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-aura-600 block mb-1">
            Vendor Directory & Vetting Suite
          </span>
          <h3 className="text-xl font-black text-surface-900 tracking-tight">
            Curated Vendor Categories & Negotiation Intelligence
          </h3>
          <p className="text-xs text-surface-500 mt-1">
            AI-crafted vetting questions and tactical negotiation tips tailored to your specific event scope.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-aura-50 rounded-xl border border-aura-200 text-center">
            <span className="text-xs text-surface-500 block">Secured</span>
            <span className="text-lg font-black text-aura-700">
              {bookedCount} / {vendors.length}
            </span>
          </div>
          <div className="px-4 py-2 bg-surface-50 rounded-xl border border-surface-200 text-center">
            <span className="text-xs text-surface-500 block">Est. Vendor Spend</span>
            <span className="text-lg font-black text-surface-900">
              {formatCurrency(totalEstimatedCost)}
            </span>
          </div>
        </div>
      </div>

      {/* Vendors List */}
      <div className="space-y-4">
        {vendors.map((vendor) => {
          const isExpanded = expandedVendorId === vendor.id;

          return (
            <div
              key={vendor.id}
              className="bg-white rounded-2xl border border-surface-200 shadow-xs overflow-hidden transition-all"
            >
              {/* Header / Summary row */}
              <div
                onClick={() => toggleExpand(vendor.id)}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-surface-50/50"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-aura-50 text-aura-600 flex items-center justify-center flex-shrink-0">
                    <Store className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold text-base text-surface-900">
                        {vendor.vendorName}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-md bg-surface-100 text-surface-700 font-semibold border border-surface-200">
                        {vendor.category}
                      </span>
                    </div>
                    <span className="text-xs text-surface-500 mt-0.5 block">
                      Est. {formatCurrency(vendor.estimatedCost)} • {vendor.contactInfo}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  {getStatusBadge(vendor.status)}

                  {/* Quick status selector */}
                  <select
                    value={vendor.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) =>
                      onUpdateVendor(vendor.id, {
                        status: e.target.value as VendorStatus,
                      })
                    }
                    aria-label={`Change engagement status for ${vendor.vendorName}`}
                    className="text-xs font-bold bg-surface-100 hover:bg-surface-200 text-surface-800 rounded-lg px-2.5 py-1.5 border border-surface-300 focus:outline-none focus:ring-2 focus:ring-aura-500"
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    aria-label={isExpanded ? 'Collapse vendor details' : 'Expand vendor details'}
                    className="p-1 text-surface-400 hover:text-surface-700"
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Collapsible Details */}
              {isExpanded && (
                <div className="p-6 bg-surface-50/60 border-t border-surface-100 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Negotiation Tips */}
                    <div className="bg-white p-4 rounded-xl border border-surface-200">
                      <div className="flex items-center gap-2 text-amber-700 mb-3">
                        <Lightbulb className="w-4 h-4 text-amber-600" aria-hidden="true" />
                        <h4 className="text-xs font-bold uppercase tracking-wider">
                          AI Negotiation Tips
                        </h4>
                      </div>
                      <ul className="space-y-2 text-xs text-surface-700">
                        {vendor.negotiationTips.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Vetting Questions */}
                    <div className="bg-white p-4 rounded-xl border border-surface-200">
                      <div className="flex items-center gap-2 text-aura-700 mb-3">
                        <HelpCircle className="w-4 h-4 text-aura-600" aria-hidden="true" />
                        <h4 className="text-xs font-bold uppercase tracking-wider">
                          Key Vetting Questions to Ask
                        </h4>
                      </div>
                      <ul className="space-y-2 text-xs text-surface-700">
                        {vendor.vettingQuestions.map((q, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-aura-500 mt-1.5 flex-shrink-0" />
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Notes & Contact info editing */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label
                        htmlFor={`vendor-notes-${vendor.id}`}
                        className="block text-xs font-bold text-surface-700 mb-1"
                      >
                        Internal Notes & Agreements
                      </label>
                      <input
                        id={`vendor-notes-${vendor.id}`}
                        type="text"
                        value={vendor.notes}
                        onChange={(e) =>
                          onUpdateVendor(vendor.id, { notes: e.target.value })
                        }
                        placeholder="Add contractual notes or promised extras..."
                        className="w-full px-3 py-2 text-xs border border-surface-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-aura-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`vendor-contact-${vendor.id}`}
                        className="block text-xs font-bold text-surface-700 mb-1"
                      >
                        Contact Details
                      </label>
                      <input
                        id={`vendor-contact-${vendor.id}`}
                        type="text"
                        value={vendor.contactInfo}
                        onChange={(e) =>
                          onUpdateVendor(vendor.id, { contactInfo: e.target.value })
                        }
                        placeholder="Email, phone, point-of-contact..."
                        className="w-full px-3 py-2 text-xs border border-surface-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-aura-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

VendorChecklistComponent.displayName = 'VendorChecklist';

export const VendorChecklist = React.memo(VendorChecklistComponent);
export default VendorChecklist;
