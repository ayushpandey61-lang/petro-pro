import React, { useState } from 'react';
import { Calendar as CalendarIcon, Calculator, FileText, Save, Send } from 'lucide-react';
import { format } from 'date-fns';
import { FormLayout, FormSection, FormField } from '@/components/forms';

const DaySettlementForm = ({ onSave }) => {
  const [formData, setFormData] = useState({
    date: new Date(),
    dayOpeningBalance: '',
    dayCashInflow: '',
    dayClosingBalance: '',
    remittance: '',
    note: '',
    uploadSlip: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      date: format(formData.date, "yyyy-MM-dd"),
    });
  };

  const actions = [
    {
      label: 'Save Draft',
      icon: Save,
      variant: 'outline',
      type: 'button',
      onClick: () => console.log('Save draft')
    },
    {
      label: 'Confirm Settlement',
      icon: Send,
      variant: 'primary',
      type: 'submit'
    }
  ];

  return (
    <FormLayout
      title="Day Settlement"
      subtitle="Complete your daily settlement process"
      icon={Calculator}
      actions={actions}
    >
      <form onSubmit={handleSubmit}>
        <FormSection
          title="Settlement Details"
          subtitle="Basic settlement information and date"
          icon={CalendarIcon}
          required
        >
          <div className="form-grid">
            <FormField
              label="Choose Date"
              type="date"
              dateValue={formData.date}
              onDateChange={(date) => setFormData(f => ({...f, date}))}
              required
            />
            <FormField
              label="Day Opening Balance"
              name="dayOpeningBalance"
              value={formData.dayOpeningBalance}
              readOnly
              placeholder="₹0.00"
              info="Auto-populated from opening stock"
            />
            <FormField
              label="Day Cash Inflow"
              name="dayCashInflow"
              value={formData.dayCashInflow}
              readOnly
              placeholder="₹0.00"
              info="Calculated from daily sales"
            />
          </div>
        </FormSection>

        <FormSection
          title="Closing Balance Information"
          subtitle="Verify and confirm closing balances"
          icon={Calculator}
        >
          <div className="form-grid">
            <FormField
              label="Day Closing Bal. (Calculated)"
              name="dayClosingBalance"
              value={formData.dayClosingBalance}
              readOnly
              placeholder="₹0.00"
              success="Auto-calculated from transactions"
            />
            <FormField
              label="Day Closing Bal. (Confirmed)"
              name="confirmedClosingBalance"
              value={formData.confirmedClosingBalance || ''}
              onChange={(e) => setFormData(f => ({...f, confirmedClosingBalance: e.target.value}))}
              placeholder="Enter confirmed amount"
              required
              info="Please verify this amount matches your physical count"
            />
            <FormField
              label="Remittance"
              name="remittance"
              value={formData.remittance}
              onChange={(e) => setFormData(f => ({...f, remittance: e.target.value}))}
              placeholder="Enter remittance amount"
              info="Amount being transferred to main account"
            />
          </div>
        </FormSection>

        <FormSection
          title="Additional Information"
          subtitle="Notes and supporting documents"
          icon={FileText}
        >
          <div className="form-grid">
            <div className="md:col-span-2">
              <FormField
                label="Note"
                name="note"
                type="textarea"
                value={formData.note}
                onChange={(e) => setFormData(f => ({...f, note: e.target.value}))}
                placeholder="Add any additional notes or remarks..."
                rows={3}
                hint="Optional: Add any observations or special notes about this settlement"
              />
            </div>
            <FormField
              label="Upload Slips / Documents"
              name="uploadSlip"
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              multiple
              onChange={(e) => setFormData(f => ({...f, uploadSlip: e.target.files}))}
              hint="Supported formats: JPG, PNG, PDF (Max 5MB each)"
            />
          </div>
        </FormSection>
      </form>
    </FormLayout>
  );
};

export default DaySettlementForm;